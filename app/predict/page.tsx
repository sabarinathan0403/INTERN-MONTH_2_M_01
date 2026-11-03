'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal';
import { KalvikkanChatDrawer } from '@/components/ai/KalvikkanChatDrawer';
import { calculatePrediction, PredictionResult } from '@/lib/predictionEngine';
import { useKalvikkanStore } from '@/lib/store';
import {
  BrainCircuit,
  Sparkles,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  UserCheck
} from 'lucide-react';

export default function AIPredictionPage() {
  const { weights, isHydrated } = useKalvikkanStore();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  // Form input states
  const [attendance, setAttendance] = useState(62);
  const [previousScore, setPreviousScore] = useState(48);
  const [assignmentCompletion, setAssignmentCompletion] = useState(55);
  const [quizScore, setQuizScore] = useState(52);
  const [assessmentScore, setAssessmentScore] = useState(50);

  const [result, setResult] = useState<PredictionResult | null>(() => {
    return calculatePrediction(
      { attendance: 62, previousScore: 48, assignmentCompletion: 55, quizScore: 52, assessmentScore: 50 },
      weights
    );
  });

  if (!isHydrated) return null;

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculatePrediction(
      { attendance, previousScore, assignmentCompletion, quizScore, assessmentScore },
      weights
    );
    setResult(res);
  };

  const handleReset = () => {
    setAttendance(85);
    setPreviousScore(78);
    setAssignmentCompletion(90);
    setQuizScore(80);
    setAssessmentScore(82);
    setResult(
      calculatePrediction(
        { attendance: 85, previousScore: 78, assignmentCompletion: 90, quizScore: 80, assessmentScore: 82 },
        weights
      )
    );
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
          title="AI Prediction Simulator"
          subtitle="Interactive academic risk prediction and scenario modeling"
        />

        <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-base">Kalvikkan Hackathon AI Prediction Model</h2>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">
                Adjust student metrics below and click &quot;Analyze Student&quot; to test real-time risk classification.
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-indigo-950 border border-indigo-700 text-indigo-300 font-bold hidden sm:inline-block">
              Hackathon AI Engine v1.0
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Input Sliders */}
            <div className="lg:col-span-6">
              <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Student Academic Inputs
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Default
                  </button>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-4">
                  {/* Attendance */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Attendance Percentage</span>
                      <span className={`font-mono ${attendance < 75 ? 'text-red-600' : 'text-blue-600'}`}>
                        {attendance}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={attendance}
                      onChange={(e) => setAttendance(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Previous Score */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Previous Semester Score</span>
                      <span className="font-mono text-blue-600">{previousScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={previousScore}
                      onChange={(e) => setPreviousScore(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Assignment Completion */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Assignment Completion Rate</span>
                      <span className="font-mono text-blue-600">{assignmentCompletion}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={assignmentCompletion}
                      onChange={(e) => setAssignmentCompletion(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Internal Assessment Score */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Internal Assessment Average</span>
                      <span className="font-mono text-blue-600">{assessmentScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={assessmentScore}
                      onChange={(e) => setAssessmentScore(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Quiz Score */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-700 dark:text-slate-300">Continuous Quiz Average</span>
                      <span className="font-mono text-blue-600">{quizScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={quizScore}
                      onChange={(e) => setQuizScore(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="w-full py-3 gap-2 text-sm">
                    <Sparkles className="w-4 h-4 text-amber-300" /> Analyze Student Prediction
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column: AI Analysis Result Output */}
            <div className="lg:col-span-6">
              {result && (
                <div className="space-y-4">
                  <Card className="bg-slate-900 text-white border-slate-800 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BrainCircuit className="w-4 h-4" /> AI Prediction Output
                      </span>
                      <Badge level={result.riskLevel} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center mb-4">
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">Predicted Final Score</span>
                        <span className="text-4xl font-black text-white mt-1 block">{result.predictedScore} <span className="text-lg text-slate-400 font-normal">/ 100</span></span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[11px] text-slate-400 font-semibold block uppercase">Model Confidence</span>
                        <span className="text-4xl font-black text-emerald-400 mt-1 block">{result.confidence}%</span>
                      </div>
                    </div>

                    {/* Weight Contribution Breakdown */}
                    <div className="border-t border-slate-800 pt-3">
                      <span className="text-xs font-bold text-slate-300 block mb-2">Score Weight Breakdown</span>
                      <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                        <div className="p-2 rounded bg-slate-950">
                          <span className="text-slate-400 block">Prev (40%)</span>
                          <span className="font-bold text-white mt-0.5 block">{result.breakdown.previousScoreContribution}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950">
                          <span className="text-slate-400 block">Att (20%)</span>
                          <span className="font-bold text-white mt-0.5 block">{result.breakdown.attendanceContribution}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950">
                          <span className="text-slate-400 block">Assign (15%)</span>
                          <span className="font-bold text-white mt-0.5 block">{result.breakdown.assignmentContribution}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950">
                          <span className="text-slate-400 block">Assess (15%)</span>
                          <span className="font-bold text-white mt-0.5 block">{result.breakdown.assessmentContribution}</span>
                        </div>
                        <div className="p-2 rounded bg-slate-950">
                          <span className="text-slate-400 block">Quiz (10%)</span>
                          <span className="font-bold text-white mt-0.5 block">{result.breakdown.quizContribution}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Explainable Risk Factors */}
                  <Card>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      Identified Risk Factors ({result.riskFactors.length})
                    </h4>
                    {result.riskFactors.length === 0 ? (
                      <p className="text-xs text-emerald-600 font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> No high risk factors detected. Student is performing well!
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {result.riskFactors.map((rf, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 shrink-0">
                              {rf.impact}
                            </span>
                            <div>
                              <span className="font-bold text-xs text-slate-900 dark:text-white block">{rf.factor}</span>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{rf.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* AI Recommendations */}
                  <Card>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      Recommended Faculty Interventions
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                      {result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <KalvikkanChatDrawer isOpen={chatDrawerOpen} onClose={() => setChatDrawerOpen(false)} />
    </div>
  );
}
