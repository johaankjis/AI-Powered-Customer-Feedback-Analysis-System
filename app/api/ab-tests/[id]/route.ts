import { type NextRequest, NextResponse } from "next/server"
import { mockData, mockNLPAnalysis } from "@/lib/mock-data"

// GET /api/ab-tests/[id] - Get specific A/B test with results
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const testId = Number.parseInt(id)

    const test = mockData.abTests.find((t) => t.id === testId)

    if (!test) {
      return NextResponse.json({ error: "A/B test not found" }, { status: 404 })
    }

    // Get feedback for each variant (mock data - randomly assign variants)
    const allFeedback = mockData.feedback.map((f) => ({
      ...f,
      analysis: mockNLPAnalysis.find((a) => a.feedback_id === f.id),
    }))

    // Simulate variant assignment (in real app, this would come from ab_test_results table)
    const variantAFeedback = allFeedback.filter((_, i) => i % 2 === 0).slice(0, 20)
    const variantBFeedback = allFeedback.filter((_, i) => i % 2 === 1).slice(0, 20)

    // Calculate metrics for each variant
    const calculateMetrics = (feedback: any[]) => {
      const sentiments = { positive: 0, negative: 0, neutral: 0 }
      let totalSentiment = 0
      let totalRating = 0

      feedback.forEach((f) => {
        if (f.analysis) {
          sentiments[f.analysis.sentiment]++
          totalSentiment += f.analysis.sentiment_score
        }
        totalRating += f.rating
      })

      return {
        count: feedback.length,
        sentiment: sentiments,
        avg_sentiment: feedback.length > 0 ? (totalSentiment / feedback.length).toFixed(2) : 0,
        avg_rating: feedback.length > 0 ? (totalRating / feedback.length).toFixed(2) : 0,
      }
    }

    const results = {
      variant_a: {
        metrics: calculateMetrics(variantAFeedback),
        sample_feedback: variantAFeedback.slice(0, 5),
      },
      variant_b: {
        metrics: calculateMetrics(variantBFeedback),
        sample_feedback: variantBFeedback.slice(0, 5),
      },
    }

    return NextResponse.json({
      data: {
        ...test,
        results,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching A/B test:", error)
    return NextResponse.json({ error: "Failed to fetch A/B test" }, { status: 500 })
  }
}

// PATCH /api/ab-tests/[id] - Update A/B test status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const testId = Number.parseInt(id)
    const body = await request.json()
    const { status } = body

    const test = mockData.abTests.find((t) => t.id === testId)

    if (!test) {
      return NextResponse.json({ error: "A/B test not found" }, { status: 404 })
    }

    const validStatuses = ["draft", "running", "completed", "paused"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(", ")}` }, { status: 400 })
    }

    if (status) {
      test.status = status
      if (status === "running" && !test.start_date) {
        test.start_date = new Date().toISOString()
      }
      if (status === "completed" && !test.end_date) {
        test.end_date = new Date().toISOString()
      }
    }

    test.updated_at = new Date().toISOString()

    return NextResponse.json({
      message: "A/B test updated successfully",
      data: test,
    })
  } catch (error) {
    console.error("[v0] Error updating A/B test:", error)
    return NextResponse.json({ error: "Failed to update A/B test" }, { status: 500 })
  }
}
