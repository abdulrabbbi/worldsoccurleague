import { AppShell } from "@/components/layout/app-shell";
import { MessageSquare, Users, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Community() {
  return (
    <AppShell title="Community">
      <div className="p-4">
        <Link href="/" data-testid="link-back-home">
          <a className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} />
            Back to Home
          </a>
        </Link>
      </div>
      <div className="p-8 pt-4 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mb-2">
          <Users size={32} />
        </div>
        <h2 className="text-xl font-bold font-display uppercase">Fan Zones Coming Soon</h2>
        <p className="text-muted-foreground">Connect with other fans, join team chats, and discuss matches live.</p>
        
        <div className="w-full max-w-xs mt-8 p-4 bg-sidebar rounded-xl text-white">
           <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
             <MessageSquare size={16} className="text-accent" />
             <span className="font-bold text-sm">Preview: Match Chat</span>
           </div>
           <div className="space-y-3 text-left">
             <div className="text-xs text-white/60"><span className="text-accent font-bold">User123:</span> What a goal!</div>
             <div className="text-xs text-white/60"><span className="text-blue-400 font-bold">CityFan:</span> We need to sub KDB on.</div>
             <div className="text-xs text-white/60"><span className="text-accent font-bold">GoalBot:</span> GOAL! 1-0</div>
           </div>
        </div>
      </div>
    </AppShell>
  );
}
