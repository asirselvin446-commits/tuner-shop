"use client";

import { useEffect, useRef } from "react";
import type { ProgressStore } from "@/lib/progress";
import { sampleKeyframes } from "@/lib/progress";
import { orbitSequence } from "@/content/media";

interface Props {
  progress: ProgressStore;
  /** Camera punch-in per chapter boundary (1 = framed as filmed). */
  zoomKeys?: readonly number[];
  /** Vertical framing offset per boundary, as a fraction of height. */
  panKeys?: readonly number[];
  className?: string;
}

/**
 * Scroll-scrubbed image sequence drawn to a canvas. Frames load lazily (coarse frames first, so
 * scrubbing is never blank), redraw only when progress or size changes, and are released on unmount.
 */
export function FrameSequence({ progress, zoomKeys = [1], panKeys = [0], className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const small = window.innerWidth < 768;
    const seq = small ? orbitSequence.sm : orbitSequence.lg;
    const frames: (HTMLImageElement | null)[] = new Array(seq.count).fill(null);
    const pending = new Set<HTMLImageElement>();
    let disposed = false;
    let raf = 0;
    let started = false;

    const nearestLoaded = (index: number) => {
      for (let d = 0; d < seq.count; d++) {
        const a = frames[index - d];
        if (a) return a;
        const b = frames[index + d];
        if (b) return b;
      }
      return null;
    };

    const draw = () => {
      raf = 0;
      const p = progress.get();
      const index = Math.round(p * (seq.count - 1));
      const img = nearestLoaded(index);
      if (!img) return;
      const { width: cw, height: ch } = canvas;
      const zoom = sampleKeyframes(zoomKeys, p);
      const pan = sampleKeyframes(panKeys, p);
      // Portrait screens: frame the whole car across the width in the upper part of the screen,
      // leaving the lower part for copy. Landscape: cover.
      const portrait = cw / ch < 1;
      const base = portrait ? (cw / img.naturalWidth) * 1.45 : Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const scale = base * zoom;
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const y = portrait ? ch * 0.33 - h / 2 : (ch - h) / 2;
      ctx.fillStyle = "#0c0d0f";
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, y + pan * ch, w, h);
    };
    const requestDraw = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      requestDraw();
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (frames[i] || disposed) return resolve();
        const img = new Image();
        img.decoding = "async";
        pending.add(img);
        img.onload = () => {
          pending.delete(img);
          if (!disposed) {
            frames[i] = img;
            requestDraw();
          }
          resolve();
        };
        img.onerror = () => {
          pending.delete(img);
          resolve();
        };
        img.src = seq.path(i);
      });

    // Coarse pass (every 8th frame) then fill in, a few requests at a time.
    const order: number[] = [];
    for (const step of [8, 4, 2, 1]) for (let i = 0; i < seq.count; i += step) if (!order.includes(i)) order.push(i);
    const loadAll = async () => {
      const queue = [...order];
      const worker = async () => {
        while (queue.length && !disposed) await load(queue.shift()!);
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
    };

    // Start fetching once the section is within ~0.6 viewports (i.e. after the visitor starts scrolling).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !started) {
          started = true;
          load(0).then(loadAll);
        }
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const unsubscribe = progress.subscribe(requestDraw);

    return () => {
      disposed = true;
      io.disconnect();
      ro.disconnect();
      unsubscribe();
      cancelAnimationFrame(raf);
      pending.forEach((img) => (img.src = ""));
      frames.fill(null);
    };
  }, [progress, zoomKeys, panKeys]);

  return <canvas ref={canvasRef} aria-hidden="true" className={`h-full w-full ${className}`} />;
}
