/**
 * Service content. Copy describes what each service involves in general terms and avoids
 * claims the business has not confirmed (packages, stages, power figures, brand coverage).
 * Only services listed in `business.services` are published.
 */
import type { MediaKey } from "./media";
import { business } from "@/config/business";

export type ServiceSlug =
  | "ecu-coding"
  | "ecu-remapping"
  | "performance-tuning"
  | "ecu-repair"
  | "dpf-service"
  | "software-updates";

export type ServiceTrack = "performance" | "repair";

export interface Service {
  slug: ServiceSlug;
  name: string;
  track: ServiceTrack;
  /** One sentence used in lists and meta descriptions. */
  summary: string;
  /** Opening paragraph(s) on the service page. */
  intro: string[];
  involves: string[];
  /** Situations where a customer would typically ask for this. */
  signs: string[];
  /** What the customer should do next. */
  nextStep: string;
  /** Honest limits and caveats. */
  limits: string[];
  media: MediaKey;
  /** Short technical annotation for the services index. */
  annotation: string;
}

export const services: Service[] = [
  {
    slug: "ecu-remapping",
    name: "ECU remapping",
    track: "performance",
    summary:
      "Vehicle-specific changes to the engine calibration, carried out on a healthy engine with hardware that can support them.",
    intro: [
      "An engine control unit runs on calibration tables: fuel delivery, ignition or injection timing, boost targets, torque limiters and more. Remapping adjusts those tables for one particular engine and the hardware fitted to it.",
      "Done properly, it starts with the condition of the car rather than a file. A remap amplifies whatever the engine is already doing — including its faults.",
    ],
    involves: [
      "A health check and fault-memory read before any calibration work",
      "Reading and archiving the original software so it can be restored",
      "Calibration matched to the engine, hardware, fuel and how the car is used",
      "Checks after writing: fault memory, live data and a measured assessment where appropriate",
    ],
    signs: [
      "You want better response, drivability or power delivery from an engine in good health",
      "Hardware has changed and the calibration no longer matches it",
    ],
    nextStep:
      "Send the make, model, engine and year with what you want from the car. Suitability is assessed for your vehicle before any work is agreed.",
    limits: [
      "A remap can’t compensate for worn parts, boost leaks, failing sensors or missed maintenance. Those are dealt with first.",
      "Results vary with the vehicle, hardware, fuel, condition, calibration and how they are measured.",
      "Modifications can affect warranty and insurance. Tell your insurer and check local regulations.",
      "Emissions-control equipment must stay fitted and working.",
    ],
    media: "engineBay",
    annotation: "Calibration tables: fuel, timing, boost, limiters",
  },
  {
    slug: "performance-tuning",
    name: "Performance tuning",
    track: "performance",
    summary:
      "Planning modifications as a whole so hardware, software and the car’s condition work together toward one goal.",
    intro: [
      "Performance tuning goes further than a single software change. It means agreeing a goal, confirming the car is healthy enough to pursue it, and matching the calibration to the parts actually fitted.",
      "The aim is a car that delivers its performance consistently and predictably — on the road, every time — not a number from one run.",
    ],
    involves: [
      "A conversation about how you use the car and what you want from it",
      "A baseline assessment of condition, fault memory and existing modifications",
      "Calibration for the hardware fitted, followed by verification",
      "A written record of what was changed",
    ],
    signs: [
      "You’re planning hardware upgrades and want them set up as one system",
      "Previous modifications left the car inconsistent or unreliable",
    ],
    nextStep:
      "Describe the car, any modifications already fitted and your goal. Available options are confirmed per vehicle — ask about yours.",
    limits: [
      "Specific packages, stages and hardware upgrades depend on the vehicle and are confirmed individually.",
      "No outcome is promised in advance. Measured figures depend on the vehicle and the measurement method.",
      "Modifications can affect warranty and insurance. Tell your insurer and check local regulations.",
    ],
    media: "dyno",
    annotation: "Goal → baseline → calibration → verification",
  },
  {
    slug: "ecu-coding",
    name: "ECU coding",
    track: "repair",
    summary:
      "Configuring control modules so they match the vehicle’s equipment and enable the features it supports.",
    intro: [
      "A modern car carries many control modules that need to agree about how the vehicle is built. Coding sets the parameters inside a module so it recognises the hardware around it and behaves as intended.",
      "It’s needed after a module is replaced, when equipment is retrofitted, or when a supported setting is changed.",
    ],
    involves: [
      "Reading the module’s current coding and saving a backup before changes",
      "Adapting a replacement or retrofitted module to the vehicle",
      "Enabling or adjusting features where the module supports them",
      "Clearing related fault memory and confirming the module communicates correctly",
    ],
    signs: [
      "A replacement module is fitted but warnings or functions aren’t right",
      "Retrofitted equipment isn’t recognised",
      "You’d like to change a supported convenience setting",
    ],
    nextStep:
      "Tell us the make, model, year and what needs coding. Compatibility is checked for your exact vehicle before booking.",
    limits: [
      "What can be coded depends on the manufacturer, module and software level.",
      "Some functions are locked by the manufacturer and need dealer-level access, or can’t be changed at all.",
    ],
    media: "workshop",
    annotation: "Module configuration and adaptation",
  },
  {
    slug: "ecu-repair",
    name: "ECU service and repair",
    track: "repair",
    summary:
      "Proving whether a control unit is at fault, then repairing it where a reliable repair is possible.",
    intro: [
      "When a control unit appears to fail — no communication, intermittent faults, a dead circuit, water damage — the first job is proving the unit itself is the problem rather than wiring, power supply or a sensor.",
      "Once that is established, the unit can be inspected and, where it’s viable, repaired.",
    ],
    involves: [
      "Confirming the fault on the vehicle: power, ground, network and wiring checks",
      "Bench inspection of the unit’s circuitry",
      "Component-level repair where a repair is viable",
      "Testing after repair, with coding or adaptation to the vehicle where needed",
    ],
    signs: [
      "The car won’t start or a module won’t communicate",
      "Intermittent faults that return after parts are replaced",
      "A unit has been exposed to water or electrical damage",
    ],
    nextStep:
      "Describe the symptoms and any fault codes you have. Repair viability is only known after inspection.",
    limits: [
      "Not every ECU fault can be repaired. Some units are damaged beyond a reliable repair and need replacing and coding instead.",
    ],
    media: "ecuBoard",
    annotation: "Power, ground and network checks, then the circuit board",
  },
  {
    slug: "dpf-service",
    name: "DPF service",
    track: "repair",
    summary:
      "Inspection, diagnosis and lawful cleaning or servicing of diesel particulate filters, including the faults that block them.",
    intro: [
      "A diesel particulate filter traps soot and burns it off through regeneration. When regeneration can’t keep up, the filter blocks and the car warns you or limits power.",
      "A blocked filter is usually a symptom. Finding why it blocked matters as much as the filter itself.",
    ],
    involves: [
      "Reading fault memory and live data: differential pressure, exhaust temperatures, soot and ash load",
      "Checking sensors and the conditions that stop regeneration from completing",
      "Diagnostic-assisted regeneration or cleaning where the filter’s condition allows it",
      "Advice on underlying faults and driving patterns that cause repeat blockages",
    ],
    signs: [
      "A DPF warning light or reduced-power mode",
      "Regeneration that never seems to complete",
      "The filter has blocked again after a previous clean",
    ],
    nextStep:
      "Send the vehicle details and the warnings you’re seeing. Diagnosis comes first so the cause is treated, not just the filter.",
    limits: [
      "Filters with high ash load or physical damage may need replacing rather than cleaning.",
      "This service covers lawful inspection, cleaning and repair only. Removing or disabling a DPF, or software that hides emissions faults, is not part of it.",
    ],
    media: "dpf",
    annotation: "Differential pressure, soot load, ash load, regeneration",
  },
  {
    slug: "software-updates",
    name: "Vehicle software updates",
    track: "repair",
    summary:
      "Updating control-module software to a supported newer release, with compatibility checks before and verification after.",
    intro: [
      "Manufacturers release software that fixes known faults, improves drivability or adds compatibility. Updating a module is careful work.",
      "The car needs stable power throughout, the correct release for its exact hardware, and checks once programming is done.",
    ],
    involves: [
      "Identifying the module, its hardware and current software versions",
      "Confirming an applicable, compatible update exists",
      "Programming on a stable power supply",
      "Verifying the module afterwards: fault memory, coding and function checks",
    ],
    signs: [
      "A known fault has a software fix",
      "A replacement module needs the current release",
      "A component needs newer software to be compatible",
    ],
    nextStep:
      "Send the vehicle details and what the update is for. Availability is confirmed for your vehicle before booking.",
    limits: [
      "Some updates are only available through the manufacturer’s own systems.",
      "Updates aren’t always reversible. That’s discussed before programming starts.",
    ],
    media: "diagnostics",
    annotation: "Hardware ID, software version, programming, verification",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Services confirmed in the business configuration, in display order. */
export function publishedServices(): Service[] {
  return services.filter((s) => business.services.includes(s.slug));
}
