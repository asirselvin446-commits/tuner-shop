/**
 * Simplified vehicle network diagram: control units sharing a CAN bus, a gateway, and a diagnostic
 * connection through the OBD port. A generic illustration — real architectures vary by manufacturer.
 * Parts carry data attributes so the story timeline can build it up chapter by chapter.
 */
const top = [
  { id: "ecu", x: 24, label: "Engine", sub: "ECU" },
  { id: "tcu", x: 152, label: "Gearbox", sub: "TCU" },
  { id: "abs", x: 280, label: "Brakes", sub: "ABS / ESC" },
];
const bottom = [
  { id: "bcm", x: 24, label: "Body", sub: "BCM" },
  { id: "ic", x: 152, label: "Instruments", sub: "Cluster" },
  { id: "gw", x: 280, label: "Gateway", sub: "GW" },
];

const NODE_W = 112;
const NODE_H = 52;
const BUS_H = 178;
const BUS_L = 188;

export function CanDiagram({ className = "" }: { className?: string }) {
  return (
    <figure className={className}>
      <svg viewBox="0 0 420 400" role="img" aria-labelledby="can-title can-desc" className="h-auto w-full overflow-visible">
        <title id="can-title">Simplified vehicle network</title>
        <desc id="can-desc">
          Six control units — engine, gearbox, brakes, body, instruments and gateway — share a two-wire CAN bus. A diagnostic tool
          connects through the OBD port via the gateway.
        </desc>

        {/* ECU responsibilities, revealed in chapter two */}
        <g data-ecu-detail className="t-svg-note" fill="var(--color-signal-text)">
          <text x={24} y={22}>
            Fuelling, timing, boost, limits
          </text>
          <path d="M80 30 V62" stroke="var(--color-signal)" strokeWidth="1" />
        </g>

        {/* Bus wires */}
        <g data-bus stroke="var(--color-alloy)" strokeWidth="1.25" fill="none">
          <path d={`M8 ${BUS_H} H412`} pathLength={1} className="bus-line" />
          <path d={`M8 ${BUS_L} H412`} pathLength={1} className="bus-line" />
        </g>
        <text x={412} y={BUS_H - 6} textAnchor="end" className="t-svg-note" fill="var(--color-alloy)">
          CAN-H
        </text>
        <text x={412} y={BUS_L + 16} textAnchor="end" className="t-svg-note" fill="var(--color-alloy)">
          CAN-L
        </text>

        {top.map((n) => (
          <g key={n.id} data-node data-node-id={n.id}>
            <line x1={n.x + NODE_W / 2} y1={62 + NODE_H} x2={n.x + NODE_W / 2} y2={BUS_H} stroke="var(--color-steel)" strokeWidth="1" />
            <rect
              data-node-box={n.id}
              x={n.x}
              y={62}
              width={NODE_W}
              height={NODE_H}
              fill="var(--color-graphite)"
              stroke={n.id === "ecu" ? "var(--color-signal)" : "var(--color-gunmetal)"}
              strokeWidth="1"
            />
            <text x={n.x + 12} y={62 + 22} className="t-svg-label" fill="var(--color-titanium)">
              {n.label}
            </text>
            <text x={n.x + 12} y={62 + 40} className="t-svg-note" fill="var(--color-alloy)">
              {n.sub}
            </text>
          </g>
        ))}

        {bottom.map((n) => (
          <g key={n.id} data-node data-node-id={n.id}>
            <line x1={n.x + NODE_W / 2} y1={BUS_L} x2={n.x + NODE_W / 2} y2={252} stroke="var(--color-steel)" strokeWidth="1" />
            <rect x={n.x} y={252} width={NODE_W} height={NODE_H} fill="var(--color-graphite)" stroke="var(--color-gunmetal)" strokeWidth="1" />
            <text x={n.x + 12} y={252 + 22} className="t-svg-label" fill="var(--color-titanium)">
              {n.label}
            </text>
            <text x={n.x + 12} y={252 + 40} className="t-svg-note" fill="var(--color-alloy)">
              {n.sub}
            </text>
          </g>
        ))}

        {/* Diagnostic connection, revealed in chapter three */}
        <g data-tool>
          <path d={`M336 ${252 + NODE_H} V340 H250`} pathLength={1} stroke="var(--color-titanium)" strokeWidth="1.25" strokeDasharray="0.02 0.015" fill="none" />
          <rect x={136} y={322} width={114} height={36} fill="var(--color-titanium)" />
          <text x={148} y={345} className="t-svg-label" fill="var(--color-asphalt)">
            Diagnostic tool
          </text>
          <text x={344} y={326} className="t-svg-note" fill="var(--color-alloy)">
            OBD port
          </text>
          <text x={136} y={384} className="t-svg-note" fill="var(--color-alloy)">
            Fault memory, live data, software versions
          </text>
        </g>
      </svg>
      <figcaption className="t-note mt-3">Simplified diagram. Network layouts differ between manufacturers and models.</figcaption>
    </figure>
  );
}
