-- Customer Feedback Analysis System Database Schema

-- Feedback table: stores raw customer feedback
CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    feedback_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    source VARCHAR(50) NOT NULL, -- 'survey', 'support_ticket', 'app_review', 'social_media'
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NLP Analysis table: stores processed feedback insights
CREATE TABLE IF NOT EXISTS nlp_analysis (
    id SERIAL PRIMARY KEY,
    feedback_id INTEGER REFERENCES feedback(id) ON DELETE CASCADE,
    sentiment VARCHAR(20) NOT NULL, -- 'positive', 'negative', 'neutral'
    sentiment_score DECIMAL(3, 2) CHECK (sentiment_score >= -1 AND sentiment_score <= 1),
    topics JSONB DEFAULT '[]', -- array of detected topics
    keywords JSONB DEFAULT '[]', -- array of extracted keywords
    feature_mentions JSONB DEFAULT '[]', -- array of mentioned features
    urgency_score INTEGER CHECK (urgency_score >= 1 AND urgency_score <= 10),
    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feedback Clusters table: groups similar feedback
CREATE TABLE IF NOT EXISTS feedback_clusters (
    id SERIAL PRIMARY KEY,
    cluster_name VARCHAR(255) NOT NULL,
    description TEXT,
    feedback_count INTEGER DEFAULT 0,
    avg_sentiment_score DECIMAL(3, 2),
    priority_score INTEGER CHECK (priority_score >= 1 AND priority_score <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cluster Membership: maps feedback to clusters
CREATE TABLE IF NOT EXISTS cluster_membership (
    id SERIAL PRIMARY KEY,
    feedback_id INTEGER REFERENCES feedback(id) ON DELETE CASCADE,
    cluster_id INTEGER REFERENCES feedback_clusters(id) ON DELETE CASCADE,
    similarity_score DECIMAL(3, 2),
    UNIQUE(feedback_id, cluster_id)
);

-- Product Requirements table: stores PRDs
CREATE TABLE IF NOT EXISTS product_requirements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'completed', 'archived'
    priority INTEGER CHECK (priority >= 1 AND priority <= 10),
    target_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requirement Feedback Mapping: links feedback to requirements
CREATE TABLE IF NOT EXISTS requirement_feedback_mapping (
    id SERIAL PRIMARY KEY,
    requirement_id INTEGER REFERENCES product_requirements(id) ON DELETE CASCADE,
    feedback_id INTEGER REFERENCES feedback(id) ON DELETE CASCADE,
    relevance_score DECIMAL(3, 2),
    mapped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requirement_id, feedback_id)
);

-- A/B Tests table: stores experiment configurations
CREATE TABLE IF NOT EXISTS ab_tests (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    description TEXT,
    hypothesis TEXT NOT NULL,
    variant_a_name VARCHAR(100) DEFAULT 'Control',
    variant_b_name VARCHAR(100) DEFAULT 'Treatment',
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'running', 'completed', 'paused'
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- A/B Test Results: stores feedback linked to experiments
CREATE TABLE IF NOT EXISTS ab_test_results (
    id SERIAL PRIMARY KEY,
    test_id INTEGER REFERENCES ab_tests(id) ON DELETE CASCADE,
    feedback_id INTEGER REFERENCES feedback(id) ON DELETE CASCADE,
    variant VARCHAR(50) NOT NULL, -- 'A' or 'B'
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(test_id, feedback_id)
);

-- Insights table: stores generated actionable insights
CREATE TABLE IF NOT EXISTS insights (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    insight_type VARCHAR(50) NOT NULL, -- 'trend', 'anomaly', 'recommendation', 'alert'
    priority INTEGER CHECK (priority >= 1 AND priority <= 10),
    related_cluster_id INTEGER REFERENCES feedback_clusters(id),
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'reviewed', 'actioned', 'dismissed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_feedback_product ON feedback(product_id);
CREATE INDEX IF NOT EXISTS idx_feedback_customer ON feedback(customer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_nlp_feedback ON nlp_analysis(feedback_id);
CREATE INDEX IF NOT EXISTS idx_nlp_sentiment ON nlp_analysis(sentiment);
CREATE INDEX IF NOT EXISTS idx_cluster_membership_feedback ON cluster_membership(feedback_id);
CREATE INDEX IF NOT EXISTS idx_cluster_membership_cluster ON cluster_membership(cluster_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_results_test ON ab_test_results(test_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_status ON insights(status);
