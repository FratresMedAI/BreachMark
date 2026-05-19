import { cn } from "@/lib/utils";

export function ScanlineOverlay({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("bm-scanlines pointer-events-none absolute inset-0 z-10", className)}
    />
  );
}
