import { ClassifiedCardSkeleton } from "@/components/inventory/classified-card-skeleton";

export function InventorySkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => i + 1).map((id) => (
        <ClassifiedCardSkeleton key={id} />
      ))}
    </div>
  );
}
