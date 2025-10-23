import React, { useState, useCallback } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import StartMenu from './components/StartMenu';
import MainWindow from './components/MainWindow';

const initialItems = [
  { id: 'f1', name: 'Projects', type: 'folder', x: 40, y: 40 },
  { id: 'f2', name: 'Notes.txt', type: 'file', x: 40, y: 140 },
  { id: 'f3', name: 'Archive', type: 'folder', x: 40, y: 240 },
  { id: 'f4', name: 'Readme.md', type: 'file', x: 220, y: 40 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(null);
  const [startOpen, setStartOpen] = useState(false);
  const [windowOpen, setWindowOpen] = useState(true);
  const [windowPos, setWindowPos] = useState({ x: 320, y: 120 });

  const onMoveItem = useCallback((id, x, y) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, x, y } : it)));
  }, []);

  const onOpenItem = useCallback((id) => {
    setSelectedId(id);
    setWindowOpen(true);
  }, []);

  const onToggleStart = useCallback(() => setStartOpen(v => !v), []);
  const onCloseStart = useCallback(() => setStartOpen(false), []);

  return (
    <div className="w-screen h-screen overflow-hidden font-mono select-none bg-[repeating-linear-gradient(135deg,#d8d0c7_0px,#d8d0c7_10px,#d1c8be_10px,#d1c8be_20px)] text-slate-900">
      <div className="relative w-full h-full">
        <Desktop
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onOpenItem={onOpenItem}
          onMoveItem={onMoveItem}
          onInteract={() => setStartOpen(false)}
        />

        {windowOpen && (
          <MainWindow
            title="Retro Explorer"
            pos={windowPos}
            onMove={setWindowPos}
            onClose={() => setWindowOpen(false)}
            items={items}
            selectedId={selectedId}
            onOpenItem={onOpenItem}
          />
        )}

        <Taskbar onStartClick={onToggleStart} />
        {startOpen && <StartMenu onClose={onCloseStart} onOpenApp={(app) => { setWindowOpen(true); setStartOpen(false); }} />}
      </div>
    </div>
  );
}
