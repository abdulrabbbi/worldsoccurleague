import { useLocation } from "wouter";
import { LogOut, Heart, Settings, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuth();

  const isAdmin = user?.platformRole === "platform_admin" || user?.platformRole === "platform_moderator";

  const handleLogout = () => {
    localStorage.removeItem("wsl_user");
    setUser(null);
    setLocation("/auth/login");
  };

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
              <h1 className="text-2xl font-bold text-foreground">{user?.name || "Guest"}</h1>
              <p className="text-sm text-muted-foreground">{user?.email || "Not logged in"}</p>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-xs bg-[#1a2d5c] text-white rounded-full">
                  <Shield size={10} />
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {isAdmin && (
          <button
            onClick={() => setLocation("/admin/grassroots")}
            className="w-full flex items-center gap-4 p-4 rounded-lg bg-[#1a2d5c]/5 border border-[#1a2d5c]/20 hover:border-[#1a2d5c] transition-colors text-left"
            data-testid="button-admin"
          >
            <Shield className="w-5 h-5 text-[#1a2d5c]" />
            <div>
              <p className="font-semibold text-[#1a2d5c]">Admin Panel</p>
              <p className="text-xs text-muted-foreground">Manage submissions, mappings & more</p>
            </div>
          </button>
        )}

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
          onClick={handleLogout}
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
