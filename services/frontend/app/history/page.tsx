"use client";
import Link from 'next/dist/client/link';
import { useEffect, useState } from 'react';

interface AnalysisResult {
  sentiment: string;
  tags: string[];
  priority: string;
  summary_ru: string;
}

export default function History() {
  const [histories, setHistories] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8001/history', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log(data)
      setHistories(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
          <Link href="/" className="text-blue-600 hover:underline">Домой</Link>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Загрузить историю анализов
        </button>
      )}

      <ul>
        {histories.map((item, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow mb-4">
            <p className="text-gray-800">{item.summary_ru}</p>
            <div className="flex justify-between items-center mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {item.priority} priority
              </span>
              <span className="text-gray-500 text-sm">{item.sentiment}</span>
            </div>
            <div>
              {item.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full mr-2 mt-2">
                  {tag}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>



      </div>
   
    </main>
  );
}