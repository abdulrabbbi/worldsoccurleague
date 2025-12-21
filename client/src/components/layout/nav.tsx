import { Link, useLocation } from "wouter";
import { Home, Heart, ShoppingBag, ShoppingBasket, Users, Search, Bell, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import logoUrl from "@assets/WSL_Tall_1766285125334.png";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Heart, label: "Favorites", path: "/favorites" },
    { icon: ShoppingBag, label: "Shop", path: "/shop" },
    { icon: ShoppingBasket, label: "Marketplace", path: "/marketplace" },
    { icon: Users, label: "Community", path: "/community" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
          return (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200 cursor-pointer",
                isActive ? "text-[#1a2d5c]" : "text-gray-400 hover:text-gray-600"
              )}>
                <item.icon size={24} strokeWidth={1.5} fill={isActive ? "#1a2d5c" : "none"} />
                <span className={cn(
                  "text-[10px] font-medium",
                  isActive ? "text-[#1a2d5c]" : "text-gray-400"
                )}>{item.label}</span>
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
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="flex flex-col max-w-md mx-auto">
        {/* Top row: Logo + Icons */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo on left */}
          <div className="flex items-center">
            <img 
              src={logoUrl} 
              alt="World Soccer Leagues" 
              className="h-12 w-auto object-contain"
              data-testid="img-logo-header"
            />
          </div>
          
          {/* Icons on right */}
          <div className="flex items-center gap-2">
            <Link href="/search">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" data-testid="button-search">
                <Search size={18} className="text-gray-600" />
              </div>
            </Link>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" data-testid="button-favorites">
              <Sparkles size={18} className="text-[#1a2d5c]" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors relative" data-testid="button-notifications">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </div>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer overflow-hidden border-2 border-white shadow-sm" data-testid="button-profile">
                <span className="text-sm font-bold text-blue-600">JD</span>
              </div>
            </Link>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors" data-testid="button-settings">
              <Settings size={18} className="text-gray-600" />
            </div>
          </div>
        </div>
        
        {/* Search bar row */}
        <div className="px-4 pb-3">
          <Link href="/search">
            <div className="w-full h-12 px-4 rounded-full bg-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-200 transition-colors">
              <span className="text-gray-400 text-sm">Search here...</span>
              <Search size={18} className="text-gray-400" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
