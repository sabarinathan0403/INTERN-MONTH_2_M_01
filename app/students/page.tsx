'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { StudentTable } from '@/components/dashboard/StudentTable';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { InterventionModal } from '@/components/interventions/InterventionModal';
import { ParentAlertModal } from '@/components/interventions/ParentAlertModal';
import { AddStudentModal } from '@/components/students/AddStudentModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { useKalvikkanStore } from '@/lib/store';
import { Student, RiskLevel, Department } from '@/types';
import { Search, Filter, SlidersHorizontal, UserPlus } from 'lucide-react';

export default function StudentsDirectoryPage() {
  const { students, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'attendance' | 'name'>('score');

  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<Student | null>(null);
  const [selectedStudentForAlert, setSelectedStudentForAlert] = useState<Student | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  // Filter & Sort logic
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.emis.includes(searchQuery) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
    const matchesDept = deptFilter === 'ALL' || s.department === deptFilter;

    return matchesSearch && matchesRisk && matchesDept;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'score') return a.predictedScore - b.predictedScore; // lowest first (highest risk first)
    if (sortBy === 'attendance') return a.attendance - b.attendance;
    return a.name.localeCompare(b.name);
  });

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
          title="Students Directory"
          subtitle={`Total ${students.length} students enrolled across 8 engineering departments`}
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                All Enrolled Students
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filter by risk, department, or add newly registered students into the AI engine
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setAddStudentOpen(true)}
              className="gap-2 shadow-md shadow-blue-600/20"
            >
              <UserPlus className="w-4 h-4" /> Add Student
            </Button>
          </div>

          {/* Search & Filter Controls */}
          <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter student name or EMIS..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Risk Level Filter */}
              <div>
                <select
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Risk Levels ({students.length})</option>
                  <option value="HIGH">High Risk ({students.filter((s) => s.riskLevel === 'HIGH').length})</option>
                  <option value="MEDIUM">Medium Risk ({students.filter((s) => s.riskLevel === 'MEDIUM').length})</option>
                  <option value="LOW">Low Risk ({students.filter((s) => s.riskLevel === 'LOW').length})</option>
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="ALL">All Departments</option>
                  <option value="AI & DS">AI &amp; DS</option>
                  <option value="AI & ML">AI &amp; ML</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="EEE">EEE</option>
                  <option value="IT">IT</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'score' | 'attendance' | 'name')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="score">Sort by: Lowest Score First</option>
                  <option value="attendance">Sort by: Lowest Attendance First</option>
                  <option value="name">Sort by: Student Name A-Z</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Table display */}
          <StudentTable
            students={sortedStudents}
            onOpenInterventionModal={(st) => setSelectedStudentForIntervention(st)}
            onOpenParentAlertModal={(st) => setSelectedStudentForAlert(st)}
          />
        </main>
      </div>

      <AddStudentModal
        isOpen={addStudentOpen}
        onClose={() => setAddStudentOpen(false)}
        onSuccessToast={(msg) => setToastMessage(msg)}
      />

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
