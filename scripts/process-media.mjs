#!/usr/bin/env node
/**
 * Media pipeline.
 *
 * Converts the supplied source clips in `_source-media/` into web-ready assets:
 *   - H.264 MP4 (audio stripped, +faststart) at 1280w and a lighter 854w variant
 *   - a JPEG poster frame per clip (next/image derives AVIF/WebP from it)
 *   - a WebP frame sequence of the orbit clip for scroll-scrubbed playback
 *
 * Requires ffmpeg on PATH. Re-run with `npm run media` after replacing sources.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = join(root, "_source-media");
const out = join(root, "public", "media");

/** slug → [source filename prefix, poster timestamp in seconds] */
const clips = {
  "hero-reveal": ["Black_car_revealed_by_light", 7.5],
  "orbit": ["Camera_orbiting_stationary_vehicle", 0.5],
  "dyno": ["Car_on_chassis_dynamometer", 1.5],
  "engine-bay": ["Engine_bay_in_automotive_workshop", 3.5],
  "dpf": ["Inspecting_diesel_particulate", 7.5],
  "ecu-board": ["Repairing_automotive_ECU_circuit", 1.5],
  "diagnostics": ["Technician_performing_vehicle_di", 3.0],
  "workshop": ["Technician_working_on_performanc", 1.0],
  "studio": ["Vehicle_filmed_in_studio_setting", 6.0],
};

const ffmpeg = (args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
const find = (prefix) => {
  const hit = readdirSync(src).find((f) => f.startsWith(prefix));
  if (!hit) throw new Error(`Missing source clip for prefix "${prefix}"`);
  return join(src, hit);
};

for (const dir of ["video", "posters", "stills", "sequence/orbit/lg", "sequence/orbit/sm"]) {
  mkdirSync(join(out, dir), { recursive: true });
}

for (const [slug, [prefix, posterAt]] of Object.entries(clips)) {
  const input = find(prefix);
  console.log(`• ${slug}`);
  const h264 = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];
  ffmpeg(["-i", input, ...h264, "-crf", "26", "-vf", "scale=1280:-2", join(out, "video", `${slug}.mp4`)]);
  ffmpeg(["-i", input, ...h264, "-crf", "28", "-vf", "scale=854:-2", join(out, "video", `${slug}-sm.mp4`)]);
  ffmpeg(["-ss", String(posterAt), "-i", input, "-frames:v", "1", "-q:v", "3", join(out, "posters", `${slug}.jpg`)]);
}

// Orbit frame sequence: 96 frames for large screens, 48 lighter frames for small ones.
const orbit = find(clips.orbit[0]);
for (const [size, frames, width, quality] of [["lg", 96, 1280, 72], ["sm", 48, 768, 68]]) {
  const dir = join(out, "sequence", "orbit", size);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  ffmpeg([
    "-i", orbit,
    "-vf", `fps=${frames / 10},scale=${width}:-2`,
    "-frames:v", String(frames),
    "-c:v", "libwebp", "-quality", String(quality),
    join(dir, "%03d.webp"),
  ]);
}

const still = readdirSync(src).find((f) => f.endsWith(".jpg"));
if (still && existsSync(join(src, still))) copyFileSync(join(src, still), join(out, "stills", "hero.jpg"));

console.log("Media ready in public/media");
