'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { RemedialPlanModal } from '@/components/students/RemedialPlanModal';
import { PeerMentorCard } from '@/components/students/PeerMentorCard';
import { DocumentUploadModal } from '@/components/upload/DocumentUploadModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { useKalvikkanStore } from '@/lib/store';
import {
  Award,
  TrendingUp,
  AlertTriangle,
  Calendar,
  BookOpen,
  CheckCircle,
  Sparkles,
  Bot,
  Upload,
  FileCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';

export default function StudentDashboard() {
  const { students, loggedStudentId, currentUser, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const [remedialModalOpen, setRemedialModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  // Student Account Privacy Isolation:
  // Match student by loggedStudentId or currentUser email
  const student =
    students.find(
      (s) =>
        (currentUser && currentUser.role === 'student' && (s.email.toLowerCase() === currentUser.email?.toLowerCase() || s.id === currentUser.studentId)) ||
        s.id === loggedStudentId
    ) || students[0];

  const studentDisplayName = currentUser?.name || student.name;
  const studentDisplayId = student.emis || student.id;

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
          title={`Private Student Portal • ${studentDisplayName}`}
          subtitle={`Department of ${student.department} • EMIS / ID: ${studentDisplayId}`}
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 border border-amber-500/30 ring-1 ring-amber-400/20 text-white shadow-2xl shadow-indigo-950/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-black border border-blue-400/30 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                  <Lock className="w-3 h-3 text-emerald-400" /> Verified Student Account
                </span>
                <span className="text-xs text-slate-300">AY 2025-2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black">Welcome back, {studentDisplayName}!</h2>
              <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
                Kalvikkan AI has evaluated your internal scores, attendance, and uploaded certificates. Upload new marksheets or certificates below to boost your prediction score!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button
                variant="primary"
                onClick={() => setUploadModalOpen(true)}
                className="gap-2 shadow-lg shadow-blue-500/30"
              >
                <Upload className="w-4 h-4" /> Upload Document / Certificate
              </Button>
              <Button
                variant="secondary"
                onClick={() => setRemedialModalOpen(true)}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Remedial Plan
              </Button>
            </div>
          </div>

          {/* Student KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <KpiCard
              title="Overall Performance"
              value={`${student.predictedScore}%`}
              subtitle="Current assessment score"
              icon={Award}
              colorVariant="blue"
            />
            <KpiCard
              title="Predicted Final Score"
              value={`${Math.min(100, student.predictedScore + 4)}%`}
              subtitle="End Semester AI Forecast"
              icon={TrendingUp}
              colorVariant="emerald"
            />
            <KpiCard
              title="Risk Status"
              value={student.riskLevel}
              subtitle="Attendance &amp; Math factor"
              icon={AlertTriangle}
              colorVariant={student.riskLevel === 'HIGH' ? 'red' : student.riskLevel === 'MEDIUM' ? 'amber' : 'emerald'}
            />
            <KpiCard
              title="Attendance"
              value={`${student.attendance}%`}
              subtitle="Threshold: 75%"
              icon={Calendar}
              colorVariant={student.attendance < 75 ? 'red' : 'blue'}
            />
          </div>

          {/* Performance Trend + AI Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <PerformanceChart />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <Card className="bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Kalvikkan AI Action Plan
                  </h3>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 font-semibold text-amber-900 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Practice Mathematics for 30 minutes daily (Current Weakest Subject).</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Complete pending DBMS assignment backlog before Friday.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Maintain overall attendance above institutional threshold (75%).</span>
                  </li>
                </ul>
              </Card>

              {/* Uploaded Documents & Certificates Card */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600" /> My Verified Documents &amp; Certificates
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    {student.documents?.length || 0} File(s)
                  </span>
                </div>

                {(!student.documents || student.documents.length === 0) ? (
                  <p className="text-xs text-slate-500 py-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    No documents uploaded yet. Upload your NPTEL certificate, marksheet, or transcript to boost AI score!
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {student.documents.map((doc) => (
                      <div key={doc.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">{doc.title}</span>
                          <span className="text-[10px] text-slate-500">{doc.category} • Uploaded {doc.uploadDate}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Peer Mentor Card */}
              <PeerMentorCard
                targetStudent={student}
                onAssignSuccess={() => setToastMessage('Peer mentor assigned successfully!')}
              />
            </div>
          </div>

          {/* Subject Performance Breakdown */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subject-wise Performance Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {student.subjects.map((sub) => (
                <Card
                  key={sub.name}
                  className={`relative overflow-hidden transition-all ${
                    sub.score < 60
                      ? 'border-2 border-red-500 bg-red-50/30 dark:bg-red-950/20'
                      : 'border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {sub.name}
                    </span>
                    {sub.score < 60 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-600 text-white">
                        WEAKEST
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">
                    {sub.score}%
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        sub.score < 60 ? 'bg-red-500' : sub.score > 75 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${sub.score}%` }}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <RemedialPlanModal
        isOpen={remedialModalOpen}
        onClose={() => setRemedialModalOpen(false)}
        student={student}
      />
      <DocumentUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        student={student}
        onSuccessToast={(msg) => setToastMessage(msg)}
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
