'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { performanceTrendData } from '@/data/mockAnalytics';

export const PerformanceChart: React.FC = () => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Performance & Attendance Overview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Average score trend across last 6 assessments
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Avg Score (%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-700 dark:text-slate-300">Attendance (%)</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="assessment"
              tick={{ fontSize: 11, fill: '#64748b' }}
              stroke="#cbd5e1"
            />
            <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
              }}
            />
            <Line
              type="monotone"
              dataKey="averageScore"
              name="Avg Score"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563eb' }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="attendanceAvg"
              name="Attendance"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: '#10b981' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
