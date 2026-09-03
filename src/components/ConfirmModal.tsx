import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
  isDangerous = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onCancel}
        >
          <motion.div
            key="confirm-modal-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 360 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#080808] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    isDangerous
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      : 'bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/30'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white">{title}</h3>
                  <p className="text-xs text-white/50 mt-2 leading-relaxed whitespace-pre-line">
                    {message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  title="Закрыть"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer ${
                    isDangerous
                      ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/50'
                      : 'bg-[#F27D26] hover:bg-[#ff8c3a] text-black shadow-[#F27D26]/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
