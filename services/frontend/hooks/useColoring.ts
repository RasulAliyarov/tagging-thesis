export const getSentimentColor = (sentiment: string) =>
({
    Positive: 'bg-green-500/20 text-green-400',
    Neutral: 'bg-gray-500/20 text-gray-400',
    Negative: 'bg-red-500/20 text-red-400',
}[sentiment] || 'bg-slate-500/20 text-slate-400')

export const getPriorityColor = (priority: string) =>
({
    Low: 'bg-blue-500/20 text-blue-400',
    Medium: 'bg-yellow-500/20 text-yellow-400',
    High: 'bg-red-500/20 text-red-400',
}[priority] || 'bg-slate-500/20 text-slate-400')