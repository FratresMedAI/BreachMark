import { ParticleField } from "@/components/effects/ParticleField";

export function AppBackground() {
  return (
    <>
      <div className="bm-mesh pointer-events-none fixed inset-0" aria-hidden />
      <ParticleField className="fixed inset-0" />
      <div className="bm-grid pointer-events-none fixed inset-0" aria-hidden />
      <div className="bm-vignette pointer-events-none fixed inset-0" aria-hidden />
    </>
  );
}
