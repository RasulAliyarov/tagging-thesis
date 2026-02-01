'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

interface PriorityChartProps {
  data: {
    low: number
    medium: number
    high: number
  }
}

export default function PriorityChart({ data }: PriorityChartProps) {
  const chartData = [
    { name: 'Low', value: data.low, fill: '#3b82f6' },
    { name: 'Medium', value: data.medium, fill: '#eab308' },
    { name: 'High', value: data.high, fill: '#ef4444' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Priority Levels
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
            }}
            cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}