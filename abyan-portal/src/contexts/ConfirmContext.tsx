"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolvePromise) resolvePromise(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && options && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm"
            dir="rtl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-sm border border-slate-100 flex flex-col gap-4"
            >
              <h3 className="font-abyan-title text-xl text-slate-900 m-0">
                {options.title}
              </h3>
              {options.description && (
                <p className="font-abyan-body text-sm text-slate-600 m-0">
                  {options.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-4 border-t border-slate-100 pt-3">
                <button
                  onClick={handleConfirm}
                  className={`flex-1 py-2 px-4 rounded-xl font-abyan-body text-sm font-medium transition-colors cursor-pointer border-none outline-none bg-transparent ${
                    options.variant === 'danger'
                      ? 'text-slate-500 hover:text-red-600'
                      : 'text-slate-500 hover:text-[#10b981]'
                  }`}
                >
                  {options.confirmText || 'تأكيد'}
                </button>
                <div className="w-[1px] h-4 bg-slate-200"></div>
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 px-4 rounded-xl font-abyan-body text-sm font-medium text-slate-500 bg-transparent hover:text-[#10b981] transition-colors cursor-pointer border-none outline-none"
                >
                  {options.cancelText || 'إلغاء'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};
