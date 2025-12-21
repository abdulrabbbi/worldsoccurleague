import { BottomNav, TopBar } from "./nav";

export function AppShell({ children, title }: { children: React.ReactNode; title?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-accent/30">
      <TopBar title={title} />
      <main className="flex-1 pb-20 w-full max-w-md mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
