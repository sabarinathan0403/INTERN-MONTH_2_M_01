'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { Toast } from '@/components/ui/Toast';
import { useKalvikkanStore } from '@/lib/store';
import { DEFAULT_WEIGHTS } from '@/lib/predictionEngine';
import { Settings, Sun, Moon, Sliders, Save, RotateCcw, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, weights, updateWeights, resetAllData, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  const [prevWeight, setPrevWeight] = useState(weights.previousScoreWeight);
  const [attWeight, setAttWeight] = useState(weights.attendanceWeight);
  const [assignWeight, setAssignWeight] = useState(weights.assignmentWeight);
  const [assessWeight, setAssessWeight] = useState(weights.assessmentWeight);
  const [quizWeight, setQuizWeight] = useState(weights.quizWeight);

  const [highThreshold, setHighThreshold] = useState(weights.highRiskThreshold);
  const [mediumThreshold, setMediumThreshold] = useState(weights.mediumRiskThreshold);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isHydrated) return null;

  const handleSaveWeights = (e: React.FormEvent) => {
    e.preventDefault();
    const total = prevWeight + attWeight + assignWeight + assessWeight + quizWeight;
    if (Math.abs(total - 1.0) > 0.01) {
      alert(`Model weights must sum to 1.00 (100%). Current sum: ${total.toFixed(2)}`);
      return;
    }

    updateWeights({
      previousScoreWeight: prevWeight,
      attendanceWeight: attWeight,
      assignmentWeight: assignWeight,
      assessmentWeight: assessWeight,
      quizWeight: quizWeight,
      highRiskThreshold: highThreshold,
      mediumRiskThreshold: mediumThreshold,
    });

    setToastMessage('Risk Model Weights & Thresholds updated successfully!');
  };

  const handleResetWeights = () => {
    setPrevWeight(DEFAULT_WEIGHTS.previousScoreWeight);
    setAttWeight(DEFAULT_WEIGHTS.attendanceWeight);
    setAssignWeight(DEFAULT_WEIGHTS.assignmentWeight);
    setAssessWeight(DEFAULT_WEIGHTS.assessmentWeight);
    setQuizWeight(DEFAULT_WEIGHTS.quizWeight);
    setHighThreshold(DEFAULT_WEIGHTS.highRiskThreshold);
    setMediumThreshold(DEFAULT_WEIGHTS.mediumRiskThreshold);
    updateWeights(DEFAULT_WEIGHTS);
    setToastMessage('Weights reset to default institutional model weights.');
  };

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
          title="Settings & Model Parameters"
          subtitle="Customize interface theme and AI risk prediction weights"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-4xl mx-auto w-full">
          {/* Theme Settings Card */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  Appearance Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Toggle between Light mode and Dark mode. Preference is saved in browser localStorage.
                </p>
              </div>

              <Button variant="secondary" onClick={toggleTheme} className="gap-2">
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
              </Button>
            </div>
          </Card>

          {/* AI Risk Model Weight Configurator */}
          <Card>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  AI Prediction Scoring Formula &amp; Weight Configurator
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Modify input feature weightings for performance score calculation (Must sum to 1.00)
                </p>
              </div>
              <button
                onClick={handleResetWeights}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Previous Academic Marks Weight (Default 40%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={prevWeight}
                    onChange={(e) => setPrevWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Attendance Percentage Weight (Default 20%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={attWeight}
                    onChange={(e) => setAttWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Assignment Completion Weight (Default 15%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={assignWeight}
                    onChange={(e) => setAssignWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Internal Assessment Weight (Default 15%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={assessWeight}
                    onChange={(e) => setAssessWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Continuous Quiz Average Weight (Default 10%)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={quizWeight}
                  onChange={(e) => setQuizWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              {/* Risk Classification Thresholds */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    High Risk Threshold (Score &lt; X)
                  </label>
                  <input
                    type="number"
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Medium Risk Threshold (Score &lt; X)
                  </label>
                  <input
                    type="number"
                    value={mediumThreshold}
                    onChange={(e) => setMediumThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <Button variant="primary" type="submit" className="gap-1.5">
                  <Save className="w-4 h-4" /> Save Model Parameters
                </Button>
              </div>
            </form>
          </Card>
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
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
