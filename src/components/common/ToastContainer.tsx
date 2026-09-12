import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Coins, 
  Award, 
  AlertCircle, 
  Info, 
  X 
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ToastNotification } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGame();

  const getToastIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'gold':
        return <Coins className="w-5 h-5 text-[#B45309] shrink-0" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-[#5D866C] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-[#5D866C] shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600 shrink-0" />;
    }
  };

  const getBorderColor = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-emerald-300';
      case 'gold':
        return 'border-amber-300';
      case 'achievement':
        return 'border-[#5D866C]/50';
      case 'error':
        return 'border-rose-300';
      case 'info':
      default:
        return 'border-[#C2A68C]';
    }
  };

  return (
    <div
      id="toast-container"
      aria-live="polite"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto rounded-2xl p-3.5 bg-white border shadow-lg flex items-start gap-3 ${getBorderColor(
              toast.type
            )}`}
          >
            {getToastIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#1C1917]">{toast.title}</h4>
              {toast.message && (
                <p className="text-[11px] text-[#57534E] mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#78716C] hover:text-[#1C1917] p-0.5 rounded transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
