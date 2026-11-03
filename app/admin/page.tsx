'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { AddFacultyModal } from '@/components/admin/AddFacultyModal';
import { Toast } from '@/components/ui/Toast';
import { useKalvikkanStore } from '@/lib/store';
import { Department } from '@/types';
import {
  ShieldCheck,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Server,
  RefreshCw,
  UserCheck,
  UserPlus
} from 'lucide-react';

export default function AdminDashboard() {
  const { students, facultyList, interventions, resetAllData, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addFacultyOpen, setAddFacultyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  const departments: Department[] = ['AI & DS', 'AI & ML', 'CSE', 'ECE', 'IT', 'MECH', 'EEE', 'CIVIL'];
  const departmentPerformance = departments.map((deptName) => {
    const deptStudents = students.filter((s) => s.department === deptName);
    const count = deptStudents.length;
    const avgScore = count > 0
      ? Math.round((deptStudents.reduce((acc, s) => acc + s.predictedScore, 0) / count) * 10) / 10
      : 0;
    const highRisk = deptStudents.filter((s) => s.riskLevel === 'HIGH').length;
    return {
      name: deptName,
      avgScore,
      students: count,
      highRisk,
    };
  });

  const highRiskTotal = students.filter((s) => s.riskLevel === 'HIGH').length;

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
          title="Administrator Portal"
          subtitle="System overview, department performance, and student & faculty management"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Admin Management Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Administrator Control Hub
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enroll new students, register faculty advisors, and oversee institutional AI early warning metrics
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
                variant="secondary"
                onClick={() => setAddFacultyOpen(true)}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20 border-transparent"
              >
                <UserCheck className="w-4 h-4" /> Add Faculty
              </Button>
            </div>
          </div>

          {/* Main KPI Cards with live dynamic counts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard
              title="Total Students"
              value={students.length}
              subtitle="Registered in database"
              icon={Users}
              colorVariant="blue"
            />
            <KpiCard
              title="Faculty Roster"
              value={facultyList.length}
              subtitle="Active advisors & mentors"
              icon={UserCheck}
              colorVariant="purple"
            />
            <KpiCard
              title="Departments"
              value={6}
              subtitle="Engineering & Tech"
              icon={Building2}
              colorVariant="emerald"
            />
            <KpiCard
              title="High Risk Count"
              value={highRiskTotal}
              subtitle="Flagged by AI Model"
              icon={AlertTriangle}
              colorVariant="red"
            />
            <KpiCard
              title="Interventions"
              value={interventions.length}
              subtitle="Active workflows"
              icon={ShieldCheck}
              colorVariant="amber"
            />
          </div>

          {/* Department Performance Cards */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Department Academic Performance Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentPerformance.map((dept) => (
                <Card key={dept.name} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-extrabold text-base text-slate-900 dark:text-white">
                      {dept.name} Department
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {dept.students} Students
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-500 font-semibold">Average Score:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{dept.avgScore}%</span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full ${dept.avgScore > 75 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, Math.max(5, dept.avgScore))}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">High Risk Students:</span>
                    <span className="font-bold text-red-600 dark:text-red-400">{dept.highRisk}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Faculty Advisors Roster + System Status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Faculty Advisor &amp; Mentor Roster ({facultyList.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Supervising advisors assigned to student cohorts
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAddFacultyOpen(true)}
                    className="gap-1.5 text-xs text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> + Add Faculty
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
                        <th className="py-2.5 px-3">Faculty Name</th>
                        <th className="py-2.5 px-3">Department</th>
                        <th className="py-2.5 px-3">Role</th>
                        <th className="py-2.5 px-3 text-right">Assigned Students</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {facultyList.map((f) => (
                        <tr key={f.id || f.email}>
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            <div className="flex flex-col">
                              <span>{f.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal font-mono">
                                {f.email} {f.phone ? `• ${f.phone}` : ''}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">{f.department}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                              {f.role}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                            {f.studentsAssigned || 20}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-4">
              <Card className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      System Health &amp; Demo Controls
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Real-time local storage state &amp; simulation controls
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Model Engine:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Kalvikkan Early-Warning Active</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Active Students:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{students.length} Records</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Active Faculty:</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{facultyList.length} Faculty Members</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Platform:</span>
                      <span className="font-bold text-blue-600">Next.js 14 App Router</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    variant="danger"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => {
                      resetAllData();
                      setToastMessage('System data successfully reset to default seeds!');
                    }}
                  >
                    <RefreshCw className="w-4 h-4" /> Reset Demo Seed Data
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <AddFacultyModal
        isOpen={addFacultyOpen}
        onClose={() => setAddFacultyOpen(false)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
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
