/**
 * Service content. Copy describes what each service involves in general terms and avoids
 * claims the business has not confirmed (packages, stages, power figures, brand coverage).
 * Service list confirmed by the client on 2026-10-27. Only services in `business.services` are published.
 */
import type { MediaKey } from "./media";
import { business } from "@/config/business";

export type ServiceSlug =
  | "diagnostics-scanning"
  | "immo-unlock"
  | "airbag-module-reset"
  | "instrument-cluster-programming"
  | "ecm-bcm-programming"
  | "key-programming"
  | "remapping-race-tuning"
  | "gps-security";

/** How services are grouped on the site. */
export type ServiceTrack = "performance" | "repair" | "security";

export interface Service {
  slug: ServiceSlug;
  name: string;
  /** Compact name for tight lists (hero index, story chapter). */
  shortName: string;
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
    slug: "diagnostics-scanning",
    name: "Automotive diagnostics and scanning",
    shortName: "Diagnostics",
    track: "repair",
    summary: "A full scan of the car’s control units and live data to find the cause of a warning light, fault or performance problem.",
    intro: [
      "Modern cars log faults across many control modules, not just the engine. A proper scan reads them all, together with live sensor data, so the real cause can be found rather than guessed.",
      "Fault codes point the way; measurements on the car confirm it. Parts are replaced when the evidence says so.",
    ],
    involves: [
      "Reading fault memory across every accessible control module",
      "Checking live data from sensors and actuators while the fault occurs",
      "Targeted tests on the circuits and components involved",
      "A clear explanation of the findings and the recommended work",
    ],
    signs: [
      "A warning light on the dashboard",
      "Loss of power, rough running or limp mode",
      "An intermittent fault no one has pinned down",
      "A check before buying a used car",
    ],
    nextStep:
      "Tell us the make, model and year, and what the car is doing. The scan comes first, so any work that follows is based on what the car reports.",
    limits: [
      "Some faults only appear under specific conditions and may need a road test or a second visit.",
      "Diagnosis finds the cause; the fix is agreed with you before any repair work starts.",
    ],
    media: "diagnostics",
    annotation: "All modules: fault memory, live data, circuit tests",
  },
  {
    slug: "immo-unlock",
    name: "Immo unlock",
    shortName: "Immo unlock",
    track: "security",
    summary: "Immobiliser unlocking and resynchronisation for owners, when the keys, ECU and immobiliser no longer recognise each other.",
    intro: [
      "The immobiliser stops the engine starting unless it recognises an authorised key. After an ECU or immobiliser module is replaced, a fault, or lost keys, those parts can fall out of step and the car won’t start.",
      "Immo unlock work restores the match, or prepares a replacement unit so it can be paired with the car.",
    ],
    involves: [
      "Confirming the immobiliser is the cause of the no-start",
      "Reading immobiliser data from the ECU or module",
      "Synchronising keys, ECU and immobiliser, or preparing a replacement unit",
      "Testing that the car starts and runs with each authorised key",
    ],
    signs: [
      "The car cranks but won’t start, with an immobiliser warning",
      "A replacement ECU or immobiliser module has been fitted",
      "Every key is lost and new ones must be paired",
    ],
    nextStep: "Bring proof of ownership with the car, and tell us the make, model and year and what led to the no-start.",
    limits: [
      "Proof of ownership (registration certificate and ID) is required before any immobiliser or key work.",
      "Some newer vehicles can only be paired through the manufacturer’s own systems.",
    ],
    media: "engineBay",
    annotation: "ECU, immobiliser and key synchronisation",
  },
  {
    slug: "airbag-module-reset",
    name: "Airbag module reset",
    shortName: "Airbag reset",
    track: "repair",
    summary:
      "Clearing stored crash data from an airbag (SRS) control module after accident repairs, so the system works and the warning light goes out.",
    intro: [
      "When airbags deploy, the SRS control module stores crash data and locks itself. Even with new airbags fitted, the warning light stays on and the system may not work until the module is reset or replaced.",
      "A reset clears the crash record so the module can be refitted and the whole system checked.",
    ],
    involves: [
      "Reading SRS fault memory and stored crash data",
      "Clearing crash data from the control module",
      "Refitting and checking the complete airbag system for faults",
      "Confirming the warning light clears and stays off",
    ],
    signs: ["The airbag light stays on after accident repairs", "An SRS module shows a stored crash record"],
    nextStep: "Tell us the make, model and year, and whether the airbags or seatbelt pretensioners deployed.",
    limits: [
      "Deployed airbags, seatbelt pretensioners and damaged sensors must be replaced first. A reset doesn’t repair them.",
      "The system is checked after the reset; the warning light is never hidden or disabled.",
    ],
    media: "workshop",
    annotation: "SRS crash data, fault memory, system check",
  },
  {
    slug: "instrument-cluster-programming",
    name: "Instrument cluster programming",
    shortName: "Cluster programming",
    track: "repair",
    summary: "Service resets, coding and programming for all types of instrument cluster, including setting up a replacement cluster.",
    intro: [
      "The instrument cluster shows warnings, service reminders and the car’s recorded mileage, and it shares data with other control units.",
      "Programming covers service interval resets, configuration and coding, and preparing a replacement cluster so it works with the car and shows the vehicle’s true mileage.",
    ],
    involves: [
      "Service interval and maintenance reminder resets",
      "Coding and configuring the cluster for the vehicle",
      "Preparing a replacement or repaired cluster to match the car",
      "Carrying the vehicle’s genuine recorded mileage over to a replacement cluster",
    ],
    signs: [
      "A service reminder that won’t reset",
      "A replacement cluster showing errors or the wrong settings",
      "Display or configuration faults after other repairs",
    ],
    nextStep: "Tell us the make, model and year, and what the cluster is doing or what needs programming.",
    limits: [
      "Mileage is only ever matched to the vehicle’s genuine recorded mileage. Odometer rollback is illegal and not offered.",
      "Some clusters need parts or access only available from the manufacturer.",
    ],
    media: "heroReveal",
    annotation: "Service resets, coding, replacement cluster setup",
  },
  {
    slug: "ecm-bcm-programming",
    name: "ECM and BCM programming",
    shortName: "ECM & BCM programming",
    track: "repair",
    summary:
      "Programming, coding and software updates for engine (ECM) and body (BCM) control modules, including setting up replacement units.",
    intro: [
      "The engine control module (ECM) runs the engine; the body control module (BCM) looks after lights, locks, windows and other body electronics. Both must be programmed and coded to match the exact car.",
      "That’s needed when a module is replaced or updated, or after repairs that change how the car is configured.",
    ],
    involves: [
      "Reading and backing up the existing software and coding",
      "Programming, coding or updating the module for the vehicle",
      "Adapting a replacement module to the car",
      "Checking fault memory and that every function works",
    ],
    signs: [
      "A replacement ECM or BCM needs programming",
      "Lights, locks or windows behave wrongly after repairs",
      "A module needs a software update or recoding",
    ],
    nextStep: "Send the make, model and year, and which module is involved. Compatibility is checked for your exact vehicle first.",
    limits: [
      "What can be programmed depends on the manufacturer, module and software level.",
      "Some modules can only be programmed through the manufacturer’s own systems.",
    ],
    media: "ecuBoard",
    annotation: "Engine and body modules: program, code, update",
  },
  {
    slug: "key-programming",
    name: "Sensor and smart key programming",
    shortName: "Key programming",
    track: "security",
    summary:
      "Programming and duplication of all types of sensor, remote and smart (keyless) keys, including spares and replacements for lost keys.",
    intro: [
      "Modern keys carry a transponder chip and often a remote or keyless-entry function. A new or spare key has to be cut where needed and programmed to the car before it will start the engine or open the doors.",
      "Duplication adds a spare to a working key; programming pairs new keys when keys are lost or damaged.",
    ],
    involves: [
      "Identifying the key type and the car’s immobiliser system",
      "Cutting the blade, where the key has one",
      "Programming the transponder, remote and keyless functions to the car",
      "Testing start, lock and unlock with every key",
    ],
    signs: ["You need a spare key", "A key is lost or damaged, or its remote has stopped working", "A smart (keyless) key isn’t recognised"],
    nextStep: "Bring the car, any working keys and proof of ownership, and tell us the make, model and year.",
    limits: [
      "Proof of ownership (registration certificate and ID) is required for all key programming and duplication.",
      "Some vehicles need parts or access only available from the manufacturer.",
    ],
    media: "orbit",
    annotation: "Transponder, remote and keyless keys",
  },
  {
    slug: "remapping-race-tuning",
    name: "Remapping and race tuning",
    shortName: "Remapping & race tuning",
    track: "performance",
    summary:
      "Vehicle-specific engine calibration, from road remaps to track-focused race tuning, on a healthy engine with hardware that can support it.",
    intro: [
      "The engine control unit runs on calibration tables: fuelling, ignition or injection timing, boost and torque limits. Remapping adjusts them for one particular engine and the hardware fitted to it.",
      "Race tuning goes further, for cars built for track and motorsport use. Either way, it starts with the condition of the car rather than a file.",
    ],
    involves: [
      "A health check and fault-memory read before any calibration work",
      "Reading and archiving the original software so it can be restored",
      "Calibration matched to the engine, hardware, fuel and how the car is used",
      "Checks after writing: fault memory, live data and a measured assessment where appropriate",
    ],
    signs: [
      "You want better response and power delivery from a healthy engine",
      "Hardware has changed and the calibration no longer matches it",
      "A track or competition car needs a dedicated calibration",
    ],
    nextStep:
      "Send the make, model, engine and year, any modifications already fitted, and what you want from the car. Options are confirmed per vehicle.",
    limits: [
      "A remap can’t compensate for worn parts, boost leaks, failing sensors or missed maintenance. Those are dealt with first.",
      "Results vary with the vehicle, hardware, fuel, condition, calibration and how they are measured.",
      "Race calibrations are for track and competition use. Road cars must stay road-legal, with emissions equipment fitted and working.",
      "Modifications can affect warranty and insurance. Tell your insurer.",
    ],
    media: "dyno",
    annotation: "Calibration tables: fuel, timing, boost, limits",
  },
  {
    slug: "gps-security",
    name: "Car GPS and security systems",
    shortName: "GPS & security",
    track: "security",
    summary: "Installation of GPS trackers, alarms and other vehicle security systems, wired in properly to the car’s electrics.",
    intro: [
      "A GPS tracker shows where the car is and can alert you when it moves; an alarm or added anti-theft protection makes it harder to steal.",
      "Installation is done so the system works reliably without draining the battery or interfering with the car’s own electronics.",
    ],
    involves: [
      "Choosing a system that suits the car and how you use it",
      "Installing and wiring it into the vehicle’s electrics",
      "Setting up the tracker or alarm with its app or remote",
      "Testing every function before handover",
    ],
    signs: ["You want to track the car’s location", "You want an alarm or extra anti-theft protection", "An earlier installation is faulty or drains the battery"],
    nextStep: "Tell us the make, model and year, and what you want the system to do.",
    limits: [
      "Available systems and features depend on the vehicle and the product chosen.",
      "Some tracking features need a subscription from the tracker provider.",
    ],
    media: "studio",
    annotation: "GPS tracking, alarms, anti-theft",
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Services confirmed in the business configuration, in display order. */
export function publishedServices(): Service[] {
  return services.filter((s) => business.services.includes(s.slug));
}
