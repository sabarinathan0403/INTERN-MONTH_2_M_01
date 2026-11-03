'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useKalvikkanStore } from '@/lib/store';
import { Department } from '@/types';
import {
  UserCheck,
  Mail,
  Phone,
  Building2,
  Briefcase,
  ShieldCheck,
  Hash,
  Users
} from 'lucide-react';

interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (message: string) => void;
}

export const AddFacultyModal: React.FC<AddFacultyModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const { addFaculty } = useKalvikkanStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState<Department>('AI & DS');
  const [role, setRole] = useState('Class Advisor');
  const [facultyId, setFacultyId] = useState('');
  const [studentsAssigned, setStudentsAssigned] = useState<number>(20);
  const [password, setPassword] = useState('faculty@123');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setDepartment('AI & DS');
    setRole('Class Advisor');
    setFacultyId('');
    setStudentsAssigned(20);
    setPassword('faculty@123');
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter faculty member\'s name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid official email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = addFaculty({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        department,
        role: role.trim(),
        phone: phone.trim() || '+91 98401 22334',
        facultyId: facultyId.trim() || `FAC-${Math.floor(100 + Math.random() * 900)}`,
        studentsAssigned: Number(studentsAssigned || 20),
        password: password.trim() || 'faculty@123',
      });

      if (onSuccessToast) {
        onSuccessToast(`Faculty "${created.name}" registered to ${created.department} (${created.role}) successfully!`);
      }

      resetForm();
      onClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to add faculty member.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Faculty Advisor"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
          <p className="text-xs text-purple-900 dark:text-purple-200 font-medium">
            Authorized administrators can enroll faculty advisors and mentors to manage department cohorts.
          </p>
        </div>

        {formError && (
          <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Faculty Name */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Faculty Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dr. A. Suresh"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Official Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="suresh@edu.in"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Faculty / Employee ID */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Faculty / Employee Code
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                placeholder="FAC-106"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
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
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="AI & DS">AI &amp; DS</option>
              <option value="AI & ML">AI &amp; ML</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="IT">IT</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          {/* Role / Designation */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Academic Role / Designation
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Class Advisor">Class Advisor</option>
              <option value="Head of Department">Head of Department</option>
              <option value="Senior Professor">Senior Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Mentor">Student Mentor</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Contact Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 22334"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
            </div>
          </div>

          {/* Students Assigned */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Assigned Student Cohort
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="number"
                min="1"
                max="120"
                value={studentsAssigned}
                onChange={(e) => setStudentsAssigned(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Default Login Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="gap-2 bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/25">
            <UserCheck className="w-4 h-4" />
            {isSubmitting ? 'Registering Faculty...' : 'Register Faculty Advisor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
