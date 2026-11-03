'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Student } from '@/types';
import { BookOpen, Calendar, CheckCircle, Clock, Sparkles } from 'lucide-react';

interface RemedialPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const RemedialPlanModal: React.FC<RemedialPlanModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const weakestSubject = [...student.subjects].sort((a, b) => a.score - b.score)[0];

  const dailySchedule = [
    { day: 'Monday', time: '05:00 PM - 05:45 PM', topic: `${weakestSubject.name}: Fundamental Theorems & Proofs`, quiz: 'Quiz 1: Concept Warmup' },
    { day: 'Tuesday', time: '05:00 PM - 05:45 PM', topic: `${weakestSubject.name}: Solved Examples & Step-by-Step Drill`, quiz: 'Quiz 2: Practice Set A' },
    { day: 'Wednesday', time: '05:00 PM - 05:45 PM', topic: 'DBMS & Relational Algebra Revision', quiz: 'Quiz 3: Query Practice' },
    { day: 'Thursday', time: '05:00 PM - 05:45 PM', topic: 'Python Data Structures & Code Optimization', quiz: 'Quiz 4: Coding Test' },
    { day: 'Friday', time: '05:00 PM - 05:45 PM', topic: `${weakestSubject.name}: Past Semester Question Papers`, quiz: 'Quiz 5: Mock Assessment' },
    { day: 'Saturday', time: '10:00 AM - 11:30 AM', topic: 'Peer Mentoring Session with Rahul Dravid M', quiz: 'Review & Doubt Clearance' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI-Generated Personal Remedial Plan" maxWidth="max-w-2xl">
      <div className="space-y-4 text-slate-800 dark:text-slate-100">
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shadow-md">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Target Subject Focus</span>
            </div>
            <h4 className="text-lg font-bold">{weakestSubject.name} (Current Score: {weakestSubject.score}%)</h4>
            <p className="text-xs text-blue-200 mt-0.5">Targeting +15% score improvement in 3 weeks</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">76%</span>
            <span className="text-[10px] text-slate-300 block uppercase font-semibold">Target Goal</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" /> Recommended 6-Day Study Schedule
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {dailySchedule.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">{item.day} • {item.time}</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5 block">{item.topic}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {item.quiz}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Remedial Plan synced with student Kalvikkan portal.</span>
          </div>
          <Button variant="success" size="sm" onClick={onClose}>
            Assign to Student
          </Button>
        </div>
      </div>
    </Modal>
  );
};
