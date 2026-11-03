import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-gold-500/20 rounded-xl p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
