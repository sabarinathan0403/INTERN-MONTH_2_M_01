'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useKalvikkanStore } from '@/lib/store';
import { generateSmartAIResponse } from '@/lib/aiChatEngine';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
}

interface KalvikkanChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KalvikkanChatDrawer: React.FC<KalvikkanChatDrawerProps> = ({ isOpen, onClose }) => {
  const { students, interventions, notifications, weights, role } = useKalvikkanStore();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Vanakkam! I am Kalvikkan AI, your intelligent context-aware early warning assistant. Ask me anything about student performance, risk factors, specific student names (e.g. "How is Abishek S?"), department stats, or uploaded certificates!',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Query smart AI Chat Engine with active dataset context
    setTimeout(() => {
      const smartReply = generateSmartAIResponse(q, {
        students,
        interventions,
        notifications,
        weights,
        activeRole: role,
      });

      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: smartReply }]);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                Kalvikkan AI Intelligence Engine <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              </h3>
              <span className="text-[10px] text-indigo-300 block">Context-Aware Real-Time Student Advisor</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-900 text-indigo-200 border border-indigo-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-2xs rounded-tl-none font-sans whitespace-pre-wrap'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Dynamic Prompts */}
        <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('How is Abishek S performing?')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
          >
            Abishek S Details
          </button>
          <button
            onClick={() => handleSend('Students with low attendance')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
          >
            Low Attendance List
          </button>
          <button
            onClick={() => handleSend('CSE department stats')}
            className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap"
          >
            CSE Department
          </button>
        </div>

        {/* Input bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kalvikkan AI about any student, marks, or department..."
            className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button variant="primary" size="sm" onClick={() => handleSend()} className="px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
