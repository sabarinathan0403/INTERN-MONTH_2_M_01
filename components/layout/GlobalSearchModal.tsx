'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, User, ArrowRight } from 'lucide-react';
import { useKalvikkanStore } from '@/lib/store';
import { Badge } from '@/components/ui/Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { students } = useKalvikkanStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled externally if listener attached to window
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? students.slice(0, 6)
    : students.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.emis.includes(query) ||
        s.department.toLowerCase().includes(query.toLowerCase()) ||
        s.riskLevel.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  const handleSelectStudent = (id: string) => {
    onClose();
    router.push(`/student/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student name, EMIS number, risk level, or department..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold"
          >
            ESC
          </button>
        </div>

        <div className="p-3 max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {query.trim() === '' ? 'Suggested Students' : `Search Results (${filtered.length})`}
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
              No students found matching &quot;{query}&quot;
            </div>
          ) : (
            filtered.map((st) => (
              <div
                key={st.id}
                onClick={() => handleSelectStudent(st.id)}
                className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-xl cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {st.name}
                      </span>
                      <Badge level={st.riskLevel} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {st.department} • EMIS: {st.emis} • Score: {st.predictedScore}%
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
