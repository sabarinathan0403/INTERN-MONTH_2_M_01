import './globals.css';
import type { Metadata } from 'next';
import { FloatingEducationBg } from '@/components/ui/FloatingEducationBg';
import { FloatingBackground } from '@/components/ui/FloatingBackground';

export const metadata: Metadata = {
  title: 'KALVIKKAN - AI Student Early Warning & Intervention System',
  description: 'Predict Early. Intervene Smartly. Improve Student Success. AI-based academic performance prediction and early warning platform.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <FloatingBackground />
        <FloatingEducationBg />
        {children}
      </body>
    </html>
  );
}
