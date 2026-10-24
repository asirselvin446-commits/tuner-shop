/**
 * Measured power and torque records for the Performance Lab.
 *
 * Only add records supplied by the business from real measurements, with the test conditions filled in.
 * While `dynoRecords` is empty, the lab shows a clearly labelled demonstration chart instead.
 */

export interface CurvePoint {
  rpm: number;
  power: number;
  torque: number;
}

export interface DynoRecord {
  id: string;
  vehicle: string;
  engine: string;
  fuel: string;
  units: { power: "kW" | "hp" | "PS"; torque: "Nm" | "lb-ft" };
  conditions: {
    /** e.g. "Chassis dynamometer, wheel power" */
    method: string;
    /** e.g. "DIN 70020" */
    correction: string;
    ambient?: string;
    date: string;
  };
  workPerformed: string;
  before: CurvePoint[];
  after: CurvePoint[];
  caseStudySlug?: string;
}

export const dynoRecords: DynoRecord[] = [];

export interface CurveSet {
  id: string;
  label: string;
  isDemo: boolean;
  units: { power: string; torque: string };
  before: CurvePoint[];
  after: CurvePoint[];
  vehicle?: string;
  engine?: string;
  fuel?: string;
  conditions?: DynoRecord["conditions"];
  workPerformed?: string;
}

/**
 * Demonstration curves. Values are relative (% of the baseline peak), not a vehicle, not a measurement
 * and not a typical gain. They exist only to show how a verified record will be presented.
 */
function demoCurves(): Pick<CurveSet, "before" | "after"> {
  const before: CurvePoint[] = [];
  const after: CurvePoint[] = [];
  for (let rpm = 1500; rpm <= 6500; rpm += 250) {
    const x = (rpm - 1500) / 5000;
    const torqueBase = 100 * (0.62 + 0.42 * Math.sin(Math.min(1, x * 1.9) * Math.PI * 0.5)) - 32 * Math.max(0, x - 0.55) ** 1.6;
    const torqueAfter = torqueBase * (1 + 0.1 * Math.exp(-((x - 0.35) ** 2) / 0.08));
    const powerOf = (t: number) => (t * rpm) / 4800;
    before.push({ rpm, torque: round(torqueBase), power: round(powerOf(torqueBase)) });
    after.push({ rpm, torque: round(torqueAfter), power: round(powerOf(torqueAfter)) });
  }
  const peakPower = Math.max(...before.map((p) => p.power));
  const peakTorque = Math.max(...before.map((p) => p.torque));
  const norm = (pts: CurvePoint[]) =>
    pts.map((p) => ({ rpm: p.rpm, power: round((p.power / peakPower) * 100), torque: round((p.torque / peakTorque) * 100) }));
  return { before: norm(before), after: norm(after) };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export function curveSets(): CurveSet[] {
  if (dynoRecords.length > 0) {
    return dynoRecords.map((r) => ({
      id: r.id,
      label: r.vehicle,
      isDemo: false,
      units: r.units,
      before: r.before,
      after: r.after,
      vehicle: r.vehicle,
      engine: r.engine,
      fuel: r.fuel,
      conditions: r.conditions,
      workPerformed: r.workPerformed,
    }));
  }
  return [
    {
      id: "demo",
      label: "Demonstration",
      isDemo: true,
      units: { power: "% of baseline peak", torque: "% of baseline peak" },
      ...demoCurves(),
    },
  ];
}
