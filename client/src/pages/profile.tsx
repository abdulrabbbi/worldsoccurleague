import { useLocation } from "wouter";
import { LogOut, Heart, Settings, Shield, ArrowLeft, ChevronRight, RefreshCw, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const isAdmin = user?.platformRole === "platform_admin" || user?.platformRole === "platform_moderator";

  const handleLogout = () => {
    localStorage.removeItem("wsl_user");
    setUser(null);
    setLocation("/auth/login");
  };

  const refreshSession = async () => {
    if (!user?.email) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("wsl_user", JSON.stringify(data.user));
        }
      }
    } catch (e) {
      console.error("Failed to refresh session", e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header with back button */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/home")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
      </div>

      {/* User Info */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground">{user?.name || "Guest"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email || "Not logged in"}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 text-xs bg-[#1a2d5c] text-white rounded-full">
                <Shield size={10} />
                Admin
              </span>
            )}
          </div>
          <button
            onClick={refreshSession}
            disabled={refreshing}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            title="Refresh session"
            data-testid="button-refresh"
          >
            <RefreshCw size={18} className={`text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Admin Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => setLocation("/admin")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-[#1a2d5c] text-white hover:bg-[#152347] transition-colors"
                data-testid="button-admin-dashboard"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Admin Dashboard</p>
                    <p className="text-xs text-white/70">Manage leagues, teams, users & more</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Partner Section */}
        {(user?.planTier === "pro" || user?.planTier === "partner") && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Partner Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => setLocation("/partner")}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transition-colors"
                data-testid="button-partner-portal"
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-semibold">Partner Portal</p>
                    <p className="text-xs text-white/70">Submit leagues, teams & venues</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Menu */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Account</h3>
          
          <button
            onClick={() => setLocation("/favorites")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
            data-testid="button-favorites"
          >
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Favorites</p>
                <p className="text-xs text-muted-foreground">Your favorite teams & leagues</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={() => setLocation("/settings")}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
            data-testid="button-settings"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Settings</p>
                <p className="text-xs text-muted-foreground">Notifications, preferences & more</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-destructive transition-colors"
            data-testid="button-logout"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-destructive" />
              <div className="text-left">
                <p className="font-semibold text-destructive">Logout</p>
                <p className="text-xs text-muted-foreground">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
