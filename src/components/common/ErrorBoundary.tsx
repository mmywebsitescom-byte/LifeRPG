import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in RPG Realm:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-[#141414] border-2 border-[#C2A68C] dark:border-[#F87171]/40 shadow-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-red-950/40 border border-amber-200 dark:border-[#F87171]/40 mx-auto flex items-center justify-center text-amber-600 dark:text-[#F87171]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl font-bold font-rpg text-[#1C1917] dark:text-white">
                Temporal Glitch Encountered
              </h2>
              <p className="text-xs text-[#78716C] dark:text-zinc-400 mt-2 leading-relaxed">
                The magical weave experienced an unexpected disruption. The realm state has been protected.
              </p>
              {this.state.error && (
                <div className="mt-3 p-2.5 rounded-xl bg-[#F5F5F0] dark:bg-black/50 text-[11px] font-mono text-[#78716C] dark:text-zinc-500 overflow-x-auto text-left">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5D866C] hover:bg-[#4B6E57] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Realm</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/dashboard';
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#E6D8C3] hover:bg-[#C2A68C] text-[#1C1917] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 border border-[#C2A68C]"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
