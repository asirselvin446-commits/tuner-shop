import { missingBusinessFields } from "@/config/business";

/**
 * Development-only checklist of unset business facts. Never rendered in production builds.
 */
export function SetupNotice() {
  if (process.env.NODE_ENV !== "development") return null;
  const missing = missingBusinessFields();
  if (missing.length === 0) return null;

  return (
    <details className="fixed bottom-3 left-3 z-[90] max-w-[320px] border border-signal bg-asphalt text-[0.8125rem] text-titanium shadow-2xl">
      <summary className="cursor-pointer px-3 py-2 font-[600]">Setup: {missing.length} business details unset</summary>
      <div className="border-t border-gunmetal px-3 py-2">
        <p className="mb-2 text-alloy">Edit src/config/business.ts. Hidden in production.</p>
        <ul className="list-disc space-y-0.5 pl-4 text-alloy">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}
