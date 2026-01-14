import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bell, Moon, Globe, Lock, Trash2, ChevronRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => setLocation("/profile")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Preferences</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Push Notifications</span>
              </div>
              <div 
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${pushNotifications ? 'bg-[#1a2d5c]' : 'bg-gray-300'}`}
                data-testid="toggle-notifications"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${pushNotifications ? 'left-[26px]' : 'left-0.5'}`} />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Dark Mode</span>
              </div>
              <div 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${darkMode ? 'bg-[#1a2d5c]' : 'bg-gray-300'}`}
                data-testid="toggle-darkmode"
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${darkMode ? 'left-[26px]' : 'left-0.5'}`} />
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
              data-testid="button-language"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">English</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Account</h2>
          <div className="space-y-2">
            <button
              onClick={() => {}}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
              data-testid="button-password"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => {}}
              className="w-full flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-destructive transition-colors"
              data-testid="button-delete"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <span className="font-medium text-destructive">Delete Account</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">About</h2>
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-sm text-muted-foreground">World Soccer Leagues v1.0.0</p>
            <p className="text-xs text-muted-foreground mt-1">Your complete soccer companion</p>
          </div>
        </section>
      </div>
    </div>
  );
}
