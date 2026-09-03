import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Network,
  Users,
  Layers,
  Table2,
  RotateCcw,
  Trash2,
  MoreVertical,
  Building2,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddEmployee: () => void;
  onAddDirection: () => void;
  onResetDemo: () => void;
  onClearAll: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  onViewModeChange,
  onAddEmployee,
  onAddDirection,
  onResetDemo,
  onClearAll,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'connections', label: 'Связи & Drag & Drop', icon: <Network className="w-4 h-4" /> },
    { id: 'matrix', label: 'Матрица ответственности', icon: <Table2 className="w-4 h-4" /> },
    { id: 'employees', label: 'Сотрудники', icon: <Users className="w-4 h-4" /> },
    { id: 'directions', label: 'Направления', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-white/10 bg-[#080808]/90 backdrop-blur-md sticky top-0 z-30">
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all ${isFullscreen ? 'max-w-none' : 'max-w-7xl'}`}>
        {/* Top bar: Brand & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26] shadow-sm shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                  Управление сотрудниками и направлениями
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 border border-white/10 rounded-full text-white/50">
                  Строительство
                </span>
                {isFullscreen && (
                  <span className="inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#F27D26]/20 border border-[#F27D26]/50 rounded-full text-[#F27D26]">
                    Фулл экран
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 leading-snug">
                Визуальное распределение строительных направлений с поддержкой Drag & Drop
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {/* Fullscreen Button */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border font-medium text-xs transition-all active:scale-95 cursor-pointer ${
                  isFullscreen
                    ? 'bg-[#F27D26]/20 border-[#F27D26]/60 text-[#F27D26] shadow-sm'
                    : 'bg-[#121212] hover:bg-white/5 border-white/10 text-white/70 hover:text-white'
                }`}
                title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран (все сотрудники рядом)'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isFullscreen ? 'Свернуть' : 'Фулл экран'}</span>
              </button>
            )}

            {/* Quick Reset Data Button */}
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121212] hover:bg-white/5 border border-white/10 text-white/70 hover:text-white font-medium text-xs transition-all active:scale-95 cursor-pointer"
              title="Обнулить все данные к чистому начальному состоянию с уникальными направлениями"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Обнулить данные</span>
            </button>

            <button
              type="button"
              onClick={onAddEmployee}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shadow-md shadow-[#F27D26]/15 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Добавить сотрудника</span>
            </button>

            <button
              type="button"
              onClick={onAddDirection}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121212] hover:bg-white/5 border border-white/10 text-white/80 hover:text-white font-medium text-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2]" />
              <span>Добавить направление</span>
            </button>

            {/* Extra Menu for reset/clear */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-[#121212] hover:bg-white/5 border border-white/10 text-white/40 hover:text-white/80 transition-colors cursor-pointer"
                title="Опции данных"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121212] border border-white/10 shadow-2xl py-1.5 z-40 text-xs">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider border-b border-white/5 mb-1">
                    Управление данными
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onResetDemo();
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Сбросить к демо-данным</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onClearAll();
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 text-rose-400 hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Очистить все данные</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-white/5 pt-2 pb-2">
          {tabs.map((tab) => {
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onViewModeChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white/5 text-[#F27D26] border border-[#F27D26]/40 shadow-sm'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
