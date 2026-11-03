import React from 'react';
import { RiskLevel } from '@/types';

interface BadgeProps {
  level?: RiskLevel | string;
  variant?: 'low' | 'medium' | 'high' | 'neutral' | 'info' | 'success';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ level, variant, children, className = '' }) => {
  let style = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  let label = children || level;

  if (level === 'LOW' || variant === 'low' || variant === 'success') {
    style = 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50';
    if (!children) label = 'LOW RISK';
  } else if (level === 'MEDIUM' || variant === 'medium') {
    style = 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/50';
    if (!children) label = 'MEDIUM RISK';
  } else if (level === 'HIGH' || variant === 'high') {
    style = 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-800/50';
    if (!children) label = 'HIGH RISK';
  } else if (variant === 'info') {
    style = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/50';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${style} ${className}`}
    >
      {label}
    </span>
  );
};
