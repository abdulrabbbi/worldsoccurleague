import { useState } from "react";
import { BottomNav, TopBar } from "./nav";
import { NavDrawer } from "./nav-drawer";

export function AppShell({ children, title }: { children: React.ReactNode; title?: React.ReactNode }) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30">
      <TopBar title={title} onLogoClick={() => setIsNavDrawerOpen(true)} />
      <main className="flex-1 pb-20 w-full max-w-md mx-auto">
        {children}
      </main>
      <BottomNav />
      <NavDrawer isOpen={isNavDrawerOpen} onClose={() => setIsNavDrawerOpen(false)} />
    </div>
  );
}
