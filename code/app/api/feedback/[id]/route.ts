import { type NextRequest, NextResponse } from "next/server"
import { mockData, mockNLPAnalysis } from "@/lib/mock-data"

// GET /api/feedback/[id] - Get specific feedback by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const feedbackId = Number.parseInt(id)

    const feedback = mockData.feedback.find((f) => f.id === feedbackId)

    if (!feedback) {
      return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
    }

    const analysis = mockNLPAnalysis.find((a) => a.feedback_id === feedbackId)

    return NextResponse.json({
      data: {
        ...feedback,
        analysis,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
