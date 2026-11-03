'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useKalvikkanStore } from '@/lib/store';
import { Department, RiskLevel } from '@/types';
import {
  UserPlus,
  Sparkles,
  GraduationCap,
  Mail,
  Phone,
  Hash,
  BookOpen,
  Award,
  Activity,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (message: string) => void;
  defaultDepartment?: Department;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
  defaultDepartment = 'AI & DS',
}) => {
  const { addStudent } = useKalvikkanStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<Department>(defaultDepartment);
  const [year, setYear] = useState<number>(2);
  const [section, setSection] = useState<string>('A');
  const [emis, setEmis] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Performance metrics
  const [attendance, setAttendance] = useState<number>(85);
  const [previousScore, setPreviousScore] = useState<number>(75);
  const [assessmentScore, setAssessmentScore] = useState<number>(72);
  const [assignmentCompletion, setAssignmentCompletion] = useState<number>(80);
  const [quizScore, setQuizScore] = useState<number>(70);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick live estimate of score
  const estimatedScore = Math.round(
    previousScore * 0.4 +
    attendance * 0.2 +
    assignmentCompletion * 0.15 +
    assessmentScore * 0.15 +
    quizScore * 0.1
  );
  const estimatedRisk: RiskLevel =
    estimatedScore < 55 ? 'HIGH' : estimatedScore < 75 ? 'MEDIUM' : 'LOW';

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDepartment(defaultDepartment);
    setYear(2);
    setSection('A');
    setEmis('');
    setAadhar('');
    setGuardianPhone('');
    setAttendance(85);
    setPreviousScore(75);
    setAssessmentScore(72);
    setAssignmentCompletion(80);
    setQuizScore(70);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter the student\'s full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid student email address.');
      return;
    }
    if (!emis.trim()) {
      setFormError('Please enter a valid EMIS ID or Register Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = addStudent({
        name: name.trim(),
        department,
        year: Number(year),
        section: section.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || '+91 98400 11223',
        emis: emis.trim(),
        aadhar: aadhar.trim() || '4567 8901 2345',
        guardianPhone: guardianPhone.trim() || phone.trim() || '+91 98400 00000',
        attendance: Number(attendance),
        previousScore: Number(previousScore),
        assessmentScore: Number(assessmentScore),
        assignmentCompletion: Number(assignmentCompletion),
        quizScore: Number(quizScore),
      });

      if (onSuccessToast) {
        onSuccessToast(`Student "${created.name}" enrolled into ${created.department} with Predicted Score ${created.predictedScore}% (${created.riskLevel} Risk)!`);
      }

      resetForm();
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Student"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Header summary banner with real-time AI prediction preview */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Live AI Risk Scoring Preview
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calculated automatically from attendance and marks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estimated Score
              </span>
              <span className="text-base font-extrabold text-blue-600 dark:text-blue-400">
                {estimatedScore}%
              </span>
            </div>
            <Badge level={estimatedRisk} />
          </div>
        </div>

        {formError && (
          <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold">
            {formError}
          </div>
        )}

        {/* Section 1: Basic Student Profile */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" /> 1. Basic Student Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Student Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Student Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh.k@edu.in"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Year & Section */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Section
                </label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                </select>
              </div>
            </div>

            {/* EMIS ID */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                EMIS / Register Number *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={emis}
                  onChange={(e) => setEmis(e.target.value)}
                  placeholder="330201004521"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Student Mobile Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98401 54321"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            {/* Aadhar */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Aadhar Card Number
              </label>
              <input
                type="text"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                placeholder="4321 8765 2109"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Parent / Guardian Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+91 94440 12345"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Academic Metrics & Attendance */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" /> 2. Academic Performance &amp; Attendance Metrics
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Attendance */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Attendance (%): <span className="text-blue-600 font-extrabold">{attendance}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Previous Exam Score */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Previous Exam (%): <span className="text-indigo-600 font-extrabold">{previousScore}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={previousScore}
                onChange={(e) => setPreviousScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Assessment Score */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Internal Assessment (%): <span className="text-emerald-600 font-extrabold">{assessmentScore}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={assessmentScore}
                onChange={(e) => setAssessmentScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Assignment Completion */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Assignment Completion: <span className="text-purple-600 font-extrabold">{assignmentCompletion}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={assignmentCompletion}
                onChange={(e) => setAssignmentCompletion(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Quiz Score */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1">
                Continuous Micro-Quiz (%): <span className="text-amber-600 font-extrabold">{quizScore}%</span>
              </label>
              <input
                type="range"
                min="30"
                max="100"
                value={quizScore}
                onChange={(e) => setQuizScore(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2 shadow-md shadow-blue-600/25">
            <UserPlus className="w-4 h-4" />
            {isSubmitting ? 'Registering Student...' : 'Add Student to Kalvikkan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
