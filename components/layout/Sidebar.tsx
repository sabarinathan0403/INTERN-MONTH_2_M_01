'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BrainCircuit,
  AlertTriangle,
  BarChart3,
  Settings,
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Bot,
  Download
} from 'lucide-react';
import { useKalvikkanStore } from '@/lib/store';
import { Role } from '@/types';
import { KalvikkanLogo } from '@/components/ui/KalvikkanLogo';
import { downloadRoleReport } from '@/lib/reportGenerator';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  onOpenAiAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, onOpenAiAssistant }) => {
  const pathname = usePathname();
  const { role, switchRole, theme, toggleTheme, students, interventions, loggedStudentId } = useKalvikkanStore();

  const getDashboardPath = () => {
    if (role === 'student') return '/student';
    if (role === 'admin') return '/admin';
    return '/faculty';
  };

  const navItems = [
    { name: 'Dashboard', href: getDashboardPath(), icon: LayoutDashboard },
    { name: 'Students Directory', href: '/students', icon: Users },
    { name: 'AI Prediction', href: '/predict', icon: BrainCircuit },
    { name: 'Intervention Center', href: '/interventions', icon: AlertTriangle },
    { name: 'Analytics & Trends', href: '/analytics', icon: BarChart3 },
    { name: 'Settings & Model', href: '/settings', icon: Settings },
  ];

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
  };

  const handleDownload = () => {
    const activeStudent = students.find((s) => s.id === loggedStudentId) || students[0];
    downloadRoleReport(role, activeStudent, students, interventions);
  };

  const content = (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-slate-300 w-64 border-r-2 border-gold-500/50">
      {/* Official Kalvikkan Logo Header */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/">
          <KalvikkanLogo size="md" lightText />
        </Link>
      </div>

      {/* Role Switcher Badge */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/40">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          Active Role Portal
        </label>
        <div className="grid grid-cols-3 gap-1 bg-slate-800/90 p-1 rounded-lg">
          <button
            onClick={() => handleRoleChange('faculty')}
            className={`py-1 text-xs font-medium rounded ${
              role === 'faculty' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:text-white text-slate-400'
            }`}
          >
            Faculty
          </button>
          <button
            onClick={() => handleRoleChange('student')}
            className={`py-1 text-xs font-medium rounded ${
              role === 'student' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:text-white text-slate-400'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`py-1 text-xs font-medium rounded ${
              role === 'admin' ? 'bg-blue-600 text-white font-bold shadow-xs' : 'hover:text-white text-slate-400'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/faculty');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-blue-950 font-bold shadow-md shadow-gold-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-950' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Report Download Trigger in Sidebar */}
        <button
          onClick={handleDownload}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 hover:border-emerald-500 transition-all mt-3"
        >
          <Download className="w-5 h-5 text-emerald-400" />
          <span>Download {role.toUpperCase()} Report</span>
        </button>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAiAssistant}
          className="w-full mt-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-indigo-300 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-700/50 hover:border-indigo-500 transition-all shadow-sm"
        >
          <Bot className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span>Kalvikkan AI Assistant</span>
          <Sparkles className="w-3.5 h-3.5 ml-auto text-amber-300" />
        </button>
      </nav>

      {/* Footer / Theme & Profile info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            {role === 'faculty' && <UserCheck className="w-4 h-4 text-emerald-400" />}
            {role === 'student' && <GraduationCap className="w-4 h-4 text-blue-400" />}
            {role === 'admin' && <ShieldCheck className="w-4 h-4 text-purple-400" />}
            <span className="capitalize">{role} Portal Active</span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>
        </div>

        <div className="text-[11px] text-slate-500 text-center border-t border-slate-800/60 pt-2">
          Kalvikkan System Online
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-slate-900 z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
