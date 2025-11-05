"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, TrendingUp, Lightbulb, AlertTriangle, Check, X } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function InsightsManagement() {
  const { data, error, isLoading, mutate } = useSWR("/api/insights", fetcher)

  const updateInsightStatus = async (id: number, status: string) => {
    try {
      const response = await fetch("/api/insights", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })

      if (!response.ok) throw new Error("Failed to update insight")
      mutate()
    } catch (error) {
      console.error("[v0] Error updating insight:", error)
      alert("Failed to update insight status")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading insights...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Failed to load insights</p>
      </div>
    )
  }

  const insights = data.data

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "reviewed":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "actioned":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "dismissed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Actionable Insights</h3>
        <p className="text-sm text-muted-foreground">Review and manage AI-generated insights</p>
      </div>

      {insights.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No insights available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight: any) => (
            <Card key={insight.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getInsightIcon(insight.insight_type)}</div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <CardTitle className="text-lg text-balance">{insight.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getPriorityColor(insight.priority)}>
                          P{insight.priority}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(insight.status)}>
                          {insight.status}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-pretty">{insight.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(insight.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    {insight.status === "new" && (
                      <>
                        <Button size="sm" variant="outline" onClick={() => updateInsightStatus(insight.id, "reviewed")}>
                          Mark Reviewed
                        </Button>
                        <Button size="sm" variant="default" onClick={() => updateInsightStatus(insight.id, "actioned")}>
                          <Check className="mr-2 h-4 w-4" />
                          Take Action
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => updateInsightStatus(insight.id, "dismissed")}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    {insight.status === "reviewed" && (
                      <Button size="sm" variant="default" onClick={() => updateInsightStatus(insight.id, "actioned")}>
                        <Check className="mr-2 h-4 w-4" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
