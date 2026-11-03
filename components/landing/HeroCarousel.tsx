'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Heart, Users, GraduationCap, Sparkles, BookOpen } from 'lucide-react';
import { KalvikkanLogo } from '@/components/ui/KalvikkanLogo';

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Three Hearts. One Concern...",
      subtitle: "Their Child's Future.",
      badge: "Institutional Early Warning System",
      quote: "Parents worry. Students struggle. Teachers face limited time. Kalvikkan AI unites all three with actionable early insights.",
      bgGradient: "from-blue-950 via-slate-950 to-indigo-950",
      type: "illustration",
    },
    {
      id: 2,
      title: "Predict Academic Risk",
      subtitle: "Before Mid-Semester Exams.",
      badge: "AI Performance Forecasting",
      quote: "Continuous metrics tracking: 40% Previous Marks + 20% Attendance + 15% Assessments + 15% Assignments + 10% Quizzes.",
      bgGradient: "from-indigo-950 via-slate-950 to-purple-950",
      type: "analytics",
    },
    {
      id: 3,
      title: "Targeted Interventions",
      subtitle: "Empower Faculty & Inform Parents.",
      badge: "Early Action Workflows",
      quote: "Trigger 1-on-1 mentor meetings, generate personalized 6-day remedial plans, and dispatch automated SMS/Email guardian alerts.",
      bgGradient: "from-slate-950 via-blue-950 to-emerald-950",
      type: "intervention",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-indigo-950/80 bg-slate-900 group ring-1 ring-amber-400/20">
      {/* Background Gradient & Animated Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} transition-all duration-700`} />
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Slide Content */}
      <div className="relative z-10 h-full p-8 lg:p-10 flex flex-col justify-between text-white">
        {/* Top Badge & Logo */}
        <div className="flex items-center justify-between">
          <KalvikkanLogo size="md" lightText />
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> {slides[currentSlide].badge}
          </span>
        </div>

        {/* Slide Main Illustrative Card */}
        <div className="my-auto py-6 animate-in fade-in duration-500 key={currentSlide}">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-2">
            {slides[currentSlide].title} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">
              {slides[currentSlide].subtitle}
            </span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl font-normal mt-3">
            {slides[currentSlide].quote}
          </p>

          {/* Interactive Feature Visual Component */}
          {slides[currentSlide].type === 'illustration' && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                <Heart className="w-5 h-5 text-red-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-white">Parents' Care</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Regularity &amp; Future</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                <GraduationCap className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-white">Students' Effort</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Concept Mastery</span>
              </div>
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-center">
                <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] font-bold block text-white">Teachers' Guide</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">Timely Support</span>
              </div>
            </div>
          )}

          {slides[currentSlide].type === 'analytics' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-indigo-800/50 mt-6 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Attendance</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">Threshold 75%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assessment</span>
                <span className="font-bold text-amber-400 mt-0.5 block">Continuous Track</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Prediction</span>
                <span className="font-bold text-blue-400 mt-0.5 block">82%-95% Conf</span>
              </div>
            </div>
          )}

          {slides[currentSlide].type === 'intervention' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-800/50 mt-6 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>6-Day Personal Remedial Timetables &amp; AI Peer Mentor Matching</span>
              </div>
              <span className="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-black text-[10px] uppercase">
                Active
              </span>
            </div>
          )}
        </div>

        {/* Carousel Navigation Indicators & Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
