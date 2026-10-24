import type { ReactNode } from "react";
import { PageMotion } from "@/components/motion/PageMotion";

/** Re-mounts on every navigation, so page-level motion is rebuilt and cleaned up per route. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
