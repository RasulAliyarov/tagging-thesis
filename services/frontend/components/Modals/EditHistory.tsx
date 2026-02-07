'use client'

import { useState } from 'react'
import { Trash2, X, Edit3, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnalysisResult } from '@/types'
import { getPriorityColor, getSentimentColor } from '@/hooks/useColoring'

type EditHistoryProps = {
    isModalOpen: boolean
    setIsModalOpen: (open: boolean) => void

    selectedItem: AnalysisResult | null

    isEditing: boolean,
    setIsEditing: (editing: boolean) => void,

    editForm: AnalysisResult | null
    setEditForm: (form: AnalysisResult) => void

    isSaving: boolean
    handleSave: (e: React.FormEvent) => void
    handleDelete: (id: string) => Promise<void>

    handleStartEdit: () => void
}

export default function EditHistory({
    isModalOpen,
    setIsModalOpen,
    selectedItem,
    isEditing,
    setIsEditing,
    editForm,
    setEditForm,
    isSaving,
    handleSave,
    handleDelete,
    handleStartEdit,
}: EditHistoryProps) {
    const [tagInput, setTagInput] = useState('')

    if (!selectedItem) return null

    /* ---------------- tag logic ---------------- */
    const addTag = (e) => {
        e.preventDefault()
        if (!editForm) return

        const tag = tagInput.trim().toLowerCase()
        if (!tag || editForm.tags?.includes(tag)) {
            setTagInput('')
            return
        }

        setEditForm({
            ...editForm,
            tags: [...(editForm.tags || []), tag],
        })
        setTagInput('')
    }

    const removeTag = (tag: string) => {
        if (!editForm) return
        setEditForm({
            ...editForm,
            tags: editForm.tags?.filter(t => t !== tag),
        })
    }

    /* ---------------- render ---------------- */
    return (
        <AnimatePresence>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* backdrop */}
                    <motion.div
                        onClick={() => setIsModalOpen(false)}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative glass w-full max-w-2xl rounded-3xl p-8 border border-white/10 shadow-2xl"
                    >
                        {/* header */}
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-white">
                                {isEditing ? 'Edit Analysis' : 'Record Insights'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* ---------------- EDIT MODE ---------------- */}
                        {isEditing && editForm ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* content */}
                                <textarea
                                    value={editForm.text}
                                    onChange={e =>
                                        setEditForm({ ...editForm, text: e.target.value })
                                    }
                                    className="w-full bg-black/40 border border-slate-700 rounded-2xl p-4 text-white h-40"
                                />

                                {/* sentiment / priority */}
                                <div className="grid grid-cols-2 gap-6">
                                    <select
                                        value={editForm.sentiment}
                                        onChange={e =>
                                            setEditForm({
                                                ...editForm,
                                                sentiment: e.target.value as AnalysisResult['sentiment'],
                                            })
                                        }
                                        className="bg-black/40 border border-slate-700 rounded-xl p-3 text-white"
                                    >
                                        <option value="Positive">Positive</option>
                                        <option value="Neutral">Neutral</option>
                                        <option value="Negative">Negative</option>
                                    </select>

                                    <select
                                        value={editForm.priority}
                                        onChange={e =>
                                            setEditForm({
                                                ...editForm,
                                                priority: e.target.value as AnalysisResult['priority'],
                                            })
                                        }
                                        className="bg-black/40 border border-slate-700 rounded-xl p-3 text-white"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                {/* tags */}
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {editForm.tags?.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => removeTag(tag)}
                                                    className="ml-2 text-red-400"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className='flex gap-2'>

                                        <input
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    addTag(e)
                                                }
                                            }}
                                            placeholder="Add tag"
                                            className="min-w-3/4 bg-black/40 border border-slate-700 rounded-xl p-3 text-white"
                                        />
                                        <button
                                            onClick={e => addTag(e)}
                                            className="min-w-1/4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white"
                                        >
                                            Add Tag
                                        </button>
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
                            /* ---------------- VIEW MODE ---------------- */
                            <div className="space-y-6">
                                <p className="text-slate-200 text-lg">“{selectedItem.text}”</p>


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

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleStartEdit}
                                        className="flex-1 py-3 bg-white/10 rounded-xl text-white flex items-center justify-center gap-2"
                                    >
                                        <Edit3 /> Modify
                                    </button>

                                    <button
                                        onClick={() => handleDelete(selectedItem.id)}
                                        className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center gap-2"
                                    >
                                        <Trash2 /> Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}