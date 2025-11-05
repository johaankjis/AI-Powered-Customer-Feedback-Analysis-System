import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, Star } from "lucide-react"

async function getExperiment(id: string) {
  const res = await fetch(`http://localhost:3000/api/ab-tests/${id}`, {
    cache: "no-store",
  })
  if (!res.ok) throw new Error("Failed to fetch experiment")
  return res.json()
}

export async function ExperimentResults({ experimentId }: { experimentId: string }) {
  const { data } = await getExperiment(experimentId)
  const { results } = data

  const variantAMetrics = results.variant_a.metrics
  const variantBMetrics = results.variant_b.metrics

  const sentimentDiff = (
    Number.parseFloat(variantBMetrics.avg_sentiment) - Number.parseFloat(variantAMetrics.avg_sentiment)
  ).toFixed(2)
  const ratingDiff = (
    Number.parseFloat(variantBMetrics.avg_rating) - Number.parseFloat(variantAMetrics.avg_rating)
  ).toFixed(2)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">{data.test_name}</h1>
        <p className="mt-2 text-muted-foreground text-pretty">{data.hypothesis}</p>
        <Badge variant="secondary" className="mt-2">
          {data.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Variant A */}
        <Card>
          <CardHeader>
            <CardTitle>{data.variant_a_name}</CardTitle>
            <CardDescription>Control group results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  Feedback Count
                </div>
                <div className="text-2xl font-bold">{variantAMetrics.count}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Star className="h-4 w-4" />
                  Avg Rating
                </div>
                <div className="text-2xl font-bold">{variantAMetrics.avg_rating}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Sentiment Distribution</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Positive</span>
                  <span className="font-medium">{variantAMetrics.sentiment.positive}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Neutral</span>
                  <span className="font-medium">{variantAMetrics.sentiment.neutral}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Negative</span>
                  <span className="font-medium">{variantAMetrics.sentiment.negative}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">Avg Sentiment Score</div>
              <div className="text-xl font-bold">{variantAMetrics.avg_sentiment}</div>
            </div>
          </CardContent>
        </Card>

        {/* Variant B */}
        <Card>
          <CardHeader>
            <CardTitle>{data.variant_b_name}</CardTitle>
            <CardDescription>Treatment group results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Users className="h-4 w-4" />
                  Feedback Count
                </div>
                <div className="text-2xl font-bold">{variantBMetrics.count}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Star className="h-4 w-4" />
                  Avg Rating
                </div>
                <div className="text-2xl font-bold">{variantBMetrics.avg_rating}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Sentiment Distribution</div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Positive</span>
                  <span className="font-medium">{variantBMetrics.sentiment.positive}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Neutral</span>
                  <span className="font-medium">{variantBMetrics.sentiment.neutral}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-600">Negative</span>
                  <span className="font-medium">{variantBMetrics.sentiment.negative}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-sm text-muted-foreground">Avg Sentiment Score</div>
              <div className="text-xl font-bold">{variantBMetrics.avg_sentiment}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Comparison Summary</CardTitle>
          <CardDescription>Performance difference between variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="text-sm text-muted-foreground">Sentiment Difference</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {Number.parseFloat(sentimentDiff) > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">+{sentimentDiff}</span>
                    </>
                  ) : Number.parseFloat(sentimentDiff) < 0 ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-red-600">{sentimentDiff}</span>
                    </>
                  ) : (
                    <span>0.00</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <div className="text-sm text-muted-foreground">Rating Difference</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {Number.parseFloat(ratingDiff) > 0 ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span className="text-green-600">+{ratingDiff}</span>
                    </>
                  ) : Number.parseFloat(ratingDiff) < 0 ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-red-600" />
                      <span className="text-red-600">{ratingDiff}</span>
                    </>
                  ) : (
                    <span>0.00</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
