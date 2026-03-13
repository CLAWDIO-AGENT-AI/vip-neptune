import { Bell, LayoutDashboard, Activity, Layers, Clock, Settings, Menu } from "lucide-react";
import icone from "@/assets/icone.webp";

interface VipHeaderProps {
  onToggleSidebar?: () => void;
}

export function VipHeader({ onToggleSidebar }: VipHeaderProps) {
  return (
    <header className="relative z-20 flex items-center justify-between px-4 md:px-6 h-14 glass-strong border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <button onClick={onToggleSidebar} className="hidden md:flex p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <Menu size={18} className="text-muted-foreground" />
        </button>
        <img src={icone} alt="VIP Netuno" className="w-8 h-8 trident-glow" />
        <span className="font-display text-sm font-bold text-gradient-gold hidden sm:inline">
          VIP NETUNO
        </span>
      </div>

      {/* VIP Status */}
      <div className="flex items-center gap-2 ml-auto mr-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-primary/20">
          <span className="text-xs trident-glow">🔱</span>
          <span className="text-[10px] font-display font-bold text-primary tracking-wider">VIP</span>
          <span className="text-[10px] text-muted-foreground font-medium">até 21/03/2026</span>
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
  { title: "Métodos", path: "/metodos", icon: Layers },
  { title: "Histórico", path: "/historico", icon: Clock },
  { title: "Config", path: "/configuracoes", icon: Settings },
];
