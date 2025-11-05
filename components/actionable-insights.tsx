"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp, Lightbulb, AlertTriangle } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function ActionableInsights() {
  const { data, error, isLoading } = useSWR("/api/insights", fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actionable Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-muted-foreground">Failed to load data</div>
        </CardContent>
      </Card>
    )
  }

  const insights = data.data.filter((i: any) => i.status === "new")

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "trend":
        return <TrendingUp className="h-5 w-5 text-blue-600" />
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-600" />
      case "anomaly":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    if (priority >= 5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actionable Insights</CardTitle>
        <CardDescription>AI-generated insights requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No new insights at this time</p>
          ) : (
            insights.map((insight: any) => (
              <div
                key={insight.id}
                className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="mt-1">{getInsightIcon(insight.insight_type)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-semibold text-balance">{insight.title}</h4>
                    <Badge variant="secondary" className={getPriorityColor(insight.priority)}>
                      P{insight.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground text-pretty">{insight.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="default">
                      Take Action
                    </Button>
                    <Button size="sm" variant="outline">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
