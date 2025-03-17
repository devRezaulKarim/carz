import { CarouselSkeleton } from "@/components/classified/carousel-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassifiedSkeleton() {
  return (
    <div className="container mx-auto flex flex-col px-4 py-12 md:px-0">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <CarouselSkeleton />
        </div>
        <div className="mt-4 md:mt-0 md:w-1/2 md:pl-8">
          <div className="flex flex-col items-start md:flex-row md:items-center">
            <Skeleton className="mr-4 h-20 w-20 rounded-full" />
            <Skeleton className="h-8 w-2/3" />
          </div>
          <div className="mb-2 mt-4 flex items-center space-x-2">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Skeleton className="mb-4 h-[134px] w-full" />
          <div className="my-4 grid w-full place-items-center rounded-xl border border-slate-200 py-12">
            <Skeleton className="h-8 w-1/2" />
          </div>
          <Skeleton className="mb-4 h-12 w-full rounded" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="shadow-xs flex flex-col items-center rounded-lg bg-gray-100 p-4 text-center"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="mt-2 h-4 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
