import { GameShell } from "@/components/game/GameShell";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #164e63 0%, transparent 40%), radial-gradient(circle at 80% 60%, #78350f 0%, transparent 35%)",
        }}
      />
      <div className="relative z-10">
        <GameShell />
      </div>
    </main>
  );
}
