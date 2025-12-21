import { Link, useLocation } from "wouter";
import { Home, Trophy, Users, MessageSquare, Menu, Globe, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Trophy, label: "Leagues", path: "/leagues" },
    { icon: Globe, label: "Explore", path: "/explore" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Menu, label: "Menu", path: "/menu" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 cursor-pointer",
                isActive ? "text-accent" : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
              )}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium tracking-wide uppercase">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function TopBar({ title, showBack = false }: { title?: React.ReactNode; showBack?: boolean }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-sidebar text-sidebar-foreground border-b border-sidebar-border shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
          {/* Logo or Back Button would go here */}
           <div className="font-display font-bold text-xl tracking-tighter uppercase italic text-white">
             WSL<span className="text-accent">.</span>
           </div>
        </div>
        
        <div className="flex-1 text-center font-medium truncate px-4">
          {title}
        </div>

        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-sidebar-foreground/80" />
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40">
             <span className="text-xs font-bold text-accent">JD</span>
          </div>
        </div>
      </div>
    </header>
  );
}
