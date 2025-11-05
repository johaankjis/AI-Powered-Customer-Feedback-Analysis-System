import { type NextRequest, NextResponse } from "next/server"
import { mockData, mockNLPAnalysis } from "@/lib/mock-data"
import type { SentimentMetrics, TrendData, FeatureMention, TopicDistribution } from "@/lib/types"

// GET /api/analytics/metrics - Get aggregated analytics metrics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("product_id")
    const days = Number.parseInt(searchParams.get("days") || "30")

    // Filter feedback by product and date range
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    let filteredFeedback = mockData.feedback.filter((f) => new Date(f.created_at) >= cutoffDate)

    if (productId) {
      filteredFeedback = filteredFeedback.filter((f) => f.product_id === productId)
    }

    // Calculate sentiment metrics
    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 }
    let totalSentimentScore = 0

    filteredFeedback.forEach((f) => {
      const analysis = mockNLPAnalysis.find((a) => a.feedback_id === f.id)
      if (analysis) {
        sentimentCounts[analysis.sentiment]++
        totalSentimentScore += analysis.sentiment_score
      }
    })

    const sentimentMetrics: SentimentMetrics = {
      ...sentimentCounts,
      total: filteredFeedback.length,
      avg_score: filteredFeedback.length > 0 ? Number((totalSentimentScore / filteredFeedback.length).toFixed(2)) : 0,
    }

    // Calculate trend data (daily aggregation)
    const trendMap = new Map<string, { positive: number; negative: number; neutral: number; total: number }>()

    filteredFeedback.forEach((f) => {
      const date = f.created_at.split("T")[0]
      const analysis = mockNLPAnalysis.find((a) => a.feedback_id === f.id)

      if (!trendMap.has(date)) {
        trendMap.set(date, { positive: 0, negative: 0, neutral: 0, total: 0 })
      }

      const dayData = trendMap.get(date)!
      dayData.total++
      if (analysis) {
        dayData[analysis.sentiment]++
      }
    })

    const trendData: TrendData[] = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Calculate feature mentions
    const featureMap = new Map<string, { count: number; totalSentiment: number }>()

    filteredFeedback.forEach((f) => {
      const analysis = mockNLPAnalysis.find((a) => a.feedback_id === f.id)
      if (analysis) {
        analysis.feature_mentions.forEach((feature) => {
          if (!featureMap.has(feature)) {
            featureMap.set(feature, { count: 0, totalSentiment: 0 })
          }
          const featureData = featureMap.get(feature)!
          featureData.count++
          featureData.totalSentiment += analysis.sentiment_score
        })
      }
    })

    const featureMentions: FeatureMention[] = Array.from(featureMap.entries())
      .map(([feature, data]) => ({
        feature,
        count: data.count,
        sentiment: Number((data.totalSentiment / data.count).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Calculate topic distribution
    const topicMap = new Map<string, number>()

    filteredFeedback.forEach((f) => {
      const analysis = mockNLPAnalysis.find((a) => a.feedback_id === f.id)
      if (analysis) {
        analysis.topics.forEach((topic) => {
          topicMap.set(topic, (topicMap.get(topic) || 0) + 1)
        })
      }
    })

    const totalTopics = Array.from(topicMap.values()).reduce((sum, count) => sum + count, 0)
    const topicDistribution: TopicDistribution[] = Array.from(topicMap.entries())
      .map(([topic, count]) => ({
        topic,
        count,
        percentage: Number(((count / totalTopics) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      data: {
        sentiment: sentimentMetrics,
        trends: trendData,
        features: featureMentions,
        topics: topicDistribution,
        date_range: {
          start: cutoffDate.toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
          days,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching analytics metrics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics metrics" }, { status: 500 })
  }
}
