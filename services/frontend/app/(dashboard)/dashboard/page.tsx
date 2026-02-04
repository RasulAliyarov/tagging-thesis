import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { AnalysisResult } from '@/types';

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/analyze/history`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 0 } // Equivalent to cache: 'no-store'
    });

    if (!res.ok) {
      if (res.status === 401) return 'unauthorized';
      throw new Error('Failed to fetch data');
    }

    return await res.json() as AnalysisResult[];
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Handle Auth failure at the page level
  if (data === null || data === 'unauthorized') {
    redirect('/login');
  }

  const history = data as AnalysisResult[];

  // --- Server-Side Data Processing ---
  const totalProcessed = history.length;
  const highPriority = history.filter(i => i.priority === 'High').length;
  const positiveCount = history.filter(i => i.sentiment === 'Positive').length;
  
  const avgSentiment = totalProcessed > 0 
    ? ((positiveCount / totalProcessed) * 10).toFixed(1) 
    : "0";

  const chartData = {
    sentiment: {
      positive: positiveCount,
      neutral: history.filter(i => i.sentiment === 'Neutral').length,
      negative: history.filter(i => i.sentiment === 'Negative').length,
    },
    priority: {
      low: history.filter(i => i.priority === 'Low').length,
      medium: history.filter(i => i.priority === 'Medium').length,
      high: highPriority,
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* We pass the processed data to the Client Component for UI/Interactivity */}
      <DashboardClient 
        history={history} 
        stats={{ totalProcessed, avgSentiment, highPriority }}
        chartData={chartData}
      />
    </div>
  );
}