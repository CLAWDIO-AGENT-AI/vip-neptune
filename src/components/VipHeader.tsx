import { Bell, LayoutDashboard, Activity, Layers, Clock, Settings } from "lucide-react";

export function VipHeader() {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 md:px-6 h-14 glass-strong border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl trident-glow">🔱</span>
        <span className="font-display text-sm font-bold text-gradient-gold hidden sm:inline">
          VIP NETUNO
        </span>
      </div>

      {/* VIP Status Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md mx-4">
        <div className="flex-1 relative">
          <div className="h-2.5 rounded-full bg-secondary overflow-hidden border border-primary/20">
            <div
              className="h-full rounded-full vip-bar-gradient"
              style={{ width: "72%" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium tracking-wide">
            🔱 VIP VENCE EM: <span className="text-primary">21/03/2026</span>
          </p>
        </div>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors group">
        <Bell size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
      </button>
    </header>
  );
}

export const navItems = [
  { title: "Visão Geral", path: "/", icon: LayoutDashboard },
  { title: "Operações", path: "/operacoes", icon: Activity },
  { title: "Métodos Ativos", path: "/metodos", icon: Layers },
  { title: "Histórico", path: "/historico", icon: Clock },
  { title: "Configurações", path: "/configuracoes", icon: Settings },
];
