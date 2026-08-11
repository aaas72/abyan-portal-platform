"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, hasRole } = useAuth();

  return (
    <aside className="w-[210px] shrink-0 h-screen sticky top-0 bg-white pb-6 pr-10 pl-4 flex flex-col border-l border-slate-200 overflow-x-hidden">
      <div className="h-[84px] shrink-0 border-b border-slate-100 flex flex-col justify-center">
        <Link href="/" className="no-underline">
          <motion.div
            {...subtleMicroHover}
            className="font-abyan-title text-2xl sm:text-3xl leading-none py-0 text-slate-900 cursor-pointer"
          >
            أَبيَن
          </motion.div>
        </Link>
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
                className={`block origin-right font-abyan-title font-normal text-[13px] sm:text-sm transition-colors duration-300 ${
                  isActive 
                    ? 'text-emerald-500 opacity-100' // Spring Green for active
                    : 'text-slate-800 opacity-90 hover:text-sky-500' // Slate 800 normally, Sky Blue on hover
                }`}
              >
                {link.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-auto flex flex-col gap-4 border-t border-slate-100">
        <Link 
          href="/" 
          className="no-underline group block"
        >
          <motion.span 
            className="block origin-right font-abyan-title font-normal text-[13px] sm:text-sm text-slate-500 group-hover:text-emerald-500 transition-colors duration-300"
          >
            العودة للمنصة الرئيسية
          </motion.span>
        </Link>
        <Link 
          href="/admin-account" 
          className="no-underline group block"
        >
          <motion.span 
            className={`block origin-right font-abyan-title font-normal text-[13px] sm:text-sm transition-colors duration-300 ${
              pathname?.includes('/admin-account')
                ? 'text-emerald-500 opacity-100'
                : 'text-slate-500 group-hover:text-emerald-500'
            }`}
          >
            حسابي
          </motion.span>
        </Link>
        {hasRole(['admin']) && (
          <Link 
            href="/admin-writers" 
            className="no-underline group block"
          >
            <motion.span 
              className={`block origin-right font-abyan-title font-normal text-[13px] sm:text-sm transition-colors duration-300 ${
                pathname?.includes('/admin-writers')
                  ? 'text-emerald-500 opacity-100'
                  : 'text-slate-500 group-hover:text-emerald-500'
              }`}
            >
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
          <motion.span 
            className="block origin-right font-abyan-title font-normal text-[13px] sm:text-sm text-slate-500 group-hover:text-red-500 transition-colors duration-300"
          >
            تسجيل الخروج
          </motion.span>
        </button>
      </div>
    </aside>
  );
}
