import { cn } from "@/lib/utils";

export function ParticleField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "bm-particles pointer-events-none absolute inset-0 opacity-40",
        className,
      )}
    />
  );
}
