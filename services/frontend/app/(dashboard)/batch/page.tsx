'use client'

import { useState, useCallback, useRef } from 'react'
import { UploadCloud, Loader, CheckCircle, Download, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import { AnalysisResult, BatchProcessingLog } from '@/types'

export default function BatchPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<BatchProcessingLog[]>([])
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false });
    setLogs(prev => [...prev, { timestamp, message, type }]);
  }

  const uploadFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      addLog('Error: Please upload a valid CSV file', 'error');
      return;
    }

    setIsProcessing(true);
    setShowResults(false);
    setProgress(10);
    setLogs([]);
    
    addLog(`Starting analysis for: ${file.name}`, 'info');
    addLog('Uploading to server...', 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/batch-analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      setProgress(50);
      addLog('Server is processing with Gemini AI...', 'warning');
      
      const data = await response.json();
      
      // Mapping Backend tags to Frontend logic if necessary
      setResults(data);
      setProgress(100);
      addLog(`Successfully analyzed ${data.length} entries`, 'success');
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowResults(true);
      }, 800);

    } catch (error: any) {
      addLog(`Critical Error: ${error.message}`, 'error');
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  // ... (Keep getSentimentColor, getPriorityColor, getLogColor functions)
  const getSentimentColor = (sentiment: string) => {
    const colors = {
      Positive: 'bg-green-500/20 text-green-400',
      Neutral: 'bg-gray-500/20 text-gray-400',
      Negative: 'bg-red-500/20 text-red-400',
    }
    return colors[sentiment as keyof typeof colors] || 'bg-slate-500/20 text-slate-400'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      Low: 'bg-blue-500/20 text-blue-400',
      Medium: 'bg-yellow-500/20 text-yellow-400',
      High: 'bg-red-500/20 text-red-400',
    }
    return colors[priority as keyof typeof colors] || 'bg-slate-500/20 text-slate-400'
  }

  const getLogColor = (type: string) => {
    const colors = {
      success: 'text-green-400',
      info: 'text-blue-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
    }
    return colors[type as keyof typeof colors]
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-white">Batch Processing</h2>
        <p className="text-slate-400">Upload CSV and let Gemini AI handle the heavy lifting</p>
      </motion.div>

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Upload Zone */}
      {!isProcessing && !showResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-8 mb-8 border border-white/5 bg-white/5"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Click or Drag CSV here</h3>
            <p className="text-slate-500 text-sm">Gemini 1.5 Flash will analyze each row</p>
          </div>
        </motion.div>
      )}

      {/* Processing Section */}
      {isProcessing && (
        <div className="glass rounded-2xl p-6 mb-8 border border-white/10 bg-slate-900/40 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-white">
              <Loader className="w-5 h-5 mr-3 animate-spin text-blue-500" />
              AI Analysis in Progress...
            </h3>
            <span className="font-mono text-sm text-blue-400">{progress}%</span>
          </div>
          
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="bg-black/40 rounded-xl p-4 h-64 overflow-y-auto font-mono text-xs border border-white/5">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                <span className={getLogColor(log.type)}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Table */}
      {showResults && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              Batch Results
            </h3>
            <div className="flex space-x-3">
               <button 
                onClick={() => { setShowResults(false); setResults([]); }}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
               >
                 Clear
               </button>
               <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500 flex items-center">
                 <Download className="w-4 h-4 mr-2" /> Export CSV
               </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 text-xs uppercase text-slate-500 font-bold tracking-wider">Text Content</th>
                  <th className="p-4 text-xs uppercase text-slate-500 font-bold tracking-wider">Sentiment</th>
                  <th className="p-4 text-xs uppercase text-slate-500 font-bold tracking-wider">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-sm text-slate-300 max-w-md truncate">{result.text}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${getSentimentColor(result.sentiment)}`}>
                        {result.sentiment}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${getPriorityColor(result.priority)}`}>
                        {result.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  )
}