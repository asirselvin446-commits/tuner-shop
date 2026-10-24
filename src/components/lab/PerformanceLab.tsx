"use client";

import { useId, useMemo, useRef, useState } from "react";
import { curveSets, type CurvePoint } from "@/content/dyno";
import { gsap, useGSAP } from "@/lib/gsap";

type Metric = "power" | "torque";

const W = 800;
const H = 440;
const M = { top: 28, right: 24, bottom: 52, left: 64 };
const PW = W - M.left - M.right;
const PH = H - M.top - M.bottom;

/** Round tick step (1, 2, 2.5 or 5 × 10ⁿ) giving four intervals that clear the data with headroom. */
function niceStep(max: number) {
  const raw = (max * 1.05) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return ([1, 2, 2.5, 5, 10].find((m) => m * pow >= raw) ?? 10) * pow;
}

export function PerformanceLab({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const sets = useMemo(() => curveSets(), []);
  const [setId, setSetId] = useState(sets[0]!.id);
  const [metric, setMetric] = useState<Metric>("power");
  const set = sets.find((s) => s.id === setId) ?? sets[0]!;
  const root = useRef<HTMLDivElement>(null);
  const uid = `lab${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const Heading = `h${headingLevel}` as const;

  const rpmMin = set.before[0]!.rpm;
  const rpmMax = set.before[set.before.length - 1]!.rpm;
  const yStep = niceStep(Math.max(...set.before.map((p) => p[metric]), ...set.after.map((p) => p[metric])));
  const yMax = yStep * 4;
  const x = (rpm: number) => M.left + ((rpm - rpmMin) / (rpmMax - rpmMin)) * PW;
  const y = (v: number) => M.top + PH - (v / yMax) * PH;
  const path = (pts: CurvePoint[]) => pts.map((p, i) => `${i ? "L" : "M"}${x(p.rpm).toFixed(1)} ${y(p[metric]).toFixed(1)}`).join(" ");

  const [rpm, setRpm] = useState(() => set.before[Math.floor(set.before.length * 0.6)]!.rpm);
  const at = (pts: CurvePoint[]) => pts.reduce((a, b) => (Math.abs(b.rpm - rpm) < Math.abs(a.rpm - rpm) ? b : a));
  const b = at(set.before);
  const a = at(set.after);
  const unit = set.units[metric];

  const xTicks: number[] = [];
  for (let r = Math.ceil(rpmMin / 1000) * 1000; r <= rpmMax; r += 1000) xTicks.push(r);
  const yTicks = [0, 1, 2, 3, 4].map((i) => i * yStep);

  // Draw the curves when the chart scrolls into view, and again on every metric/data change.
  useGSAP(
    () => {
      const reveals = gsap.utils.toArray<SVGRectElement>("[data-reveal]", root.current);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(reveals, { attr: { width: M.left } }, {
          attr: { width: W },
          duration: 1.6,
          ease: "power2.inOut",
          stagger: 0.25,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [metric, setId], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="relative">
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 md:col-span-8 xl:col-span-4">
          <Heading data-reveal="lines" className="t-h2 xl:text-[clamp(1.75rem,2.6vw,2.875rem)]">Performance lab</Heading>
          <p className="mt-5 text-alloy text-pretty">
            Measured power and torque, before and after calibration work, with the test conditions that make the numbers meaningful.
          </p>

          {set.isDemo ? (
            <div className="mt-8 border-l-2 border-signal pl-5">
              <p className="font-[640]">No measured results are published yet.</p>
              <p className="mt-2 text-[0.9375rem] text-alloy">
                The chart shows demonstration curves on a relative scale. It is not a vehicle, a measurement or a typical gain. Verified
                records will appear here with the vehicle, engine, fuel, test method and work performed.
              </p>
            </div>
          ) : (
            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[0.9375rem]">
              <dt className="text-alloy">Vehicle</dt>
              <dd>{set.vehicle}</dd>
              <dt className="text-alloy">Engine</dt>
              <dd>{set.engine}</dd>
              <dt className="text-alloy">Fuel</dt>
              <dd>{set.fuel}</dd>
              <dt className="text-alloy">Method</dt>
              <dd>{set.conditions?.method}</dd>
              <dt className="text-alloy">Correction</dt>
              <dd>{set.conditions?.correction}</dd>
              {set.conditions?.ambient && (
                <>
                  <dt className="text-alloy">Ambient</dt>
                  <dd>{set.conditions.ambient}</dd>
                </>
              )}
              <dt className="text-alloy">Date</dt>
              <dd>{set.conditions?.date}</dd>
              <dt className="text-alloy">Work</dt>
              <dd>{set.workPerformed}</dd>
            </dl>
          )}

          <p className="mt-8 text-[0.8125rem] text-alloy">
            Results vary with vehicle, hardware, fuel, condition, calibration and measurement method. Figures from different dynamometers
            or correction standards are not directly comparable.
          </p>
        </div>

        <figure className="col-span-4 md:col-span-12 xl:col-span-8 xl:col-start-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div role="group" aria-label="Measurement shown" className="inline-flex border border-gunmetal">
              {(["power", "torque"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={metric === m}
                  onClick={() => setMetric(m)}
                  className="min-h-[44px] px-5 text-[0.9375rem] font-[600] capitalize text-alloy transition-colors aria-pressed:bg-titanium aria-pressed:text-asphalt"
                >
                  {m}
                </button>
              ))}
            </div>
            {sets.length > 1 && (
              <label className="flex items-center gap-3 text-[0.9375rem]">
                <span className="text-alloy">Record</span>
                <select value={setId} onChange={(e) => setSetId(e.target.value)} className="field-input min-h-[44px] w-auto py-1 pr-8">
                  {sets.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <ul className="flex gap-5 text-[0.875rem]">
              <li className="flex items-center gap-2">
                <svg width="28" height="8" aria-hidden="true">
                  <path d="M0 4h28" stroke="var(--color-alloy)" strokeWidth="2" strokeDasharray="5 4" />
                </svg>
                Before
              </li>
              <li className="flex items-center gap-2">
                <svg width="28" height="8" aria-hidden="true">
                  <path d="M0 4h28" stroke="var(--color-signal)" strokeWidth="2.5" />
                </svg>
                After
              </li>
            </ul>
          </div>

          <div className="relative border border-gunmetal bg-graphite/40">
            {set.isDemo && (
              <span className="absolute top-3 right-3 z-10 bg-signal px-2 py-1 text-[0.75rem] font-[650] text-white" style={{ fontStretch: "90%" }}>
                Demonstration data
              </span>
            )}
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
              <title id={`${uid}-t`}>{`${metric === "power" ? "Power" : "Torque"} against engine speed${set.isDemo ? " (demonstration data)" : ""}`}</title>
              <desc id={`${uid}-d`}>
                {`Before and after curves from ${rpmMin} to ${rpmMax} rpm. Use the engine speed slider below the chart to read values.`}
              </desc>

              {set.isDemo && (
                <text x={M.left + PW / 2} y={M.top + PH / 2 + 18} textAnchor="middle" fill="var(--color-titanium)" opacity="0.05" style={{ fontSize: 64, fontWeight: 800, fontStretch: "125%" }}>
                  DEMONSTRATION
                </text>
              )}

              {yTicks.map((t) => (
                <g key={t}>
                  <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--color-gunmetal)" strokeWidth="1" />
                  <text x={M.left - 10} y={y(t) + 4} textAnchor="end" className="t-svg-note" fill="var(--color-alloy)">
                    {Math.round(t)}
                  </text>
                </g>
              ))}
              {xTicks.map((t) => (
                <text key={t} x={x(t)} y={H - M.bottom + 22} textAnchor="middle" className="t-svg-note" fill="var(--color-alloy)">
                  {t}
                </text>
              ))}
              <text x={M.left + PW / 2} y={H - 8} textAnchor="middle" className="t-svg-note" fill="var(--color-alloy)">
                Engine speed (rpm)
              </text>
              <text transform={`translate(16 ${M.top + PH / 2}) rotate(-90)`} textAnchor="middle" className="t-svg-note" fill="var(--color-alloy)">
                {`${metric === "power" ? "Power" : "Torque"} (${unit})`}
              </text>

              <defs>
                {["before", "after"].map((k) => (
                  <clipPath key={k} id={`${uid}-${k}`}>
                    <rect data-reveal x={0} y={0} width={W} height={H} />
                  </clipPath>
                ))}
              </defs>
              {/* "Before" is dashed and "after" solid, so the series differ by more than colour. */}
              <path clipPath={`url(#${uid}-before)`} d={path(set.before)} fill="none" stroke="var(--color-alloy)" strokeWidth="2" strokeDasharray="7 5" />
              <path clipPath={`url(#${uid}-after)`} d={path(set.after)} fill="none" stroke="var(--color-signal)" strokeWidth="2.75" />

              <line x1={x(rpm)} x2={x(rpm)} y1={M.top} y2={M.top + PH} stroke="var(--color-titanium)" strokeOpacity="0.4" strokeWidth="1" />
              <circle cx={x(b.rpm)} cy={y(b[metric])} r="4.5" fill="var(--color-asphalt)" stroke="var(--color-alloy)" strokeWidth="2" />
              <circle cx={x(a.rpm)} cy={y(a[metric])} r="4.5" fill="var(--color-signal)" />
            </svg>
          </div>

          <div className="mt-5 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="sr-only">Engine speed</span>
              <input
                type="range"
                min={rpmMin}
                max={rpmMax}
                step={set.before[1]!.rpm - set.before[0]!.rpm}
                value={rpm}
                onChange={(e) => setRpm(Number(e.target.value))}
                aria-valuetext={`${rpm} rpm`}
                className="lab-range w-full"
              />
            </label>
            <output className="t-index flex gap-5 text-[0.9375rem] tabular-nums" aria-live="polite">
              <span>{rpm} rpm</span>
              <span className="text-alloy">
                Before {b[metric]} {unit}
              </span>
              <span className="text-signal-text">
                After {a[metric]} {unit}
              </span>
            </output>
          </div>
          {set.isDemo && <figcaption className="t-note mt-3">Demonstration curves only. Relative scale; no vehicle was measured.</figcaption>}
        </figure>
      </div>
    </div>
  );
}
