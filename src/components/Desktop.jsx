import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Folder, FileText } from 'lucide-react';

function useBoundingClientRect(ref) {
  const [rect, setRect] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setRect(el.getBoundingClientRect());
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [ref]);
  return rect;
}

function IconGraphic({ type }) {
  const common = 'drop-shadow-[0_2px_0_rgba(0,0,0,0.25)]';
  if (type === 'folder') return <Folder className={`w-8 h-8 text-sky-700 ${common}`} aria-hidden />;
  return <FileText className={`w-8 h-8 text-slate-700 ${common}`} aria-hidden />;
}

export default function Desktop({ items, selectedId, onSelect, onOpenItem, onMoveItem, onInteract }) {
  const deskRef = useRef(null);
  const rect = useBoundingClientRect(deskRef);
  const [dragOverId, setDragOverId] = useState(null);
  const [keyboardIndex, setKeyboardIndex] = useState(0);

  useEffect(() => {
    if (!items.length) return;
    const idx = items.findIndex(i => i.id === selectedId);
    setKeyboardIndex(idx >= 0 ? idx : 0);
  }, [selectedId, items]);

  const clamp = useCallback((val, min, max) => Math.max(min, Math.min(max, val)), []);

  const handleDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id || !rect) return;
    const x = clamp(e.clientX - rect.left - 32, 8, rect.width - 96);
    const y = clamp(e.clientY - rect.top - 32, 8, rect.height - 140); // leave room for taskbar
    onMoveItem(id, Math.round(x / 20) * 20, Math.round(y / 20) * 20);
    setDragOverId(null);
  };

  const handleKeyDown = (e) => {
    if (!items.length) return;
    const cols = Math.max(1, Math.floor((rect?.width || 1) / 160));
    let idx = keyboardIndex;
    if (e.key === 'ArrowRight') idx = (idx + 1) % items.length;
    if (e.key === 'ArrowLeft') idx = (idx - 1 + items.length) % items.length;
    if (e.key === 'ArrowDown') idx = (idx + cols) % items.length;
    if (e.key === 'ArrowUp') idx = (idx - cols + items.length) % items.length;
    if (idx !== keyboardIndex && ['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)) {
      e.preventDefault();
      onSelect(items[idx].id);
      setKeyboardIndex(idx);
    }
    if (e.key === 'Enter' && selectedId) {
      e.preventDefault();
      onOpenItem(selectedId);
    }
  };

  return (
    <div
      ref={deskRef}
      onClick={onInteract}
      onKeyDown={handleKeyDown}
      role="listbox"
      aria-label="Desktop"
      tabIndex={0}
      className="absolute inset-0 pb-10 outline-none"
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={handleDrop}
    >
      {items.map((item) => {
        const selected = selectedId === item.id;
        const isDragOver = dragOverId === item.id;
        return (
          <button
            key={item.id}
            role="option"
            aria-selected={selected}
            tabIndex={-1}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', item.id);
              const img = new Image();
              img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%228%22 fill=%22%23cfd6df%22 stroke=%22%23788%22/%3E%3C/svg%3E';
              e.dataTransfer.setDragImage(img, 32, 32);
            }}
            onDragEnd={() => setDragOverId(null)}
            onDragEnter={() => setDragOverId(item.id)}
            onDragLeave={() => setDragOverId(null)}
            onFocus={() => onSelect(item.id)}
            onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}
            onDoubleClick={() => onOpenItem(item.id)}
            className={
              `group absolute w-28 text-[13px] leading-tight break-words p-2 rounded-md
              transition-transform active:translate-y-px
              [box-shadow:inset_2px_2px_0_rgba(255,255,255,0.8),inset_-2px_-2px_0_rgba(0,0,0,0.15),0_6px_14px_rgba(0,0,0,0.15)]
              ${selected ? 'bg-[#e6ecf3]/90 ring-2 ring-sky-700' : 'bg-[#e0e6ed]/80 hover:bg-[#e8eef5]'}
              `}
            style={{ left: item.x, top: item.y }}
          >
            <div className={`mx-auto mb-1 grid place-items-center w-12 h-12 rounded-md
              ${isDragOver ? 'outline outline-2 outline-sky-600' : 'outline-none'}`}
            >
              <IconGraphic type={item.type} />
            </div>
            <div className={`text-center ${selected ? 'text-sky-900' : 'text-slate-800'} drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]`}>
              {item.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}
