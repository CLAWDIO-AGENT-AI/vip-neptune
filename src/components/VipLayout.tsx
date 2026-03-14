import { ReactNode, useState } from "react";
import { ParticleBackground } from "./ParticleBackground";
import { VipHeader } from "./VipHeader";
import { VipSidebar } from "./VipSidebar";
import { BottomNav } from "./BottomNav";

export function VipLayout({ children }: { children: ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <VipHeader />
        <div className="flex flex-1">
          <VipSidebar expanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} />
          <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
            {children}
          </main>
        </div>
        <BottomNav />
      </div>
    </div>
  );
}
