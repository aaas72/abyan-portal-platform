"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { subtleMicroHover } from '@/lib/animations';
import { useAuth } from '@/contexts/AuthContext';

const ADMIN_LINKS = [
  { href: '/admin-dashboard', label: 'لوحة القيادة' },
  { href: '/admin-landmarks', label: 'المعالم والحصون' },
  { href: '/admin-pioneers', label: 'الأعلام والشخصيات' },
  { href: '/admin-districts', label: 'مديريات أبين' },
  { href: '/admin-history', label: 'التاريخ والحقب' },
  { href: '/admin-culture', label: 'الموروث الثقافي' },
  { href: '/admin-economy', label: 'الاقتصاد والزراعة' },
  { href: '/admin-gallery', label: 'الأرشيف البصري' },
  { href: '/admin-landing', label: 'أقسام صفحة الهبوط', roles: ['admin'] },
  { href: '/admin-about', label: 'صفحة عن البوابة', roles: ['admin'] },
  { href: '/admin-copyright', label: 'حقوق الملكية الفكرية', roles: ['admin'] },
  { href: '/admin-terms', label: 'شروط الاستخدام', roles: ['admin'] },
  { href: '/admin-privacy', label: 'سياسة الخصوصية', roles: ['admin'] },
  { href: '/admin-contact', label: 'إدارة التواصل', roles: ['admin'] },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, hasRole, user } = useAuth();

  return (
    <>
      {/* 1. MOBILE SIDEBAR (Green Gradient, similar to public Navbar) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            />

            {/* Mobile Sliding Curtain Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 z-[60] w-[80vw] max-w-xs bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] text-white p-6 sm:p-8 flex flex-col justify-between shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="space-y-8 text-right w-full">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/20 pb-5 text-right">
                  <div className="flex flex-col gap-1">
                    <p className="font-abyan-title font-normal text-2xl text-white leading-none m-0">
                      {user?.name || 'مستخدم النظام'}
                    </p>
                    <p className="font-abyan-body text-sm text-emerald-200 leading-none m-0">
                      {user?.role === 'admin' ? 'مدير النظام' : 'كاتب محتوى'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="font-abyan-title text-lg text-white/90 hover:text-white bg-transparent border-none cursor-pointer p-1 font-normal"
                  >
                    إغلاق
                  </button>
                </div>

                {/* Vertical Links List */}
                <nav className="flex flex-col space-y-5">
                  {ADMIN_LINKS.filter(link => !link.roles || hasRole(link.roles)).map((link) => {
                    const normalizedPath = pathname === '/' ? '/' : pathname?.replace(/\/$/, '') || '';
                    const isActive = link.href === '/admin-dashboard' ? normalizedPath === '/admin-dashboard' : normalizedPath.includes(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className="no-underline block"
                      >
                        <span className={`font-abyan-title text-lg font-normal transition-colors block ${
                          isActive
                            ? 'text-amber-200 font-medium'
                            : 'text-white/90 hover:text-white'
                        }`}>
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 mt-8 border-t border-white/20 text-right flex flex-col gap-5">
                <Link href="/" onClick={onClose} className="no-underline block">
                  <span className="font-abyan-title text-lg text-white/90 hover:text-white font-normal transition-colors">
                    العودة للمنصة
                  </span>
                </Link>
                <Link href="/admin-account" onClick={onClose} className="no-underline block">
                  <span className={`font-abyan-title text-lg font-normal transition-colors ${
                    pathname?.includes('/admin-account') ? 'text-amber-200 font-medium' : 'text-white/90 hover:text-white'
                  }`}>
                    حسابي
                  </span>
                </Link>
                {hasRole(['admin']) && (
                  <Link href="/admin-writers" onClick={onClose} className="no-underline block">
                    <span className={`font-abyan-title text-lg font-normal transition-colors ${
                      pathname?.includes('/admin-writers') ? 'text-amber-200 font-medium' : 'text-white/90 hover:text-white'
                    }`}>
                      إدارة الحسابات
                    </span>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    router.push('/admin-login');
                  }}
                  className="bg-transparent border-none cursor-pointer text-right p-0 m-0 w-full outline-none"
                >
                  <span className="font-abyan-title text-lg text-red-200 hover:text-red-100 font-normal transition-colors block">
                    تسجيل الخروج
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 2. DESKTOP SIDEBAR (White, Sticky, always visible on lg) */}
      <aside className="hidden lg:flex w-[210px] shrink-0 h-screen sticky top-0 right-0 z-[60] bg-white pb-6 pr-10 pl-4 flex-col border-l border-slate-200 overflow-x-hidden">
        <div className="h-[84px] shrink-0 border-b border-slate-100 flex flex-col justify-center gap-2 pt-2">
          <p className="font-abyan-title font-normal text-base text-slate-900 leading-none m-0">
            {user?.name || 'مستخدم النظام'}
          </p>
          <p className="font-abyan-body text-xs text-sky-600 leading-none m-0">
            {user?.role === 'admin' ? 'مدير النظام' : 'كاتب محتوى'}
          </p>
        </div>

        <nav className="flex flex-col gap-6 flex-1 overflow-y-auto no-scrollbar pt-6 pb-4">
          {ADMIN_LINKS.filter(link => !link.roles || hasRole(link.roles)).map((link) => {
            const normalizedPath = pathname === '/' ? '/' : pathname?.replace(/\/$/, '') || '';
            const isActive = link.href === '/admin-dashboard' ? normalizedPath === '/admin-dashboard' : normalizedPath.includes(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="no-underline group"
              >
                <motion.span 
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={`block origin-right font-abyan-title font-normal text-[13px] transition-colors duration-300 ${
                    isActive 
                      ? 'text-emerald-500 opacity-100'
                      : 'text-slate-800 opacity-90 hover:text-sky-500'
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 mt-auto flex flex-col gap-4 border-t border-slate-100">
          <Link href="/" className="no-underline group block">
            <motion.span className="block origin-right font-abyan-title font-normal text-[13px] text-slate-500 group-hover:text-emerald-500 transition-colors duration-300">
              العودة للمنصة الرئيسية
            </motion.span>
          </Link>
          <Link href="/admin-account" className="no-underline group block">
            <motion.span className={`block origin-right font-abyan-title font-normal text-[13px] transition-colors duration-300 ${
              pathname?.includes('/admin-account') ? 'text-emerald-500 opacity-100' : 'text-slate-500 group-hover:text-emerald-500'
            }`}>
              حسابي
            </motion.span>
          </Link>
          {hasRole(['admin']) && (
            <Link href="/admin-writers" className="no-underline group block">
              <motion.span className={`block origin-right font-abyan-title font-normal text-[13px] transition-colors duration-300 ${
                pathname?.includes('/admin-writers') ? 'text-emerald-500 opacity-100' : 'text-slate-500 group-hover:text-emerald-500'
              }`}>
                إدارة الحسابات
              </motion.span>
            </Link>
          )}
          <button 
            onClick={() => {
              logout();
              router.push('/admin-login');
            }}
            className="bg-transparent border-none cursor-pointer text-right p-0 m-0 group block w-full outline-none"
          >
            <motion.span className="block origin-right font-abyan-title font-normal text-[13px] text-slate-500 group-hover:text-red-500 transition-colors duration-300">
              تسجيل الخروج
            </motion.span>
          </button>
        </div>
      </aside>
    </>
  );
}
