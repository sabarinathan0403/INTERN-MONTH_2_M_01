import React from 'react';
import { Card } from '@/components/ui/Card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  colorVariant?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple';
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorVariant = 'blue',
  trend,
}) => {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <span className="inline-block mt-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>

        <div className={`p-3 rounded-xl ${colorStyles[colorVariant]} shrink-0 shadow-2xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};
