'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Student } from '@/types';
import { useKalvikkanStore } from '@/lib/store';
import { Send, CheckCircle2, PhoneCall, Mail } from 'lucide-react';

interface ParentAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccessToast?: (msg: string) => void;
}

export const ParentAlertModal: React.FC<ParentAlertModalProps> = ({
  isOpen,
  onClose,
  student,
  onSuccessToast,
}) => {
  const { dispatchParentAlert } = useKalvikkanStore();
  const [alertType, setAlertType] = useState<'Email' | 'SMS'>('Email');
  const [customMsg, setCustomMsg] = useState('');

  if (!student) return null;

  const defaultMessage = `Dear Parent/Guardian, Kalvikkan AI Early Warning Alert: Your ward ${student.name} (EMIS: ${student.emis}) currently has an attendance of ${student.attendance}% and academic score of ${student.predictedScore}%. Please connect with Class Advisor Dr. S. Ramanathan for remedial discussion.`;

  const handleSend = () => {
    const finalMsg = customMsg || defaultMessage;
    dispatchParentAlert({
      studentId: student.id,
      studentName: student.name,
      parentContact: alertType === 'Email' ? student.email : student.phone,
      type: alertType,
      message: finalMsg,
    });

    if (onSuccessToast) {
      onSuccessToast(`Parent ${alertType} alert dispatched to ${student.name}'s guardian!`);
    }

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dispatch Parent / Guardian Warning Alert">
      <div className="space-y-4 text-slate-800 dark:text-slate-100">
        <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-800 dark:text-blue-300">
          <p className="font-bold flex items-center gap-1.5 mb-1">
            <Mail className="w-4 h-4 text-blue-600" /> Automated Guardian Communication System
          </p>
          Send instant notification directly to registered parent contact to ensure early intervention.
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setAlertType('Email')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              alertType === 'Email'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Mail className="w-4 h-4" /> Email Alert ({student.email})
          </button>
          <button
            type="button"
            onClick={() => setAlertType('SMS')}
            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              alertType === 'SMS'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <PhoneCall className="w-4 h-4" /> SMS Notice ({student.phone})
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Notification Message Preview
          </label>
          <textarea
            rows={4}
            value={customMsg || defaultMessage}
            onChange={(e) => setCustomMsg(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSend} className="gap-1.5">
            <Send className="w-4 h-4" /> Dispatch Alert Now
          </Button>
        </div>
      </div>
    </Modal>
  );
};
