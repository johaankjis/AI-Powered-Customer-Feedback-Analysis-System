import { Suspense } from "react"
import { ExperimentsHeader } from "@/components/experiments-header"
import { ExperimentsList } from "@/components/experiments-list"
import { Skeleton } from "@/components/ui/skeleton"

export default function ExperimentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <ExperimentsHeader />

      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<ExperimentsSkeleton />}>
          <ExperimentsList />
        </Suspense>
      </main>
    </div>
  )
}

function ExperimentsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-48" />
      ))}
    </div>
  )
}
