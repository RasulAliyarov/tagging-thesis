"use client";
import { useState } from 'react';

interface AnalysisResult {
  sentiment: string;
  tags: string[];
  priority: string;
  summary_ru: string;
}

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const [file, setFile] = useState<File | null>(null);

  // Функция для отправки файла
  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8001/analyze-batch', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      alert(`Обработано ${data.processed} записей!`);
      // Можно обновить результат, чтобы показать последний из пачки
      setResult(data.data[0]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8001/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">AI Feedback Tagger</h1>
          <p className="mt-2 text-gray-600">Microservice-based text analysis with Gemini AI</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800"
            rows={5}
            placeholder="Введите отзыв клиента здесь..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text}
            className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg'
              }`}
          >
            {loading ? 'Анализируем...' : 'Запустить ИИ анализ'}
          </button>
        </section>

        {result && (
          <section className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-blue-500 animate-in fade-in duration-500">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-sm font-uppercase tracking-wider text-gray-400 font-bold uppercase">Результат</h2>
                <p className="text-lg text-gray-800 italic mt-1">"{result.summary_ru}"</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${result.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                {result.priority} priority
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 text-sm mb-2">Тональность</h3>
                <span className="capitalize text-xl font-semibold text-gray-900">{result.sentiment}</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm mb-2">Теги</h3>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm border border-blue-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}



        <div className="mt-12 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">

          <h3 className="text-lg font-medium text-gray-700 mb-4">Пакетная обработка (CSV)</h3>

          <input

            type="file"

            accept=".csv"

            onChange={(e) => setFile(e.target.files?.[0] || null)}

            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"

          />

          <button

            onClick={handleFileUpload}

            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"

          >

            Загрузить и проанализировать пачку

          </button>

        </div>



      </div>
    </main>
  );
}