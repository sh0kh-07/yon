import React, { useState, useEffect } from 'react';
import {
  Layers,
  Users,
  Plus,
  Sparkles,
  Info,
  X,
  Search,
  LayoutList,
  LayoutGrid,
  Columns,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Direction, Employee, getEmployeeName } from '../types';
import { DirectionPaletteItem } from './DirectionPaletteItem';
import { EmployeeCard } from './EmployeeCard';

interface ConnectionsBoardProps {
  directions: Direction[];
  employees: Employee[];
  directionsMap: Map<string, Direction>;
  onAddDirectionToEmployee: (employeeId: string, directionId: string) => void;
  onRemoveDirectionFromEmployee: (employeeId: string, directionId: string) => void;
  onOpenAddEmployee: () => void;
  onOpenAddDirection: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onOpenQuickAssign: (employee: Employee) => void;
  onReorderEmployees: (newOrder: Employee[]) => void;
  onReorderDirections: (newOrder: Direction[]) => void;
  selectedDirectionFilter: string | null;
  onSelectDirectionFilter: (directionId: string | null) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const ConnectionsBoard: React.FC<ConnectionsBoardProps> = ({
  directions,
  employees,
  directionsMap,
  onAddDirectionToEmployee,
  onRemoveDirectionFromEmployee,
  onOpenAddEmployee,
  onOpenAddDirection,
  onEditEmployee,
  onDeleteEmployee,
  onOpenQuickAssign,
  onReorderEmployees,
  onReorderDirections,
  selectedDirectionFilter,
  onSelectDirectionFilter,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [draggingDirection, setDraggingDirection] = useState<Direction | null>(null);
  const [directionSearch, setDirectionSearch] = useState('');
  const [employeeSearch, setEmployeeSearch] = useState('');
  // view modes: 'columns' (Все сотрудники рядом), 'single' (Подряд в одну колонку), 'grid' (Сетка)
  const [viewMode, setViewMode] = useState<'columns' | 'single' | 'grid'>('columns');
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string | null>(null);
  const [draggedDirectionPaletteId, setDraggedDirectionPaletteId] = useState<string | null>(null);

  // Automatically switch to 'columns' (Рядом) when fullscreen is activated
  useEffect(() => {
    if (isFullscreen) {
      setViewMode('columns');
    }
  }, [isFullscreen]);

  // Direction drag handlers
  const handleDragStartDirection = (e: React.DragEvent, direction: Direction) => {
    setDraggingDirection(direction);
    e.dataTransfer.effectAllowed = 'copyMove';
    e.dataTransfer.setData('application/json', JSON.stringify({ type: 'direction', id: direction.id }));
    e.dataTransfer.setData('text/plain', direction.name);
  };

  const handleDragEndDirection = () => {
    setDraggingDirection(null);
  };

  // Reorder Employee Handlers
  const handleDragStartEmployeeOrder = (e: React.DragEvent, employee: Employee) => {
    setDraggedEmployeeId(employee.id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/employee-id', employee.id);
  };

  const handleDropEmployeeOrder = (e: React.DragEvent, targetEmployee: Employee) => {
    e.preventDefault();
    if (!draggedEmployeeId || draggedEmployeeId === targetEmployee.id) {
      setDraggedEmployeeId(null);
      return;
    }

    const currentIndex = employees.findIndex((e) => e.id === draggedEmployeeId);
    const targetIndex = employees.findIndex((e) => e.id === targetEmployee.id);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updated = [...employees];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      const reindexed = updated.map((emp, idx) => ({ ...emp, order: idx }));
      onReorderEmployees(reindexed);
    }
    setDraggedEmployeeId(null);
  };

  // Reorder Direction Handlers
  const handleDragStartDirectionOrder = (e: React.DragEvent, dir: Direction) => {
    setDraggedDirectionPaletteId(dir.id);
    handleDragStartDirection(e, dir);
  };

  const handleDropDirectionOrder = (e: React.DragEvent, targetDir: Direction) => {
    if (!draggedDirectionPaletteId || draggedDirectionPaletteId === targetDir.id) {
      setDraggedDirectionPaletteId(null);
      return;
    }
    const currentIndex = directions.findIndex((d) => d.id === draggedDirectionPaletteId);
    const targetIndex = directions.findIndex((d) => d.id === targetDir.id);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updated = [...directions];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      const reindexed = updated.map((d, idx) => ({ ...d, order: idx }));
      onReorderDirections(reindexed);
    }
    setDraggedDirectionPaletteId(null);
  };

  // Filtered directions
  const filteredDirections = directions.filter((d) =>
    d.name.toLowerCase().includes(directionSearch.toLowerCase()) ||
    (d.description && d.description.toLowerCase().includes(directionSearch.toLowerCase()))
  );

  // Filtered employees
  const displayEmployees = employees.filter((emp) => {
    const matchesDirection = selectedDirectionFilter
      ? emp.directionIds?.includes(selectedDirectionFilter)
      : true;

    const empName = getEmployeeName(emp).toLowerCase();
    const empDesc = (emp.description || '').toLowerCase();
    const query = employeeSearch.toLowerCase();
    const matchesSearch = !query || empName.includes(query) || empDesc.includes(query);

    return matchesDirection && matchesSearch;
  });

  const activeFilteredDirection = selectedDirectionFilter
    ? directionsMap.get(selectedDirectionFilter)
    : null;

  return (
    <div className="space-y-6">
      {/* 1. TOP INTERACTIVE DIRECTIONS DOCK */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 flex items-center justify-center text-[#F27D26]">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                Строительные направления
              </h2>
              <span className="text-xs font-mono bg-[#121212] border border-white/10 text-white/60 px-2.5 py-0.5 rounded-full font-semibold">
                {directions.length}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
              <span>
                <strong>Drag & Drop:</strong> Перетащите карточку направления на любого сотрудника ниже для мгновенного закрепления.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick search inside directions palette */}
            {directions.length > 3 && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={directionSearch}
                  onChange={(e) => setDirectionSearch(e.target.value)}
                  placeholder="Поиск направления..."
                  className="bg-[#121212] border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26] w-44"
                />
                {directionSearch && (
                  <button
                    type="button"
                    onClick={() => setDirectionSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onOpenAddDirection}
              className="inline-flex items-center gap-1.5 text-xs text-black font-bold bg-[#F27D26] hover:bg-[#ff8c3a] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#F27D26]/20 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Создать направление</span>
            </button>
          </div>
        </div>

        {/* Directions Grid / Ribbon */}
        {directions.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-white/10 bg-[#121212]/40">
            <p className="text-xs text-white/40 mb-2">Направления пока не созданы</p>
            <button
              type="button"
              onClick={onOpenAddDirection}
              className="inline-flex items-center gap-1.5 text-xs text-[#F27D26] hover:text-[#ff8c3a] font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать первое направление</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {filteredDirections.map((dir) => {
              const assignedEmp = employees.find((e) => (e.directionIds || []).includes(dir.id));
              const assignedCount = assignedEmp ? 1 : 0;
              const isFilterActive = selectedDirectionFilter === dir.id;

              return (
                <div
                  key={dir.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropDirectionOrder(e, dir)}
                >
                  <DirectionPaletteItem
                    direction={dir}
                    assignedCount={assignedCount}
                    assignedEmployee={assignedEmp}
                    isDragging={draggingDirection?.id === dir.id}
                    onDragStart={(e) => handleDragStartDirectionOrder(e, dir)}
                    onDragEnd={handleDragEndDirection}
                    onClick={() =>
                      onSelectDirectionFilter(isFilterActive ? null : dir.id)
                    }
                    isActiveFilter={isFilterActive}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* Active direction filter indicator bar */}
        {selectedDirectionFilter && activeFilteredDirection && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs bg-[#121212]/50 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-white/60">Показаны сотрудники с направлением:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#F27D26]/20 border border-[#F27D26]/40 text-white font-semibold">
                <span>{activeFilteredDirection.icon}</span>
                <span>{activeFilteredDirection.name}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectDirectionFilter(null)}
              className="text-[#F27D26] hover:text-[#ff8c3a] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Показать всех сотрудников</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. MAIN SECTION: СОТРУДНИКИ ПОДРЯД (Sequential Employee Stream) */}
      <div className="space-y-4">
        {/* Header of employees stream */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080808] border border-white/10 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                  Сотрудники подряд
                </h2>
                <span className="text-xs font-mono bg-[#121212] border border-white/10 text-white/60 px-2.5 py-0.5 rounded-full font-semibold">
                  {displayEmployees.length}
                </span>
              </div>
              <p className="text-xs text-white/40 mt-0.5">
                Имя, описание обязанностей и четко оформленные строительные направления
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Поиск сотрудника..."
                className="bg-[#121212] border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26] w-48"
              />
              {employeeSearch && (
                <button
                  type="button"
                  onClick={() => setEmployeeSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle: Columns (Рядом) vs Single (Подряд) vs Grid (Сетка) */}
            <div className="flex items-center p-1 bg-[#121212] border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('columns')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'columns'
                    ? 'bg-[#F27D26] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Отображать всех сотрудников рядом в горизонтальный ряд"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Рядом</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'single'
                    ? 'bg-[#F27D26] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Отображать сотрудников в одну просторную колонку подряд"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Подряд</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#F27D26] text-black font-bold shadow-sm'
                    : 'text-white/60 hover:text-white'
                }`}
                title="Отображать сотрудников в сетку карточек"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Сетка</span>
              </button>
            </div>

            {/* Fullscreen Button */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 cursor-pointer ${
                  isFullscreen
                    ? 'bg-[#F27D26]/20 border-[#F27D26]/60 text-[#F27D26]'
                    : 'bg-[#121212] hover:bg-white/5 border-white/10 text-white/60 hover:text-white'
                }`}
                title={isFullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран (все сотрудники рядом)'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Свернуть' : 'Фулл экран'}</span>
              </button>
            )}

            {/* Add employee button */}
            <button
              type="button"
              onClick={onOpenAddEmployee}
              className="inline-flex items-center gap-1.5 text-xs text-black font-bold bg-[#F27D26] hover:bg-[#ff8c3a] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-[#F27D26]/20 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Добавить сотрудника</span>
            </button>
          </div>
        </div>

        {/* Empty state */}
        {displayEmployees.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-[#080808]/50">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white/80 mb-1">
              {selectedDirectionFilter
                ? 'В этом направлении пока нет сотрудников'
                : employeeSearch
                ? 'Сотрудники не найдены'
                : 'Список сотрудников пуст'}
            </h3>
            <p className="text-xs text-white/40 max-w-sm mx-auto mb-4 leading-relaxed">
              {selectedDirectionFilter
                ? 'Перетащите направление на сотрудника из списка или сбросьте фильтр'
                : employeeSearch
                ? 'Попробуйте изменить поисковый запрос'
                : 'Добавьте первого сотрудника, чтобы закрепить за ним направления'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {selectedDirectionFilter ? (
                <button
                  type="button"
                  onClick={() => onSelectDirectionFilter(null)}
                  className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-white/5 border border-white/10 text-xs font-medium text-white/80 transition-colors"
                >
                  Показать всех сотрудников
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAddEmployee}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shadow-md shadow-[#F27D26]/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Добавить сотрудника</span>
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'columns' ? (
          /* РЯДОМ: Горизонтальный ряд сотрудников с прокруткой и свободным размещением */
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/40 px-1">
              <span>Сотрудники расположены рядом (горизонтальная раскладка)</span>
              <span>Всего: {displayEmployees.length}</span>
            </div>
            <div className="overflow-x-auto pb-4 pt-1 scrollbar-thin">
              <div className="flex items-start gap-4 min-w-max">
                {displayEmployees.map((emp) => (
                  <div key={emp.id} className="w-[350px] sm:w-[390px] shrink-0 flex flex-col">
                    <EmployeeCard
                      employee={emp}
                      directionsMap={directionsMap}
                      allDirections={directions}
                      allEmployees={employees}
                      currentlyDraggingDirectionId={draggingDirection?.id || null}
                      onAddDirection={onAddDirectionToEmployee}
                      onRemoveDirection={onRemoveDirectionFromEmployee}
                      onEditEmployee={onEditEmployee}
                      onDeleteEmployee={onDeleteEmployee}
                      onOpenQuickAssign={onOpenQuickAssign}
                      onDragStartEmployeeOrder={handleDragStartEmployeeOrder}
                      onDropEmployeeOrder={handleDropEmployeeOrder}
                      layoutStyle="compact"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List of Employee Cards: in 'single' mode (1 wide column подряд) or 'grid' mode (2-3 columns) */
          <div
            className={`grid gap-4 ${
              viewMode === 'single' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {displayEmployees.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                directionsMap={directionsMap}
                allDirections={directions}
                allEmployees={employees}
                currentlyDraggingDirectionId={draggingDirection?.id || null}
                onAddDirection={onAddDirectionToEmployee}
                onRemoveDirection={onRemoveDirectionFromEmployee}
                onEditEmployee={onEditEmployee}
                onDeleteEmployee={onDeleteEmployee}
                onOpenQuickAssign={onOpenQuickAssign}
                onDragStartEmployeeOrder={handleDragStartEmployeeOrder}
                onDropEmployeeOrder={handleDropEmployeeOrder}
                layoutStyle={viewMode === 'single' ? 'spacious' : 'compact'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
