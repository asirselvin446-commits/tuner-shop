"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useLayoutEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import type { ProgressStore } from "@/lib/progress";
import { sampleKeyframes } from "@/lib/progress";
import type { QualityTier } from "@/lib/device";
import { qualitySettings, sceneLook, storyCameraKeys, type CameraKey } from "@/config/vehicleScene";

export interface VehicleSceneProps {
  src: string;
  progress: ProgressStore;
  quality: QualityTier;
  cameraKeys?: CameraKey[];
  transform?: { scale: number; yOffset: number; yaw: number };
  look?: Partial<typeof sceneLook>;
  onLoaded?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Reusable WebGL vehicle scene: dark studio, overhead softbox, restrained red rim light, static
 * contact shadow, and a camera driven by an external progress value. Renders on demand only — a frame
 * is drawn when progress changes or the canvas resizes, never continuously.
 */
export default function VehicleScene({
  src,
  progress,
  quality,
  cameraKeys = storyCameraKeys,
  transform = { scale: 1, yOffset: 0, yaw: -0.6 },
  look: lookOverrides,
  onLoaded,
  onError,
}: VehicleSceneProps) {
  const settings = qualitySettings[quality];
  const look = { ...sceneLook, ...lookOverrides };

  return (
    <SceneErrorBoundary onError={onError}>
      <Canvas
        frameloop="demand"
        dpr={settings.dpr}
        gl={{ antialias: settings.antialias, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: cameraKeys[0]?.fov ?? 32, near: 0.1, far: 60, position: cameraKeys[0]?.position ?? [-5, 1.4, 5.5] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = look.exposure;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onError?.(new Error("WebGL context lost"));
          });
        }}
      >
        <color attach="background" args={[look.background]} />
        <fog attach="fog" args={[look.background, look.fog.near, look.fog.far]} />

        <CameraRig progress={progress} keys={cameraKeys} />

        {/* Direct lights: overhead key, faint fill, and a low red rim from behind. */}
        <ambientLight intensity={0.18} />
        <directionalLight position={[-3, 7, 4]} intensity={look.keyIntensity * 0.9} />
        <pointLight position={[3.5, 0.6, -3.5]} color={look.rimColor} intensity={look.rimIntensity * 6} distance={12} decay={1.6} />

        <Suspense fallback={null}>
          <Model src={src} transform={transform} envIntensity={look.environmentIntensity} onLoaded={onLoaded} />
          {settings.shadows && <ContactShadows frames={1} position={[0, 0.001, 0]} scale={12} blur={2.4} opacity={0.75} far={3} resolution={quality === "high" ? 1024 : 512} />}
        </Suspense>

        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color={look.floor} roughness={0.55} metalness={0.2} />
        </mesh>

        {/* Rendered once into an environment map: cheap studio reflections without real-time probes. */}
        <Environment frames={1} resolution={settings.envResolution}>
          <Lightformer form="rect" intensity={look.keyIntensity} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={look.rimIntensity} color={look.rimColor} position={[-6, 1.2, -2]} rotation-y={Math.PI / 2.4} scale={[6, 0.6, 1]} />
          <Lightformer form="rect" intensity={look.rimIntensity * 0.6} color={look.rimColor} position={[6, 1.0, 3]} rotation-y={-Math.PI / 2.2} scale={[5, 0.4, 1]} />
          <Lightformer form="ring" intensity={0.6} position={[0, 2, 8]} scale={4} />
        </Environment>
      </Canvas>
    </SceneErrorBoundary>
  );
}

function CameraRig({ progress, keys }: { progress: ProgressStore; keys: CameraKey[] }) {
  const get = useThree((s) => s.get);
  const invalidate = useThree((s) => s.invalidate);

  useLayoutEffect(() => {
    const target = new THREE.Vector3();
    const apply = (t: number) => {
      const camera = get().camera as THREE.PerspectiveCamera;
      const axis = (k: "position" | "target", i: 0 | 1 | 2) => sampleKeyframes(keys.map((c) => c[k][i]), t);
      camera.position.set(axis("position", 0), axis("position", 1), axis("position", 2));
      target.set(axis("target", 0), axis("target", 1), axis("target", 2));
      camera.fov = sampleKeyframes(keys.map((c) => c.fov), t);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      invalidate();
    };
    apply(progress.get());
    return progress.subscribe(apply);
  }, [get, invalidate, keys, progress]);

  return null;
}

function Model({
  src,
  transform,
  envIntensity,
  onLoaded,
}: {
  src: string;
  transform: { scale: number; yOffset: number; yaw: number };
  envIntensity: number;
  onLoaded?: () => void;
}) {
  const gltf = useGLTF(src);
  const invalidate = useThree((s) => s.invalidate);

  // Clone so material tweaks never leak into the shared loader cache.
  const scene = useMemo(() => {
    const tune = (m: THREE.Material) => {
      const copy = m.clone();
      if (copy instanceof THREE.MeshStandardMaterial) copy.envMapIntensity = envIntensity;
      return copy;
    };
    const clone = gltf.scene.clone(true);
    clone.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.material = Array.isArray(mesh.material) ? mesh.material.map(tune) : tune(mesh.material);
    });
    return clone;
  }, [gltf.scene, envIntensity]);

  useEffect(() => {
    onLoaded?.();
    invalidate();
    return () => {
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => m.dispose());
      });
    };
  }, [scene, onLoaded, invalidate]);

  // Release the cached GLTF (geometries/textures) when the scene leaves the page entirely.
  useEffect(
    () => () => {
      gltf.scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => v instanceof THREE.Texture && v.dispose());
          m.dispose();
        });
      });
      useGLTF.clear(src);
    },
    [gltf, src],
  );

  return <primitive object={scene} scale={transform.scale} position-y={transform.yOffset} rotation-y={transform.yaw} />;
}

class SceneErrorBoundary extends Component<{ children: ReactNode; onError?: (e: unknown) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError?.(error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
