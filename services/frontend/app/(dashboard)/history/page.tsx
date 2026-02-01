import HistoryClient from './HistoryClient'
import { AnalysisResult } from '@/types'

async function getHistory(): Promise<AnalysisResult[]> {
  const res = await fetch('http://nlp-worker:8001/api/analyses', {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch history')
  }

  return res.json()
}

export default async function HistoryPage() {
  const histories = await getHistory()

  return <HistoryClient initialHistories={histories} />
}
