'use client'

import { useState } from 'react'
import { Edit3, Brain, Sparkles, Search, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SinglePage() {
  const [inputText, setInputText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<{
    sentiment: 'Positive' | 'Neutral' | 'Negative'
    priority: 'Low' | 'Medium' | 'High'
    confidence: number
    keyPhrases: string[]
    detailedAnalysis: string
  } | null>(null)

  const analyzeSingleText = async () => {
    if (!inputText.trim()) return

    setAnalyzing(true)
    setError(null)
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect to the analysis server')
      }

      const data = await response.json()

      // Mapping Backend (snake_case) to Frontend (camelCase)
      setResults({
        sentiment: data.sentiment,
        priority: data.priority,
        confidence: Math.round(data.confidence * 100), // Convert 0.85 to 85
        keyPhrases: data.tags || [],
        detailedAnalysis: data.detailed_analysis || 'No detailed analysis provided.',
      })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      console.error('Analysis error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  // ... (keep getSentimentColor and getPriorityColor functions as they are)
  const getSentimentColor = (sentiment: string) => {
    const colors = {
      Positive: 'bg-green-500/20 border-green-500/30 text-green-400',
      Neutral: 'bg-gray-500/20 border-gray-500/30 text-gray-400',
      Negative: 'bg-red-500/20 border-red-500/30 text-red-400',
    }
    return colors[sentiment as keyof typeof colors]
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      Medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
      High: 'bg-red-500/20 border-red-500/30 text-red-400',
    }
    return colors[priority as keyof typeof colors]
  }

  return (
    <div className="p-6 lg:p-8">
      {/* ... (Header Section) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Single Text Analysis</h2>
        <p className="text-slate-400">Analyze individual texts in real-time using Gemini AI</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="glass rounded-2xl p-6 border border-white/10 bg-white/5 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-white">
            <Edit3 className="w-5 h-5 mr-2" />
            Input Text
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Paste customer feedback, review, or any text here..."
          />

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <button
            onClick={analyzeSingleText}
            disabled={analyzing || !inputText.trim()}
            className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-semibold shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {analyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI is thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Run Analysis</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {results ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 border border-white/10 bg-white/5">
            <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Intelligence Report
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Sentiment</label>
                  <div className={`px-4 py-2 rounded-lg border text-center ${getSentimentColor(results.sentiment)}`}>
                    {results.sentiment}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Priority</label>
                  <div className={`px-4 py-2 rounded-lg border text-center ${getPriorityColor(results.priority)}`}>
                    {results.priority}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-slate-500 uppercase tracking-wider">AI Confidence</label>
                  <span className="text-xs font-mono text-blue-400">{results.confidence}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${results.confidence}%` }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-3 block">Extracted Tags</label>
                <div className="flex flex-wrap gap-2">
                  {results.keyPhrases.map((phrase) => (
                    <span key={phrase} className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300">
                      #{phrase}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">Executive Summary</label>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{results.detailedAnalysis}"
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass rounded-2xl border border-dashed border-slate-700 flex items-center justify-center p-12">
            <div className="text-center opacity-40">
              <Search className="w-12 h-12 mx-auto mb-4 text-slate-500" />
              <p>Waiting for input data...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}