import React from 'react';
import { Users, Layers, GitBranch, UserX, AlertTriangle } from 'lucide-react';
import { Employee, Direction, FilterState } from '../types';

interface StatsCardsProps {
  employees: Employee[];
  directions: Direction[];
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  employees,
  directions,
  filters,
  onFilterChange,
}) => {
  const totalEmployees = employees.length;
  const totalDirections = directions.length;
  const totalConnections = employees.reduce((acc, emp) => acc + (emp.directionIds?.length || 0), 0);
  const unassignedEmployees = employees.filter((emp) => !emp.directionIds || emp.directionIds.length === 0).length;

  // Directions with 0 assigned employees
  const unassignedDirections = directions.filter((dir) => {
    return !employees.some((emp) => emp.directionIds?.includes(dir.id));
  }).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {/* 1. Employees */}
      <button
        type="button"
        onClick={() => onFilterChange({ employeeStatus: 'all', directionId: 'all' })}
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
          filters.employeeStatus === 'all' && filters.directionId === 'all' && !filters.search
            ? 'bg-white/5 border-[#F27D26]/60 shadow-md ring-1 ring-[#F27D26]/40'
            : 'bg-[#121212] border-white/10 hover:bg-white/5 hover:border-[#F27D26]/40'
        }`}
      >
        <div className="flex items-center justify-between text-white/40 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Сотрудников</span>
          <Users className="w-4 h-4 text-sky-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-[#F27D26] tracking-tight">{totalEmployees}</div>
        <div className="text-[11px] text-white/40 mt-0.5">В команде</div>
      </button>

      {/* 2. Directions */}
      <button
        type="button"
        onClick={() => onFilterChange({ directionId: 'all' })}
        className="text-left p-3.5 rounded-xl border bg-[#121212] border-white/10 hover:bg-white/5 hover:border-[#F27D26]/40 transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between text-white/40 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Направлений</span>
          <Layers className="w-4 h-4 text-[#F27D26]" />
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">{totalDirections}</div>
        <div className="text-[11px] text-white/40 mt-0.5">Строительных линий</div>
      </button>

      {/* 3. Connections */}
      <div className="p-3.5 rounded-xl border bg-[#121212] border-white/10 select-none">
        <div className="flex items-center justify-between text-white/40 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Всего связей</span>
          <GitBranch className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white tracking-tight">{totalConnections}</div>
        <div className="text-[11px] text-white/40 mt-0.5">
          {totalEmployees > 0 ? `~${(totalConnections / totalEmployees).toFixed(1)} на чел.` : '0'}
        </div>
      </div>

      {/* 4. Without directions (Clickable alert) */}
      <button
        type="button"
        onClick={() =>
          onFilterChange({
            employeeStatus: filters.employeeStatus === 'without-directions' ? 'all' : 'without-directions',
            directionId: 'all',
          })
        }
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
          filters.employeeStatus === 'without-directions'
            ? 'bg-[#F27D26]/10 border-[#F27D26] ring-1 ring-[#F27D26]/40'
            : unassignedEmployees > 0
            ? 'bg-[#121212] border-amber-500/40 hover:bg-white/5 hover:border-amber-500/60'
            : 'bg-[#121212] border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between text-white/40 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Без направлений</span>
          <UserX className={`w-4 h-4 ${unassignedEmployees > 0 ? 'text-[#F27D26]' : 'text-white/30'}`} />
        </div>
        <div className={`text-2xl font-bold font-mono tracking-tight ${unassignedEmployees > 0 ? 'text-[#F27D26]' : 'text-white/60'}`}>
          {unassignedEmployees}
        </div>
        <div className="text-[11px] text-white/40 mt-0.5">
          {unassignedEmployees > 0 ? 'Требуют назначения' : 'Все распределены'}
        </div>
      </button>

      {/* 5. Free directions */}
      <button
        type="button"
        onClick={() =>
          onFilterChange({
            directionId: filters.directionId === 'unassigned' ? 'all' : 'unassigned',
          })
        }
        className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
          filters.directionId === 'unassigned'
            ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-500/40'
            : unassignedDirections > 0
            ? 'bg-[#121212] border-rose-500/40 hover:border-rose-500/60'
            : 'bg-[#121212] border-white/10 hover:border-white/20'
        }`}
      >
        <div className="flex items-center justify-between text-white/40 mb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Без куратора</span>
          <AlertTriangle
            className={`w-4 h-4 ${unassignedDirections > 0 ? 'text-rose-400' : 'text-white/30'}`}
          />
        </div>
        <div className={`text-2xl font-bold font-mono tracking-tight ${unassignedDirections > 0 ? 'text-rose-400' : 'text-white/60'}`}>
          {unassignedDirections}
        </div>
        <div className="text-[11px] text-white/40 mt-0.5">
          {unassignedDirections > 0 ? 'Направлений без людей' : 'Все закрыты'}
        </div>
      </button>
    </div>
  );
};
