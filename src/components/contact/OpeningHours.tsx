import type { OpeningHoursEntry } from "@/config/business";

function dayRange(days: OpeningHoursEntry["days"]) {
  if (days.length === 1) return days[0];
  return `${days[0]}–${days[days.length - 1]}`;
}

export function OpeningHours({ hours }: { hours: OpeningHoursEntry[] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-alloy">
      {hours.map((h) => (
        <div key={h.days.join()} className="contents">
          <dt>{dayRange(h.days)}</dt>
          <dd className="tabular-nums">
            {h.opens}–{h.closes}
          </dd>
        </div>
      ))}
    </dl>
  );
}
