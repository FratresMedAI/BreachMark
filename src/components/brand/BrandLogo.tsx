import Image from "next/image";
import { cn } from "@/lib/utils";

const sizes = {
  sm: 36,
  md: 48,
  lg: 88,
  xl: 160,
  hero: 280,
} as const;

type BrandLogoProps = {
  size?: keyof typeof sizes;
  className?: string;
  glow?: boolean;
  priority?: boolean;
};

export function BrandLogo({
  size = "md",
  className,
  glow = false,
  priority = false,
}: BrandLogoProps) {
  const px = sizes[size];

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: px, height: px }}
    >
      {glow && (
        <div className="absolute inset-0 scale-110 rounded-full bg-primary/25 blur-2xl" aria-hidden />
      )}
      <Image
        src="/breachmark-logo.png"
        alt="BreachMark — blue team incident simulator"
        width={px}
        height={px}
        priority={priority}
        className="relative h-full w-full object-contain drop-shadow-[0_8px_32px_oklch(0.55_0.14_195/45%)]"
      />
    </div>
  );
}
