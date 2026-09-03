import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';
          const isInfo = toast.type === 'info';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md ${
                isError
                  ? 'bg-rose-950/90 border-rose-800/60 text-rose-100'
                  : isWarning
                  ? 'bg-amber-950/90 border-amber-800/60 text-amber-100'
                  : isInfo
                  ? 'bg-sky-950/90 border-sky-800/60 text-sky-100'
                  : 'bg-neutral-900/95 border-neutral-700/70 text-neutral-100'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : isInfo ? (
                  <Info className="w-5 h-5 text-sky-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-neutral-400 mt-1 leading-snug">{toast.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
