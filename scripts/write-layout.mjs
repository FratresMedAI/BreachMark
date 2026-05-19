import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

fs.writeFileSync(
  path.join(root, "src/components/layout/AppBackground.tsx"),
  `export function AppBackground() {
  return (
    <>
      <motionShell />
    </>
  );
}
`.replace(
  "<motionShell />",
  `<div className="bm-mesh pointer-events-none fixed inset-0" aria-hidden />
      <div className="bm-grid pointer-events-none fixed inset-0" aria-hidden />
      <div className="bm-vignette pointer-events-none fixed inset-0" aria-hidden />`,
),
);
