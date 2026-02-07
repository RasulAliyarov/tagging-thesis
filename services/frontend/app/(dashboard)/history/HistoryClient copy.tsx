'use client'

import { useState } from 'react'
import { Search, Trash2, Loader2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnalysisResult } from '@/types'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { toast } from 'react-hot-toast'
import EditHistory from '@/components/Modals/EditHistory'
import { getPriorityColor, getSentimentColor } from '@/hooks/useColoring'
interface Props {
  initialHistories: AnalysisResult[]
}

/* ------------------ component ------------------ */
export default function HistoryClient({ initialHistories }: Props) {
  const [history, setHistory] = useState(initialHistories)
  const [selectedItem, setSelectedItem] = useState<AnalysisResult | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [editForm, setEditForm] = useState<AnalysisResult | null>(null)

  const { token } = useAuth()
  const router = useRouter()

  /* ------------------ actions ------------------ */
  const handleStartEdit = () => {
    if (!selectedItem) return
    setEditForm({ ...selectedItem })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return

    setDeletingId(id)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/history/${id}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) throw new Error()
      setHistory(prev => prev.filter(item => item.id !== id))
      setIsModalOpen(false)
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editForm || !selectedItem) return

    setIsSaving(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/history/${selectedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      )

      if (!res.ok) throw new Error()
      const updated = await res.json()

      setHistory(prev =>
        prev.map(item => (item.id === updated.id ? updated : item))
      )
      setSelectedItem(updated)
      setIsEditing(false)
    } catch {
      toast.error('Update failed')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analyze/export/excel`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `analysis_${Date.now()}.xlsx`
      a.click()

      URL.revokeObjectURL(url)
    } catch {
      toast.error('Export failed')
    }
  }

  /* ------------------ render ------------------ */
  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-3xl font-bold mb-6 text-white">Analysis Records</h2>

      <button
        onClick={handleExport}
        className="mb-6 flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl"
      >
        <Download className="w-4 h-4" /> Export Excel
      </button>

      <div className="space-y-4">
        {history.map(item => (
          <motion.div
            key={item.id}
            onClick={() => {
              setSelectedItem(item)
              setIsModalOpen(true)
              setIsEditing(false)
            }}
            className="glass p-6 rounded-2xl cursor-pointer border border-white/5"
          >
            <div>
              <p className="text-slate-200 mb-2 line-clamp-2">{item.text}</p>

              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs ${getSentimentColor(item.sentiment)}`}>
                  {item.sentiment}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(item.priority)}`}>
                  {item.priority}
                </span>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation()
                handleDelete(item.id)
              }}
              className="mt-4 text-red-400"
            >
              {deletingId === item.id ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </motion.div>
        ))}
      </div>

      <EditHistory
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedItem={selectedItem}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        isSaving={isSaving}
        editForm={editForm}
        setEditForm={setEditForm}
        handleSave={handleSave}
        handleStartEdit={handleStartEdit}
        handleDelete={handleDelete}
      />
    </div>
  )
}
