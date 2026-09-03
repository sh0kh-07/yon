import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  Users,
  Layers,
  Search,
  UserPlus,
  X,
} from 'lucide-react';
import { Direction, Employee, getEmployeeName } from '../types';

interface DirectionsViewProps {
  directions: Direction[];
  employees: Employee[];
  onOpenAddDirection: () => void;
  onEditDirection: (direction: Direction) => void;
  onDeleteDirection: (direction: Direction) => void;
  onReorderDirections: (newDirections: Direction[]) => void;
  onToggleConnection: (employeeId: string, directionId: string) => void;
}

export const DirectionsView: React.FC<DirectionsViewProps> = ({
  directions,
  employees,
  onOpenAddDirection,
  onEditDirection,
  onDeleteDirection,
  onReorderDirections,
  onToggleConnection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedDirId, setDraggedDirId] = useState<string | null>(null);
  const [assigningForDirId, setAssigningForDirId] = useState<string | null>(null);

  const filteredDirections = directions.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Drag to reorder handlers
  const handleDragStart = (e: React.DragEvent, dir: Direction) => {
    setDraggedDirId(dir.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dir.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDir: Direction) => {
    e.preventDefault();
    if (!draggedDirId || draggedDirId === targetDir.id) {
      setDraggedDirId(null);
      return;
    }

    const currentIndex = directions.findIndex((d) => d.id === draggedDirId);
    const targetIndex = directions.findIndex((d) => d.id === targetDir.id);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updated = [...directions];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      const reindexed = updated.map((d, idx) => ({ ...d, order: idx }));
      onReorderDirections(reindexed);
    }
    setDraggedDirId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080808] border border-white/10 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Строительные направления
            </h2>
            <span className="text-xs font-mono bg-[#121212] border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
              {directions.length}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Управление строительными направлениями и закрепленными специалистами
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск направления..."
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          <button
            type="button"
            onClick={onOpenAddDirection}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm shadow-[#F27D26]/15"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Создать</span>
          </button>
        </div>
      </div>

      {/* Grid of Directions */}
      {filteredDirections.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-[#080808]/50">
          <Layers className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white/80 mb-1">
            Пока нет строительных направлений
          </h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
            Добавьте направления (например: Металлы, Блоки, Электрика), чтобы распределять задачи в команде
          </p>
          <button
            type="button"
            onClick={onOpenAddDirection}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shadow-md shadow-[#F27D26]/15"
          >
            <Plus className="w-4 h-4" />
            <span>Создать направление</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDirections.map((dir) => {
            const assignedEmployees = employees.filter((e) =>
              e.directionIds?.includes(dir.id)
            );
            const isUnassigned = assignedEmployees.length === 0;

            return (
              <div
                key={dir.id}
                draggable
                onDragStart={(e) => handleDragStart(e, dir)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dir)}
                className={`rounded-2xl border transition-all p-5 flex flex-col justify-between select-none ${
                  draggedDirId === dir.id
                    ? 'opacity-40 border-dashed border-[#F27D26]'
                    : 'bg-[#121212] border-white/10 hover:border-[#F27D26]/40 hover:bg-[#151515] shadow-lg'
                }`}
                style={{
                  borderTopColor: dir.color,
                  borderTopWidth: '3px',
                }}
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                        style={{ backgroundColor: `${dir.color}20` }}
                      >
                        {dir.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">
                          {dir.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 ${
                            isUnassigned
                              ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50'
                              : 'bg-white/5 text-white/70 border border-white/10'
                          }`}
                        >
                          <Users className="w-2.5 h-2.5" />
                          <span>
                            {assignedEmployees.length}{' '}
                            {assignedEmployees.length === 1
                              ? 'сотрудник'
                              : assignedEmployees.length >= 2 && assignedEmployees.length <= 4
                              ? 'сотрудника'
                              : 'сотрудников'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions: Reorder grip, Edit, Delete */}
                    <div className="flex items-center gap-1 text-white/40">
                      <div
                        className="p-1 hover:text-white cursor-grab active:cursor-grabbing"
                        title="Потяните, чтобы изменить порядок направлений"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => onEditDirection(dir)}
                        className="p-1 hover:text-[#F27D26] transition-colors"
                        title="Редактировать направление"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteDirection(dir)}
                        className="p-1 hover:text-rose-400 transition-colors"
                        title="Удалить направление"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {dir.description && (
                    <p className="text-xs text-white/40 mt-3 leading-relaxed">
                      {dir.description}
                    </p>
                  )}
                </div>

                {/* Assigned employees list */}
                <div className="mt-4 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
                      Ответственные
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAssigningForDirId(
                          assigningForDirId === dir.id ? null : dir.id
                        )
                      }
                      className="text-[11px] text-[#F27D26] hover:text-[#ff8c3a] font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>{assigningForDirId === dir.id ? 'Скрыть' : 'Назначить'}</span>
                    </button>
                  </div>

                  {/* Inline assign quick dropdown */}
                  {assigningForDirId === dir.id && (
                    <div className="mb-3 p-2 rounded-xl bg-[#080808] border border-white/10 text-xs space-y-1 max-h-48 overflow-y-auto">
                      <div className="text-[10px] text-white/40 uppercase font-semibold px-1 py-0.5">
                        {assignedEmployees.length > 0
                          ? 'Текущий куратор (нажмите для отвязки) или смените:'
                          : 'Выберите ответственного сотрудника (1 куратор):'}
                      </div>
                      {employees.map((emp) => {
                        const isConnected = emp.directionIds?.includes(dir.id);
                        const isOtherConnected = !isConnected && assignedEmployees.length > 0;
                        const empName = getEmployeeName(emp);
                        return (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => onToggleConnection(emp.id, dir.id)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors cursor-pointer ${
                              isConnected
                                ? 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/40 font-semibold'
                                : isOtherConnected
                                ? 'hover:bg-white/5 text-white/60 hover:text-white'
                                : 'hover:bg-white/5 text-white/80'
                            }`}
                          >
                            <span className="truncate">{empName}</span>
                            <span className="text-xs font-bold">
                              {isConnected ? '✓ Закреплен' : isOtherConnected ? 'Заменить' : '+ Назначить'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {assignedEmployees.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {assignedEmployees.map((emp) => {
                        const empName = getEmployeeName(emp);
                        const initial = empName ? empName.charAt(0).toUpperCase() : 'С';
                        return (
                          <span
                            key={emp.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/90"
                          >
                            <span
                              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                              style={{ backgroundColor: emp.avatarColor || '#3b82f6' }}
                            >
                              {initial}
                            </span>
                            <span className="truncate max-w-[140px] font-medium">
                              {empName}
                            </span>
                            <button
                              type="button"
                              onClick={() => onToggleConnection(emp.id, dir.id)}
                              className="hover:text-rose-400 text-white/40 transition-colors ml-0.5 cursor-pointer"
                              title={`Отвязать сотрудника ${empName}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-white/30 italic">
                      Куратор не назначен
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
