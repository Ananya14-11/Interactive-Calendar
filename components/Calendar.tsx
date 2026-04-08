'use client'

import React, { useEffect, useState } from 'react';
import CalendarGrid from './CalendarGrid';
import HeroImage from './HeroImage';
import MonthNav from './MonthNav';
import NotesPanel from './NotesPanel';

export const monthThemes: { [key: number]: { color: string; bg: string; activeBg: string; img: string; label: string } } = {
  0: { label: "Winter Solstice", color: "text-blue-600", bg: "bg-blue-50", activeBg: "bg-blue-600", img: "https://picsum.photos/id/230/1000/800" },
  1: { label: "Frost & Fog", color: "text-cyan-600", bg: "bg-cyan-50", activeBg: "bg-cyan-600", img: "https://picsum.photos/id/231/1000/800" },
  2: { label: "Early Bloom", color: "text-emerald-600", bg: "bg-emerald-50", activeBg: "bg-emerald-600", img: "https://picsum.photos/id/232/1000/800" },
  3: { label: "Spring Rain", color: "text-pink-500", bg: "bg-pink-50", activeBg: "bg-pink-500", img: "https://picsum.photos/id/124/1000/800" },
  4: { label: "Full Bloom", color: "text-green-600", bg: "bg-green-50", activeBg: "bg-green-600", img: "https://picsum.photos/id/234/1000/800" },
  5: { label: "Summer Solstice", color: "text-amber-500", bg: "bg-amber-50", activeBg: "bg-amber-500", img: "https://picsum.photos/id/235/1000/800" },
  6: { label: "High Heat", color: "text-orange-600", bg: "bg-orange-50", activeBg: "bg-orange-600", img: "https://picsum.photos/id/236/1000/800" },
  7: { label: "August Dusk", color: "text-yellow-600", bg: "bg-yellow-50", activeBg: "bg-yellow-600", img: "https://picsum.photos/id/237/1000/800" },
  8: { label: "Autumn Harvest", color: "text-orange-800", bg: "bg-orange-100", activeBg: "bg-orange-800", img: "https://picsum.photos/id/238/1000/800" },
  9: { label: "Golden Leaf", color: "text-red-700", bg: "bg-red-50", activeBg: "bg-red-700", img: "https://picsum.photos/id/239/1000/800" },
  10: { label: "First Chill", color: "text-indigo-800", bg: "bg-indigo-50", activeBg: "bg-indigo-800", img: "https://picsum.photos/id/240/1000/800" },
  11: { label: "Deep Winter", color: "text-slate-800", bg: "bg-slate-100", activeBg: "bg-slate-800", img: "https://picsum.photos/id/241/1000/800" },
};

// Indian public holidays — key format: "YYYY-MM-DD"
export const indianHolidays: { [key: string]: string } = {
  // 2026 holidays
  "2026-01-01": "New Year's Day",
  "2026-01-14": "Makar Sankranti / Pongal",
  "2026-01-26": "Republic Day",
  "2026-02-26": "Maha Shivaratri",
  "2026-03-20": "Holi",
  "2026-03-21": "Holika Dahan",
  "2026-04-02": "Ram Navami",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. Ambedkar Jayanti / Tamil New Year",
  "2026-04-30": "Eid ul-Fitr",
  "2026-05-12": "Buddha Purnima",
  "2026-07-07": "Eid ul-Adha (Bakrid)",
  "2026-07-27": "Muharram",
  "2026-08-15": "Independence Day",
  "2026-08-27": "Janmashtami",
  "2026-09-17": "Ganesh Chaturthi",
  "2026-10-02": "Gandhi Jayanti / Dussehra",
  "2026-10-05": "Eid-e-Milad (Milad-un-Nabi)",
  "2026-10-20": "Diwali (Lakshmi Puja)",
  "2026-10-21": "Govardhan Puja",
  "2026-10-22": "Bhai Dooj",
  "2026-11-05": "Guru Nanak Jayanti",
  "2026-12-25": "Christmas Day",

  // 2025 holidays (for browsing back)
  "2025-01-01": "New Year's Day",
  "2025-01-14": "Makar Sankranti / Pongal",
  "2025-01-26": "Republic Day",
  "2025-02-26": "Maha Shivaratri",
  "2025-03-14": "Holi",
  "2025-04-06": "Ram Navami",
  "2025-04-10": "Mahavir Jayanti",
  "2025-04-14": "Dr. Ambedkar Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-12": "Buddha Purnima",
  "2025-06-07": "Eid ul-Adha (Bakrid)",
  "2025-07-06": "Muharram",
  "2025-08-15": "Independence Day",
  "2025-08-16": "Janmashtami",
  "2025-09-05": "Ganesh Chaturthi (Maharashtra)",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-02": "Dussehra",
  "2025-10-20": "Diwali",
  "2025-11-05": "Guru Nanak Jayanti",
  "2025-12-25": "Christmas Day",
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(1);
  const [range, setRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const saved = localStorage.getItem('calendar-notes-app');
    if (saved) {
      try { setNotes(JSON.parse(saved)); }
      catch (e) { console.error("Failed to load notes", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-notes-app', JSON.stringify(notes));
  }, [notes]);

  const goToPrevMonth = () => {
    setDirection(-1);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (date < range.start) {
      setRange({ start: date, end: range.start });
    } else {
      setRange({ ...range, end: date });
    }
  };

  const ringCount = 28;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-16 mb-20 relative">

      {/* --- Stacked Paper Layers --- */}
      <div className="absolute -bottom-3 left-8 right-8 h-10 bg-white/60 border border-gray-200 rounded-2xl shadow-sm -z-20 scale-[0.97]" />
      <div className="absolute -bottom-1.5 left-4 right-4 h-10 bg-white/80 border border-gray-200 rounded-2xl shadow-sm -z-10 scale-[0.99]" />

      {/* --- Main Calendar Container --- */}
      <div className="bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl border border-gray-100 relative ring-1 ring-black/5">

        {/* --- Responsive Spiral Coil --- */}
        <div className="absolute -top-6 left-0 right-0 h-10 flex justify-between items-center px-6 sm:px-10 pointer-events-none z-20">
          {Array.from({ length: ringCount }).map((_, i) => (
            <div key={i} className={`flex flex-col items-center relative h-full ${i > 15 ? 'hidden sm:flex' : 'flex'}`}>
              <div className="absolute w-[2px] sm:w-[3px] h-6 sm:h-8 rounded-full opacity-60 z-10"
                style={{ left: '50%', top: '-2px', transform: 'translateX(-50%) rotate(20deg)', background: 'linear-gradient(to bottom, #222, #000, #333)' }}
              />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-400 rounded-full shadow-inner relative mt-4 sm:mt-6 z-20 ring-1 ring-black/10" />
              <div className="absolute w-[3px] sm:w-[4px] h-7 sm:h-9 border-[1.5px] sm:border-2 border-black rounded-full shadow-md z-30"
                style={{ left: '50%', top: '-5px', transform: 'translateX(-50%) rotate(-15deg)', background: 'linear-gradient(to bottom, #000, #444, #000)', clipPath: 'ellipse(100% 70% at 50% 30%)' }}
              />
            </div>
          ))}
        </div>

        {/* --- Layout --- */}
        <div className="flex flex-col lg:flex-row pt-6 sm:pt-10 overflow-hidden rounded-2xl">

          {/* Left: Visuals & Memos */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:border-r border-gray-100 flex flex-col gap-6">
            <HeroImage month={currentDate.getMonth()} year={currentDate.getFullYear()} />
            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <NotesPanel selectedRange={range} notes={notes} setNotes={setNotes} />
            </div>
          </div>

          {/* Right: Navigation & Grid */}
          <div className="w-full lg:w-1/2 p-5 sm:p-8 flex flex-col justify-center bg-white">
            <MonthNav
              date={currentDate}
              setDate={setCurrentDate}
              onPrev={goToPrevMonth}
              onNext={goToNextMonth}
            />
            <div className="mt-2">
              <CalendarGrid
                currentDate={currentDate}
                direction={direction}
                range={range}
                onDateClick={handleDateClick}
                notes={notes}
              />
            </div>

            {/* Holiday Legend */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              <span>Indian public holiday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}