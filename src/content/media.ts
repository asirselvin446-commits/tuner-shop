/**
 * Media registry. Every visual on the site is referenced by key so footage can be swapped in one place.
 *
 * The current clips were supplied with the project and carry an AI-generation watermark; they are
 * illustrative, not footage of this workshop or its customers' cars. Replace them with real workshop
 * footage (run `npm run media` after updating `_source-media/`) and set `business.media.illustrative`
 * to false once every item is genuine.
 */
import heroStill from "../../public/media/stills/hero.jpg";
import heroRevealPoster from "../../public/media/posters/hero-reveal.jpg";
import orbitPoster from "../../public/media/posters/orbit.jpg";
import dynoPoster from "../../public/media/posters/dyno.jpg";
import engineBayPoster from "../../public/media/posters/engine-bay.jpg";
import dpfPoster from "../../public/media/posters/dpf.jpg";
import ecuBoardPoster from "../../public/media/posters/ecu-board.jpg";
import diagnosticsPoster from "../../public/media/posters/diagnostics.jpg";
import workshopPoster from "../../public/media/posters/workshop.jpg";
import studioPoster from "../../public/media/posters/studio.jpg";
import type { StaticImageData } from "next/image";

export interface MediaItem {
  poster: StaticImageData;
  /** Video sources; omit for stills. `sm` is served below 768px. */
  video?: { lg: string; sm: string };
  alt: string;
}

export const media = {
  heroStill: {
    poster: heroStill,
    alt: "Black sports coupé with dark wheels and a rear wing, lit by a red side light in a concrete studio.",
  },
  heroReveal: {
    poster: heroRevealPoster,
    video: { lg: "/media/video/hero-reveal.mp4", sm: "/media/video/hero-reveal-sm.mp4" },
    alt: "A black sports coupé emerges from darkness as studio lights come up.",
  },
  orbit: {
    poster: orbitPoster,
    video: { lg: "/media/video/orbit.mp4", sm: "/media/video/orbit-sm.mp4" },
    alt: "The camera circles a black sports coupé from the front quarter around to the rear.",
  },
  dyno: {
    poster: dynoPoster,
    video: { lg: "/media/video/dyno.mp4", sm: "/media/video/dyno-sm.mp4" },
    alt: "A sports coupé strapped to a chassis dynamometer, with cooling fans and a monitor in the background.",
  },
  engineBay: {
    poster: engineBayPoster,
    video: { lg: "/media/video/engine-bay.mp4", sm: "/media/video/engine-bay-sm.mp4" },
    alt: "Close view of an engine bay: coil packs, wiring connectors and intake pipework.",
  },
  dpf: {
    poster: dpfPoster,
    video: { lg: "/media/video/dpf.mp4", sm: "/media/video/dpf-sm.mp4" },
    alt: "A removed diesel particulate filter on a workbench, its honeycomb outlet facing the camera.",
  },
  ecuBoard: {
    poster: ecuBoardPoster,
    video: { lg: "/media/video/ecu-board.mp4", sm: "/media/video/ecu-board-sm.mp4" },
    alt: "A test probe on the circuit board of an opened engine control unit, with an oscilloscope nearby.",
  },
  diagnostics: {
    poster: diagnosticsPoster,
    video: { lg: "/media/video/diagnostics.mp4", sm: "/media/video/diagnostics-sm.mp4" },
    alt: "A technician connects a diagnostic tablet to a car's OBD port and reviews the data.",
  },
  workshop: {
    poster: workshopPoster,
    video: { lg: "/media/video/workshop.mp4", sm: "/media/video/workshop-sm.mp4" },
    alt: "A technician works on a laptop at a tool cart beside a black sports coupé in a workshop.",
  },
  studio: {
    poster: studioPoster,
    video: { lg: "/media/video/studio.mp4", sm: "/media/video/studio-sm.mp4" },
    alt: "A black sports coupé standing in a dim studio under a single overhead light.",
  },
} satisfies Record<string, MediaItem>;

export type MediaKey = keyof typeof media;

/** Frame sequence used for the scroll-scrubbed vehicle orbit. */
export const orbitSequence = {
  lg: { count: 96, path: (i: number) => `/media/sequence/orbit/lg/${String(i + 1).padStart(3, "0")}.webp`, width: 1280, height: 720 },
  sm: { count: 48, path: (i: number) => `/media/sequence/orbit/sm/${String(i + 1).padStart(3, "0")}.webp`, width: 768, height: 432 },
} as const;
