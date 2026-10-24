"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { media, type MediaKey } from "@/content/media";

interface MediaProps {
  id: MediaKey;
  /** `sizes` for the poster image. */
  sizes: string;
  className?: string;
  /** Load the poster eagerly with high priority (above-the-fold only). */
  priority?: boolean;
  /** Play the clip when visible. Off = still poster only. */
  motion?: boolean;
  objectPosition?: string;
  /** Hide the "Illustrative" tag (e.g. when a caption already says so). */
  hideTag?: boolean;
  onReady?: () => void;
}

/**
 * Poster-first media. The optimised poster renders immediately (and is all that renders without JS,
 * with reduced motion, or with Save-Data on). The video is fetched only near the viewport, swapped in
 * once it can play, and paused whenever it leaves the screen or the tab is hidden.
 */
export function Media({ id, sizes, className = "", priority, motion = true, objectPosition = "50% 50%", hideTag, onReady }: MediaProps) {
  const item = media[id];
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const visibleRef = useRef(false);
  const video = "video" in item ? item.video : undefined;

  useEffect(() => {
    if (!motion || !video || !wrapRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;

    const el = wrapRef.current;
    const sync = () => {
      const v = videoRef.current;
      if (!v) return;
      if (visibleRef.current && !document.hidden) v.play().catch(() => {});
      else v.pause();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = !!entry?.isIntersecting;
        if (visibleRef.current) setSrc((cur) => cur ?? (window.innerWidth < 768 ? video.sm : video.lg));
        sync();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps -- pause whichever element is mounted now
      videoRef.current?.pause();
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [motion, video]);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden bg-graphite ${className}`}>
      <Image
        src={item.poster}
        alt={item.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        className="object-cover"
        style={{ objectPosition }}
      />
      {src && (
        <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          onCanPlay={(e) => {
            if (visibleRef.current && !document.hidden) e.currentTarget.play().catch(() => {});
          }}
          onPlaying={() => {
            setPlaying(true);
            onReady?.();
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
          style={{ objectPosition }}
        />
      )}
      {business.media.illustrative && !hideTag && <span className="media-tag">Illustrative</span>}
    </div>
  );
}
