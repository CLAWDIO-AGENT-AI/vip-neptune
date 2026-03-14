import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wallet, LineChart, Clock, Settings, PanelLeftClose, PanelLeftOpen, LogOut, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface VipSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function VipSidebar({ expanded, onToggle }: VipSidebarProps) {
  const location = useLocation();
  const { logout, isAdmin } = useApp();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Visão Geral" },
    { path: "/operacoes", icon: Wallet, label: "Operações" },
    { path: "/metodos", icon: LineChart, label: "Métodos" },
    { path: "/historico", icon: Clock, label: "Histórico" },
    { path: "/configuracoes", icon: Settings, label: "Configurações" },
  ];

  return (
    <aside className={`hidden md:flex flex-col glass-strong border-r border-border relative z-10 transition-all duration-300 sticky top-14 h-[calc(100vh-3.5rem)] ${expanded ? "w-56" : "w-16"}`}>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1 mt-2 no-scrollbar">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} title={!expanded ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? "bg-primary/10 text-primary glow-gold border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary"} ${!expanded ? "justify-center px-0" : ""}`}>
              <item.icon size={18} className={`shrink-0 ${isActive ? "text-primary transition-transform scale-110" : ""}`} />
              {expanded && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        <div className="pt-2 border-t border-border mt-2 space-y-1">
          {isAdmin && (
            <Link to="/membros" title={!expanded ? "Painel Admin" : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === "/membros" ? "bg-primary/10 text-primary glow-gold border border-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary"} ${!expanded ? "justify-center px-0" : ""}`}>
              <Users size={18} className={`shrink-0 ${location.pathname === "/membros" ? "text-primary transition-transform scale-110" : ""}`} />
              {expanded && <span className="truncate">Painel Admin</span>}
            </Link>
          )}

          <button onClick={onToggle} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${!expanded ? "justify-center px-0" : ""}`} title={expanded ? "Recolher" : "Expandir"}>
            {expanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            {expanded && <span className="truncate">Recolher</span>}
          </button>
        </div>
      </div>

      {/* Logout Area fixed at bottom */}
      <div className="p-2 border-t border-border mt-auto">
        <button onClick={logout} title={!expanded ? "Sair da conta" : undefined} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all group ${!expanded ? "justify-center px-0" : ""}`}>
          <LogOut size={18} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {expanded && <span className="truncate">Sair da conta</span>}
        </button>
      </div>
    </aside>
  );
}
