import { type NextRequest, NextResponse } from "next/server"
import { clusterFeedback } from "@/lib/nlp-processor"

// POST /api/nlp/cluster - Cluster similar feedback items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedback_items } = body

    if (!Array.isArray(feedback_items) || feedback_items.length === 0) {
      return NextResponse.json(
        { error: "feedback_items must be a non-empty array with id and text fields" },
        { status: 400 },
      )
    }

    if (feedback_items.length > 100) {
      return NextResponse.json({ error: "Maximum 100 feedback items can be clustered at once" }, { status: 400 })
    }

    // Cluster the feedback
    const clusters = await clusterFeedback(feedback_items)

    // Convert Map to array format
    const clustersArray = Array.from(clusters.entries()).map(([name, feedbackIds]) => ({
      cluster_name: name,
      feedback_ids: feedbackIds,
      count: feedbackIds.length,
    }))

    return NextResponse.json({
      data: clustersArray,
      summary: {
        total_feedback: feedback_items.length,
        clusters_created: clustersArray.length,
      },
    })
  } catch (error) {
    console.error("[v0] Error in clustering:", error)
    return NextResponse.json({ error: "Failed to cluster feedback" }, { status: 500 })
  }
}
