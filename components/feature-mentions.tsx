"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeatureMentions() {
  const { data, error, isLoading } = useSWR("/api/analytics/metrics", fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Mentions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">Failed to load data</div>
        </CardContent>
      </Card>
    )
  }

  const features = data.data.features

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Mentions</CardTitle>
        <CardDescription>Most mentioned features with sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature: any, index: number) => {
            const sentimentIcon =
              feature.sentiment > 0.2 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : feature.sentiment < -0.2 ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )

            const sentimentColor =
              feature.sentiment > 0.2
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : feature.sentiment < -0.2
                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"

            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  {sentimentIcon}
                  <div>
                    <p className="font-medium capitalize">{feature.feature}</p>
                    <p className="text-sm text-muted-foreground">{feature.count} mentions</p>
                  </div>
                </div>
                <Badge variant="secondary" className={sentimentColor}>
                  {feature.sentiment > 0 ? "+" : ""}
                  {feature.sentiment.toFixed(2)}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
