'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { monthThemes } from './Calendar';

interface Props {
  date: Date;
  setDate: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

const themeColorMap: { [key: string]: string } = {
  'text-blue-600':    '#2563eb',
  'text-cyan-600':    '#0891b2',
  'text-emerald-600': '#059669',
  'text-pink-500':    '#ec4899',
  'text-green-600':   '#16a34a',
  'text-amber-500':   '#f59e0b',
  'text-orange-600':  '#ea580c',
  'text-yellow-600':  '#ca8a04',
  'text-orange-800':  '#9a3412',
  'text-red-700':     '#b91c1c',
  'text-indigo-800':  '#3730a3',
  'text-slate-800':   '#1e293b',
};

export default function MonthNav({ date, setDate, onPrev, onNext }: Props) {
  const currentMonth = date.getMonth();
  const theme = monthThemes[currentMonth];
  const accentColor = themeColorMap[theme.color] ?? '#6366f1';

  const today = new Date();
  const isCurrentMonth =
    date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

  // Month progress: what % of the month has passed (only meaningful for current month)
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const dayOfMonth = isCurrentMonth ? today.getDate() : 0;
  const progressPct = isCurrentMonth ? Math.round((dayOfMonth / daysInMonth) * 100) : 0;

  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const goToToday = () => {
    setDate(new Date());
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        {/* ── Month + Year title ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${monthName}-${year}`}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col"
          >
            <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-800 leading-none">
              {monthName}
              <span
                className="ml-2 font-light transition-colors duration-500"
                style={{ color: accentColor }}
              >
                {year}
              </span>
            </h2>

            {/* Underbar */}
            <div
              className="h-1.5 mt-1 rounded-full shadow-sm transition-all duration-500"
              style={{ width: '3rem', background: accentColor }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ── Controls ── */}
        <div className="flex items-center gap-2">
          {/* Today button — only visible when not on current month */}
          <AnimatePresence>
            {!isCurrentMonth && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={goToToday}
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all duration-200 hover:shadow-sm"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  background: `${accentColor}0d`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${accentColor}0d`;
                }}
              >
                Today
              </motion.button>
            )}
          </AnimatePresence>

          {/* Prev */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={onPrev}
            className="p-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-sm transition-all hover:shadow-md"
            style={{ color: accentColor }}
            aria-label="Previous Month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </motion.button>

          {/* Next */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            onClick={onNext}
            className="p-3 backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl shadow-sm transition-all hover:shadow-md"
            style={{ color: accentColor }}
            aria-label="Next Month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </motion.button>
        </div>
      </div>

      {/* ── Month progress bar (only for current month) ── */}
      <AnimatePresence>
        {isCurrentMonth && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">Month progress</span>
              <span className="text-[9px] font-bold" style={{ color: accentColor }}>
                Day {dayOfMonth} of {daysInMonth}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(to right, ${accentColor}88, ${accentColor})` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}