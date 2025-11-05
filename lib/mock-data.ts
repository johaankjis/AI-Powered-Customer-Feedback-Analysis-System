// Mock data generator for development and testing

import type { Feedback, NLPAnalysis, FeedbackCluster, ABTest, Insight, ProductRequirement } from "./types"

const feedbackTexts = [
  "The new dashboard is amazing! Love the clean interface and fast loading times.",
  "App crashes frequently when uploading large files. Very frustrating experience.",
  "Customer support was helpful but response time could be faster.",
  "The mobile app needs dark mode. It's too bright at night.",
  "Pricing is too high compared to competitors. Consider a mid-tier plan.",
  "Export feature is broken. Can't download my data in CSV format.",
  "Love the new collaboration features! Makes team work so much easier.",
  "Search functionality is slow and often returns irrelevant results.",
  "The onboarding tutorial was clear and helpful for new users.",
  "Missing integration with Slack. This would be a game changer.",
  "UI is confusing. Took me forever to find the settings page.",
  "Performance has improved significantly after the last update!",
  "Need better documentation for the API. Current docs are incomplete.",
  "The analytics dashboard provides great insights into our data.",
  "Login process is too complicated. Should support social auth.",
  "Notifications are too frequent and can't be customized.",
  "Great product overall but needs more customization options.",
  "Data sync between devices is unreliable and causes conflicts.",
  "The new AI features are impressive and save a lot of time.",
  "Mobile app is buggy. Desktop version works much better.",
]

const products = ["product-a", "product-b", "product-c"]
const sources = ["survey", "support_ticket", "app_review", "social_media"] as const

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateMockFeedback(count: number): Feedback[] {
  const feedback: Feedback[] = []
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  for (let i = 1; i <= count; i++) {
    const createdAt = randomDate(startDate, endDate)
    feedback.push({
      id: i,
      customer_id: `customer-${Math.floor(Math.random() * 100) + 1}`,
      product_id: products[Math.floor(Math.random() * products.length)],
      feedback_text: feedbackTexts[Math.floor(Math.random() * feedbackTexts.length)],
      rating: Math.floor(Math.random() * 5) + 1,
      source: sources[Math.floor(Math.random() * sources.length)],
      metadata: {},
      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
    })
  }

  return feedback
}

function generateMockNLPAnalysis(feedbackId: number, feedbackText: string): NLPAnalysis {
  const sentiments: Array<"positive" | "negative" | "neutral"> = ["positive", "negative", "neutral"]
  const sentiment =
    feedbackText.includes("love") || feedbackText.includes("amazing") || feedbackText.includes("great")
      ? "positive"
      : feedbackText.includes("crash") || feedbackText.includes("broken") || feedbackText.includes("frustrating")
        ? "negative"
        : "neutral"

  const sentimentScore =
    sentiment === "positive"
      ? 0.7 + Math.random() * 0.3
      : sentiment === "negative"
        ? -0.7 - Math.random() * 0.3
        : -0.2 + Math.random() * 0.4

  const allTopics = ["UI/UX", "Performance", "Features", "Pricing", "Support", "Mobile", "Integration", "Documentation"]
  const topics = allTopics.filter(() => Math.random() > 0.7).slice(0, 3)

  const allFeatures = [
    "dashboard",
    "mobile app",
    "search",
    "export",
    "analytics",
    "notifications",
    "API",
    "collaboration",
  ]
  const features = allFeatures.filter((f) => feedbackText.toLowerCase().includes(f))

  return {
    id: feedbackId,
    feedback_id: feedbackId,
    sentiment,
    sentiment_score: Number(sentimentScore.toFixed(2)),
    topics,
    keywords: feedbackText
      .split(" ")
      .filter((w) => w.length > 5)
      .slice(0, 5),
    feature_mentions: features,
    urgency_score: sentiment === "negative" ? Math.floor(Math.random() * 3) + 7 : Math.floor(Math.random() * 5) + 1,
    processed_at: new Date().toISOString(),
  }
}

function generateMockClusters(): FeedbackCluster[] {
  return [
    {
      id: 1,
      cluster_name: "Performance Issues",
      description: "Feedback related to app speed, crashes, and loading times",
      feedback_count: 15,
      avg_sentiment_score: -0.65,
      priority_score: 9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      cluster_name: "UI/UX Improvements",
      description: "Suggestions for interface design and user experience",
      feedback_count: 23,
      avg_sentiment_score: 0.15,
      priority_score: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      cluster_name: "Feature Requests",
      description: "New features and integrations requested by users",
      feedback_count: 18,
      avg_sentiment_score: 0.45,
      priority_score: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 4,
      cluster_name: "Pricing Concerns",
      description: "Feedback about pricing, plans, and value proposition",
      feedback_count: 12,
      avg_sentiment_score: -0.35,
      priority_score: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 5,
      cluster_name: "Positive Feedback",
      description: "General praise and satisfaction with the product",
      feedback_count: 32,
      avg_sentiment_score: 0.85,
      priority_score: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

function generateMockInsights(): Insight[] {
  return [
    {
      id: 1,
      title: "Critical: Performance degradation detected",
      description: "15 users reported crashes in the last 48 hours. This is 3x higher than the baseline.",
      insight_type: "alert",
      priority: 10,
      related_cluster_id: 1,
      metadata: { affected_users: 15, baseline: 5 },
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Trending: Dark mode requests increasing",
      description: "Dark mode mentioned in 8 feedback items this week, up from 2 last week.",
      insight_type: "trend",
      priority: 7,
      related_cluster_id: 3,
      metadata: { current_week: 8, last_week: 2 },
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Recommendation: Add Slack integration",
      description: "Slack integration requested by 12 users. High correlation with enterprise customers.",
      insight_type: "recommendation",
      priority: 8,
      related_cluster_id: 3,
      metadata: { request_count: 12, customer_segment: "enterprise" },
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

function generateMockABTests(): ABTest[] {
  return [
    {
      id: 1,
      test_name: "New Onboarding Flow",
      description: "Testing simplified onboarding vs. current flow",
      hypothesis: "Simplified onboarding will reduce time-to-value and increase user satisfaction",
      variant_a_name: "Current Flow",
      variant_b_name: "Simplified Flow",
      status: "running",
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      test_name: "Dashboard Layout",
      description: "Testing card-based vs. list-based dashboard layout",
      hypothesis: "Card-based layout will improve information scanning and user engagement",
      variant_a_name: "List Layout",
      variant_b_name: "Card Layout",
      status: "completed",
      start_date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

function generateMockRequirements(): ProductRequirement[] {
  return [
    {
      id: 1,
      title: "Implement Dark Mode",
      description: "Add system-wide dark mode support with automatic switching based on system preferences",
      status: "active",
      priority: 8,
      target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Slack Integration",
      description: "Build native Slack integration for notifications and data sharing",
      status: "draft",
      priority: 7,
      target_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Performance Optimization",
      description: "Optimize app performance to reduce crashes and improve loading times",
      status: "active",
      priority: 10,
      target_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

// Export mock data generators
export const mockData = {
  feedback: generateMockFeedback(100),
  clusters: generateMockClusters(),
  insights: generateMockInsights(),
  abTests: generateMockABTests(),
  requirements: generateMockRequirements(),
}

// Generate NLP analysis for all feedback
export const mockNLPAnalysis = mockData.feedback.map((f) => generateMockNLPAnalysis(f.id, f.feedback_text))

// Helper function to get feedback with analysis
export function getFeedbackWithAnalysis() {
  return mockData.feedback.map((f) => ({
    ...f,
    analysis: mockNLPAnalysis.find((a) => a.feedback_id === f.id),
  }))
}
