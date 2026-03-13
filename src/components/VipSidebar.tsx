import { useLocation, Link } from "react-router-dom";
import { navItems } from "./VipHeader";
import icone from "@/assets/icone.webp";

interface VipSidebarProps {
  expanded: boolean;
}

export function VipSidebar({ expanded }: VipSidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={`hidden md:flex flex-col min-h-screen glass-strong border-r border-border relative z-10 transition-all duration-300 ${
        expanded ? "w-52" : "w-16"
      }`}
    >
      <div className="p-2 space-y-1 mt-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.title}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary glow-gold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              } ${!expanded ? "justify-center px-0" : ""}`}
            >
              <item.icon size={18} className={`shrink-0 ${active ? "text-primary" : ""}`} />
              {expanded && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </div>

      {/* Bottom brand */}
      <div className="mt-auto p-3 border-t border-border flex flex-col items-center">
        <img src={icone} alt="Netuno" className="w-6 h-6 opacity-50" />
        {expanded && (
          <p className="text-[9px] text-muted-foreground mt-1 font-display tracking-widest">NETUNO V1</p>
        )}
      </div>
    </aside>
  );
}
