import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsOverview } from "@/components/metrics-overview"
import { SentimentTrends } from "@/components/sentiment-trends"
import { TopClusters } from "@/components/top-clusters"
import { ActionableInsights } from "@/components/actionable-insights"
import { FeatureMentions } from "@/components/feature-mentions"
import { TopicDistribution } from "@/components/topic-distribution"
import { QuickLinks } from "@/components/quick-links"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <QuickLinks />

        <Suspense fallback={<MetricsSkeleton />}>
          <MetricsOverview />
        </Suspense>

        <Suspense fallback={<InsightsSkeleton />}>
          <ActionableInsights />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <SentimentTrends />
          </Suspense>

          <Suspense fallback={<ChartSkeleton />}>
            <TopicDistribution />
          </Suspense>
        </div>

        <Suspense fallback={<ChartSkeleton />}>
          <FeatureMentions />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <TopClusters />
        </Suspense>
      </main>
    </div>
  )
}

function MetricsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
  )
}

function InsightsSkeleton() {
  return <Skeleton className="h-48" />
}

function ChartSkeleton() {
  return <Skeleton className="h-96" />
}
