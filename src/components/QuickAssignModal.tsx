import React, { useState } from 'react';
import { X, Layers, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee, Direction, getEmployeeName } from '../types';

interface QuickAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  allDirections: Direction[];
  allEmployees?: Employee[];
  onToggleDirection: (employeeId: string, directionId: string) => void;
}

export const QuickAssignModal: React.FC<QuickAssignModalProps> = ({
  isOpen,
  onClose,
  employee,
  allDirections,
  allEmployees = [],
  onToggleDirection,
}) => {
  const [search, setSearch] = useState('');

  const empName = employee ? getEmployeeName(employee) : '';
  const initials = empName
    ? empName
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'С';

  const filteredDirections = allDirections.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AnimatePresence>
      {isOpen && employee && (
        <motion.div
          key="quick-assign-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="quick-assign-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]/50">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0 ring-1 ring-white/10"
                  style={{ backgroundColor: employee.avatarColor || '#3b82f6' }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-white truncate">
                    Направления: {empName}
                  </h2>
                  <p className="text-xs text-white/40 truncate">
                    Нажмите на направление для назначения или отвязки • Закреплено: {employee.directionIds?.length || 0}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer shrink-0"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-white/10 bg-[#121212]/30">
              <div className="relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Быстрый поиск по направлениям..."
                  className="w-full bg-[#121212] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26]"
                />
              </div>
            </div>

            {/* List of Directions */}
            <div className="p-4 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
              {filteredDirections.length === 0 ? (
                <div className="text-center py-8 text-xs text-white/40">
                  Направления не найдены
                </div>
              ) : (
                filteredDirections.map((dir) => {
                  const isAssigned = (employee.directionIds || []).includes(dir.id);
                  const holder = allEmployees.find(
                    (e) => e.id !== employee.id && (e.directionIds || []).includes(dir.id)
                  );
                  const isTakenByOther = Boolean(holder);
                  const holderName = holder ? getEmployeeName(holder) : '';

                  return (
                    <button
                      key={dir.id}
                      type="button"
                      disabled={isTakenByOther}
                      onClick={() => {
                        if (isTakenByOther) return;
                        onToggleDirection(employee.id, dir.id);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isTakenByOther
                          ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/5 text-white/40'
                          : isAssigned
                          ? 'bg-[#F27D26]/15 border-[#F27D26]/60 text-white shadow-sm ring-1 ring-[#F27D26]/20 cursor-pointer'
                          : 'bg-[#121212] border-white/10 text-white/70 hover:bg-white/5 hover:text-white cursor-pointer'
                      }`}
                      style={{
                        borderLeftColor: dir.color,
                        borderLeftWidth: '4px',
                      }}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ring-1 ring-white/10"
                          style={{ backgroundColor: `${dir.color}25` }}
                        >
                          {dir.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {dir.name}
                          </div>
                          {isTakenByOther ? (
                            <div className="text-[11px] text-rose-400 font-medium truncate mt-0.5">
                              🔒 Закреплено за: {holderName}
                            </div>
                          ) : dir.description ? (
                            <div className="text-[11px] text-white/50 truncate mt-0.5">
                              {dir.description}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ml-3 transition-colors ${
                          isTakenByOther
                            ? 'border-white/10 bg-black text-transparent'
                            : isAssigned
                            ? 'bg-[#F27D26] border-[#F27D26] text-black'
                            : 'border-white/20 bg-[#121212] text-transparent'
                        }`}
                      >
                        {isAssigned && !isTakenByOther && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-[#121212]/40 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#F27D26] hover:bg-[#ff8c3a] text-black transition-colors cursor-pointer shadow-md shadow-[#F27D26]/20"
              >
                Готово
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
