'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { monthThemes } from './Calendar';

interface Props {
  selectedRange: { start: Date | null; end: Date | null };
  notes: { [key: string]: string };
  setNotes: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  month?: number; // pass current month for theming
}

const MAX_CHARS = 280;

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function NotesPanel({ selectedRange, notes, setNotes, month = new Date().getMonth() }: Props) {
  const { start, end } = selectedRange;
  const theme = monthThemes[month];
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use start date as key; show range label if end is also selected
  const pad = (n: number) => String(n).padStart(2, '0');
  const toKey = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  const dateKey = start ? toKey(start) : null;
  const currentNote = dateKey ? (notes[dateKey] || '') : '';
  const charCount = currentNote.length;
  const isNearLimit = charCount > MAX_CHARS * 0.8;
  const isAtLimit = charCount >= MAX_CHARS;

  // Auto-focus textarea when date selected
  useEffect(() => {
    if (start && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [dateKey]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!dateKey) return;
    const val = e.target.value;
    if (val.length > MAX_CHARS) return;
    setNotes(prev => ({ ...prev, [dateKey]: val }));
  };

  const clearNote = () => {
    if (!dateKey) return;
    const newNotes = { ...notes };
    delete newNotes[dateKey];
    setNotes(newNotes);
  };

  // Label: show range if both dates selected, else just start date
  const dateLabel = start
    ? end && end.toDateString() !== start.toDateString()
      ? `${formatDate(start)} → ${formatDate(end)}`
      : formatDate(start)
    : null;

  // Days between range
  const dayCount = start && end
    ? Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : null;

  return (
    <div className="min-h-[180px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={dateKey || 'empty'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── Header row ── */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                {dateLabel ? `Memo` : 'Select a date'}
              </h3>
              {dateLabel && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-[10px] font-semibold ${theme.color} bg-opacity-10 px-2 py-0.5 rounded-full border ${theme.color.replace('text-', 'border-')} border-opacity-30`}
                  style={{ background: 'rgba(0,0,0,0.03)' }}
                >
                  {dateLabel}
                </motion.span>
              )}
              {dayCount && dayCount > 1 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full"
                >
                  {dayCount}d
                </motion.span>
              )}
            </div>

            {currentNote && (
              <button
                onClick={clearNote}
                className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-wide transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* ── Textarea ── */}
          <div className="relative group">
            <textarea
              ref={textareaRef}
              disabled={!start}
              value={currentNote}
              onChange={handleNoteChange}
              placeholder={start ? 'Type something here...' : 'Select a date on the grid to jot down a memo.'}
              className={`w-full h-32 p-4 bg-white/60 border rounded-xl resize-none transition-all duration-300
                text-gray-700 text-sm leading-[28px] italic shadow-inner outline-none
                ${start
                  ? `focus:ring-2 ${theme.color.replace('text-', 'focus:ring-')}/20 focus:border-opacity-50 border-gray-200 focus:bg-white`
                  : 'border-transparent bg-gray-50/50 cursor-not-allowed'
                }
                ${isAtLimit ? 'border-red-300 focus:ring-red-200' : ''}
              `}
              style={{
                backgroundImage: start
                  ? 'linear-gradient(transparent, transparent 27px, #e8edf2 27px)'
                  : 'none',
                backgroundSize: '100% 28px',
              }}
            />

            {/* Locked overlay */}
            {!start && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50/60 backdrop-blur-[1px] rounded-xl pointer-events-none">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-xs font-medium">Select a date to unlock</span>
                </div>
              </div>
            )}

            {/* Themed left accent bar when focused/has content */}
            {start && currentNote && (
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full origin-top ${theme.activeBg} opacity-60`}
              />
            )}
          </div>

          {/* ── Footer: char counter ── */}
          {start && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end mt-1.5"
            >
              <span className={`text-[10px] font-mono transition-colors ${
                isAtLimit ? 'text-red-400 font-bold' :
                isNearLimit ? 'text-amber-400' :
                'text-gray-300'
              }`}>
                {charCount}/{MAX_CHARS}
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}