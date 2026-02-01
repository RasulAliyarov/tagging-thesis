'use client'

import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'

interface SummaryCardProps {
  icon: LucideIcon
  title: string
  value: string | number
  change?: string
  color: 'blue' | 'purple' | 'red'
  delay?: number
}

export default function SummaryCard({
  icon: Icon,
  title,
  value,
  change,
  color,
  delay = 0,
}: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    red: 'bg-red-500/20 text-red-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-2xl p-6 hover-lift"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <span className="text-xs font-mono text-slate-400">{change}</span>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </motion.div>
  )
}