"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TopClusters() {
  const { data, error, isLoading } = useSWR("/api/clusters", fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback Clusters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feedback Clusters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center text-muted-foreground">Failed to load data</div>
        </CardContent>
      </Card>
    )
  }

  const clusters = data.data
  const maxCount = Math.max(...clusters.map((c: any) => c.feedback_count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feedback Clusters</CardTitle>
        <CardDescription>AI-grouped feedback by themes and topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {clusters.map((cluster: any) => {
            const percentage = (cluster.feedback_count / maxCount) * 100
            const sentimentColor =
              cluster.avg_sentiment_score > 0.2
                ? "text-green-600"
                : cluster.avg_sentiment_score < -0.2
                  ? "text-red-600"
                  : "text-muted-foreground"

            return (
              <div key={cluster.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{cluster.cluster_name}</h4>
                      <Badge variant="secondary">{cluster.feedback_count} items</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 text-pretty">{cluster.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Priority</div>
                    <div className="text-2xl font-bold text-primary">{cluster.priority_score}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Volume</span>
                    <span className={sentimentColor}>Sentiment: {cluster.avg_sentiment_score.toFixed(2)}</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
