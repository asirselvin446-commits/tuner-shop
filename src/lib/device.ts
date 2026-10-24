/**
 * Device capability helpers used to pick rendering quality. Client-only.
 */

export type QualityTier = "high" | "medium" | "low";

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
}

export function detectQualityTier(): QualityTier {
  if (typeof window === "undefined") return "medium";
  const nav = navigator as Navigator & NavigatorHints;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (saveData || slowNetwork || memory <= 2 || cores <= 2) return "low";
  if (coarse || width < 1024 || memory <= 4 || cores <= 4) return "medium";
  return "high";
}

let webglSupport: boolean | null = null;

/** True when a WebGL context can actually be created (not just when the API exists). */
export function supportsWebGL(): boolean {
  if (webglSupport !== null) return webglSupport;
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    webglSupport = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}
