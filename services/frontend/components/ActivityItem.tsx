'use client'

import { Check, AlertTriangle, Minus, LucideIcon } from 'lucide-react'
import { AnalysisResult } from '@/types'

interface ActivityItemProps {
  result: AnalysisResult
}

export default function ActivityItem({ result }: ActivityItemProps) {
  const sentimentConfig: Record<string, { icon: LucideIcon; bgColor: string; iconColor: string; badgeColor: string }> = {
    Positive: {
      icon: Check,
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400',
      badgeColor: 'bg-green-500/20 text-green-400',
    },
    Neutral: {
      icon: Minus,
      bgColor: 'bg-gray-500/20',
      iconColor: 'text-gray-400',
      badgeColor: 'bg-gray-500/20 text-gray-400',
    },
    Negative: {
      icon: AlertTriangle,
      bgColor: 'bg-red-500/20',
      iconColor: 'text-red-400',
      badgeColor: 'bg-red-500/20 text-red-400',
    },
  }

  const priorityConfig: Record<string, string> = {
    Low: 'bg-blue-500/20 text-blue-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    High: 'bg-red-500/20 text-red-400',
  }

  const config = sentimentConfig[result.sentiment as keyof typeof sentimentConfig] ?? sentimentConfig['Neutral']
  const Icon = config.icon

  return (
    <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors">
      <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-300 mb-1 truncate">{result.text}</p>
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <span className="font-mono">{result.timestamp}</span>
          <span className={`px-2 py-1 rounded-full ${config.badgeColor} font-medium`}>
            {result.sentiment}
          </span>
          <span className={`px-2 py-1 rounded-full ${priorityConfig[result.priority]} font-medium`}>
            {result.priority} Priority
          </span>
        </div>
      </div>
    </div>
  )
}