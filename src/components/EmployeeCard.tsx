import React, { useState, useRef, useEffect } from 'react';
import {
  GripVertical,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  X,
  User,
} from 'lucide-react';
import { Employee, Direction, getEmployeeName } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  directionsMap: Map<string, Direction>;
  allDirections: Direction[];
  allEmployees?: Employee[];
  currentlyDraggingDirectionId: string | null;
  onRemoveDirection: (employeeId: string, directionId: string) => void;
  onAddDirection: (employeeId: string, directionId: string) => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onOpenQuickAssign: (employee: Employee) => void;
  onDragStartEmployeeOrder?: (e: React.DragEvent, employee: Employee) => void;
  onDragOverEmployeeOrder?: (e: React.DragEvent, targetEmployee: Employee) => void;
  onDropEmployeeOrder?: (e: React.DragEvent, targetEmployee: Employee) => void;
  layoutStyle?: 'spacious' | 'compact';
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  directionsMap,
  allDirections,
  allEmployees = [],
  currentlyDraggingDirectionId,
  onRemoveDirection,
  onAddDirection,
  onEditEmployee,
  onDeleteEmployee,
  onOpenQuickAssign,
  onDragStartEmployeeOrder,
  onDragOverEmployeeOrder,
  onDropEmployeeOrder,
  layoutStyle = 'spacious',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [justDropped, setJustDropped] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setIsQuickAddOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const assignedDirections = (employee.directionIds || [])
    .map((id) => directionsMap.get(id))
    .filter((d): d is Direction => Boolean(d));

  const isAlreadyLinkedWithDragged =
    currentlyDraggingDirectionId !== null &&
    (employee.directionIds || []).includes(currentlyDraggingDirectionId);

  // Check if dragged direction is already held by another employee
  const otherHolderOfDragged =
    currentlyDraggingDirectionId !== null
      ? allEmployees.find(
          (e) => e.id !== employee.id && (e.directionIds || []).includes(currentlyDraggingDirectionId)
        )
      : null;

  const draggedDirectionObj = currentlyDraggingDirectionId
    ? directionsMap.get(currentlyDraggingDirectionId)
    : null;

  // Drag & Drop handlers for dropping a direction onto this employee
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);

    if (onDragOverEmployeeOrder) {
      onDragOverEmployeeOrder(e, employee);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.type === 'direction' && data.id) {
          onAddDirection(employee.id, data.id);
          setJustDropped(true);
          setTimeout(() => setJustDropped(false), 800);
          return;
        }
      }
    } catch {
      // ignore json parse error
    }

    if (currentlyDraggingDirectionId) {
      onAddDirection(employee.id, currentlyDraggingDirectionId);
      setJustDropped(true);
      setTimeout(() => setJustDropped(false), 800);
      return;
    }

    if (onDropEmployeeOrder) {
      onDropEmployeeOrder(e, employee);
    }
  };

  // Available directions not yet assigned to this employee
  const unassignedDirections = allDirections.filter(
    (dir) => !(employee.directionIds || []).includes(dir.id)
  );

  const empName = getEmployeeName(employee);
  const initials = empName
    ? empName
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'С';

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative rounded-2xl border transition-all duration-200 ${
        isDragOver
          ? otherHolderOfDragged
            ? 'bg-[#121212] border-rose-500 ring-2 ring-rose-500/40 shadow-xl'
            : isAlreadyLinkedWithDragged
            ? 'bg-[#121212] border-amber-500/60 ring-2 ring-amber-500/30'
            : 'bg-[#121212] border-[#F27D26] ring-2 ring-[#F27D26]/50 shadow-2xl shadow-[#F27D26]/20 scale-[1.008]'
          : justDropped
          ? 'bg-[#121212] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
          : 'bg-[#0a0a0a] border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-black/70'
      }`}
    >
      {/* Visual Drop Banner indicator */}
      {isDragOver && (
        <div
          className={`px-4 py-2.5 text-xs font-semibold rounded-t-2xl flex items-center justify-center gap-2 transition-colors ${
            otherHolderOfDragged
              ? 'bg-rose-950/60 text-rose-300 border-b border-rose-800/60'
              : isAlreadyLinkedWithDragged
              ? 'bg-amber-500/20 text-amber-300 border-b border-amber-500/30'
              : 'bg-[#F27D26]/20 text-[#F27D26] border-b border-[#F27D26]/30 animate-pulse'
          }`}
        >
          {otherHolderOfDragged ? (
            <span>
              ❌ «{draggedDirectionObj?.name}» уже занято сотрудником {getEmployeeName(otherHolderOfDragged)} (1 направление = 1 сотрудник)
            </span>
          ) : isAlreadyLinkedWithDragged ? (
            <span>Это направление уже назначено {empName}</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>
                Отпустите, чтобы закрепить направление {draggedDirectionObj ? `«${draggedDirectionObj.icon} ${draggedDirectionObj.name}»` : ''} за {empName}
              </span>
            </>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Top Header: Reorder Handle, Avatar, Name, Action Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            {/* Reorder drag handle */}
            <div
              draggable
              onDragStart={(e) => onDragStartEmployeeOrder && onDragStartEmployeeOrder(e, employee)}
              className="text-white/20 hover:text-white/60 transition-colors cursor-grab active:cursor-grabbing p-1 -ml-1 mt-1 rounded shrink-0"
              title="Потяните, чтобы изменить порядок сотрудников в списке"
            >
              <GripVertical className="w-4 h-4" />
            </div>

            {/* Avatar / Initials */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-md shrink-0 select-none ring-1 ring-white/10"
              style={{ backgroundColor: employee.avatarColor || '#3b82f6' }}
            >
              {initials}
            </div>

            {/* Name & Description */}
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
                {empName}
              </h3>

              {/* Only Description (no position or phone!) */}
              {employee.description ? (
                <p className="text-xs text-white/55 mt-1 leading-relaxed line-clamp-2">
                  {employee.description}
                </p>
              ) : (
                <p className="text-xs text-white/30 italic mt-0.5">
                  Описание не добавлено
                </p>
              )}
            </div>
          </div>

          {/* Action Menu (⋮) */}
          <div className="relative shrink-0 ml-2" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Меню действий"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-52 rounded-xl bg-[#141414] border border-white/10 shadow-2xl py-1 z-30 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onEditEmployee(employee);
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-white/40" />
                  <span>Редактировать</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenQuickAssign(employee);
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#F27D26]" />
                  <span>Назначить направления</span>
                </button>
                <div className="my-1 border-t border-white/10" />
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onDeleteEmployee(employee);
                  }}
                  className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-rose-400 hover:bg-rose-950/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Удалить сотрудника</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Separator */}
        <div className="my-4 border-t border-white/10" />

        {/* DIRECTIONS SECTION (Clearly visible as distinct cards, NOT tags!) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                Направления
              </span>
              <span className="text-xs font-mono bg-[#161616] border border-white/10 text-[#F27D26] px-2 py-0.5 rounded-md font-semibold">
                {assignedDirections.length}
              </span>
            </div>

            {/* Quick + Add direction button */}
            <div className="relative" ref={quickAddRef}>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                className="inline-flex items-center gap-1.5 text-xs text-[#F27D26] hover:text-[#ff8c3a] hover:bg-[#F27D26]/15 border border-[#F27D26]/30 bg-[#F27D26]/10 px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium"
                title="Закрепить направление за сотрудником"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Назначить</span>
              </button>

              {/* Quick Add Dropdown Popover */}
              {isQuickAddOpen && (
                <div className="absolute right-0 mt-1.5 w-72 rounded-xl bg-[#141414] border border-white/10 shadow-2xl p-2 z-40 text-xs">
                  <div className="text-[11px] font-semibold text-white/40 px-2.5 py-1 uppercase tracking-wider border-b border-white/10 mb-1">
                    Выберите направление
                  </div>
                  {unassignedDirections.length === 0 ? (
                    <div className="py-3 px-2 text-center text-white/40 text-xs">
                      Все направления уже назначены
                    </div>
                  ) : (
                    <div className="max-h-52 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                      {unassignedDirections.map((dir) => {
                        const holder = allEmployees.find(
                          (e) => e.id !== employee.id && (e.directionIds || []).includes(dir.id)
                        );
                        const isTaken = Boolean(holder);
                        const holderName = holder ? getEmployeeName(holder) : '';

                        return (
                          <button
                            key={dir.id}
                            type="button"
                            disabled={isTaken}
                            onClick={() => {
                              if (isTaken) return;
                              onAddDirection(employee.id, dir.id);
                              setIsQuickAddOpen(false);
                            }}
                            className={`w-full text-left flex items-center justify-between p-2 rounded-lg transition-colors ${
                              isTaken
                                ? 'opacity-40 cursor-not-allowed bg-white/[0.02] text-white/40'
                                : 'hover:bg-white/5 text-white/80 cursor-pointer'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base">{dir.icon}</span>
                              <div className="min-w-0">
                                <span className="font-semibold block truncate">{dir.name}</span>
                                {isTaken ? (
                                  <span className="text-[10px] text-rose-400 block truncate">
                                    🔒 Занято: {holderName}
                                  </span>
                                ) : (
                                  dir.description && (
                                    <span className="text-[10px] text-white/40 block truncate">
                                      {dir.description}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                            {isTaken ? (
                              <span className="text-[10px] text-rose-400 font-medium shrink-0 ml-1.5 px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-800/40">
                                Занято
                              </span>
                            ) : (
                              <Plus className="w-4 h-4 text-[#F27D26] shrink-0 ml-1.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DISTINCT DIRECTION CARDS (NOT A TAG!) */}
          {assignedDirections.length > 0 ? (
            <div className={`grid gap-2.5 ${layoutStyle === 'compact' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
              {assignedDirections.map((dir) => (
                <div
                  key={dir.id}
                  className="group/dir relative flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-white/10 hover:border-white/20 transition-all shadow-sm"
                  style={{
                    borderLeftColor: dir.color,
                    borderLeftWidth: '4px',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm ring-1 ring-white/10"
                      style={{ backgroundColor: `${dir.color}25` }}
                    >
                      {dir.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-white truncate">
                        {dir.name}
                      </div>
                      {dir.description && (
                        <div
                          className="text-[11px] text-white/45 truncate mt-0.5"
                          title={dir.description}
                        >
                          {dir.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveDirection(employee.id, dir.id);
                    }}
                    className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0 ml-2"
                    title={`Отвязать направление «${dir.name}»`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`p-4 rounded-xl border border-dashed text-center transition-colors ${
                isDragOver
                  ? 'border-[#F27D26]/70 bg-[#F27D26]/10 text-[#F27D26]'
                  : 'border-white/10 bg-[#080808]/40 text-white/40 hover:border-white/20'
              }`}
            >
              <p className="text-xs font-semibold text-white/60">Направления не закреплены</p>
              <p className="text-[11px] text-white/35 mt-1">
                Перетащите направление из панели выше или нажмите «Назначить»
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
