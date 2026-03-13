import { useLocation, Link } from "react-router-dom";
import { navItems } from "./VipHeader";

export function VipSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen glass-strong border-r border-border relative z-10">
      <div className="p-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary glow-gold border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon size={18} className={active ? "text-primary" : ""} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>

      {/* Bottom brand */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="text-center">
          <span className="text-lg trident-glow">🔱</span>
          <p className="text-[10px] text-muted-foreground mt-1 font-display tracking-widest">NETUNO V1</p>
        </div>
      </div>
    </aside>
  );
}
