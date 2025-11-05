import { type NextRequest, NextResponse } from "next/server"
import { generateInsights } from "@/lib/nlp-processor"

// POST /api/nlp/insights - Generate actionable insights from feedback summary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { summary } = body

    if (!summary || typeof summary !== "object") {
      return NextResponse.json({ error: "Missing or invalid summary object" }, { status: 400 })
    }

    const { total, sentiment, topTopics, topFeatures, urgentCount } = summary

    if (!total || !sentiment || !topTopics || !topFeatures) {
      return NextResponse.json(
        { error: "Summary must include: total, sentiment, topTopics, topFeatures, urgentCount" },
        { status: 400 },
      )
    }

    // Generate insights
    const insights = await generateInsights({
      total,
      sentiment,
      topTopics,
      topFeatures,
      urgentCount: urgentCount || 0,
    })

    return NextResponse.json({
      data: insights,
      count: insights.length,
    })
  } catch (error) {
    console.error("[v0] Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
