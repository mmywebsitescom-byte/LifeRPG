import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Encountered a Temporal Rift',
  message = 'Unable to communicate with the guild registry.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-rose-950/20 border border-rose-900/40 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-900/30 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-950/30">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-rose-200 font-rpg mb-1">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-sm mb-5 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-rose-950/40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          TRY AGAIN
        </button>
      )}
    </div>
  );
};
