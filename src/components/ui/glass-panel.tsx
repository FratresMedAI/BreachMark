import { cn } from "@/lib/utils";

type GlassPanelProps = React.ComponentProps<"div"> & {
  header?: React.ReactNode;
};

export function GlassPanel({
  className,
  header,
  children,
  ...props
}: GlassPanelProps) {
  return (
    <div className={cn("bm-panel overflow-hidden rounded-2xl", className)} {...props}>
      {header ? (
        <div className="bm-panel-header px-4 py-3">{header}</div>
      ) : null}
      {children}
    </div>
  );
}
