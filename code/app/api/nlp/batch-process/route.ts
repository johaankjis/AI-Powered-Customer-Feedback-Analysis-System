import { type NextRequest, NextResponse } from "next/server"
import { processFeedbackWithAI } from "@/lib/nlp-processor"

// POST /api/nlp/batch-process - Process multiple feedback items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedback_items } = body

    if (!Array.isArray(feedback_items) || feedback_items.length === 0) {
      return NextResponse.json({ error: "feedback_items must be a non-empty array" }, { status: 400 })
    }

    if (feedback_items.length > 50) {
      return NextResponse.json({ error: "Maximum 50 feedback items can be processed at once" }, { status: 400 })
    }

    // Process each feedback item
    const results = await Promise.all(
      feedback_items.map(async (item: { id: number; text: string }) => {
        try {
          const analysis = await processFeedbackWithAI(item.text)
          return {
            id: item.id,
            success: true,
            analysis,
          }
        } catch (error) {
          console.error(`[v0] Error processing feedback ${item.id}:`, error)
          return {
            id: item.id,
            success: false,
            error: "Processing failed",
          }
        }
      }),
    )

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.length - successCount

    return NextResponse.json({
      data: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
      },
    })
  } catch (error) {
    console.error("[v0] Error in batch NLP processing:", error)
    return NextResponse.json({ error: "Failed to process feedback batch" }, { status: 500 })
  }
}
