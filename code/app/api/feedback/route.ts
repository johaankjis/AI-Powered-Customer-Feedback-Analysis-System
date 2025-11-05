import { type NextRequest, NextResponse } from "next/server"
import { mockData, mockNLPAnalysis } from "@/lib/mock-data"
import type { Feedback } from "@/lib/types"

// GET /api/feedback - Retrieve feedback with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("product_id")
    const source = searchParams.get("source")
    const sentiment = searchParams.get("sentiment")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredFeedback = [...mockData.feedback]

    // Apply filters
    if (productId) {
      filteredFeedback = filteredFeedback.filter((f) => f.product_id === productId)
    }
    if (source) {
      filteredFeedback = filteredFeedback.filter((f) => f.source === source)
    }
    if (sentiment) {
      filteredFeedback = filteredFeedback.filter((f) => {
        const analysis = mockNLPAnalysis.find((a) => a.feedback_id === f.id)
        return analysis?.sentiment === sentiment
      })
    }

    // Sort by created_at descending
    filteredFeedback.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    // Paginate
    const total = filteredFeedback.length
    const paginatedFeedback = filteredFeedback.slice(offset, offset + limit)

    // Attach NLP analysis to each feedback
    const feedbackWithAnalysis = paginatedFeedback.map((f) => ({
      ...f,
      analysis: mockNLPAnalysis.find((a) => a.feedback_id === f.id),
    }))

    return NextResponse.json({
      data: feedbackWithAnalysis,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}

// POST /api/feedback - Submit new feedback
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { customer_id, product_id, feedback_text, rating, source } = body

    if (!customer_id || !product_id || !feedback_text || !rating || !source) {
      return NextResponse.json(
        { error: "Missing required fields: customer_id, product_id, feedback_text, rating, source" },
        { status: 400 },
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const validSources = ["survey", "support_ticket", "app_review", "social_media"]
    if (!validSources.includes(source)) {
      return NextResponse.json({ error: `Source must be one of: ${validSources.join(", ")}` }, { status: 400 })
    }

    // Create new feedback entry
    const newFeedback: Feedback = {
      id: mockData.feedback.length + 1,
      customer_id,
      product_id,
      feedback_text,
      rating,
      source,
      metadata: body.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // In a real app, this would save to database
    mockData.feedback.push(newFeedback)

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
        data: newFeedback,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error submitting feedback:", error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
