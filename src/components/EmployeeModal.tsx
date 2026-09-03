import React, { useState, useEffect } from 'react';
import { X, User, FileText, Check, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Employee, Direction, getEmployeeName } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Omit<Employee, 'id' | 'order'>) => void;
  initialData?: Employee | null;
  allDirections: Direction[];
  allEmployees?: Employee[];
}

const AVATAR_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  allDirections,
  allEmployees = [],
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [selectedDirectionIds, setSelectedDirectionIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(getEmployeeName(initialData));
      setDescription(initialData.description || '');
      setAvatarColor(initialData.avatarColor || AVATAR_COLORS[0]);
      setSelectedDirectionIds(initialData.directionIds || []);
    } else {
      setName('');
      setDescription('');
      setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
      setSelectedDirectionIds([]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Укажите имя сотрудника';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const trimmedName = name.trim();
    const parts = trimmedName.split(/\s+/);
    const firstName = parts[0] || trimmedName;
    const lastName = parts.slice(1).join(' ') || '';

    onSave({
      name: trimmedName,
      firstName,
      lastName,
      description: description.trim() || undefined,
      avatarColor,
      directionIds: selectedDirectionIds,
    });
    onClose();
  };

  const toggleDirection = (dirId: string) => {
    setSelectedDirectionIds((prev) =>
      prev.includes(dirId) ? prev.filter((id) => id !== dirId) : [...prev, dirId]
    );
  };

  const initials = name.trim()
    ? name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'С';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="employee-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="employee-modal-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]/50">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ring-1 ring-white/10"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initials}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {initialData ? 'Редактировать сотрудника' : 'Новый сотрудник'}
                  </h2>
                  <p className="text-xs text-white/40">
                    Имя, описание обязанностей и строительные направления
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                title="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
              {/* Employee Name */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Имя сотрудника <span className="text-[#F27D26]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например: Александр Иванов"
                    autoFocus
                    className={`w-full bg-[#121212] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-all ${
                      errors.name
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-white/10 focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26]/40'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-400 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Описание / Обязанности
                </label>
                <div className="relative">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Укажите зону ответственности, курируемые вопросы, опыт или комментарий..."
                    className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26] resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Avatar Color */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                  Цвет аватара
                </label>
                <div className="flex items-center gap-2">
                  {AVATAR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAvatarColor(color)}
                      className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center cursor-pointer ${
                        avatarColor === color ? 'scale-110 ring-2 ring-white shadow-lg' : 'hover:scale-105 opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {avatarColor === color && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Directions Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Направления ({selectedDirectionIds.length})
                  </label>
                  <span className="text-[11px] text-white/40">
                    Отметьте для привязки
                  </span>
                </div>

                {allDirections.length === 0 ? (
                  <p className="text-xs text-white/40 italic">Направления пока не созданы</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-white/10 rounded-xl bg-[#080808]">
                    {allDirections.map((dir) => {
                      const isChecked = selectedDirectionIds.includes(dir.id);
                      const holder = allEmployees.find(
                        (e) => e.id !== initialData?.id && (e.directionIds || []).includes(dir.id)
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
                            toggleDirection(dir.id);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left border ${
                            isTaken
                              ? 'opacity-40 cursor-not-allowed bg-[#080808] border-white/5 text-white/40'
                              : isChecked
                              ? 'bg-[#F27D26]/15 border-[#F27D26]/50 text-white shadow-sm cursor-pointer'
                              : 'bg-[#121212] border-white/10 text-white/70 hover:text-white hover:bg-white/5 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base shrink-0">{dir.icon}</span>
                            <div className="min-w-0">
                              <div className="font-semibold truncate">{dir.name}</div>
                              {isTaken ? (
                                <div className="text-[10px] text-rose-400 truncate">
                                  🔒 Занято: {holderName}
                                </div>
                              ) : dir.description ? (
                                <div className="text-[10px] text-white/40 truncate">
                                  {dir.description}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ml-1.5 ${
                              isTaken
                                ? 'border-white/10 bg-black/40 text-transparent'
                                : isChecked
                                ? 'bg-[#F27D26] border-[#F27D26] text-black'
                                : 'border-white/20 bg-[#121212]'
                            }`}
                          >
                            {isChecked && !isTaken && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F27D26] hover:bg-[#ff8c3a] text-black transition-all shadow-md shadow-[#F27D26]/20 active:scale-95 cursor-pointer"
                >
                  {initialData ? 'Сохранить изменения' : 'Создать сотрудника'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
