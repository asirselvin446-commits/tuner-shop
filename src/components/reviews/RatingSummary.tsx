import { Stars } from "./Stars";

interface Props {
  value: number;
  count?: number;
  /** ISO date for a snapshot; omit for a live value from Google. */
  asOf?: string;
  size?: "lg" | "md";
}

/** Overall Google Maps rating. A snapshot always carries its date so it can't pass as current. */
export function RatingSummary({ value, count, asOf, size = "lg" }: Props) {
  const date = asOf ? new Date(asOf).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : null;
  return (
    <div>
      <p aria-hidden="true" className={`${size === "lg" ? "t-display" : "t-h1"} !normal-case tabular-nums`}>
        {value.toFixed(1)}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Stars value={value} size={size === "lg" ? 22 : 18} />
        <p className="text-alloy">
          {count !== undefined && (
            <>
              {count.toLocaleString("en-GB")} {count === 1 ? "review" : "reviews"}{" "}
            </>
          )}
          on <span className="text-titanium">Google Maps</span>
          {date && <>, as of {date}</>}
        </p>
      </div>
    </div>
  );
}
