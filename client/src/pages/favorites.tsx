import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Heart } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export default function FavoritesPage() {
  const [favorites] = useState<any[]>([]);

  return (
    <AppShell>
      <div className="p-4 space-y-6">
        <Link href="/home" data-testid="link-back-home" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-[#1a2d5c] mb-2 font-display uppercase" data-testid="text-favorites-title">Favorites</h1>
          <p className="text-gray-500 text-sm" data-testid="text-favorites-description">
            {favorites.length === 0 
              ? "No favorites yet" 
              : `${favorites.length} saved`}
          </p>
          {favorites.length === 0 && (
            <p className="text-muted-foreground/70 text-sm mt-2">Add teams and leagues to your favorites</p>
          )}
        </div>
        {favorites.length > 0 && (
          <div className="space-y-3">
            {favorites.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-card border border-border">
                <p className="font-semibold text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
