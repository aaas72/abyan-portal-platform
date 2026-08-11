"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig = {
  success: {
    icon: CheckCircle2,
    colors: 'bg-white border-emerald-200 text-slate-800',
    iconColor: 'text-[#10b981]',
  },
  error: {
    icon: XCircle,
    colors: 'bg-white border-red-200 text-slate-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertCircle,
    colors: 'bg-white border-orange-200 text-slate-800',
    iconColor: 'text-orange-500',
  },
  info: {
    icon: Info,
    colors: 'bg-white border-sky-200 text-slate-800',
    iconColor: 'text-[#0ea5e9]',
  },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((msg: string, d?: number) => showToast('success', msg, d), [showToast]);
  const error = useCallback((msg: string, d?: number) => showToast('error', msg, d), [showToast]);
  const info = useCallback((msg: string, d?: number) => showToast('info', msg, d), [showToast]);
  const warning = useCallback((msg: string, d?: number) => showToast('warning', msg, d), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="pointer-events-auto w-fit max-w-[90vw] sm:max-w-sm flex items-center gap-4 p-4 rounded-2xl bg-white bg-gradient-to-br from-emerald-100 via-white to-sky-100 shadow-md border border-slate-100"
                dir="rtl"
              >
                <p className="flex-1 text-sm font-abyan-body leading-relaxed m-0 mt-0.5 text-slate-900">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="shrink-0 text-slate-400 hover:text-slate-600 transition-colors bg-transparent border-none outline-none cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
