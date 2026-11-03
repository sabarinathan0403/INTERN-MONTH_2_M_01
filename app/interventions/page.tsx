'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { InterventionModal } from '@/components/interventions/InterventionModal';
import { ParentAlertModal } from '@/components/interventions/ParentAlertModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { useKalvikkanStore } from '@/lib/store';
import { Student, Intervention } from '@/types';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Eye,
  MessageSquare,
  Sparkles,
  UserCheck
} from 'lucide-react';

export default function EarlyInterventionCenter() {
  const router = useRouter();
  const {
    students,
    interventions,
    updateInterventionStatus,
    parentAlerts,
    isHydrated,
  } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'critical' | 'attention' | 'improved' | 'alerts'>('critical');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  // Tab filtering
  const criticalList = interventions.filter((i) => i.riskLevel === 'HIGH' || i.status === 'Pending');
  const attentionList = interventions.filter((i) => i.riskLevel === 'MEDIUM' || i.status === 'In Progress');
  const improvedList = interventions.filter((i) => i.riskLevel === 'LOW' || i.status === 'Completed');

  const handleMarkCompleted = (id: string, name: string) => {
    updateInterventionStatus(id, 'Completed');
    setToastMessage(`Intervention for ${name} marked as COMPLETED!`);
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar
        mobileOpen={mobileNavOpen}
        setMobileOpen={setMobileNavOpen}
        onOpenAiAssistant={() => setChatDrawerOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          title="Early Intervention Center"
          subtitle="Action tracking, mentor assignments, and parent dispatch records"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Active Intervention Workflows
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track progress across faculty mentor meetings, remedial classes, and parent communication
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setSelectedStudentForModal(students[0])}
              className="gap-2 shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" /> Create New Intervention
            </Button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab('critical')}
              className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 ${
                activeTab === 'critical'
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border-b-2 border-red-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" /> Critical Students ({criticalList.length})
            </button>
            <button
              onClick={() => setActiveTab('attention')}
              className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 ${
                activeTab === 'attention'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-b-2 border-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" /> Needs Attention ({attentionList.length})
            </button>
            <button
              onClick={() => setActiveTab('improved')}
              className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 ${
                activeTab === 'improved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Recently Improved ({improvedList.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-t-xl transition-all flex items-center gap-2 ${
                activeTab === 'alerts'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Parent Alert History ({parentAlerts.length})
            </button>
          </div>

          {/* Interventions Cards/Table List */}
          {activeTab !== 'alerts' ? (
            <div className="space-y-4">
              {(activeTab === 'critical' ? criticalList : activeTab === 'attention' ? attentionList : improvedList).map((item) => (
                <Card key={item.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-5">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {item.studentName}
                        </h3>
                        <Badge level={item.riskLevel} />
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                            : item.status === 'In Progress'
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        <strong className="text-slate-900 dark:text-slate-200">Department:</strong> {item.department} • <strong className="text-slate-900 dark:text-slate-200">Primary Issue:</strong> {item.primaryProblem}
                      </p>

                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                        <strong>Strategy:</strong> {item.recommendedIntervention} • Assigned to {item.assignedFaculty}
                      </p>

                      {item.notes && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg mt-2">
                          &quot;{item.notes}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const target = students.find((s) => s.name === item.studentName) || students[0];
                          router.push(`/student/${target.id}`);
                        }}
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Student
                      </Button>

                      {item.status !== 'Completed' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkCompleted(item.id, item.studentName)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Completed
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const target = students.find((s) => s.name === item.studentName) || students[0];
                          setSelectedStudentForAlert(target);
                        }}
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" /> Parent Alert
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Parent Alert History Log */
            <Card>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                Guardian Communication Log
              </h3>
              {parentAlerts.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                  No parent alert notifications dispatched yet. Use the &quot;Parent Alert&quot; button to send notices.
                </p>
              ) : (
                <div className="space-y-3">
                  {parentAlerts.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-start text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{log.studentName}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                            {log.type}
                          </span>
                          <span className="text-slate-400 text-[11px]">{log.sentAt}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-1 font-mono text-[11px] leading-relaxed">
                          {log.message}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <InterventionModal
        isOpen={!!selectedStudentForModal}
        onClose={() => setSelectedStudentForModal(null)}
        student={selectedStudentForModal}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />
      <ParentAlertModal
        isOpen={!!selectedStudentForAlert}
        onClose={() => setSelectedStudentForAlert(null)}
        student={selectedStudentForAlert}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />
      <KalvikkanChatDrawer isOpen={chatDrawerOpen} onClose={() => setChatDrawerOpen(false)} />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
