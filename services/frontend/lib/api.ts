import { AnalysisResult } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.textanalysis.ai/v1'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * Analyze a single text
 */
export async function analyzeSingleText(text: string): Promise<ApiResponse<AnalysisResult>> {
  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Batch analyze multiple texts
 */
export async function analyzeBatchTexts(
  texts: string[]
): Promise<ApiResponse<AnalysisResult[]>> {
  try {
    const response = await fetch(`${API_URL}/batch-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ texts }),
    })

    if (!response.ok) {
      throw new Error('Batch analysis failed')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get analysis history
 */
export async function getAnalysisHistory(
  page: number = 1,
  limit: number = 10,
  filters?: {
    sentiment?: string
    priority?: string
    dateRange?: string
  }
): Promise<ApiResponse<{ results: AnalysisResult[]; total: number }>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    })

    const response = await fetch(`${API_URL}/history?${params}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch history')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<ApiResponse<{
  total_processed: number
  avg_sentiment_score: number
  high_priority_count: number
  sentiment_distribution: { positive: number; neutral: number; negative: number }
  priority_levels: { low: number; medium: number; high: number }
}>> {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch stats')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Upload CSV file for batch processing
 */
export async function uploadCSVFile(file: File): Promise<ApiResponse<{ jobId: string }>> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_URL}/upload-csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('CSV upload failed')
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Export results to CSV
 */
export async function exportResults(results: AnalysisResult[]): Promise<Blob> {
  const headers = ['ID', 'Text', 'Sentiment', 'Priority', 'Confidence', 'Timestamp']
  const csvContent = [
    headers.join(','),
    ...results.map((r) =>
      [
        r.id,
        `"${r.original_text.replace(/"/g, '""')}"`,
        r.sentiment,
        r.priority,
        r.confidence,
        r.timestamp,
      ].join(',')
    ),
  ].join('\n')

  return new Blob([csvContent], { type: 'text/csv' })
}