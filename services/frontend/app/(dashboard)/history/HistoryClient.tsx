'use client'

import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Trash2, X, Edit3, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnalysisResult } from '@/types'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext'

interface Props {
  initialHistories: AnalysisResult[]
}

export default function HistoryClient({ initialHistories }: Props) {
  // Data states
  const [history, setHistory] = useState<AnalysisResult[]>(initialHistories)
  // Modal states
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [deletingId, setDeletingId] = useState<string | null>(null);
      const { token } = useAuth();
  
  const router = useRouter();

  // Edit form state
  const [editForm, setEditForm] = useState({
    text: '',
    sentiment: '',
    priority: ''
  })

  // Color helpers
  const getSentimentColor = (sentiment: string) => ({
    Positive: 'bg-green-500/20 text-green-400',
    Neutral: 'bg-gray-500/20 text-gray-400',
    Negative: 'bg-red-500/20 text-red-400',
  }[sentiment] || 'bg-slate-500/20 text-slate-400')

  // Priority color helper
  const getPriorityColor = (priority: string) => ({
    Low: 'bg-blue-500/20 text-blue-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    High: 'bg-red-500/20 text-red-400',
  }[priority] || 'bg-slate-500/20 text-slate-400')

  // Open edit form
  const handleStartEdit = () => {
    if (selectedItem) {
      setEditForm({
        text: selectedItem.text,
        sentiment: selectedItem.sentiment,
        priority: selectedItem.priority
      })
      setIsEditing(true)
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this analysis?')) return;

    setDeletingId(itemId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze/history/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        // Force a re-fetch of data, ensuring UI consistency without manual state manipulation getHistory()
        router.refresh();
      } else {
        alert('Failed to delete item');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  // Save handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItem) return

    setIsSaving(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze/history/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      })

      if (res.ok) {
        const updatedItem = await res.json()
        setHistory(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item))
        setSelectedItem(updatedItem) // Update selected item
        setIsEditing(false)
      }
    } catch (err) {
      alert("Update failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Analysis Records</h2>
        <p className="text-slate-400">Manage and audit AI-generated insights</p>
      </motion.div>

      {/* Filters (Mockup for now) */}
      <div className="glass rounded-2xl p-6 mb-6 grid md:grid-cols-4 gap-4">
        <select className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-blue-500">
          <option>All Sentiments</option>
          <option>Positive</option>
          <option>Neutral</option>
          <option>Negative</option>
        </select>
        <select className="px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-blue-500">
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Search in text..."
            className="w-full px-4 py-3 pl-12 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 outline-none focus:border-blue-500"
          />
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4 mb-8">
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => { setSelectedItem(item); setIsModalOpen(true); setIsEditing(false); }}
            className="glass rounded-2xl p-6 hover-lift cursor-pointer group border border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-slate-200 mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {item.text}
                </p>
                <div className="flex items-center space-x-4 text-xs text-slate-500 font-mono">
                  <span>ID: #{item.id.slice(-6)}</span>
                  <span>•</span>
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
           <button 
      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
      disabled={deletingId === item.id}
      className="text-red-400 hover:text-red-300 transition-colors p-2"
    >
      {deletingId === item.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
    </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full font-medium text-[10px] uppercase tracking-wider ${getSentimentColor(item.sentiment)}`}>
                {item.sentiment}
              </span>
              <span className={`px-3 py-1 rounded-full font-medium text-[10px] uppercase tracking-wider ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
              {item.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] border border-slate-700 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Section */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">
                  {isEditing ? 'Edit Analysis' : 'Record Insights'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Content</label>
                    <textarea
                      value={editForm.text}
                      onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                      className="w-full bg-black/40 border border-slate-700 rounded-2xl p-4 text-white h-40 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Sentiment</label>
                      <select
                        value={editForm.sentiment}
                        onChange={(e) => setEditForm({ ...editForm, sentiment: e.target.value })}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                      >
                        <option value="Positive">Positive</option>
                        <option value="Neutral">Neutral</option>
                        <option value="Negative">Negative</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Priority</label>
                      <select
                        value={editForm.priority}
                        onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                        className="w-full bg-black/40 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      disabled={isSaving}
                      type="submit"
                      className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-white transition-all flex items-center justify-center"
                    >
                      {isSaving ? <Loader2 className="animate-spin mr-2" /> : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-white transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-slate-200 text-lg leading-relaxed">
                    "{selectedItem.text}"
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Sentiment</p>
                      <p className={`font-bold ${getSentimentColor(selectedItem.sentiment).split(' ')[1]}`}>
                        {selectedItem.sentiment}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Priority</p>
                      <p className={`font-bold ${getPriorityColor(selectedItem.priority).split(' ')[1]}`}>
                        {selectedItem.priority}
                      </p>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Confidence</p>
                      <p className="font-bold text-purple-400">{selectedItem.confidence * 100}%</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleStartEdit}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-white border border-white/10 flex items-center justify-center space-x-3 transition-all"
                    >
                      <Edit3 className="w-5 h-5" /> <span>Modify</span>
                    </button>
                    <button
                      onClick={() => handleDelete(selectedItem.id)}
                      className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold flex items-center justify-center space-x-3 transition-all"
                    >
                      <Trash2 className="w-5 h-5" /> <span>Discard</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}