import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Direction, Employee, FilterState } from '../types';

interface SearchAndFilterProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  directions: Direction[];
  employees: Employee[];
  filteredCount: number;
  totalCount: number;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFilterChange,
  directions,
  employees,
  filteredCount,
  totalCount,
}) => {
  const isFiltered =
    filters.search.trim() !== '' ||
    filters.directionId !== 'all' ||
    filters.employeeStatus !== 'all';

  const resetFilters = () => {
    onFilterChange({
      search: '',
      directionId: 'all',
      employeeStatus: 'all',
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-[#080808] border border-white/10 p-3 rounded-2xl">
      {/* Left: Search input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Поиск сотрудника, описания или направления..."
          className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-9 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26]/40 transition-all"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            title="Очистить поиск"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Center/Right: Dropdowns and status filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Direction filter dropdown */}
        <div className="relative flex items-center">
          <Filter className="w-3.5 h-3.5 text-white/40 absolute left-3 pointer-events-none" />
          <select
            value={filters.directionId}
            onChange={(e) => onFilterChange({ directionId: e.target.value })}
            className="bg-[#121212] border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs font-medium text-white/80 focus:outline-none focus:border-[#F27D26] appearance-none cursor-pointer hover:border-white/20"
          >
            <option value="all" className="bg-[#121212] text-white">Все направления ({directions.length})</option>
            <option value="unassigned" className="bg-[#121212] text-white">Без ответственных</option>
            {directions.map((dir) => {
              const assignedCount = employees.filter((e) => e.directionIds?.includes(dir.id)).length;
              return (
                <option key={dir.id} value={dir.id} className="bg-[#121212] text-white">
                  {dir.icon} {dir.name} ({assignedCount})
                </option>
              );
            })}
          </select>
          <div className="pointer-events-none absolute right-2.5 text-white/40 text-xs">▼</div>
        </div>

        {/* Quick status segment */}
        <div className="inline-flex bg-[#121212] border border-white/10 p-0.5 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => onFilterChange({ employeeStatus: 'all' })}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              filters.employeeStatus === 'all'
                ? 'bg-white/10 text-white font-medium shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Все
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ employeeStatus: 'with-directions' })}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              filters.employeeStatus === 'with-directions'
                ? 'bg-white/10 text-white font-medium shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            С направлениями
          </button>
          <button
            type="button"
            onClick={() => onFilterChange({ employeeStatus: 'without-directions' })}
            className={`px-2.5 py-1.5 rounded-lg transition-all ${
              filters.employeeStatus === 'without-directions'
                ? 'bg-[#F27D26]/20 text-[#F27D26] font-medium border border-[#F27D26]/40'
                : 'text-white/40 hover:text-white'
            }`}
          >
            Без направлений
          </button>
        </div>

        {/* Clear filters button */}
        {isFiltered && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-[#F27D26] hover:text-[#ff8c3a] bg-[#F27D26]/10 hover:bg-[#F27D26]/20 border border-[#F27D26]/30 px-2.5 py-1.5 rounded-xl transition-all"
            title="Сбросить все фильтры"
          >
            <X className="w-3.5 h-3.5" />
            <span>Сброс</span>
          </button>
        )}

        {/* Count indicator */}
        <span className="text-xs text-white/40 hidden lg:inline-block ml-1 font-mono">
          {filteredCount} из {totalCount}
        </span>
      </div>
    </div>
  );
};
