'use client';

import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { riskDistributionData } from '@/data/mockAnalytics';

export const RiskChart: React.FC = () => {
  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Risk Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Current student academic risk segmentation
        </p>
      </div>

      <div className="w-full h-48 my-2 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">120</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Total</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Low Risk
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">78</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Medium
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">29</span>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            High Risk
          </div>
          <span className="text-base font-bold text-slate-900 dark:text-white block mt-0.5">13</span>
        </div>
      </div>
    </Card>
  );
};
