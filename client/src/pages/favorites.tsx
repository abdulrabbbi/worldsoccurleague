import { useState } from "react";
import { Link } from "wouter";
import { ChevronLeft, Heart } from "lucide-react";

export default function FavoritesPage() {
  const [favorites] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/home">
            <a
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5" />
            </a>
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Favorites</h1>
            <p className="text-xs text-muted-foreground">{favorites.length} saved</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No favorites yet</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Add teams and leagues to your favorites</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((item, i) => (
              <div key={i} className="p-4 rounded-lg bg-card border border-border">
                <p className="font-semibold text-foreground">{item.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
