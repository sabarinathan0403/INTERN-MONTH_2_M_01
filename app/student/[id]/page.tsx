'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { InterventionModal } from '@/components/interventions/InterventionModal';
import { ParentAlertModal } from '@/components/interventions/ParentAlertModal';
import { RemedialPlanModal } from '@/components/students/RemedialPlanModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { useKalvikkanStore } from '@/lib/store';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Hash,
  AlertTriangle,
  Award,
  Calendar,
  Sparkles,
  ArrowLeft,
  BookOpen,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { students, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const [interventionModalOpen, setInterventionModalOpen] = useState(false);
  const [parentAlertModalOpen, setParentAlertModalOpen] = useState(false);
  const [remedialModalOpen, setRemedialModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  const studentId = params?.id as string;
  const student = students.find((s) => s.id === studentId) || students[0];

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
          title={`Student Profile • ${student.name}`}
          subtitle={`Department of ${student.department} • EMIS: ${student.emis}`}
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Back button & Action buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Students
            </button>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setInterventionModalOpen(true)}
                className="gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Start Intervention
              </Button>
              <Button
                variant="secondary"
                onClick={() => setParentAlertModalOpen(true)}
                className="gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" /> Parent Alert
              </Button>
              <Button
                variant="outline"
                onClick={() => setRemedialModalOpen(true)}
                className="gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" /> Remedial Plan
              </Button>
            </div>
          </div>

          {/* Student Profile Identity Card */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      {student.name}
                    </h2>
                    <Badge level={student.riskLevel} />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                    {student.department} • Year {student.year}, Section {student.section} • Class Advisor: {student.mentorName}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-blue-600" /> EMIS: {student.emis}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-600" /> {student.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> {student.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" /> Aadhar: {student.aadhar}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6 shrink-0">
                <div className="text-center px-3">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Predicted Final</span>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block">{student.predictedScore}%</span>
                </div>
                <div className="text-center px-3 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">Attendance</span>
                  <span className={`text-3xl font-black block ${student.attendance < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {student.attendance}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Explainable AI Section: Why is this student at risk? */}
          <Card className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-indigo-900/60 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <h3 className="text-base font-bold text-white">
                Explainable Risk Analysis (Why is this student flagged?)
              </h3>
            </div>
            <p className="text-xs text-indigo-200/90 mb-4">
              Kalvikkan AI does not return a dark-box score. Below are the contributing factors generated for {student.name}:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {student.riskFactors.map((rf, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-800/50 flex items-start gap-3"
                >
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shrink-0 mt-0.5 ${
                      rf.impact === 'HIGH IMPACT'
                        ? 'bg-red-600 text-white'
                        : rf.impact === 'MEDIUM IMPACT'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {rf.impact}
                  </span>
                  <div>
                    <span className="font-bold text-xs text-white block">{rf.factor}</span>
                    <p className="text-xs text-slate-300 mt-0.5">{rf.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance Trend Chart + Subject Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <PerformanceChart />
            </div>

            <div className="lg:col-span-5">
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    Subject-wise Scores
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Current internal assessment and attendance per subject
                  </p>

                  <div className="space-y-3">
                    {student.subjects.map((sub) => (
                      <div key={sub.code} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-slate-900 dark:text-white">{sub.code} - {sub.name}</span>
                          <span className={`font-black ${sub.score < 60 ? 'text-red-600' : 'text-slate-900 dark:text-white'}`}>
                            {sub.score}% (Grade {sub.grade})
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${sub.score < 60 ? 'bg-red-500' : 'bg-blue-600'}`}
                            style={{ width: `${sub.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <InterventionModal
        isOpen={interventionModalOpen}
        onClose={() => setInterventionModalOpen(false)}
        student={student}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />
      <ParentAlertModal
        isOpen={parentAlertModalOpen}
        onClose={() => setParentAlertModalOpen(false)}
        student={student}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />
      <RemedialPlanModal
        isOpen={remedialModalOpen}
        onClose={() => setRemedialModalOpen(false)}
        student={student}
      />
      <KalvikkanChatDrawer
        isOpen={chatDrawerOpen}
        onClose={() => setChatDrawerOpen(false)}
      />

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
