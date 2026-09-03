import React from 'react';
import { GripVertical } from 'lucide-react';
import { Direction, Employee, getEmployeeName } from '../types';

interface DirectionPaletteItemProps {
  direction: Direction;
  assignedCount?: number;
  assignedEmployee?: Employee | null;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent, direction: Direction) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onClick?: () => void;
  isActiveFilter?: boolean;
}

export const DirectionPaletteItem: React.FC<DirectionPaletteItemProps> = ({
  direction,
  assignedCount = 0,
  assignedEmployee = null,
  isDragging,
  onDragStart,
  onDragEnd,
  onClick,
  isActiveFilter = false,
}) => {
  const isAssigned = Boolean(assignedEmployee) || assignedCount > 0;
  const holderName = assignedEmployee ? getEmployeeName(assignedEmployee) : '';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, direction)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing select-none ${
        isDragging
          ? 'opacity-40 scale-95 border-dashed border-[#F27D26] bg-[#121212]'
          : isActiveFilter
          ? 'bg-[#F27D26]/15 border-[#F27D26] ring-2 ring-[#F27D26]/40 shadow-lg shadow-[#F27D26]/10'
          : 'bg-[#121212] border-white/10 hover:bg-white/5 hover:border-[#F27D26]/50 hover:shadow-lg'
      }`}
      style={{
        borderLeftColor: direction.color,
        borderLeftWidth: '4px',
      }}
      title={
        isAssigned
          ? `Закреплено за ${holderName}. Одно направление закрепляется только за одним сотрудником.`
          : `Свободно. Перетащите на сотрудника, чтобы закрепить.`
      }
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="text-white/20 group-hover:text-white/60 transition-colors cursor-grab shrink-0">
          <GripVertical className="w-3.5 h-3.5" />
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg shrink-0 ring-1 ring-white/10 shadow-sm"
          style={{ backgroundColor: `${direction.color}25` }}
        >
          {direction.icon}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#F27D26] transition-colors">
            {direction.name}
          </h4>
          {direction.description && (
            <p className="text-[11px] text-white/45 truncate mt-0.5" title={direction.description}>
              {direction.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        {assignedEmployee ? (
          <span
            className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-white/5 text-white/90 border border-white/10 max-w-[120px] truncate"
            title={`Закреплено за: ${holderName}`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: assignedEmployee.avatarColor || '#3b82f6' }}
            />
            <span className="truncate">{holderName.split(' ')[0]}</span>
          </span>
        ) : (
          <span
            className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40"
            title="Свободно — готово к распределению"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Свободно</span>
          </span>
        )}
      </div>
    </div>
  );
};
