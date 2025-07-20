import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DigitalLendingLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32" />
              <div>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="flex-1 h-10" />
            <div className="flex gap-2">
              <Skeleton className="w-40 h-10" />
              <Skeleton className="w-32 h-10" />
            </div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Books Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="aspect-[3/4] w-full rounded-md mb-3" />
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
