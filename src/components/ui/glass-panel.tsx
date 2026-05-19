import { cn } from "@/lib/utils";

type GlassPanelProps = React.ComponentProps<"div"> & {
  header?: React.ReactNode;
  variant?: "default" | "hud" | "danger";
  glow?: boolean;
};

export function GlassPanel({
  className,
  header,
  children,
  variant = "default",
  glow = false,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "bm-panel overflow-hidden rounded-2xl",
        variant === "hud" && "bm-panel-hud",
        variant === "danger" && "bm-panel-danger",
        glow && "bm-glow-cyan",
        className,
      )}
      {...props}
    >
      {header ? (
        <div className="bm-panel-header px-4 py-3">{header}</div>
      ) : null}
      {children}
    </div>
  );
}
