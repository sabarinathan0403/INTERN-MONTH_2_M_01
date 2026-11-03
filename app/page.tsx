'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  BrainCircuit,
  Lock,
  Mail,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  Key,
  UserPlus,
  Phone,
  Hash,
  Building2,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useKalvikkanStore } from '@/lib/store';
import { Department, Role } from '@/types';
import { KalvikkanLogo } from '@/components/ui/KalvikkanLogo';
import { HeroCarousel } from '@/components/landing/HeroCarousel';
import { FloatingBackground } from '@/components/ui/FloatingBackground';

export default function LandingPage() {
  const router = useRouter();
  const { loginWithCredentials, registerUser } = useKalvikkanStore();

  // Primary tab is Sign Up first, then Account Login ("sign up option starting la irukanum")
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Sign Up form state
  const [signupRole, setSignupRole] = useState<Role>('student');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupDept, setSignupDept] = useState<Department>('AI & DS');

  // Student specific sign up fields
  const [signupYear, setSignupYear] = useState<number>(1);
  const [signupSection, setSignupSection] = useState('A');
  const [signupEmis, setSignupEmis] = useState('');
  const [signupAadhar, setSignupAadhar] = useState('');
  const [signupGuardianPhone, setSignupGuardianPhone] = useState('');
  const [signupAttendance, setSignupAttendance] = useState(85);
  const [signupPreviousScore, setSignupPreviousScore] = useState(78);

  // Faculty specific sign up fields
  const [signupFacultyRole, setSignupFacultyRole] = useState('Class Advisor');
  const [signupFacultyId, setSignupFacultyId] = useState('');

  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleCredentialLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both your registered Email/EMIS ID and Password.');
      return;
    }

    const success = loginWithCredentials(emailInput, passwordInput, selectedRole);
    if (success) {
      if (selectedRole === 'student') router.push('/student');
      else if (selectedRole === 'admin') router.push('/admin');
      else router.push('/faculty');
    } else {
      setLoginError(
        'Invalid login credentials. If you have not created an account yet, please click "Sign Up" first to register.'
      );
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    if (!signupName.trim()) {
      setSignupError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setSignupError('Please enter a valid email address.');
      return;
    }
    if (!signupPassword) {
      setSignupError('Please enter a password.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }
    if (signupRole === 'student' && !signupEmis.trim()) {
      setSignupError('Please enter student EMIS / Register Number (e.g. ENG0001).');
      return;
    }

    const res = registerUser({
      role: signupRole,
      name: signupName,
      email: signupEmail,
      password: signupPassword,
      department: signupDept,
      phone: signupPhone,
      emis: signupEmis,
      aadhar: signupAadhar,
      year: signupYear,
      section: signupSection,
      guardianPhone: signupGuardianPhone,
      attendance: signupAttendance,
      previousScore: signupPreviousScore,
      facultyRole: signupFacultyRole,
      facultyId: signupFacultyId,
    });

    if (res.success) {
      setSignupSuccess(`Account registered as ${signupRole.toUpperCase()}! Switching to Login...`);
      setTimeout(() => {
        setSelectedRole(signupRole);
        setEmailInput(signupEmail);
        setPasswordInput('');
        setActiveTab('login');
        setSignupSuccess('');
      }, 1000);
    } else {
      setSignupError(res.error || 'Failed to register account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Floating icons: above this page's dark background, below the content (z-10) */}
      <FloatingBackground front />
      {/* Ambient Gradient Lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-amber-600/10 via-purple-600/10 to-transparent rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(30,58,138,0.08)_0%,_transparent_70%)] pointer-events-none" />

      {/* Official Brand Header Bar */}
      <header className="px-6 lg:px-12 py-3.5 flex items-center justify-between z-10 border-b border-amber-500/20 bg-slate-950/80 backdrop-blur-xl">
        <KalvikkanLogo size="md" lightText />

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-bold uppercase tracking-wider">
            AI Student Early Warning Portal
          </span>
        </div>
      </header>

      {/* Main Hero & Auth Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Moving Images & Hero Slide Banner */}
        <div className="lg:col-span-7 relative">
          <HeroCarousel />
        </div>

        {/* Right Column: Multi-Role Auth Card with Sign Up & Sign In */}
        <div className="lg:col-span-5 relative z-10">
          <div className="bg-slate-900/90 border border-amber-500/30 ring-1 ring-amber-400/20 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-950/90 relative overflow-hidden backdrop-blur-2xl">
            {/* Top Golden Light Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

            {/* Top Navigation Tabs: Sign Up is First, Followed by Sign In */}
            <div className="flex items-center border-b border-slate-800 pb-3 mb-5 gap-6">
              <button
                onClick={() => {
                  setActiveTab('signup');
                  setSignupError('');
                }}
                className={`text-xs font-black pb-2 border-b-2 transition-all flex items-center gap-1.5 uppercase tracking-wider ${
                  activeTab === 'signup'
                    ? 'border-emerald-500 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                Sign Up
              </button>

              <button
                onClick={() => {
                  setActiveTab('login');
                  setLoginError('');
                }}
                className={`text-xs font-black pb-2 border-b-2 transition-all flex items-center gap-1.5 uppercase tracking-wider ${
                  activeTab === 'login'
                    ? 'border-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Sign In
              </button>
            </div>

            {/* TAB 1: SIGN UP (Starting Option) */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3 max-h-[72vh] overflow-y-auto pr-1">
                {/* Role Selector for Sign Up */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Register As:
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSignupRole('student')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        signupRole === 'student' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole('faculty')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        signupRole === 'faculty' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupRole('admin')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        signupRole === 'admin' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Common Fields: Name, Email */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Official / Registered Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your.email@edu.in"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Department *
                  </label>
                  <select
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value as Department)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="AI & DS">AI &amp; DS (Artificial Intelligence &amp; Data Science)</option>
                    <option value="AI & ML">AI &amp; ML (Artificial Intelligence &amp; Machine Learning)</option>
                    <option value="CSE">CSE (Computer Science &amp; Engineering)</option>
                    <option value="ECE">ECE (Electronics &amp; Communication)</option>
                    <option value="EEE">EEE (Electrical &amp; Electronics)</option>
                    <option value="MECH">MECH (Mechanical Engineering)</option>
                    <option value="IT">IT (Information Technology)</option>
                    <option value="CIVIL">CIVIL (Civil Engineering)</option>
                  </select>
                </div>

                {/* STUDENT-SPECIFIC DETAILS */}
                {signupRole === 'student' && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Student Academic Details
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Year</label>
                        <select
                          value={signupYear}
                          onChange={(e) => setSignupYear(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value={1}>1st Year</option>
                          <option value={2}>2nd Year</option>
                          <option value={3}>3rd Year</option>
                          <option value={4}>4th Year</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Section</label>
                        <select
                          value={signupSection}
                          onChange={(e) => setSignupSection(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="A">Section A</option>
                          <option value="B">Section B</option>
                          <option value="C">Section C</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">EMIS / Reg No *</label>
                        <input
                          type="text"
                          value={signupEmis}
                          onChange={(e) => setSignupEmis(e.target.value)}
                          placeholder="e.g. ENG0001"
                          required
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Mobile Phone</label>
                        <input
                          type="text"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          placeholder="+91 98401 22334"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Initial Attendance (%)</label>
                        <input
                          type="number"
                          min="30"
                          max="100"
                          value={signupAttendance}
                          onChange={(e) => setSignupAttendance(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Previous Score (%)</label>
                        <input
                          type="number"
                          min="30"
                          max="100"
                          value={signupPreviousScore}
                          onChange={(e) => setSignupPreviousScore(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* FACULTY-SPECIFIC DETAILS */}
                {signupRole === 'faculty' && (
                  <div className="space-y-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Faculty Profile Details
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Designation / Role</label>
                        <select
                          value={signupFacultyRole}
                          onChange={(e) => setSignupFacultyRole(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        >
                          <option value="Class Advisor">Class Advisor</option>
                          <option value="Head of Department">Head of Department</option>
                          <option value="Senior Professor">Senior Professor</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Mentor">Student Mentor</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">Faculty ID Code</label>
                        <input
                          type="text"
                          value={signupFacultyId}
                          onChange={(e) => setSignupFacultyId(e.target.value)}
                          placeholder="FAC-201"
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-300 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="+91 98401 55667"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Feedback Messages */}
                {signupError && (
                  <p className="text-xs text-red-400 font-semibold bg-red-950/60 p-2 rounded-lg border border-red-800/60">
                    {signupError}
                  </p>
                )}

                {signupSuccess && (
                  <p className="text-xs text-emerald-300 font-semibold bg-emerald-950/60 p-2 rounded-lg border border-emerald-800/60 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {signupSuccess}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full py-2.5 font-bold gap-2 text-sm bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
                >
                  <UserPlus className="w-4 h-4" /> Create {signupRole.toUpperCase()} Account
                </Button>

                {/* Back to Login link */}
                <div className="pt-2 text-center border-t border-slate-800/80">
                  <p className="text-xs text-slate-400">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-blue-400 hover:text-blue-300 font-bold underline transition-colors"
                    >
                      Sign In here
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: SIGN IN (Strict Credential Sign In - No Demo Shortcuts) */}
            {activeTab === 'login' && (
              <form onSubmit={handleCredentialLogin} className="space-y-4">
                {/* Role Selector Buttons */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Select Account Role
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('student');
                        setLoginError('');
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedRole === 'student' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Student
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('faculty');
                        setLoginError('');
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedRole === 'faculty' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Faculty
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRole('admin');
                        setLoginError('');
                      }}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedRole === 'admin' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {/* Email / EMIS ID */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {selectedRole === 'student' ? 'Student Registered Email or EMIS ID' : 'Official Registered Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'e.g. ENG0001 or student email' : 'e.g. faculty@edu.in'}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter account password"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-xs text-red-400 font-semibold bg-red-950/60 p-2.5 rounded-lg border border-red-800/60 leading-relaxed">
                    {loginError}
                  </p>
                )}

                <Button type="submit" variant="primary" className="w-full py-2.5 font-black gap-2 text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white shadow-xl shadow-indigo-900/50 border border-amber-400/30 transition-all">
                  Sign In to {selectedRole.toUpperCase()} Portal <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Sign up prompt link */}
                <div className="pt-2 text-center border-t border-slate-800/80">
                  <p className="text-xs text-slate-400">
                    Don&apos;t have an account yet?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('signup');
                        setSignupRole(selectedRole);
                      }}
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
                    >
                      Sign Up here first
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 lg:px-12 py-4 border-t border-slate-800/80 text-center text-xs text-slate-500 z-10 bg-slate-950/60 backdrop-blur-sm">
        KALVIKKAN AI © 2026 • AI-Based Student Performance Prediction and Early Intervention System
      </footer>
    </div>
  );
}
