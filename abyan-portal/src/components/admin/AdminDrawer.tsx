import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  formId?: string;
  saveLabel?: string;
  headerActions?: React.ReactNode;
  isSaving?: boolean;
}

export default function AdminDrawer({
  isOpen,
  onClose,
  title,
  children,
  formId,
  saveLabel,
  headerActions,
  isSaving = false,
}: AdminDrawerProps) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (Static, no click to close) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          />

          {/* Drawer (Slides from left side of the screen) */}
          <motion.div
            initial={{ x: '-100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-full sm:w-[60%] bg-white shadow-2xl z-[70] flex flex-col border-r border-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-abyan-title text-base text-slate-900 m-0">
                {title}
              </h2>
              <div className="flex items-center gap-3 sm:gap-4">
                {headerActions}

                {headerActions && formId && saveLabel && (
                  <span className="w-[1px] h-4 bg-slate-200 shrink-0" aria-hidden="true" />
                )}

                {formId && saveLabel && (
                  <button
                    type="submit"
                    form={formId}
                    disabled={isSaving}
                    className={`font-abyan-title text-sm transition-colors border-none ${
                      isSaving
                        ? "text-[#10b981] opacity-70 cursor-not-allowed"
                        : "text-slate-500 hover:text-[#10b981] bg-transparent cursor-pointer"
                    }`}
                  >
                    {isSaving ? "جاري الحفظ..." : saveLabel}
                  </button>
                )}

                {(headerActions || (formId && saveLabel)) && (
                  <span className="w-[1px] h-4 bg-slate-200 shrink-0" aria-hidden="true" />
                )}

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSaving}
                  className={`font-abyan-title text-sm bg-transparent transition-colors border-none ${
                    isSaving
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-500 hover:text-red-500 cursor-pointer"
                  }`}
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-thin-scrollbar p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
