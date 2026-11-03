'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Menu, User, CheckCircle2, AlertTriangle, ChevronDown, Download, FileSpreadsheet, Sun, Moon } from 'lucide-react';
import { useKalvikkanStore } from '@/lib/store';
import { downloadRoleReport } from '@/lib/reportGenerator';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenSearch: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileNav,
  onOpenSearch,
  title = 'Faculty Dashboard',
  subtitle = 'Predict Early. Intervene Smartly. Improve Student Success.',
}) => {
  const router = useRouter();
  const { role, notifications, students, interventions, loggedStudentId, theme, toggleTheme } = useKalvikkanStore();
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (path?: string) => {
    setShowNotifPopover(false);
    if (path) router.push(path);
  };

  const handleDownloadReport = () => {
    const activeStudent = students.find((s) => s.id === loggedStudentId) || students[0];
    downloadRoleReport(role, activeStudent, students, interventions);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-gold-500/60 dark:border-gold-500/40 px-4 lg:px-8 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action items */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium transition-all"
        >
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="hidden sm:inline">Search students, EMIS, risk...</span>
          <span className="sm:hidden">Search</span>
        </button>

        {/* Download Role Report Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadReport}
          className="hidden md:flex items-center gap-1.5 text-xs font-bold border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
          title="Download Official Role Report (PDF / Print)"
        >
          <Download className="w-3.5 h-3.5" /> Download Report
        </Button>

        {/* Dark / Bright mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 dark:from-blue-900 dark:to-blue-800 text-gold-700 dark:text-gold-300 border border-gold-400/60 hover:scale-105 transition-all"
          aria-label="Toggle dark / bright mode"
          title={theme === 'dark' ? 'Switch to Bright mode' : 'Switch to Dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifPopover(!showNotifPopover)}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifPopover && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Notifications
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                  {unreadCount} New
                </span>
              </div>

              <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.targetPath)}
                    className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className="flex items-start gap-2.5">
                      {notif.type === 'critical' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      ) : notif.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Bell className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {role === 'faculty' ? 'FC' : role === 'student' ? 'ST' : 'AD'}
            </div>
            <div className="hidden md:block text-left">
              <span className="text-xs font-bold block leading-tight text-slate-900 dark:text-white capitalize">
                {role === 'faculty' ? 'Dr. S. Ramanathan' : role === 'student' ? 'Naveen Kumar' : 'System Admin'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block capitalize">
                {role} Account
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="font-bold text-slate-900 dark:text-white">KALVIKKAN AI</p>
                <p className="text-slate-400 text-[11px]">Logged in as {role}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={handleDownloadReport}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2 font-semibold"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" /> Download {role.toUpperCase()} Report
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={() => { setShowProfileMenu(false); router.push('/'); }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 font-semibold"
                >
                  Log Out / Portal Select
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
