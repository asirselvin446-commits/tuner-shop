/**
 * Homepage copy. Headline and supporting line are proposed marketing copy, not an established slogan —
 * edit freely.
 */
export const hero = {
  headline: ["Engineered", "for performance."],
  support: "Precision ECU tuning, vehicle diagnostics and electronic control solutions.",
  primaryCta: { label: "Book a diagnostic", href: "/contact#enquiry" },
  secondaryCta: { label: "Explore performance", href: "/performance" },
};

/**
 * Chapters of the pinned vehicle story. The footage shows the car's exterior only, so the electronic
 * systems are explained with a separate diagram rather than pointed at on the car.
 */
export const storyChapters = [
  {
    title: "A car is a network.",
    body: "Engine, gearbox, brakes, body and dashboard each have their own control unit. They talk constantly over the vehicle’s data networks.",
  },
  {
    title: "Every module has a job.",
    body: "The engine control unit decides fuelling, timing and boost thousands of times a second. Its neighbours share sensor data, limits and fault reports.",
  },
  {
    title: "Read before you write.",
    body: "Work starts with what the car reports: fault memory, live data and software versions. Calibration or repair follows only once the picture is clear.",
  },
  {
    title: "Then the right service.",
    body: "Coding, remapping, repair, DPF work or a software update — chosen for the fault or goal you actually have.",
  },
] as const;
