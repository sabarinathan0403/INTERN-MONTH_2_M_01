'use client';

import React, { useState } from 'react';
import useRouter from 'next/navigation';
import { Student } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowUpRight, ArrowDownRight, Minus, Eye, AlertTriangle, MessageSquare } from 'lucide-react';
import { useRouter as useNextRouter } from 'next/navigation';

interface StudentTableProps {
  students: Student[];
  onOpenInterventionModal?: (student: Student) => void;
  onOpenParentAlertModal?: (student: Student) => void;
  limit?: number;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onOpenInterventionModal,
  onOpenParentAlertModal,
  limit,
}) => {
  const router = useNextRouter();

  const displayList = limit ? students.slice(0, limit) : students;

  return (
    <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-800">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Students Requiring Attention
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time risk scoring and early warning alerts
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/students')}
        >
          View All Students
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase font-semibold border-b border-slate-200/80 dark:border-slate-800">
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Performance</th>
              <th className="py-3 px-4">Attendance</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Trend</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {displayList.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex flex-col">
                    <span>{st.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 font-normal">
                      EMIS: {st.emis}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4">{st.department}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                  {st.predictedScore}%
                </td>
                <td className="py-3.5 px-4">
                  <span className={`font-semibold ${st.attendance < 75 ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                    {st.attendance}%
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <Badge level={st.riskLevel} />
                </td>
                <td className="py-3.5 px-4">
                  {st.trend === 'UP' && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <ArrowUpRight className="w-3.5 h-3.5" /> Improving
                    </span>
                  )}
                  {st.trend === 'DOWN' && (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                      <ArrowDownRight className="w-3.5 h-3.5" /> Declining
                    </span>
                  )}
                  {st.trend === 'STABLE' && (
                    <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                      <Minus className="w-3.5 h-3.5" /> Stable
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/student/${st.id}`)}
                      className="px-2.5 py-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    {onOpenInterventionModal && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenInterventionModal(st)}
                        className="px-2.5 py-1 text-xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Intervene
                      </Button>
                    )}
                    {onOpenParentAlertModal && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onOpenParentAlertModal(st)}
                        className="px-2 py-1 text-xs"
                        title="Dispatch SMS/Email Alert to Parent"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
