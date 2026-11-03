import React from 'react';
import { Card } from '@/components/ui/Card';
import { Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

export const AIInsightCard: React.FC = () => {
  const topFactors = [
    { name: 'Attendance Lag (<75%)', percent: 38, color: 'bg-red-500' },
    { name: 'Assessment Score Decline', percent: 31, color: 'bg-amber-500' },
    { name: 'Incomplete Assignments', percent: 21, color: 'bg-blue-500' },
    { name: 'Other Signals', percent: 10, color: 'bg-slate-400' },
  ];

  return (
    <Card className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border-indigo-800/60 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-indigo-400" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            Kalvikkan AI Insight
          </div>
          <span className="text-[11px] text-slate-400 ml-auto">Updated 5 mins ago</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-snug">
          13 students currently show high academic risk.
        </h3>
        <p className="text-xs text-indigo-100/90 leading-relaxed mb-4">
          The strongest contributing signals across AI &amp; DS, CSE, and ECE departments are declining assessment scores, low attendance (&lt;75%), and incomplete continuous evaluations. Early mentor interventions recommended.
        </p>

        <div className="border-t border-indigo-800/60 pt-3">
          <span className="text-xs font-semibold text-indigo-200 block mb-2.5">
            Top Risk Factor Weights &amp; Impact
          </span>
          <div className="space-y-2">
            {topFactors.map((factor) => (
              <div key={factor.name}>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>{factor.name}</span>
                  <span className="font-bold text-white">{factor.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${factor.color} rounded-full transition-all duration-500`}
                    style={{ width: `${factor.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
