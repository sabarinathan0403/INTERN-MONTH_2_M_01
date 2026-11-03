'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { RiskChart } from '@/components/dashboard/RiskChart';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { subjectComparisonData, departmentPerformanceData } from '@/data/mockAnalytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3, Users, Award, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

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
          title="Institutional Analytics"
          subtitle="Cohort performance trends, subject pass rates, and risk distribution"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <KpiCard
              title="Total Enrolled"
              value={120}
              subtitle="All departments"
              icon={Users}
              colorVariant="blue"
            />
            <KpiCard
              title="Average Score"
              value="72.8%"
              subtitle="+2.4% vs last assessment"
              icon={Award}
              colorVariant="purple"
            />
            <KpiCard
              title="Avg Attendance"
              value="81.4%"
              subtitle="Threshold: 75%"
              icon={Calendar}
              colorVariant="blue"
            />
            <KpiCard
              title="High Risk Count"
              value={13}
              subtitle="Action required"
              icon={AlertTriangle}
              colorVariant="red"
            />
            <KpiCard
              title="Improvement Rate"
              value="+14.2%"
              subtitle="Post-intervention"
              icon={TrendingUp}
              colorVariant="emerald"
            />
          </div>

          {/* Performance & Risk Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <PerformanceChart />
            </div>
            <div className="lg:col-span-4">
              <RiskChart />
            </div>
          </div>

          {/* Subject Performance & Department Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Subject Comparison Bar Chart */}
            <div className="lg:col-span-6">
              <Card className="h-full flex flex-col justify-between">
                <div className="mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Subject Performance Averages
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Mathematics visibly displays the highest risk lag
                  </p>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectComparisonData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '0.5rem',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="average" radius={[6, 6, 0, 0]}>
                        {subjectComparisonData.map((entry, index) => (
                          <Cell
                            key={`bar-${index}`}
                            fill={entry.subject === 'Mathematics' ? '#ef4444' : '#2563eb'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Department Comparison Cards */}
            <div className="lg:col-span-6">
              <Card className="h-full">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Department Risk &amp; Score Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  AI &amp; DS, CSE, ECE, MECH, EEE, IT break-downs
                </p>

                <div className="space-y-3">
                  {departmentPerformanceData.map((dept) => (
                    <div
                      key={dept.department}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{dept.department}</span>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {dept.totalStudents} enrolled students
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Score</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{dept.avgScore}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-red-500 uppercase font-bold block">High Risk</span>
                          <span className="font-extrabold text-red-600 dark:text-red-400">{dept.highRiskCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <KalvikkanChatDrawer isOpen={chatDrawerOpen} onClose={() => setChatDrawerOpen(false)} />
    </div>
  );
}
