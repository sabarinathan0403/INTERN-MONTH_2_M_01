'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Student } from '@/types';
import { useKalvikkanStore } from '@/lib/store';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccessToast?: (msg: string) => void;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccessToast,
}) => {
  const { addIntervention } = useKalvikkanStore();

  const [interventionType, setInterventionType] = useState('Mentor Meeting');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [notes, setNotes] = useState('');
  const [assignedFaculty, setAssignedFaculty] = useState('Dr. S. Ramanathan');

  if (!student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addIntervention({
      studentId: student.id,
      studentName: student.name,
      department: student.department,
      riskLevel: student.riskLevel,
      primaryProblem: student.riskFactors[0]?.description || 'Academic performance decline',
      recommendedIntervention: interventionType,
      status: 'In Progress',
      priority,
      notes: notes || `Initiated ${interventionType} intervention for ${student.name}.`,
      assignedFaculty,
    });

    if (onSuccessToast) {
      onSuccessToast(`Intervention created for ${student.name}! Status: In Progress`);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Early Intervention">
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800 dark:text-slate-100">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Student Name &amp; EMIS
          </label>
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-sm text-slate-900 dark:text-white flex justify-between items-center">
            <span>{student.name} ({student.department})</span>
            <span className="text-xs font-mono font-normal text-slate-500">EMIS: {student.emis}</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Select Intervention Strategy
          </label>
          <select
            value={interventionType}
            onChange={(e) => setInterventionType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Mentor Meeting">1-on-1 Mentor Meeting &amp; Academic Counseling</option>
            <option value="Remedial Class">Remedial Class &amp; Subject Tutorial</option>
            <option value="Assignment Support">Assignment &amp; Lab Backlog Support</option>
            <option value="Attendance Counseling">Attendance Counseling &amp; Parent Alert</option>
            <option value="Study Plan">Custom 30-Day Personalized Study Plan</option>
            <option value="Subject Resources">Core Concept &amp; Practice Quiz Resources</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'High' | 'Medium' | 'Low')}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Assigned Faculty
            </label>
            <input
              type="text"
              value={assignedFaculty}
              onChange={(e) => setAssignedFaculty(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Faculty Notes &amp; Action Items
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add specific instructions, weak topic focus, or meeting schedule..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Start Intervention
          </Button>
        </div>
      </form>
    </Modal>
  );
};
