import { InventorySkeleton } from "@/components/inventory/inventory-skeleton";

export default function FavoritesLoadingPage() {
  return (
    <div className="container mx-auto min-h-[80dvh] px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Your favorite Classifieds</h1>
      <InventorySkeleton />
    </div>
  );
}
