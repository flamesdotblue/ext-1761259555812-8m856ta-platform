import React, { useEffect, useRef } from 'react';
import { Folder, FileText, Settings, Star } from 'lucide-react';

export default function StartMenu({ onClose, onOpenApp }) {
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const items = [
    { id: 'explorer', label: 'Explorer', icon: Folder },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="Start menu"
      className="fixed left-2 bottom-12 w-56 rounded-md overflow-hidden z-50
      bg-[linear-gradient(180deg,#e6ded2,#d7cdbf)] border border-[#a79d92]
      [box-shadow:inset_2px_2px_0_rgba(255,255,255,0.9),inset_-2px_-2px_0_rgba(0,0,0,0.1),0_10px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="bg-[#3c5974] text-[#e7f1ff] px-3 py-2 text-sm tracking-wide">Retro Start</div>
      <ul className="p-2 space-y-1">
        {items.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              role="menuitem"
              onClick={() => onOpenApp(id)}
              className="flex items-center gap-3 w-full text-left px-2 py-2 rounded
              hover:bg-[#e9f0f7] active:bg-[#dfe8f1]
              focus:outline-none focus:ring-2 focus:ring-sky-700"
            >
              <Icon className="w-4 h-4 text-sky-800" aria-hidden />
              <span className="text-sm text-slate-800">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
