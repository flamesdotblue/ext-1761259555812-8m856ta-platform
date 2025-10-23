import React, { useEffect, useState } from 'react';
import { Wifi, Menu } from 'lucide-react';

export default function Taskbar({ onStartClick }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      className="fixed bottom-0 left-0 right-0 h-10
      bg-[linear-gradient(180deg,#d3cbc1,#c6bdb2)]
      [box-shadow:inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-2px_0_rgba(0,0,0,0.15),0_-4px_16px_rgba(0,0,0,0.25)]
      border-t border-[#b9b0a6]/80 flex items-center px-2 gap-2"
    >
      <button
        onClick={onStartClick}
        className="flex items-center gap-2 px-3 h-8 rounded
        bg-[linear-gradient(180deg,#e5dccf,#d8cfc1)] border border-[#a79d92]
        [box-shadow:inset_2px_2px_0_rgba(255,255,255,0.9),inset_-2px_-2px_0_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.2)]
        hover:brightness-105 active:translate-y-px active:[box-shadow:inset_1px_1px_0_rgba(0,0,0,0.05),inset_-1px_-1px_0_rgba(0,0,0,0.25)]"
        aria-label="Open Start Menu"
      >
        <Menu className="w-4 h-4" aria-hidden />
        <span className="text-sm">Start</span>
      </button>
      <div className="ml-auto flex items-center gap-3 pr-2">
        <Wifi className="w-4 h-4 text-sky-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]" aria-label="Network status: connected" />
        <div aria-label={`Time ${timeStr}`} className="text-sm tabular-nums">
          {timeStr}
        </div>
      </div>
    </div>
  );
}
