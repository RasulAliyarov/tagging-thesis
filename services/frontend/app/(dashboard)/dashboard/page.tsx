import { FileText, Smile, AlertCircle } from 'lucide-react'
import DashboardClient from './DashboardClient'
import { AnalysisResult } from '@/types'

// This function runs ONLY on the server
async function getDashboardData() {
  try {
    // Note: Inside Docker, we use the service name 'nlp-worker' instead of 'localhost'
    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/analyses`, { 
      cache: 'no-store' // Ensure we get fresh data every time (SSR)
    })
    
    if (!res.ok) throw new Error('Failed to fetch data')
    
    const data: AnalysisResult[] = await res.json()
    return data
  } catch (error) {
    console.error("Dashboard Fetch Error:", error)
    return []
  }
}

export default async function DashboardPage() {
  const history = await getDashboardData()

  // Data processing for summary cards
  const totalProcessed = history.length
  const highPriority = history.filter(i => i.priority === 'High').length
  
  // Logic for Sentiment Score (e.g., scale 1-10)
  const positiveCount = history.filter(i => i.sentiment === 'Positive').length
  const avgSentiment = totalProcessed > 0 
    ? ((positiveCount / totalProcessed) * 10).toFixed(1) 
    : "0"

  // Data for Charts
  const chartData = {
    sentiment: {
      positive: positiveCount,
      neutral: history.filter(i => i.sentiment === 'Neutral').length,
      negative: history.filter(i => i.sentiment === 'Negative').length,
    },
    priority: {
      low: history.filter(i => i.priority === 'Low').length,
      medium: history.filter(i => i.priority === 'Medium').length,
      high: highPriority,
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Passing all calculated data to a Client Component for animations and charts */}
      <DashboardClient 
        history={history} 
        stats={{ totalProcessed, avgSentiment, highPriority }}
        chartData={chartData}
      />
    </div>
  )
}