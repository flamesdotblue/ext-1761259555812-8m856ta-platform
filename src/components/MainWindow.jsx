import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MainWindow({ title, pos, onMove, onClose, items, selectedId, onOpenItem }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!dragging) return;
      onMove({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
    const onMouseUp = () => setDragging(false);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging, offset, onMove]);

  return (
    <section
      ref={ref}
      role="dialog"
      aria-label={title}
      aria-modal={false}
      className="absolute z-40 w-[min(720px,92vw)] h-[min(420px,60vh)]
      bg-[linear-gradient(180deg,#e9e5de,#dcd6cd)] border border-[#a79d92]
      [box-shadow:inset_2px_2px_0_rgba(255,255,255,0.9),inset_-2px_-2px_0_rgba(0,0,0,0.12),0_20px_40px_rgba(0,0,0,0.3)]
      rounded-md overflow-hidden"
      style={{ left: pos.x, top: pos.y }}
    >
      <div
        className="h-9 cursor-move flex items-center justify-between px-2
        bg-[linear-gradient(180deg,#4d6f8f,#3c5974)] text-[#e7f1ff]
        [box-shadow:inset_0_1px_0_rgba(255,255,255,0.35)]"
        onMouseDown={(e) => {
          const rect = ref.current?.getBoundingClientRect();
          if (!rect) return;
          setDragging(true);
          setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        <div className="font-semibold text-sm tracking-wide">{title}</div>
        <button
          aria-label="Close window"
          onClick={onClose}
          className="w-6 h-6 grid place-items-center rounded-sm
          bg-[linear-gradient(180deg,#e5dccf,#d8cfc1)] border border-[#a79d92]
          text-slate-800 hover:brightness-105 active:translate-y-px"
        >
          <X className="w-3.5 h-3.5" aria-hidden />
        </button>
      </div>
      <div className="h-full overflow-auto p-3">
        <div className="text-xs text-slate-600 mb-2">Desktop Items</div>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
          role="list"
          aria-label="Items list"
        >
          {items.map((it) => (
            <button
              key={it.id}
              role="listitem"
              onDoubleClick={() => onOpenItem(it.id)}
              className={`flex items-center gap-2 px-2 py-2 rounded border
              ${selectedId === it.id ? 'border-sky-700 bg-[#e6ecf3]' : 'border-transparent hover:border-[#a79d92] hover:bg-[#efefe9]'}
              [box-shadow:inset_1px_1px_0_rgba(255,255,255,0.6),inset_-1px_-1px_0_rgba(0,0,0,0.08)]`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-sky-800" aria-hidden />
              <span className="text-sm text-slate-800">{it.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
