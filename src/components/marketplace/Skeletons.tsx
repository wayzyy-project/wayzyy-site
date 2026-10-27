import { Skeleton } from "@/components/ui/skeleton";

/** Same shape as PropertyCard: photo, title, subtitle, price line. */
export const PropertyCardSkeleton = () => (
  <div className="flex flex-col gap-2.5" aria-hidden="true">
    <Skeleton className="aspect-[20/19] w-full rounded-2xl" />
    <div className="space-y-2 pt-0.5">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

/** Same grid as the stay listings, so nothing jumps when the real cards arrive. */
export const PropertyGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div
    role="status"
    aria-label="Loading stays"
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[1900px]:grid-cols-6 gap-x-6 gap-y-10"
  >
    {Array.from({ length: count }, (_, i) => <PropertyCardSkeleton key={i} />)}
  </div>
);

/** Listing page: title row, photo mosaic, then details beside the booking card. */
export const PropertyDetailSkeleton = () => (
  <main
    role="status"
    aria-label="Loading listing"
    className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8"
  >
    <div className="space-y-3">
      <Skeleton className="h-8 w-2/3 sm:h-9 sm:w-1/2" />
      <Skeleton className="h-4 w-40" />
    </div>
    <div className="grid h-[260px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl sm:h-[420px]">
      <Skeleton className="col-span-4 row-span-2 rounded-none sm:col-span-2" />
      <Skeleton className="hidden rounded-none sm:block" />
      <Skeleton className="hidden rounded-none sm:block" />
      <Skeleton className="hidden rounded-none sm:block" />
      <Skeleton className="hidden rounded-none sm:block" />
    </div>
    <div className="grid grid-cols-1 gap-12 pt-4 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="space-y-2.5 border-t border-border pt-8">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-2 gap-4 border-t border-border pt-8">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-5 w-3/4" />)}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="space-y-4 rounded-3xl border border-border p-6">
          <Skeleton className="h-7 w-1/2" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  </main>
);

/** My trips: stacked cards with a photo on the left, like the real ones. */
export const TripListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div role="status" aria-label="Loading trips" className="space-y-4">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex flex-col overflow-hidden rounded-lg border sm:flex-row">
        <Skeleton className="h-40 w-full rounded-none sm:h-auto sm:w-48" />
        <div className="flex-1 space-y-3 p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
