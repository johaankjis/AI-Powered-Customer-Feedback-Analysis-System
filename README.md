# AI-Powered Customer Feedback Analysis System

A comprehensive, intelligent platform for analyzing customer feedback using Natural Language Processing (NLP) and AI to extract actionable insights, identify trends, and drive data-driven product decisions.

## 🌟 Overview

This system processes customer feedback from multiple sources (surveys, support tickets, app reviews, social media) and uses advanced AI models to perform sentiment analysis, topic extraction, feature detection, and clustering. It provides product managers and teams with actionable insights through an intuitive dashboard interface.

## ✨ Key Features

### 📊 Dashboard & Analytics
- **Real-time Metrics Overview**: Track sentiment distribution, feedback volume, and key performance indicators
- **Sentiment Trends Visualization**: Monitor sentiment changes over time with interactive charts
- **Topic Distribution Analysis**: Identify the most discussed topics and themes
- **Feature Mentions Tracking**: Discover which product features are mentioned most frequently

### 🤖 AI-Powered Analysis
- **Sentiment Analysis**: Automatic classification of feedback as positive, negative, or neutral with confidence scores (-1 to 1)
- **Topic Extraction**: AI-driven identification of main themes and subjects in feedback
- **Keyword Extraction**: Automatic extraction of important keywords from feedback text
- **Feature Detection**: Recognition of specific product features mentioned in feedback
- **Urgency Scoring**: Intelligent prioritization based on feedback urgency (1-10 scale)
- **Smart Clustering**: Automatic grouping of similar feedback items for pattern recognition

### 📋 Management Tools
- **Feedback Management**: Centralized repository for all customer feedback with filtering and search
- **Requirements Management**: Link customer feedback to product requirements and PRDs
- **A/B Test Experiments**: Track and analyze feedback from A/B tests with variant comparison
- **Insights Dashboard**: Auto-generated actionable insights with priority levels

### 🔍 Advanced Capabilities
- **Multi-source Integration**: Support for surveys, support tickets, app reviews, and social media
- **Feedback Clustering**: Group similar feedback to identify common patterns and themes
- **Automated Insights**: AI-generated recommendations and alerts based on feedback analysis
- **Product Requirements Mapping**: Connect feedback directly to product requirements

## 🛠️ Technology Stack

### Frontend
- **Next.js 16**: React framework with server-side rendering and App Router
- **React 19**: Latest React features for building the UI
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
- **Recharts**: Data visualization library for charts and graphs
- **Lucide React**: Beautiful icon library

### AI & NLP
- **Vercel AI SDK**: Integration with AI models for text analysis
- **OpenAI GPT-4o-mini**: Advanced language model for sentiment analysis and insights generation
- **Rule-based Fallback**: Robust fallback system when AI is unavailable

### Backend & Data
- **PostgreSQL**: Relational database (schema provided)
- **Next.js API Routes**: Backend API endpoints
- **SWR**: React Hooks for data fetching and caching

### Development Tools
- **ESLint**: Code linting and quality enforcement
- **pnpm**: Fast, disk-space efficient package manager

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin management interface
│   ├── api/                      # API endpoints
│   ├── experiments/              # A/B testing and experiments
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Dashboard home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Reusable UI components (Radix UI)
│   ├── actionable-insights.tsx   # Insights display component
│   ├── admin-header.tsx          # Admin navigation
│   ├── admin-tabs.tsx            # Admin tab management
│   ├── dashboard-header.tsx      # Main dashboard header
│   ├── experiments-list.tsx      # A/B test experiments list
│   ├── feedback-management.tsx   # Feedback CRUD operations
│   ├── feature-mentions.tsx      # Feature mentions visualization
│   ├── metrics-overview.tsx      # Key metrics display
│   ├── requirements-management.tsx # PRD management
│   ├── sentiment-trends.tsx      # Sentiment trend charts
│   ├── top-clusters.tsx          # Feedback clustering display
│   └── topic-distribution.tsx    # Topic analysis charts
├── lib/                          # Utility libraries
│   ├── mock-data.ts              # Sample data for development
│   ├── nlp-processor.ts          # NLP and AI processing logic
│   ├── types.ts                  # TypeScript type definitions
│   └── utils.ts                  # Utility functions
├── scripts/                      # Database and setup scripts
│   └── 01-create-schema.sql     # Database schema
├── hooks/                        # Custom React hooks
├── public/                       # Static assets
├── styles/                       # Additional styles
├── components.json               # Shadcn UI configuration
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── tailwind.config.js            # Tailwind CSS configuration
```

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- **feedback**: Raw customer feedback storage
- **nlp_analysis**: Processed feedback with AI-generated insights
- **feedback_clusters**: Grouped similar feedback
- **cluster_membership**: Feedback-to-cluster mapping
- **product_requirements**: Product requirements and PRDs
- **requirement_feedback_mapping**: Links feedback to requirements
- **ab_tests**: A/B test configurations
- **ab_test_results**: Test results and feedback variants
- **insights**: Auto-generated actionable insights

See `scripts/01-create-schema.sql` for the complete schema definition.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database (for production use)
- OpenAI API key (for AI-powered analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johaankjis/AI-Powered-Customer-Feedback-Analysis-System.git
   cd AI-Powered-Customer-Feedback-Analysis-System
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # OpenAI API Key for AI-powered analysis
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Database connection (if using PostgreSQL)
   DATABASE_URL=postgresql://user:password@localhost:5432/feedback_db
   ```

4. **Set up the database** (Optional - for production)
   ```bash
   # Create the database
   createdb feedback_db
   
   # Run the schema script
   psql feedback_db < scripts/01-create-schema.sql
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📖 Usage

### Main Dashboard
Access the main dashboard at `/` to view:
- Overall sentiment metrics
- Sentiment trends over time
- Topic distribution
- Feature mentions
- Feedback clusters
- Actionable insights

### Admin Panel
Access the admin interface at `/admin` to:
- Manage feedback entries
- Create and manage product requirements
- View and manage insights
- Track feedback-to-requirement mappings

### Experiments
Access the experiments page at `/experiments` to:
- Create and manage A/B tests
- Track experiment results
- Compare feedback between variants

## 🔧 Development

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Component-based architecture
- Server components by default (Next.js App Router)
- Client components marked with 'use client'

### Adding New Features

1. Define types in `lib/types.ts`
2. Create reusable components in `components/`
3. Add API routes in `app/api/`
4. Use the NLP processor from `lib/nlp-processor.ts` for AI features
5. Follow existing patterns for consistency

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and patterns
- Add TypeScript types for new features
- Test your changes thoroughly
- Update documentation as needed
- Keep commits focused and descriptive

## 📝 Core Concepts

### Sentiment Analysis
The system analyzes feedback text to determine sentiment (positive, negative, neutral) and provides a sentiment score from -1 (very negative) to 1 (very positive).

### Topic Extraction
AI identifies main topics and themes in feedback, such as UI/UX, Performance, Features, Pricing, Support, etc.

### Feature Detection
The system recognizes mentions of specific product features (dashboard, mobile app, search, API, etc.) to help teams understand which features users discuss most.

### Urgency Scoring
Each feedback item receives an urgency score (1-10) based on sentiment, keywords, and context to help prioritize responses.

### Clustering
Similar feedback items are automatically grouped into clusters, making it easier to identify patterns and common issues.

### Insights Generation
The system automatically generates actionable insights with types:
- **Alert**: Critical issues requiring immediate attention
- **Trend**: Patterns emerging from feedback over time
- **Recommendation**: Suggested improvements based on feedback
- **Anomaly**: Unusual patterns or outliers detected

## 🔐 Security

- API keys should be stored in environment variables, never committed to the repository
- Input validation on all user-submitted data
- SQL injection prevention through parameterized queries
- XSS protection through React's built-in escaping

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- AI powered by [OpenAI](https://openai.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the codebase examples

## 🗺️ Roadmap

Future enhancements planned:
- Real-time feedback streaming
- Multi-language support
- Advanced analytics and reporting
- Integration with popular CRM systems
- Customizable dashboards
- Email notifications for critical insights
- Mobile app for on-the-go feedback review
- Export capabilities (PDF, CSV, Excel)

---

**Built with ❤️ for product teams who value customer feedback**
