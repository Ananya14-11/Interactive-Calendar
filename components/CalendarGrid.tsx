'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { monthThemes, indianHolidays } from './Calendar';

interface Props {
  currentDate: Date;
  direction: number;
  range: { start: Date | null; end: Date | null };
  onDateClick: (d: Date) => void;
  notes: { [key: string]: string };
}

// ─── Animation Variants ──────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.15 },
    },
  }),
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.06,
      staggerChildren: 0.018,
    },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.7, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 22 },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function CalendarGrid({
  currentDate,
  direction,
  range,
  onDateClick,
  notes,
}: Props) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const theme = monthThemes[month];

  // Tooltip state: which date is hovered (for holiday tooltip)
  const [hoveredHoliday, setHoveredHoliday] = useState<string | null>(null);

  const today = new Date();
  const isToday = (day: number) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getBgColor = (colorClass: string) => colorClass.replace('text-', 'bg-');

  // Pad month/day to 2 digits
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="relative overflow-visible min-h-[340px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${year}-${month}`}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* ── Day Labels ── */}
          <div className="grid grid-cols-7 gap-y-2 text-center mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
              <motion.div
                key={`day-label-${index}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="font-bold text-gray-400 text-[10px] uppercase py-2 tracking-widest"
              >
                {d}
              </motion.div>
            ))}
          </div>

          {/* ── Day Cells ── */}
          <motion.div
            className="grid grid-cols-7 gap-y-2 text-center"
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {blanks.map(b => (
              <div key={`blank-${b}`} className="h-10" />
            ))}

            {days.map(day => {
              const d = new Date(year, month, day);
              const dateString = d.toISOString().split('T')[0];
              // Also build a local key (avoids timezone shift issues)
              const localKey = `${year}-${pad(month + 1)}-${pad(day)}`;

              const isStart = range.start?.toDateString() === d.toDateString();
              const isEnd = range.end?.toDateString() === d.toDateString();
              const inRange =
                range.start && range.end && d > range.start && d < range.end;
              const hasNote = !!notes[dateString];
              const todayCell = isToday(day);

              // Indian holiday check
              const holidayName = indianHolidays[localKey];
              const isHoliday = !!holidayName;
              const tooltipId = localKey;

              return (
                <motion.div
                  key={day}
                  variants={cellVariants}
                  whileHover={{
                    scale: 1.18,
                    transition: { type: 'spring', stiffness: 400, damping: 15 },
                  }}
                  whileTap={{
                    scale: 0.88,
                    transition: { type: 'spring', stiffness: 500, damping: 20 },
                  }}
                  onClick={() => onDateClick(d)}
                  onMouseEnter={() => isHoliday && setHoveredHoliday(tooltipId)}
                  onMouseLeave={() => setHoveredHoliday(null)}
                  className={`relative h-10 flex items-center justify-center cursor-pointer text-sm font-medium
                    ${isStart ? `${getBgColor(theme.color)} rounded-l-full z-20 shadow-lg` : ''}
                    ${isEnd   ? `${getBgColor(theme.color)} rounded-r-full z-20 shadow-lg` : ''}
                    ${inRange ? 'z-10' : 'rounded-full'}
                    ${!isStart && !isEnd && !inRange ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {/* ── Range fill background ── */}
                  {inRange && (
                    <div className={`absolute inset-0 ${theme.bg} z-0`} />
                  )}

                  {/* ── Holiday: saffron left-border accent ── */}
                  {isHoliday && !isStart && !isEnd && (
                    <span className="absolute left-1 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-orange-400 z-30 opacity-80" />
                  )}

                  {/* ── Today: outer pulsing ring ── */}
                  {todayCell && (
                    <motion.span
                      className={`absolute inset-0 rounded-full border-2 ${theme.color.replace('text-', 'border-')} z-10`}
                      animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0, 0.8] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}

                  {/* ── Today: solid inner dot-ring ── */}
                  {todayCell && (
                    <span
                      className={`absolute inset-0 rounded-full border ${theme.color.replace('text-', 'border-')} opacity-60 z-10`}
                    />
                  )}

                  {/* ── Day number ── */}
                  <span
                    className={`relative z-30 transition-colors duration-300
                      ${isStart || isEnd ? 'text-black font-bold' : ''}
                      ${inRange ? theme.color : ''}
                      ${todayCell && !isStart && !isEnd ? `${theme.color} font-bold` : ''}
                      ${isHoliday && !isStart && !isEnd && !inRange && !todayCell ? 'text-orange-500 font-semibold' : ''}
                      ${!isStart && !isEnd && !inRange && !todayCell && !isHoliday ? 'text-gray-700' : ''}
                    `}
                  >
                    {day}
                  </span>

                  {/* ── Note dot ── */}
                  {hasNote && (
                    <motion.div
                      layoutId={`note-${dateString}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className={`absolute bottom-1 w-1 h-1 rounded-full z-30
                        ${isStart || isEnd ? 'bg-white' : getBgColor(theme.color)}
                      `}
                    />
                  )}

                  {/* ── Holiday dot (bottom, saffron) ── */}
                  {isHoliday && (
                    <span
                      className={`absolute bottom-[3px] right-[6px] w-1 h-1 rounded-full z-30
                        ${isStart || isEnd ? 'bg-white' : 'bg-orange-400'}
                      `}
                    />
                  )}

                  {/* ── Holiday Tooltip ── */}
                  <AnimatePresence>
                    {hoveredHoliday === tooltipId && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
                        style={{ minWidth: '120px' }}
                      >
                        <div className="bg-gray-900 text-white text-[10px] font-medium rounded-lg px-2.5 py-1.5 shadow-xl whitespace-nowrap text-center">
                          <span className="mr-1">🇮🇳</span>
                          {holidayName}
                          {/* Arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                            style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #111827' }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}