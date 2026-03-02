"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <section className="bg-background mx-auto w-[80%] max-w-6xl py-8 lg:w-full lg:place-self-start">
      {/* Greeting Skeleton */}
      <div className="mb-10 flex flex-col items-start justify-between gap-y-4 lg:flex-row">
        <div className="flex flex-col space-y-1">
          <Skeleton className="h-10 w-lg rounded-md" />
          <Skeleton className="h-3 w-60 rounded-md" />
        </div>
        <div className="mb-6 flex items-center gap-4">
          <Skeleton className="h-9 w-52 rounded-md" />

          <Skeleton className="h-9 w-16 rounded-md" />
        </div>
      </div>

      {/* Create Button Placeholder */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 rounded-md" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="border-border bg-card space-y-4 rounded-lg border p-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-28 rounded-md" />
              </div>
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>

            {/* Badge */}
            <Skeleton className="h-6 w-28 rounded-md" />

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
