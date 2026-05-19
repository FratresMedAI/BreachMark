import { AppBackground } from "@/components/layout/AppBackground";
import { AppHeader } from "@/components/layout/AppHeader";
import { GameShell } from "@/components/game/GameShell";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AppBackground />
      <AppHeader />
      <div className="relative z-10">
        <GameShell />
      </div>
    </main>
  );
}
