import React from 'react';
import { X } from 'lucide-react';
import { Direction } from '../types';

interface DirectionBadgeProps {
  direction: Direction;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  className?: string;
  showIcon?: boolean;
  title?: string;
}

export const DirectionBadge: React.FC<DirectionBadgeProps> = ({
  direction,
  onRemove,
  size = 'md',
  draggable = false,
  onDragStart,
  className = '',
  showIcon = true,
  title,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      draggable={draggable}
      onDragStart={onDragStart}
      title={title || direction.description || direction.name}
      className={`inline-flex items-center rounded-full border transition-all select-none ${
        sizeClasses[size]
      } ${
        draggable ? 'cursor-grab active:cursor-grabbing hover:scale-[1.02] active:scale-95' : ''
      } ${className}`}
      style={{
        backgroundColor: `${direction.color}15`,
        borderColor: `${direction.color}40`,
        color: direction.color,
      }}
    >
      {showIcon && <span className="shrink-0">{direction.icon}</span>}
      <span className="truncate text-white/90">{direction.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-white/20 text-white/40 hover:text-rose-300 transition-colors cursor-pointer"
          title={`Удалить связь с «${direction.name}»`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
