import { type NextRequest, NextResponse } from "next/server"
import { processFeedbackWithAI } from "@/lib/nlp-processor"

// POST /api/nlp/process - Process feedback text with NLP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedback_text } = body

    if (!feedback_text || typeof feedback_text !== "string") {
      return NextResponse.json({ error: "Missing or invalid feedback_text" }, { status: 400 })
    }

    if (feedback_text.length < 10) {
      return NextResponse.json({ error: "Feedback text must be at least 10 characters long" }, { status: 400 })
    }

    // Process the feedback with AI
    const analysis = await processFeedbackWithAI(feedback_text)

    return NextResponse.json({
      data: analysis,
      message: "Feedback processed successfully",
    })
  } catch (error) {
    console.error("[v0] Error in NLP processing:", error)
    return NextResponse.json({ error: "Failed to process feedback" }, { status: 500 })
  }
}
