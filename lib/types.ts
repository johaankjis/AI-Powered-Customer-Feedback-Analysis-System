// Core data types for the Customer Feedback Analysis System

export interface Feedback {
  id: number
  customer_id: string
  product_id: string
  feedback_text: string
  rating: number
  source: "survey" | "support_ticket" | "app_review" | "social_media"
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface NLPAnalysis {
  id: number
  feedback_id: number
  sentiment: "positive" | "negative" | "neutral"
  sentiment_score: number
  topics: string[]
  keywords: string[]
  feature_mentions: string[]
  urgency_score: number
  processed_at: string
}

export interface FeedbackCluster {
  id: number
  cluster_name: string
  description: string
  feedback_count: number
  avg_sentiment_score: number
  priority_score: number
  created_at: string
  updated_at: string
}

export interface ClusterMembership {
  id: number
  feedback_id: number
  cluster_id: number
  similarity_score: number
}

export interface ProductRequirement {
  id: number
  title: string
  description: string
  status: "draft" | "active" | "completed" | "archived"
  priority: number
  target_date: string | null
  created_at: string
  updated_at: string
}

export interface RequirementFeedbackMapping {
  id: number
  requirement_id: number
  feedback_id: number
  relevance_score: number
  mapped_at: string
}

export interface ABTest {
  id: number
  test_name: string
  description: string
  hypothesis: string
  variant_a_name: string
  variant_b_name: string
  status: "draft" | "running" | "completed" | "paused"
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface ABTestResult {
  id: number
  test_id: number
  feedback_id: number
  variant: "A" | "B"
  recorded_at: string
}

export interface Insight {
  id: number
  title: string
  description: string
  insight_type: "trend" | "anomaly" | "recommendation" | "alert"
  priority: number
  related_cluster_id: number | null
  metadata: Record<string, any>
  status: "new" | "reviewed" | "actioned" | "dismissed"
  created_at: string
  updated_at: string
}

// Extended types with joined data
export interface FeedbackWithAnalysis extends Feedback {
  analysis?: NLPAnalysis
}

export interface ClusterWithFeedback extends FeedbackCluster {
  feedback: FeedbackWithAnalysis[]
}

export interface ABTestWithResults extends ABTest {
  results: {
    variant_a: FeedbackWithAnalysis[]
    variant_b: FeedbackWithAnalysis[]
  }
}

// Dashboard metrics types
export interface SentimentMetrics {
  positive: number
  negative: number
  neutral: number
  total: number
  avg_score: number
}

export interface TrendData {
  date: string
  positive: number
  negative: number
  neutral: number
  total: number
}

export interface FeatureMention {
  feature: string
  count: number
  sentiment: number
}

export interface TopicDistribution {
  topic: string
  count: number
  percentage: number
}
