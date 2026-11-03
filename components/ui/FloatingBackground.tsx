'use client';

import React from 'react';
import { KalvikkanLogo } from '@/components/ui/KalvikkanLogo';

export const FloatingBackground: React.FC<{ front?: boolean }> = ({ front = false }) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none ${front ? 'z-[1]' : '-z-10'}`}
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-[90px]" />

      {/* 1. Open Academic Book - Top Left */}
      <div className="absolute top-8 left-6 sm:left-14 animate-bg-float-1 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 100 80" className="w-16 h-14 sm:w-20 sm:h-16 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]" fill="none">
          <path
            d="M50 70 C35 60 15 60 5 64 L5 16 C15 12 35 12 50 22 C65 12 85 12 95 16 L95 64 C85 60 65 60 50 70 Z"
            fill="#0F172A"
            stroke="#38BDF8"
            strokeWidth="2.5"
          />
          <path d="M50 66 C36 56 18 56 8 60 L8 18 C18 14 36 14 50 24 Z" fill="#1E293B" stroke="#60A5FA" strokeWidth="1" />
          <path d="M50 66 C64 56 82 56 92 60 L92 18 C82 14 64 14 50 24 Z" fill="#1E293B" stroke="#60A5FA" strokeWidth="1" />
          <path d="M50 24 L50 56 L54 52 L58 56 L58 24 Z" fill="#F59E0B" />
          <line x1="16" y1="28" x2="42" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="36" x2="38" y2="36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="44" x2="40" y2="44" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="58" y1="28" x2="84" y2="28" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="58" y1="36" x2="80" y2="36" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="58" y1="44" x2="82" y2="44" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 2. Golden Fountain Pen - Top Right */}
      <div className="absolute top-12 right-10 sm:right-24 animate-bg-float-2 opacity-35 dark:opacity-45">
        <svg viewBox="0 0 80 80" className="w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] drop-shadow-[0_0_14px_rgba(245,158,11,0.55)]" fill="none">
          <g transform="rotate(-40 40 40)">
            <rect x="36" y="8" width="8" height="42" rx="2" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="35" y="24" width="10" height="4" fill="#F59E0B" />
            <rect x="35" y="40" width="10" height="3" fill="#F59E0B" />
            <polygon points="36,50 44,50 42,68 40,73 38,68" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="40" cy="60" r="1" fill="#0F172A" />
            <line x1="40" y1="60" x2="40" y2="73" stroke="#0F172A" strokeWidth="0.8" />
          </g>
          <circle cx="62" cy="20" r="2" fill="#F59E0B" className="animate-ping" />
          <circle cx="68" cy="14" r="1.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* 3. Kalvikkan Logo Emblem - Center Top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 animate-bg-float-3 opacity-30 dark:opacity-40">
        <div className="p-2 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-blue-500/20 shadow-[0_0_18px_rgba(59,130,246,0.3)]">
          <KalvikkanLogo size="sm" showText={false} />
        </div>
      </div>

      {/* 4. Graduation Mortarboard Cap - Far Right Upper */}
      <div className="absolute top-36 right-4 sm:right-16 animate-bg-float-4 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 70 60" className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]" fill="none">
          <polygon points="35,10 65,24 35,38 5,24" fill="#1E1B4B" stroke="#818CF8" strokeWidth="2" />
          <path d="M18,30 L18,44 Q35,52 52,44 L52,30" fill="#0F172A" stroke="#818CF8" strokeWidth="1.8" />
          <circle cx="35" cy="24" r="2.5" fill="#F59E0B" />
          <path d="M35,24 Q54,26 53,42" fill="none" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="51,42 55,42 53,50" fill="#F59E0B" />
        </svg>
      </div>

      {/* 5. Academic Diploma Scroll - Far Left Upper */}
      <div className="absolute top-48 left-4 sm:left-12 animate-bg-float-5 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 70 70" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_12px_rgba(16,185,129,0.4)]" fill="none">
          <g transform="rotate(25 35 35)">
            <rect x="15" y="24" width="40" height="22" rx="3" fill="#0F172A" stroke="#10B981" strokeWidth="1.8" />
            <ellipse cx="15" cy="35" rx="4" ry="11" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
            <ellipse cx="55" cy="35" rx="4" ry="11" fill="#1E293B" stroke="#10B981" strokeWidth="1.5" />
            <rect x="33" y="22" width="6" height="26" fill="#F59E0B" stroke="#FCD34D" strokeWidth="0.8" />
            <polygon points="32,48 36,44 40,48 38,54 34,54" fill="#F59E0B" />
          </g>
        </svg>
      </div>

      {/* 6. Open Book Tilted - Mid Right */}
      <div className="absolute top-1/2 right-6 sm:right-20 -translate-y-1/2 animate-bg-float-1 opacity-25 dark:opacity-35">
        <svg viewBox="0 0 80 65" className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]" fill="none">
          <g transform="rotate(12 40 32)">
            <path d="M40 56 C28 48 12 48 4 52 L4 12 C12 8 28 8 40 16 C52 8 68 8 76 12 L76 52 C68 48 52 48 40 56 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <path d="M40 52 C30 44 14 44 6 48 L6 14 C14 10 30 10 40 18 Z" fill="#1E293B" />
            <path d="M40 52 C50 44 66 44 74 48 L74 14 C66 10 50 10 40 18 Z" fill="#1E293B" />
            <line x1="12" y1="22" x2="34" y2="22" stroke="#64748B" strokeWidth="1.2" />
            <line x1="12" y1="28" x2="30" y2="28" stroke="#64748B" strokeWidth="1.2" />
            <line x1="46" y1="22" x2="68" y2="22" stroke="#64748B" strokeWidth="1.2" />
            <line x1="46" y1="28" x2="64" y2="28" stroke="#64748B" strokeWidth="1.2" />
          </g>
        </svg>
      </div>

      {/* 7. Writing Pencil - Mid Left */}
      <div className="absolute top-1/2 left-6 sm:left-20 -translate-y-1/2 animate-bg-float-6 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 70 70" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_12px_rgba(245,158,11,0.45)]" fill="none">
          <g transform="rotate(-50 35 35)">
            <rect x="32" y="10" width="7" height="38" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <polygon points="32,48 39,48 35.5,60" fill="#FDE68A" stroke="#D97706" strokeWidth="0.8" />
            <polygon points="34,56 37,56 35.5,60" fill="#0F172A" />
            <rect x="31.5" y="8" width="8" height="4" fill="#94A3B8" />
            <rect x="32" y="4" width="7" height="4" rx="1.5" fill="#EF4444" />
          </g>
        </svg>
      </div>

      {/* 8. Kalvikkan Eye of Knowledge - Center Floating */}
      <div className="absolute top-1/3 right-1/4 animate-bg-float-2 opacity-25 dark:opacity-35">
        <svg viewBox="0 0 120 70" className="w-20 h-12 sm:w-24 sm:h-14 drop-shadow-[0_0_16px_rgba(59,130,246,0.5)]" fill="none">
          <path d="M10,35 Q60,5 110,35 Q60,65 10,35 Z" fill="#0F172A" stroke="#2563EB" strokeWidth="4" />
          <circle cx="60" cy="35" r="18" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="60" cy="35" r="9" fill="#0F172A" />
          <circle cx="63" cy="32" r="3" fill="#F59E0B" />
        </svg>
      </div>

      {/* 9. Graduation Cap - Bottom Left */}
      <div className="absolute bottom-28 left-8 sm:left-24 animate-bg-float-3 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 70 60" className="w-14 h-12 sm:w-16 sm:h-14 drop-shadow-[0_0_14px_rgba(139,92,246,0.45)]" fill="none">
          <polygon points="35,10 65,24 35,38 5,24" fill="#0F172A" stroke="#A78BFA" strokeWidth="2" />
          <path d="M18,30 L18,44 Q35,52 52,44 L52,30" fill="#1E1B4B" stroke="#A78BFA" strokeWidth="1.8" />
          <circle cx="35" cy="24" r="2.5" fill="#F59E0B" />
          <path d="M35,24 Q54,26 53,42" fill="none" stroke="#F59E0B" strokeWidth="2" />
          <polygon points="51,42 55,42 53,50" fill="#F59E0B" />
        </svg>
      </div>

      {/* 10. Star of Academic Merit - Bottom Right */}
      <div className="absolute bottom-32 right-8 sm:right-28 animate-bg-float-4 opacity-35 dark:opacity-45">
        <svg viewBox="0 0 60 60" className="w-12 h-12 sm:w-[3.75rem] sm:h-[3.75rem] drop-shadow-[0_0_16px_rgba(245,158,11,0.6)]" fill="none">
          <path
            d="M30 4 L36 20 L53 14 L44 29 L58 38 L41 40 L40 57 L30 44 L20 57 L19 40 L2 38 L16 29 L7 14 L24 20 Z"
            fill="#F59E0B"
            stroke="#FDE68A"
            strokeWidth="1.5"
          />
          <circle cx="30" cy="30" r="8" fill="#0F172A" stroke="#FDE68A" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 11. Fountain Pen Nib - Bottom Center-Left */}
      <div className="absolute bottom-12 left-1/3 animate-bg-float-5 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 60 70" className="w-12 h-14 sm:w-14 sm:h-16 drop-shadow-[0_0_12px_rgba(59,130,246,0.45)]" fill="none">
          <g transform="rotate(30 30 35)">
            <rect x="25" y="5" width="10" height="35" rx="2" fill="#0F172A" stroke="#3B82F6" strokeWidth="1.5" />
            <polygon points="25,40 35,40 33,56 30,62 27,56" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
            <circle cx="30" cy="50" r="1" fill="#0F172A" />
          </g>
        </svg>
      </div>

      {/* 12. Open Book with Bookmark - Bottom Far Right */}
      <div className="absolute bottom-10 right-4 sm:right-12 animate-bg-float-6 opacity-30 dark:opacity-40">
        <svg viewBox="0 0 90 70" className="w-16 h-12 sm:w-[4.5rem] sm:h-14 drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]" fill="none">
          <path d="M45 62 C32 52 14 52 4 56 L4 14 C14 10 32 10 45 20 C58 10 76 10 86 14 L86 56 C76 52 58 52 45 62 Z" fill="#0F172A" stroke="#10B981" strokeWidth="2.2" />
          <path d="M45 20 L45 50 L49 46 L53 50 L53 20 Z" fill="#F59E0B" />
          <line x1="14" y1="26" x2="36" y2="26" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="14" y1="33" x2="32" y2="33" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="54" y1="26" x2="76" y2="26" stroke="#94A3B8" strokeWidth="1.2" />
          <line x1="54" y1="33" x2="72" y2="33" stroke="#94A3B8" strokeWidth="1.2" />
        </svg>
      </div>

      {/* 13. Lightbulb of Innovation - Left Center */}
      <div className="absolute top-2/3 left-4 sm:left-10 animate-bg-float-2 opacity-25 dark:opacity-35">
        <svg viewBox="0 0 60 70" className="w-12 h-14 sm:w-14 sm:h-16 drop-shadow-[0_0_16px_rgba(250,204,21,0.5)]" fill="none">
          <path d="M20,44 Q10,32 10,22 A20,20 0 1,1 50,22 Q50,32 40,44 Z" fill="#0F172A" stroke="#FACC15" strokeWidth="2" />
          <path d="M24,24 Q30,16 36,24 Q30,32 24,24" stroke="#FDE047" strokeWidth="1.5" fill="none" />
          <rect x="23" y="44" width="14" height="4" rx="1" fill="#94A3B8" />
          <rect x="25" y="49" width="10" height="3" rx="1" fill="#94A3B8" />
          <path d="M27,53 L33,53" stroke="#64748B" strokeWidth="2" />
        </svg>
      </div>

      {/* 14. Academic Atom / Knowledge Molecule - Center Lower-Right */}
      <div className="absolute bottom-20 right-1/3 animate-bg-float-1 opacity-25 dark:opacity-35">
        <svg viewBox="0 0 70 70" className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_12px_rgba(129,140,248,0.4)]" fill="none">
          <ellipse cx="35" cy="35" rx="28" ry="10" stroke="#818CF8" strokeWidth="1.5" transform="rotate(30 35 35)" />
          <ellipse cx="35" cy="35" rx="28" ry="10" stroke="#818CF8" strokeWidth="1.5" transform="rotate(-30 35 35)" />
          <ellipse cx="35" cy="35" rx="28" ry="10" stroke="#818CF8" strokeWidth="1.5" transform="rotate(90 35 35)" />
          <circle cx="35" cy="35" r="4" fill="#F59E0B" />
          <circle cx="56" cy="22" r="2.5" fill="#38BDF8" />
        </svg>
      </div>

      {/* 15. Kalvikkan Shield Emblem - Lower Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bg-float-3 opacity-25 dark:opacity-35">
        <div className="p-2 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.3)]">
          <KalvikkanLogo size="sm" showText={false} />
        </div>
      </div>

      {/* 16. Mathematical Academic Sigma & Pi Symbol - Upper Center-Left */}
      <div className="absolute top-24 left-1/3 animate-bg-float-4 opacity-25 dark:opacity-35">
        <svg viewBox="0 0 60 50" className="w-12 h-10 sm:w-14 sm:h-12 drop-shadow-[0_0_10px_rgba(244,63,94,0.4)]" fill="none">
          <path d="M12 10 L38 10 L24 25 L38 40 L12 40" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
