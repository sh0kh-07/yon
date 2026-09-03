import React, { useState } from 'react';
import { Check, Plus, AlertCircle, Search, Table2 } from 'lucide-react';
import { Direction, Employee, getEmployeeName } from '../types';

interface ResponsibilityMatrixProps {
  employees: Employee[];
  directions: Direction[];
  onToggleConnection: (employeeId: string, directionId: string) => void;
  onOpenAddEmployee: () => void;
  onOpenAddDirection: () => void;
}

export const ResponsibilityMatrix: React.FC<ResponsibilityMatrixProps> = ({
  employees,
  directions,
  onToggleConnection,
  onOpenAddEmployee,
  onOpenAddDirection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter((emp) => {
    const name = getEmployeeName(emp).toLowerCase();
    const desc = (emp.description || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || desc.includes(query);
  });

  return (
    <div className="space-y-4">
      {/* Description header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#080808] border border-white/10 rounded-2xl p-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/20 flex items-center justify-center text-[#F27D26]">
              <Table2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Матрица ответственности: Кто за что отвечает
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Интерактивная сводная таблица: нажмите на любую ячейку, чтобы мгновенно привязать или отвязать направление
          </p>
        </div>

        {/* Quick search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск по сотрудникам..."
            className="w-full bg-[#121212] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26]"
          />
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#080808] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#121212]">
                <th className="p-3.5 text-[11px] font-semibold text-white/40 uppercase tracking-wider sticky left-0 bg-[#121212] z-10 w-64 backdrop-blur-sm border-r border-white/10">
                  Сотрудник
                </th>
                {directions.map((dir) => (
                  <th
                    key={dir.id}
                    className="p-3 text-center text-xs font-semibold text-white/70 min-w-[100px] border-l border-white/5"
                    title={dir.description || dir.name}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-base">{dir.icon}</span>
                      <span className="truncate max-w-[90px] text-[11px] text-white/80 font-medium">
                        {dir.name}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="p-3 text-center text-[11px] font-semibold text-white/40 uppercase tracking-wider border-l border-white/10 w-24">
                  Всего
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-xs">
              {filteredEmployees.map((emp) => {
                const assignedCount = emp.directionIds?.length || 0;
                const isUnassigned = assignedCount === 0;
                const empName = getEmployeeName(emp);
                const initials = empName
                  ? empName
                      .split(/\s+/)
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'С';

                return (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    {/* Employee cell */}
                    <td className="p-3.5 sticky left-0 bg-[#080808] group-hover:bg-[#121212] z-10 backdrop-blur-sm border-r border-white/10 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 select-none shadow-sm ring-1 ring-white/10"
                          style={{ backgroundColor: emp.avatarColor || '#3b82f6' }}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-white truncate text-xs">
                            {empName}
                          </div>
                          {emp.description && (
                            <div className="text-[11px] text-white/40 truncate mt-0.5 max-w-[180px]">
                              {emp.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Checkbox / Toggle cells for each direction */}
                    {directions.map((dir) => {
                      const isConnected = emp.directionIds?.includes(dir.id);
                      const holder = employees.find(
                        (other) => other.id !== emp.id && (other.directionIds || []).includes(dir.id)
                      );
                      const isTakenByOther = Boolean(holder);
                      const holderName = holder ? getEmployeeName(holder) : '';

                      return (
                        <td
                          key={dir.id}
                          className="p-2 text-center border-l border-white/5"
                        >
                          <button
                            type="button"
                            onClick={() => onToggleConnection(emp.id, dir.id)}
                            className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-all ${
                              isConnected
                                ? 'bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/50 shadow-sm shadow-[#F27D26]/10 hover:bg-[#F27D26]/30 cursor-pointer'
                                : isTakenByOther
                                ? 'text-white/25 cursor-not-allowed hover:bg-rose-950/20 hover:text-rose-400/50'
                                : 'text-white/20 hover:text-white/60 hover:bg-white/5 cursor-pointer'
                            }`}
                            title={
                              isConnected
                                ? `Отвязать «${dir.name}» от сотрудника ${empName}`
                                : isTakenByOther
                                ? `Направление «${dir.name}» уже закреплено за ${holderName}. Нажмите для информации.`
                                : `Привязать «${dir.name}» к сотруднику ${empName}`
                            }
                          >
                            {isConnected ? (
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            ) : isTakenByOther ? (
                              <span className="text-[11px] opacity-40 select-none">🔒</span>
                            ) : (
                              <span className="text-base leading-none opacity-30 group-hover:opacity-60">+</span>
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Total badge */}
                    <td className="p-3 text-center border-l border-white/10 font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs ${
                          isUnassigned
                            ? 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                            : 'bg-white/5 text-white/80 border border-white/10'
                        }`}
                      >
                        {assignedCount}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Bottom Summary Row: Employee Count per Direction */}
              <tr className="bg-[#121212] font-semibold border-t border-white/10">
                <td className="p-3.5 text-xs text-white/50 uppercase tracking-wider sticky left-0 bg-[#121212] z-10 border-r border-white/10">
                  Сотрудников на направлении
                </td>
                {directions.map((dir) => {
                  const assignedCount = employees.filter((e) =>
                    e.directionIds?.includes(dir.id)
                  ).length;
                  const isZero = assignedCount === 0;

                  return (
                    <td
                      key={dir.id}
                      className="p-3 text-center border-l border-white/5"
                    >
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-mono text-xs ${
                          isZero
                            ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                            : 'bg-white/5 text-white/80 border border-white/10'
                        }`}
                        title={isZero ? 'Внимание: нет ответственного!' : `${assignedCount} сотр.`}
                      >
                        {assignedCount}
                      </span>
                    </td>
                  );
                })}
                <td className="p-3 text-center border-l border-white/10 font-mono text-[#F27D26]">
                  {employees.reduce((acc, e) => acc + (e.directionIds?.length || 0), 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
