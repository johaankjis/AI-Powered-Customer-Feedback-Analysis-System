import { type NextRequest, NextResponse } from "next/server"
import { mockData, mockNLPAnalysis } from "@/lib/mock-data"

// GET /api/clusters - Get all feedback clusters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const includeDetails = searchParams.get("include_details") === "true"

    const clusters = [...mockData.clusters]

    // Sort by priority score descending
    clusters.sort((a, b) => b.priority_score - a.priority_score)

    if (includeDetails) {
      // Include sample feedback for each cluster
      const clustersWithFeedback = clusters.map((cluster) => {
        // Get feedback that matches cluster characteristics
        const clusterFeedback = mockData.feedback
          .map((f) => ({
            ...f,
            analysis: mockNLPAnalysis.find((a) => a.feedback_id === f.id),
          }))
          .filter((f) => {
            // Simple clustering logic based on sentiment and keywords
            if (cluster.cluster_name === "Performance Issues") {
              return (
                f.analysis?.sentiment === "negative" &&
                (f.feedback_text.toLowerCase().includes("crash") ||
                  f.feedback_text.toLowerCase().includes("slow") ||
                  f.feedback_text.toLowerCase().includes("performance"))
              )
            }
            if (cluster.cluster_name === "UI/UX Improvements") {
              return (
                f.feedback_text.toLowerCase().includes("ui") ||
                f.feedback_text.toLowerCase().includes("interface") ||
                f.feedback_text.toLowerCase().includes("design")
              )
            }
            if (cluster.cluster_name === "Feature Requests") {
              return (
                f.feedback_text.toLowerCase().includes("need") ||
                f.feedback_text.toLowerCase().includes("missing") ||
                f.feedback_text.toLowerCase().includes("integration")
              )
            }
            if (cluster.cluster_name === "Pricing Concerns") {
              return (
                f.feedback_text.toLowerCase().includes("pricing") ||
                f.feedback_text.toLowerCase().includes("price") ||
                f.feedback_text.toLowerCase().includes("expensive")
              )
            }
            if (cluster.cluster_name === "Positive Feedback") {
              return f.analysis?.sentiment === "positive"
            }
            return false
          })
          .slice(0, 5) // Limit to 5 samples per cluster

        return {
          ...cluster,
          sample_feedback: clusterFeedback,
        }
      })

      return NextResponse.json({ data: clustersWithFeedback })
    }

    return NextResponse.json({ data: clusters })
  } catch (error) {
    console.error("[v0] Error fetching clusters:", error)
    return NextResponse.json({ error: "Failed to fetch clusters" }, { status: 500 })
  }
}
