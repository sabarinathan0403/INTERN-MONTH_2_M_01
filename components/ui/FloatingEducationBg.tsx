'use client';

import React from 'react';
import {
  BookOpen, Book, BookMarked, PenTool, Pencil, Feather, GraduationCap, NotebookPen,
  Library, Award, Lightbulb, Ruler, Calculator, ScrollText, Highlighter, Crown,
  type LucideIcon,
} from 'lucide-react';

interface FlyItem {
  Icon: LucideIcon;
  left: number;      // % from left
  size: number;      // px
  duration: number;  // s
  delay: number;     // s (negative = already mid-flight on load)
  sway: number;      // px sideways drift
  r0: number;        // start rotation deg
  r1: number;        // end rotation deg
  tone: 'gold' | 'blue';
  opacity: number;
}

// Fixed values (no Math.random) so server and client render identically.
const ITEMS: FlyItem[] = [
  { Icon: BookOpen,      left: 4,  size: 34, duration: 26, delay: -2,  sway: 40,  r0: -15, r1: 25,  tone: 'gold', opacity: 0.38 },
  { Icon: PenTool,       left: 11, size: 26, duration: 31, delay: -14, sway: -30, r0: 10,  r1: 70,  tone: 'blue', opacity: 0.32 },
  { Icon: GraduationCap, left: 18, size: 38, duration: 29, delay: -7,  sway: 50,  r0: -10, r1: 15,  tone: 'gold', opacity: 0.38 },
  { Icon: Pencil,        left: 25, size: 24, duration: 24, delay: -19, sway: -45, r0: 30,  r1: -40, tone: 'blue', opacity: 0.32 },
  { Icon: Book,          left: 32, size: 30, duration: 33, delay: -3,  sway: 35,  r0: -25, r1: 20,  tone: 'blue', opacity: 0.30 },
  { Icon: Feather,       left: 39, size: 28, duration: 27, delay: -11, sway: -55, r0: 0,   r1: 60,  tone: 'gold', opacity: 0.36 },
  { Icon: Library,       left: 46, size: 36, duration: 35, delay: -22, sway: 30,  r0: 8,   r1: -12, tone: 'gold', opacity: 0.30 },
  { Icon: NotebookPen,   left: 53, size: 30, duration: 28, delay: -5,  sway: -40, r0: -20, r1: 30,  tone: 'blue', opacity: 0.32 },
  { Icon: Lightbulb,     left: 60, size: 28, duration: 25, delay: -16, sway: 45,  r0: -8,  r1: 12,  tone: 'gold', opacity: 0.40 },
  { Icon: Award,         left: 67, size: 32, duration: 32, delay: -9,  sway: -35, r0: 15,  r1: -20, tone: 'gold', opacity: 0.36 },
  { Icon: BookMarked,    left: 73, size: 32, duration: 30, delay: -1,  sway: 40,  r0: -30, r1: 10,  tone: 'blue', opacity: 0.32 },
  { Icon: Highlighter,   left: 79, size: 24, duration: 23, delay: -13, sway: -50, r0: 25,  r1: 80,  tone: 'gold', opacity: 0.36 },
  { Icon: ScrollText,    left: 85, size: 30, duration: 34, delay: -20, sway: 30,  r0: -5,  r1: 18,  tone: 'blue', opacity: 0.30 },
  { Icon: Ruler,         left: 90, size: 26, duration: 27, delay: -6,  sway: -30, r0: 40,  r1: -30, tone: 'blue', opacity: 0.30 },
  { Icon: Calculator,    left: 95, size: 26, duration: 31, delay: -17, sway: 25,  r0: -12, r1: 14,  tone: 'gold', opacity: 0.32 },
  { Icon: Crown,         left: 8,  size: 26, duration: 36, delay: -26, sway: 35,  r0: -10, r1: 10,  tone: 'gold', opacity: 0.40 },
  { Icon: BookOpen,      left: 50, size: 24, duration: 38, delay: -30, sway: -45, r0: 20,  r1: -25, tone: 'blue', opacity: 0.28 },
  { Icon: PenTool,       left: 76, size: 22, duration: 28, delay: -24, sway: 40,  r0: -40, r1: 20,  tone: 'gold', opacity: 0.34 },
];

export const FloatingEducationBg: React.FC = () => {
  return (
    <div className="fly-layer" aria-hidden="true">
      {ITEMS.map(({ Icon, left, size, duration, delay, sway, r0, r1, tone, opacity }, i) => (
        <span
          key={i}
          className={`fly-item ${tone === 'gold' ? 'fly-gold' : 'fly-blue'}`}
          style={
            {
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              '--sway': `${sway}px`,
              '--r0': `${r0}deg`,
              '--r1': `${r1}deg`,
              '--o': opacity,
            } as React.CSSProperties
          }
        >
          <Icon width={size} height={size} strokeWidth={1.6} />
        </span>
      ))}
    </div>
  );
};
