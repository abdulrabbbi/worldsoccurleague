import { AppShell } from "@/components/layout/app-shell";
import { ShoppingBag } from "lucide-react";

export default function Shop() {
  return (
    <AppShell>
      <div className="p-4 space-y-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-[#1a2d5c] mb-2" data-testid="text-shop-title">Shop</h1>
          <p className="text-gray-500 text-sm" data-testid="text-shop-description">
            Official team merchandise and gear coming soon.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
