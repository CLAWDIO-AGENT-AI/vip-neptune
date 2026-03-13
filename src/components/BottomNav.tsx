import { useLocation, Link } from "react-router-dom";
import { navItems } from "./VipHeader";

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.slice(0, 5).map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all duration-200 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon size={20} className={active ? "trident-glow" : ""} />
              <span className="text-[10px] font-medium">{item.title.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
