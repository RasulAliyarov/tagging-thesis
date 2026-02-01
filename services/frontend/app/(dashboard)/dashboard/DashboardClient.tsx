'use client'

import { motion } from 'framer-motion'
import { FileText, Smile, AlertCircle, Activity } from 'lucide-react'
import SummaryCard from '@/components/SummaryCard'
import SentimentChart from '@/components/SentimentChart'
import PriorityChart from '@/components/PriorityChart'
import ActivityItem from '@/components/ActivityItem'
import { AnalysisResult } from '@/types'

interface DashboardClientProps {
  history: AnalysisResult[]
  stats: { totalProcessed: number; avgSentiment: string; highPriority: number }
  chartData: any
}

export default function DashboardClient({ history, stats, chartData }: DashboardClientProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Dashboard</h2>
        <p className="text-slate-400">Real-time overview from database</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          icon={FileText}
          title="Total Processed"
          value={stats.totalProcessed.toLocaleString()}
          change="Lifetime"
          color="blue"
          delay={0.1}
        />
        <SummaryCard
          icon={Smile}
          title="Avg Sentiment"
          value={`${stats.avgSentiment}/10`}
          change={`${chartData.sentiment.positive} positive hits`}
          color="purple"
          delay={0.2}
        />
        <SummaryCard
          icon={AlertCircle}
          title="High Priority"
          value={stats.highPriority.toString()}
          change="Action required"
          color="red"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SentimentChart data={chartData.sentiment} />
        <PriorityChart data={chartData.priority} />
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
          <Activity className="w-5 h-5 mr-2" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {history.slice(0, 10).map((activity) => (
            <ActivityItem key={activity.id || activity._id} result={activity} />
          ))}
          {history.length === 0 && <p className="text-slate-500 text-center py-4">No data available yet.</p>}
        </div>
      </div>
    </motion.div>
  )
}