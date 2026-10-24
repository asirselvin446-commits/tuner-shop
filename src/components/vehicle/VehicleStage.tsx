"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { media } from "@/content/media";
import { detectQualityTier, supportsWebGL, type QualityTier } from "@/lib/device";
import type { ProgressStore } from "@/lib/progress";
import { FrameSequence } from "./FrameSequence";

// three.js and the model load only when a model is configured and the device can run it.
const VehicleScene = dynamic(() => import("./VehicleScene"), { ssr: false });

interface Props {
  progress: ProgressStore;
  zoomKeys?: readonly number[];
  panKeys?: readonly number[];
}

/**
 * Chooses how the vehicle is presented:
 *  - WebGL scene, when `business.vehicleModel.src` is set, WebGL works, the device isn't low-tier and
 *    reduced motion is off;
 *  - otherwise the scroll-scrubbed orbit frame sequence (the current default — no model supplied).
 * The poster underneath covers loading and any failure.
 */
export function VehicleStage({ progress, zoomKeys, panKeys }: Props) {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [webglReady, setWebglReady] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const modelSrc = business.vehicleModel.src;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = detectQualityTier();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client capability probe
    if (modelSrc && !reduce && t !== "low" && supportsWebGL()) setTier(t);
  }, [modelSrc]);

  const handleLoaded = useCallback(() => setWebglReady(true), []);
  const failedRef = useRef(false);
  const handleError = useCallback((error: unknown) => {
    // Unmounting a failed canvas also fires "context lost"; report the first cause only.
    if (failedRef.current) return;
    failedRef.current = true;
    console.warn("Vehicle scene unavailable, using image sequence instead.", error);
    setWebglFailed(true);
  }, []);

  const useWebGL = !!modelSrc && !!tier && !webglFailed;

  return (
    <div className="absolute inset-0">
      <Image src={media.orbit.poster} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover max-md:object-contain max-md:object-[50%_22%]" />
      {(!useWebGL || !webglReady) && <FrameSequence progress={progress} zoomKeys={zoomKeys} panKeys={panKeys} className="absolute inset-0" />}
      {useWebGL && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${webglReady ? "opacity-100" : "opacity-0"}`}>
          <VehicleScene
            src={modelSrc}
            progress={progress}
            quality={tier}
            transform={business.vehicleModel}
            onLoaded={handleLoaded}
            onError={handleError}
          />
        </div>
      )}
    </div>
  );
}
