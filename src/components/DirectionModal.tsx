import React, { useState, useEffect } from 'react';
import { X, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction } from '../types';

interface DirectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (directionData: Omit<Direction, 'id' | 'order'>) => void;
  initialData?: Direction | null;
}

const PRESET_ICONS = [
  '🔩', '❄️', '🧱', '🪨', '⚡', '🚰', '🛡️', '🎨',
  '🏗️', '🪵', '🛠️', '📐', '🚚', '🚜', '🔌', '🚪',
  '🪟', '🏠', '🚧', '🔥', '🦺', '⛏️', '⛓️', '📦',
];

const PRESET_COLORS = [
  '#f59e0b', // amber
  '#38bdf8', // sky
  '#fb923c', // orange
  '#eab308', // yellow
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6366f1', // indigo
  '#f43f5e', // rose
];

export const DirectionModal: React.FC<DirectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState(PRESET_ICONS[0]);
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setIcon(initialData.icon || PRESET_ICONS[0]);
      setColor(initialData.color || PRESET_COLORS[0]);
    } else {
      setName('');
      setDescription('');
      setIcon(PRESET_ICONS[Math.floor(Math.random() * PRESET_ICONS.length)]);
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Укажите название направления';
    if (!icon.trim()) newErrors.icon = 'Укажите символ или иконку';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
      color,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="direction-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="direction-modal-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]/50">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xl shadow-sm ring-1 ring-white/10"
                  style={{ backgroundColor: `${color}25` }}
                >
                  {icon}
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    {initialData ? 'Редактировать направление' : 'Новое направление'}
                  </h2>
                  <p className="text-xs text-white/40">
                    Строительное направление для распределения сотрудников
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
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Название направления <span className="text-[#F27D26]">*</span>
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Металлы, Опоры, Чиллеры, Блоки..."
                    autoFocus
                    className={`w-full bg-[#121212] border rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none transition-all ${
                      errors.name
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-white/10 focus:border-[#F27D26] focus:ring-1 focus:ring-[#F27D26]/40'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                  Краткое описание / Специфика
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Специфика направления, поставляемые материалы, виды работ..."
                  className="w-full bg-[#121212] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26] resize-none leading-relaxed"
                />
              </div>

              {/* Icon Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Иконка / Символ
                  </label>
                  <span className="text-[11px] text-white/40">Выбрано: {icon}</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5 p-2 rounded-xl bg-[#080808] border border-white/10 mb-2">
                  {PRESET_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setIcon(emoji)}
                      className={`h-8 rounded-lg flex items-center justify-center text-base transition-all hover:scale-110 cursor-pointer ${
                        icon === emoji
                          ? 'bg-[#F27D26]/20 border border-[#F27D26]/60 shadow-sm'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {/* Custom icon input */}
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  maxLength={4}
                  placeholder="Или введите свой эмодзи..."
                  className="w-full bg-[#121212] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F27D26]"
                />
              </div>

              {/* Color Selector */}
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                  Цветовой акцент
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-lg transition-transform flex items-center justify-center cursor-pointer ${
                        color === c ? 'scale-110 ring-2 ring-white shadow-lg' : 'hover:scale-105 opacity-75 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview card */}
              <div
                className="p-3.5 rounded-xl bg-[#080808] border flex items-center gap-3 transition-colors"
                style={{ borderColor: `${color}40`, borderLeftWidth: '4px', borderLeftColor: color }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ring-1 ring-white/10"
                  style={{ backgroundColor: `${color}25` }}
                >
                  {icon || '🔩'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">
                    {name || 'Название направления'}
                  </div>
                  <div className="text-xs text-white/50 truncate mt-0.5">
                    {description || 'Описание направления'}
                  </div>
                </div>
              </div>

              {/* Buttons */}
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
                  {initialData ? 'Сохранить изменения' : 'Создать направление'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
