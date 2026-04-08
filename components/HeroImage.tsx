'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { monthThemes, indianHolidays } from './Calendar';

interface Props {
  month: number;
  year: number;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Extract a raw CSS color from Tailwind class for use in inline styles
const themeColorMap: { [key: string]: string } = {
  'text-blue-600':   '#2563eb',
  'text-cyan-600':   '#0891b2',
  'text-emerald-600':'#059669',
  'text-pink-500':   '#ec4899',
  'text-green-600':  '#16a34a',
  'text-amber-500':  '#f59e0b',
  'text-orange-600': '#ea580c',
  'text-yellow-600': '#ca8a04',
  'text-orange-800': '#9a3412',
  'text-red-700':    '#b91c1c',
  'text-indigo-800': '#3730a3',
  'text-slate-800':  '#1e293b',
};

export default function HeroImage({ month, year }: Props) {
  const theme = monthThemes[month];
  const accentColor = themeColorMap[theme.color] ?? '#6366f1';
  const monthName = MONTH_NAMES[month];

  // Count holidays in this month
  const pad = (n: number) => String(n).padStart(2, '0');
  const prefix = `${year}-${pad(month + 1)}-`;
  const holidayCount = Object.keys(indianHolidays).filter(k => k.startsWith(prefix)).length;

  return (
    <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden shadow-xl bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${theme.img}-${year}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          {/* ── Photo ── */}
          <img
            src={theme.img}
            alt={theme.label}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />

          {/* ── Grain texture overlay ── */}
          <div
            className="absolute inset-0 opacity-[0.18] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />

          {/* ── Themed gradient (bottom-heavy, color-tinted) ── */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${accentColor}cc 0%, ${accentColor}33 40%, transparent 75%)`,
            }}
          />

          {/* ── Large ghost month name (decorative) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="absolute top-3 right-4 pointer-events-none select-none"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.10)',
              lineHeight: 1,
              textTransform: 'uppercase',
              fontFamily: 'Georgia, serif',
            }}
          >
            {monthName}
          </motion.div>

          {/* ── Holiday count badge ── */}
          {holidayCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 backdrop-blur-sm"
              style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-base leading-none">🇮🇳</span>
              <span className="text-white text-[10px] font-semibold tracking-wide">
                {holidayCount} holiday{holidayCount > 1 ? 's' : ''}
              </span>
            </motion.div>
          )}

          {/* ── Bottom content ── */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
            {/* Shimmer accent line */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
              className="h-[2px] w-12 rounded-full mb-2 origin-left"
              style={{ background: `linear-gradient(to right, #fff, ${accentColor})` }}
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em] mb-0.5"
            >
              {year} Collection
            </motion.p>

            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white text-2xl font-light tracking-tight italic"
            >
              {theme.label}
            </motion.h4>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}