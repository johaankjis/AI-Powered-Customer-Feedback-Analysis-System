import { generateText } from "ai"

export interface NLPResult {
  sentiment: "positive" | "negative" | "neutral"
  sentiment_score: number
  topics: string[]
  keywords: string[]
  feature_mentions: string[]
  urgency_score: number
  summary: string
}

// Common product features to detect
const KNOWN_FEATURES = [
  "dashboard",
  "mobile app",
  "search",
  "export",
  "analytics",
  "notifications",
  "API",
  "collaboration",
  "integration",
  "authentication",
  "pricing",
  "support",
  "documentation",
  "performance",
  "UI",
  "UX",
  "dark mode",
  "onboarding",
]

/**
 * Process feedback text using AI to extract insights
 */
export async function processFeedbackWithAI(feedbackText: string): Promise<NLPResult> {
  try {
    const prompt = `Analyze the following customer feedback and provide a structured analysis:

Feedback: "${feedbackText}"

Provide your analysis in the following JSON format:
{
  "sentiment": "positive" | "negative" | "neutral",
  "sentiment_score": number between -1 and 1,
  "topics": array of 2-4 main topics (e.g., "UI/UX", "Performance", "Features", "Pricing", "Support"),
  "keywords": array of 3-5 important keywords from the feedback,
  "feature_mentions": array of specific product features mentioned,
  "urgency_score": number from 1-10 indicating how urgent this feedback is,
  "summary": brief one-sentence summary of the feedback
}

Guidelines:
- sentiment_score: -1 (very negative) to 1 (very positive)
- urgency_score: 1 (low) to 10 (critical/urgent)
- Extract actual features mentioned like "dashboard", "mobile app", "search", etc.
- Topics should be high-level categories
- Keywords should be the most meaningful words from the feedback`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
    })

    // Parse the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const analysis = JSON.parse(jsonMatch[0])

    // Validate and normalize the response
    return {
      sentiment: analysis.sentiment || "neutral",
      sentiment_score: Math.max(-1, Math.min(1, analysis.sentiment_score || 0)),
      topics: Array.isArray(analysis.topics) ? analysis.topics.slice(0, 4) : [],
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 5) : [],
      feature_mentions: Array.isArray(analysis.feature_mentions) ? analysis.feature_mentions : [],
      urgency_score: Math.max(1, Math.min(10, analysis.urgency_score || 5)),
      summary: analysis.summary || feedbackText.slice(0, 100),
    }
  } catch (error) {
    console.error("[v0] Error processing feedback with AI:", error)
    // Fallback to rule-based analysis
    return processFeedbackRuleBased(feedbackText)
  }
}

/**
 * Fallback rule-based processing when AI is unavailable
 */
export function processFeedbackRuleBased(feedbackText: string): NLPResult {
  const lowerText = feedbackText.toLowerCase()

  // Sentiment analysis using keyword matching
  const positiveWords = [
    "love",
    "great",
    "amazing",
    "excellent",
    "helpful",
    "good",
    "better",
    "improved",
    "easy",
    "fast",
  ]
  const negativeWords = [
    "crash",
    "broken",
    "slow",
    "frustrating",
    "bad",
    "terrible",
    "confusing",
    "missing",
    "bug",
    "issue",
  ]

  let sentimentScore = 0
  positiveWords.forEach((word) => {
    if (lowerText.includes(word)) sentimentScore += 0.2
  })
  negativeWords.forEach((word) => {
    if (lowerText.includes(word)) sentimentScore -= 0.2
  })

  sentimentScore = Math.max(-1, Math.min(1, sentimentScore))

  const sentiment: "positive" | "negative" | "neutral" =
    sentimentScore > 0.2 ? "positive" : sentimentScore < -0.2 ? "negative" : "neutral"

  // Extract topics based on keywords
  const topics: string[] = []
  if (lowerText.match(/ui|ux|interface|design|layout/)) topics.push("UI/UX")
  if (lowerText.match(/performance|slow|fast|crash|speed|loading/)) topics.push("Performance")
  if (lowerText.match(/feature|integration|missing|need/)) topics.push("Features")
  if (lowerText.match(/price|pricing|cost|expensive|plan/)) topics.push("Pricing")
  if (lowerText.match(/support|help|customer service/)) topics.push("Support")
  if (lowerText.match(/mobile|app|ios|android/)) topics.push("Mobile")
  if (lowerText.match(/document|docs|api|guide/)) topics.push("Documentation")

  // Extract keywords (words longer than 4 characters)
  const words = feedbackText.split(/\s+/)
  const keywords = words
    .filter((w) => w.length > 4 && !["about", "would", "could", "should", "their", "there"].includes(w.toLowerCase()))
    .slice(0, 5)

  // Detect feature mentions
  const featureMentions = KNOWN_FEATURES.filter((feature) => lowerText.includes(feature.toLowerCase()))

  // Calculate urgency based on negative sentiment and certain keywords
  let urgencyScore = 5
  if (sentiment === "negative") urgencyScore += 2
  if (lowerText.match(/urgent|critical|crash|broken|can't|cannot/)) urgencyScore += 3
  if (lowerText.match(/please|need|important/)) urgencyScore += 1
  urgencyScore = Math.max(1, Math.min(10, urgencyScore))

  return {
    sentiment,
    sentiment_score: Number(sentimentScore.toFixed(2)),
    topics: topics.slice(0, 4),
    keywords,
    feature_mentions: featureMentions,
    urgency_score: urgencyScore,
    summary: feedbackText.slice(0, 100) + (feedbackText.length > 100 ? "..." : ""),
  }
}

/**
 * Cluster similar feedback items using AI
 */
export async function clusterFeedback(
  feedbackItems: Array<{ id: number; text: string }>,
): Promise<Map<string, number[]>> {
  try {
    const feedbackTexts = feedbackItems.map((f) => `[${f.id}] ${f.text}`).join("\n")

    const prompt = `Analyze the following customer feedback items and group them into 3-5 meaningful clusters based on their themes and topics.

Feedback items:
${feedbackTexts}

Provide your clustering in the following JSON format:
{
  "clusters": [
    {
      "name": "Cluster name",
      "description": "Brief description",
      "feedback_ids": [array of feedback IDs that belong to this cluster]
    }
  ]
}

Guidelines:
- Create 3-5 clusters maximum
- Each cluster should have a clear, descriptive name
- Group feedback with similar themes, issues, or requests together
- Each feedback item should belong to at least one cluster`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.3,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse clustering response")
    }

    const result = JSON.parse(jsonMatch[0])
    const clusterMap = new Map<string, number[]>()

    if (result.clusters && Array.isArray(result.clusters)) {
      result.clusters.forEach((cluster: any) => {
        if (cluster.name && Array.isArray(cluster.feedback_ids)) {
          clusterMap.set(cluster.name, cluster.feedback_ids)
        }
      })
    }

    return clusterMap
  } catch (error) {
    console.error("[v0] Error clustering feedback:", error)
    return new Map()
  }
}

/**
 * Generate actionable insights from feedback analysis
 */
export async function generateInsights(feedbackSummary: {
  total: number
  sentiment: { positive: number; negative: number; neutral: number }
  topTopics: string[]
  topFeatures: string[]
  urgentCount: number
}): Promise<Array<{ title: string; description: string; type: string; priority: number }>> {
  try {
    const prompt = `Based on the following customer feedback analysis, generate 2-4 actionable insights for the product team:

Analysis Summary:
- Total feedback items: ${feedbackSummary.total}
- Sentiment breakdown: ${feedbackSummary.sentiment.positive} positive, ${feedbackSummary.sentiment.negative} negative, ${feedbackSummary.sentiment.neutral} neutral
- Top topics: ${feedbackSummary.topTopics.join(", ")}
- Most mentioned features: ${feedbackSummary.topFeatures.join(", ")}
- Urgent feedback items: ${feedbackSummary.urgentCount}

Provide insights in the following JSON format:
{
  "insights": [
    {
      "title": "Brief, actionable title",
      "description": "Detailed description with context and impact",
      "type": "alert" | "trend" | "recommendation" | "anomaly",
      "priority": number from 1-10
    }
  ]
}

Guidelines:
- Focus on actionable insights that can drive product decisions
- Highlight critical issues (type: "alert") if negative sentiment is high
- Identify trends (type: "trend") in feedback patterns
- Provide recommendations (type: "recommendation") for improvements
- Flag anomalies (type: "anomaly") if something unusual is detected
- Priority should reflect urgency and impact (10 = highest)`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.4,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse insights response")
    }

    const result = JSON.parse(jsonMatch[0])
    return result.insights || []
  } catch (error) {
    console.error("[v0] Error generating insights:", error)
    return []
  }
}
