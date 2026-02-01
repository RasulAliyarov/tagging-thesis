'use client';
import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';

const COLORS = {
  positive: '#10b981', // Emerald-500
  neutral: '#94a3b8',  // Slate-400
  negative: '#f43f5e', // Rose-500
  priority: '#6366f1'  // Indigo-500
};

// Custom tooltip for better presentation
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-800">{`${payload[0].name}: ${payload[0].value}`}</p>
        <p className="text-xs text-gray-500 italic">Show details</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ data }: { data: any[] }) {
  // 1. Aggregate data for Sentiment
  const sentimentStats = [
    { name: 'Positive', value: data.filter(i => i.sentiment === 'positive').length, key: 'positive' },
    { name: 'Neutral', value: data.filter(i => i.sentiment === 'neutral').length, key: 'neutral' },
    { name: 'Negative', value: data.filter(i => i.sentiment === 'negative').length, key: 'negative' },
  ].filter(i => i.value > 0);

  // 2. Aggregate data for Task Priorities
  const priorityStats = [
    { name: 'Low', count: data.filter(i => i.priority === 'low').length },
    { name: 'Medium', count: data.filter(i => i.priority === 'medium').length },
    { name: 'High', count: data.filter(i => i.priority === 'high').length },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sentiment */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Overall Sentiment</h3>
          <p className="text-sm text-gray-500 mb-6">Distribution of sentiments in the dataset</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentStats}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1200}
                >
                  {sentimentStats.map((entry: any) => (
                    <Cell key={entry.key} fill={COLORS[entry.key as keyof typeof COLORS]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Task Priorities */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Task Priorities</h3>
          <p className="text-sm text-gray-500 mb-6">AI recommendations by urgency</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} content={<CustomTooltip />} />
                <Bar dataKey="count" fill={COLORS.priority} radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}