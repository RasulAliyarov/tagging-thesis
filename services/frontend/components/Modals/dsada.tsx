'use client'

import { Search, ChevronLeft, ChevronRight, Trash2, X, Edit3, Loader2, Download } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type EditHistoryProps = {
    isModalOpen: boolean,
    setIsModalOpen: (open: boolean) => void,
    selectedItem: any,
    setSelectedItem: (item: any) => void,
    isEditing: boolean
}

export default function EditHistory({isModalOpen, setIsModalOpen, selectedItem, setSelectedItem, isEditing,}: EditHistoryProps) {


    return (
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
    )
}