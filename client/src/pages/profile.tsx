import { useLocation } from "wouter";
import { LogOut, Heart, Settings } from "lucide-react";

export default function ProfilePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
              <p className="text-sm text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        <button
          onClick={() => setLocation("/favorites")}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors text-left"
          data-testid="button-favorites"
        >
          <Heart className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Favorites</p>
            <p className="text-xs text-muted-foreground">Manage your favorite teams & leagues</p>
          </div>
        </button>

        <button
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors text-left"
          data-testid="button-settings"
        >
          <Settings className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Settings</p>
            <p className="text-xs text-muted-foreground">Notifications, preferences & more</p>
          </div>
        </button>

        <button
          onClick={() => setLocation("/auth/login")}
          className="w-full flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-destructive transition-colors text-left"
          data-testid="button-logout"
        >
          <LogOut className="w-5 h-5 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Logout</p>
            <p className="text-xs text-muted-foreground">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
