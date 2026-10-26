/** Five-star rating, filled to a fractional value. The number is always given as text for screen readers. */
export function Stars({ value, size = 16, className = "" }: { value: number; size?: number; className?: string }) {
  const pct = Math.max(0, Math.min(5, value)) / 5;
  const row = (fill: string) => (
    <span className="flex gap-[2px]">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L10 15l-5.4 3 1.2-6L1.3 7.8l6.1-.7z" fill={fill} />
        </svg>
      ))}
    </span>
  );
  return (
    <span className={`relative inline-flex ${className}`}>
      <span className="sr-only">Rated {value.toFixed(1)} out of 5</span>
      {row("var(--color-gunmetal)")}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${pct * 100}%` }}>
        {row("var(--color-signal)")}
      </span>
    </span>
  );
}
