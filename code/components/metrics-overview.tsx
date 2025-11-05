"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, AlertCircle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function MetricsOverview() {
  const { data, error, isLoading } = useSWR("/api/analytics/metrics", fetcher)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-16 flex items-center justify-center text-muted-foreground">...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Failed to load metrics</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { sentiment } = data.data

  const positivePercentage = ((sentiment.positive / sentiment.total) * 100).toFixed(1)
  const negativePercentage = ((sentiment.negative / sentiment.total) * 100).toFixed(1)

  const metrics = [
    {
      title: "Total Feedback",
      value: sentiment.total.toLocaleString(),
      icon: MessageSquare,
      description: "Last 30 days",
      trend: null,
    },
    {
      title: "Positive Sentiment",
      value: `${positivePercentage}%`,
      icon: TrendingUp,
      description: `${sentiment.positive} items`,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Negative Sentiment",
      value: `${negativePercentage}%`,
      icon: TrendingDown,
      description: `${sentiment.negative} items`,
      trend: "down",
      color: "text-red-600",
    },
    {
      title: "Avg Sentiment Score",
      value: sentiment.avg_score.toFixed(2),
      icon: AlertCircle,
      description: "Range: -1 to 1",
      trend: sentiment.avg_score > 0 ? "up" : "down",
      color: sentiment.avg_score > 0 ? "text-green-600" : "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
              <Icon className={`h-4 w-4 ${metric.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${metric.color || ""}`}>{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
