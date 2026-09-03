import React, { useState } from 'react';
import {
  Users,
  Plus,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react';
import { Employee, Direction, getEmployeeName } from '../types';
import { EmployeeCard } from './EmployeeCard';

interface EmployeesViewProps {
  employees: Employee[];
  directions: Direction[];
  directionsMap: Map<string, Direction>;
  onOpenAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onOpenQuickAssign: (employee: Employee) => void;
  onAddDirectionToEmployee: (employeeId: string, directionId: string) => void;
  onRemoveDirectionFromEmployee: (employeeId: string, directionId: string) => void;
  onReorderEmployees: (newEmployees: Employee[]) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  directions,
  directionsMap,
  onOpenAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onOpenQuickAssign,
  onAddDirectionToEmployee,
  onRemoveDirectionFromEmployee,
  onReorderEmployees,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDirectionId, setFilterDirectionId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'directionsCount'>('order');
  const [layoutStyle, setLayoutStyle] = useState<'spacious' | 'compact'>('spacious');
  const [draggedEmployeeId, setDraggedEmployeeId] = useState<string | null>(null);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const name = getEmployeeName(emp).toLowerCase();
    const desc = (emp.description || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesDirection =
      filterDirectionId === 'all' ||
      (filterDirectionId === 'none'
        ? !emp.directionIds || emp.directionIds.length === 0
        : emp.directionIds?.includes(filterDirectionId));
    return matchesSearch && matchesDirection;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    if (sortBy === 'name') {
      return getEmployeeName(a).localeCompare(getEmployeeName(b), 'ru');
    }
    if (sortBy === 'directionsCount') {
      return (b.directionIds?.length || 0) - (a.directionIds?.length || 0);
    }
    return (a.order ?? 0) - (b.order ?? 0);
  });

  // Drag to reorder
  const handleDragStart = (e: React.DragEvent, emp: Employee) => {
    setDraggedEmployeeId(emp.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetEmp: Employee) => {
    e.preventDefault();
    if (!draggedEmployeeId || draggedEmployeeId === targetEmp.id) {
      setDraggedEmployeeId(null);
      return;
    }

    const currentIndex = employees.findIndex((e) => e.id === draggedEmployeeId);
    const targetIndex = employees.findIndex((e) => e.id === targetEmp.id);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const updated = [...employees];
      const [moved] = updated.splice(currentIndex, 1);
      updated.splice(targetIndex, 0, moved);
      const reindexed = updated.map((emp, idx) => ({ ...emp, order: idx }));
      onReorderEmployees(reindexed);
    }
    setDraggedEmployeeId(null);
  };

  return (
    <div className="space-y-4">
      {/* Top action and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080808] border border-white/10 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Сотрудники компании
            </h2>
            <span className="text-xs font-mono bg-[#121212] border border-white/10 text-white/50 px-2 py-0.5 rounded-full">
              {employees.length}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Список специалистов, их описание и закрепленные строительные направления
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск сотрудника..."
              className="w-full bg-[#121212] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          {/* Direction filter */}
          <div className="relative">
            <select
              value={filterDirectionId}
              onChange={(e) => setFilterDirectionId(e.target.value)}
              className="bg-[#121212] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-[#F27D26] cursor-pointer"
            >
              <option value="all">Все направления</option>
              <option value="none">Без направлений</option>
              {directions.map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {dir.icon} {dir.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121212] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white/80 focus:outline-none focus:border-[#F27D26] cursor-pointer"
            >
              <option value="order">По порядку</option>
              <option value="name">По имени (А-Я)</option>
              <option value="directionsCount">По числу направлений</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shrink-0 cursor-pointer shadow-sm shadow-[#F27D26]/15"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Добавить сотрудника</span>
          </button>
        </div>
      </div>

      {/* Grid of employees */}
      {sortedEmployees.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-[#080808]/50">
          <Users className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white/80 mb-1">
            Сотрудники не найдены
          </h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
            Попробуйте изменить параметры поиска или добавить нового сотрудника
          </p>
          <button
            type="button"
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F27D26] hover:bg-[#ff8c3a] text-black font-bold text-xs transition-all shadow-md shadow-[#F27D26]/15"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить сотрудника</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedEmployees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              directionsMap={directionsMap}
              allDirections={directions}
              allEmployees={employees}
              currentlyDraggingDirectionId={null}
              onAddDirection={onAddDirectionToEmployee}
              onRemoveDirection={onRemoveDirectionFromEmployee}
              onEditEmployee={onEditEmployee}
              onDeleteEmployee={onDeleteEmployee}
              onOpenQuickAssign={onOpenQuickAssign}
              onDragStartEmployeeOrder={handleDragStart}
              onDropEmployeeOrder={handleDrop}
              layoutStyle="spacious"
            />
          ))}
        </div>
      )}
    </div>
  );
};
