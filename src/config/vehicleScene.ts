/**
 * Camera choreography and look for the WebGL vehicle scene (used only when a model is configured in
 * `business.vehicleModel.src`). One camera key per story chapter boundary; the scene interpolates
 * between them as the story scrolls. Units are metres for a ~4.5m-long car centred at the origin.
 */
export interface CameraKey {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export const storyCameraKeys: CameraKey[] = [
  { position: [-5.2, 1.4, 5.6], target: [0, 0.55, 0], fov: 32 }, // front three-quarter
  { position: [-3.6, 1.0, 4.3], target: [0.4, 0.6, 0], fov: 30 }, // closer on the front end
  { position: [3.8, 1.1, 4.6], target: [0, 0.55, 0], fov: 30 }, // side profile from the right
  { position: [5.4, 2.2, -4.8], target: [0, 0.5, 0], fov: 34 }, // rear three-quarter, higher
];

export const sceneLook = {
  background: "#0c0d0f",
  floor: "#101114",
  /** Overhead softbox, matching the studio footage. */
  keyIntensity: 2.2,
  rimColor: "#c8102e",
  rimIntensity: 3.0,
  environmentIntensity: 1.1,
  exposure: 1.15,
  fog: { near: 9, far: 22 },
};

export const qualitySettings = {
  high: { dpr: [1, 1.75] as [number, number], envResolution: 256, antialias: true, shadows: true },
  medium: { dpr: [1, 1.25] as [number, number], envResolution: 128, antialias: true, shadows: true },
  low: { dpr: [1, 1] as [number, number], envResolution: 64, antialias: false, shadows: false },
};
