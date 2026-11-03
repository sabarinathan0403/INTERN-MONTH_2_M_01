'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { AIInsightCard } from '@/components/dashboard/AIInsightCard';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { InterventionModal } from '@/components/interventions/InterventionModal';
import { ParentAlertModal } from '@/components/interventions/ParentAlertModal';
import { DocumentUploadModal } from '@/components/upload/DocumentUploadModal';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useKalvikkanStore } from '@/lib/store';
import { Student } from '@/types';
import { Users, AlertTriangle, ShieldAlert, Award, Calendar, CheckCircle2, Upload, Sparkles, UserPlus } from 'lucide-react';

export default function FacultyDashboard() {
  const { students, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [batchUploadOpen, setBatchUploadOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<Student | null>(null);
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  const lowRiskCount = students.filter((s) => s.riskLevel === 'LOW').length;
  const mediumRiskCount = students.filter((s) => s.riskLevel === 'MEDIUM').length;
  const highRiskCount = students.filter((s) => s.riskLevel === 'HIGH').length;

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
          title="Faculty Dashboard"
          subtitle="AI Early Warning & Intervention Center • Institution-wide Risk Monitoring"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Action Bar with Add Student and Batch Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Faculty Overview
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View student predictions, add individual students, or upload class marksheets to trigger live batch predictions
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setAddStudentOpen(true)}
                className="gap-2 shadow-md shadow-blue-600/20"
              >
                <UserPlus className="w-4 h-4" /> Add Student
              </Button>
              <Button
                variant="outline"
                onClick={() => setBatchUploadOpen(true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" /> Batch Upload Dataset
              </Button>
            </div>
          </div>

          {/* Main KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard
              title="Total Students"
              value={students.length}
              subtitle="Enrolled cohort"
              icon={Users}
              colorVariant="blue"
            />
            <KpiCard
              title="Low Risk"
              value={lowRiskCount}
              subtitle="On track (>75%)"
              icon={CheckCircle2}
              colorVariant="emerald"
            />
            <KpiCard
              title="Medium Risk"
              value={mediumRiskCount}
              subtitle="Requires monitoring"
              icon={AlertTriangle}
              colorVariant="amber"
            />
            <KpiCard
              title="High Risk"
              value={highRiskCount}
              subtitle="Needs immediate help"
              icon={ShieldAlert}
              colorVariant="red"
            />
            <KpiCard
              title="Avg Score"
              value="72.8%"
              subtitle="Institutional average"
              icon={Award}
              colorVariant="purple"
            />
            <KpiCard
              title="Avg Attendance"
              value="81.4%"
              subtitle="Threshold 75%"
              icon={Calendar}
              colorVariant="blue"
            />
          </div>

          {/* AI Insight Card + Risk Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <AIInsightCard />
            </div>
            <div className="lg:col-span-5">
              <RiskChart />
            </div>
          </div>

          {/* Performance Overview Line Chart */}
          <div className="w-full">
            <PerformanceChart />
          </div>

          {/* High Risk / Students Requiring Attention Table */}
          <div className="w-full">
            <StudentTable
              students={students}
              limit={10}
              onOpenInterventionModal={(st) => setSelectedStudentForIntervention(st)}
              onOpenParentAlertModal={(st) => setSelectedStudentForAlert(st)}
            />
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <InterventionModal
        isOpen={!!selectedStudentForIntervention}
        onClose={() => setSelectedStudentForIntervention(null)}
        student={selectedStudentForIntervention}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <ParentAlertModal
        isOpen={!!selectedStudentForAlert}
        onClose={() => setSelectedStudentForAlert(null)}
        student={selectedStudentForAlert}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <DocumentUploadModal
        isOpen={batchUploadOpen}
        onClose={() => setBatchUploadOpen(false)}
        isBatchFacultyMode={true}
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
