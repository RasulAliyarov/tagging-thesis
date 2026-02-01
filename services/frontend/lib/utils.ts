/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  // Less than 1 minute
  if (diff < 60000) {
    return 'just now'
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  // Less than 1 day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  // Less than 1 week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }

  // Format as date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get sentiment color class
 */
export function getSentimentColor(sentiment: string): string {
  const colors = {
    Positive: 'text-green-400 bg-green-500/20',
    Neutral: 'text-gray-400 bg-gray-500/20',
    Negative: 'text-red-400 bg-red-500/20',
  }
  return colors[sentiment as keyof typeof colors] || 'text-gray-400 bg-gray-500/20'
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority: string): string {
  const colors = {
    Low: 'text-blue-400 bg-blue-500/20',
    Medium: 'text-yellow-400 bg-yellow-500/20',
    High: 'text-red-400 bg-red-500/20',
  }
  return colors[priority as keyof typeof colors] || 'text-gray-400 bg-gray-500/20'
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Calculate sentiment score from distribution
 */
export function calculateSentimentScore(distribution: {
  positive: number
  neutral: number
  negative: number
}): number {
  const weighted =
    distribution.positive * 10 + distribution.neutral * 5 + distribution.negative * 0
  const total = distribution.positive + distribution.neutral + distribution.negative
  return total > 0 ? weighted / total : 0
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US')
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

/**
 * Parse CSV file
 */
export async function parseCSV(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter((line) => line.trim())
      // Skip header and get text column (assuming first column)
      const texts = lines.slice(1).map((line) => {
        const columns = line.split(',')
        return columns[0].replace(/^"|"$/g, '') // Remove quotes
      })
      resolve(texts)
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Download file
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}