import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Award, CheckCircle2 } from 'lucide-react';
import { Student } from '@/types';

interface PeerMentorCardProps {
  targetStudent: Student;
  onAssignSuccess?: () => void;
}

export const PeerMentorCard: React.FC<PeerMentorCardProps> = ({ targetStudent, onAssignSuccess }) => {
  const mentorOptions = [
    { name: 'Rahul Dravid M', dept: 'CSE', score: 95, email: 'rahuldravid1234@gmail.com', strength: 'Mathematics & Java' },
    { name: 'Srija S', dept: 'AI & DS', score: 92, email: 'srijasaravanan@gmail.com', strength: 'Python & Data Structures' },
    { name: 'Kavipriya E', dept: 'ECE', score: 93, email: 'kavipriyatvm2007@gmail.com', strength: 'DBMS & Logic' },
  ];

  const matchedMentor = mentorOptions[0];

  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Users className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            AI Peer Mentor Match
          </h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full">
          98% Match Rate
        </span>
      </div>

      <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              {matchedMentor.name} <Award className="w-3.5 h-3.5 text-amber-500" />
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {matchedMentor.dept} • Score: {matchedMentor.score}% • {matchedMentor.strength}
            </p>
          </div>
          <Badge level="LOW" />
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
        Pairing {targetStudent.name} with {matchedMentor.name} for weekly peer study sessions.
      </p>

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs font-semibold"
        onClick={onAssignSuccess}
      >
        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Assign Peer Study Partner
      </Button>
    </Card>
  );
};
