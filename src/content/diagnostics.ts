/**
 * Typical diagnostic journey. Illustrative until the workshop confirms its own process —
 * the section says so on the page.
 */
export const diagnosticSteps = [
  {
    title: "Understand the concern",
    body: "What you noticed, when it happens, and anything already tried or replaced.",
  },
  {
    title: "Identify the vehicle and system",
    body: "Exact model, engine, control unit and software version. The right procedure depends on all of them.",
  },
  {
    title: "Diagnose",
    body: "Fault memory, live data and measurements on the circuits involved. A fault code points the way; it rarely gives the answer on its own.",
  },
  {
    title: "Explain the findings",
    body: "What was found, what it means, and the proposed work — before anything on the car is changed.",
  },
  {
    title: "Carry out the approved work",
    body: "Repair, coding, a software update or DPF service — only the work you agreed to.",
  },
  {
    title: "Verify the outcome",
    body: "Fault memory re-read, live data checked, and a road test where it’s relevant.",
  },
] as const;
