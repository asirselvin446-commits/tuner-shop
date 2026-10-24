/**
 * Minimal observable 0–1 value. Lets a ScrollTrigger drive renderers (canvas frames or WebGL camera)
 * without React re-renders on every scroll tick.
 */
export interface ProgressStore {
  get: () => number;
  set: (value: number) => void;
  subscribe: (fn: (value: number) => void) => () => void;
}

export function createProgress(initial = 0): ProgressStore {
  let value = initial;
  const listeners = new Set<(value: number) => void>();
  return {
    get: () => value,
    set(next) {
      if (next === value) return;
      value = next;
      listeners.forEach((fn) => fn(value));
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

/** Piecewise-linear interpolation through evenly spaced keyframes, eased between each pair. */
export function sampleKeyframes(keys: readonly number[], t: number): number {
  if (keys.length === 1) return keys[0]!;
  const scaled = Math.min(Math.max(t, 0), 1) * (keys.length - 1);
  const i = Math.min(Math.floor(scaled), keys.length - 2);
  const local = scaled - i;
  const eased = local * local * (3 - 2 * local);
  return keys[i]! + (keys[i + 1]! - keys[i]!) * eased;
}
