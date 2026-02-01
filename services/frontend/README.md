# AI Text Analysis System - Next.js Application

A modern, enterprise-grade AI-powered text analysis system built with Next.js 16, TypeScript, Tailwind CSS, and Recharts.

## 🚀 Features

- **Home Page**: Landing page with feature highlights and statistics
- **Dashboard**: Real-time analytics with sentiment distribution and priority levels
- **Batch Processing**: Upload CSV files for bulk text analysis with real-time console logs
- **Single Analysis**: Analyze individual texts with detailed AI insights
- **History**: View and filter past analyses
- **Settings**: Configure API endpoints and preferences
- **Responsive Design**: Fully mobile-friendly with collapsible sidebar

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Fonts**: IBM Plex Sans & JetBrains Mono

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ai-text-analysis-nextjs
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API credentials:
```env
NEXT_PUBLIC_API_URL=https://api.textanalysis.ai/v1
NEXT_PUBLIC_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-text-analysis-nextjs/
├── app/
│   ├── (dashboard)/           # Dashboard layout group
│   │   ├── layout.tsx         # Dashboard layout with sidebar
│   │   ├── dashboard/         # Dashboard page
│   │   ├── batch/             # Batch processing page
│   │   ├── single/            # Single analysis page
│   │   ├── history/           # History page
│   │   └── settings/          # Settings page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   ├── SummaryCard.tsx        # Dashboard summary cards
│   ├── SentimentChart.tsx     # Sentiment pie chart
│   ├── PriorityChart.tsx      # Priority bar chart
│   └── ActivityItem.tsx       # Recent activity item
├── lib/
│   ├── api.ts                 # API utility functions
│   └── utils.ts               # Helper functions
├── types/
│   └── index.ts               # TypeScript type definitions
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── next.config.js
```

## 🎨 Design Philosophy

- **Enterprise Clean**: Inspired by Vercel and Stripe
- **Dark Theme**: Slate/Zinc palette with gradient accents
- **Glass Morphism**: Subtle transparency effects
- **Smooth Animations**: Framer Motion for delightful interactions
- **Typography**: IBM Plex Sans for UI, JetBrains Mono for code

## 🔌 API Integration

The application is designed to work with a REST API. Replace the mock data in pages with actual API calls using the functions in `lib/api.ts`:

```typescript
import { analyzeSingleText, analyzeBatchTexts, getAnalysisHistory } from '@/lib/api'

// Single text analysis
const result = await analyzeSingleText("Your text here")

// Batch analysis
const results = await analyzeBatchTexts(["Text 1", "Text 2"])

// Get history
const history = await getAnalysisHistory(1, 10, { sentiment: 'Positive' })
```

## 📊 Data Types

All TypeScript interfaces are defined in `types/index.ts`:

- `AnalysisResult`: Individual analysis result
- `SummaryStats`: Dashboard statistics
- `ChartData`: Chart visualization data
- `BatchProcessingLog`: Processing logs
- `UserSettings`: User preferences

## 🎯 Key Components

### Sidebar
Responsive navigation with active state highlighting. Automatically closes on mobile after navigation.

### Dashboard
- Summary cards with animation delays
- Recharts pie chart for sentiment distribution
- Recharts bar chart for priority levels
- Recent activity feed with live updates

### Batch Processing
- Drag-and-drop CSV upload
- Real-time progress tracking
- Console-style logging
- Results table with sortable columns

### Single Analysis
- Real-time text input
- AI-powered analysis with confidence scores
- Key phrase extraction
- Detailed insights

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
vercel deploy
```

### Docker

```bash
docker build -t ai-text-analysis .
docker run -p 3000:3000 ai-text-analysis
```

### Static Export

```bash
npm run build
npm run export
```

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette.

### Fonts
Replace fonts in `app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'
```

### API Endpoint
Update `NEXT_PUBLIC_API_URL` in `.env.local` or `next.config.js`

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For support, email support@textanalysis.ai or open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript