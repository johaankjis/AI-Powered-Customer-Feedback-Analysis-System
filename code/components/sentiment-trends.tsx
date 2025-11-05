"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function SentimentTrends() {
  const { data, error, isLoading } = useSWR("/api/analytics/metrics", fetcher)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-muted-foreground">Failed to load data</div>
        </CardContent>
      </Card>
    )
  }

  const chartData = data.data.trends.map((item: any) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    positive: item.positive,
    negative: item.negative,
    neutral: item.neutral,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Trends</CardTitle>
        <CardDescription>Daily sentiment distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            positive: {
              label: "Positive",
              color: "hsl(var(--chart-2))",
            },
            negative: {
              label: "Negative",
              color: "hsl(var(--chart-1))",
            },
            neutral: {
              label: "Neutral",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-80"
        >
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
