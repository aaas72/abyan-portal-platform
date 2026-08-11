"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ConfirmProvider } from '@/contexts/ConfirmContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin-login' || pathname === '/admin-login/';
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <div className="flex min-h-screen bg-white">
          {/* Only show Sidebar if not on login page */}
          {!isLoginPage && (
            <AdminSidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
            />
          )}
          
          {/* Main Content Area */}
          <main className={`flex-1 min-w-0 bg-white ${!isLoginPage ? 'py-5' : ''}`}>
            {!isLoginPage && (
              <div className="lg:hidden flex items-center justify-between px-4 sm:px-6 pb-4 mb-4 border-b border-slate-100">
                <span className="font-abyan-title text-xl text-slate-900">لوحة تحكم بوابة أبين</span>
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 -mr-2 text-slate-600 hover:text-[#10b981] transition-colors bg-transparent border-none cursor-pointer outline-none flex items-center justify-center"
                >
                  <span className="font-abyan-title text-sm">القائمة</span>
                </button>
              </div>
            )}
            {!isLoginPage ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                <ProtectedRoute>
                  {children}
                </ProtectedRoute>
              </div>
            ) : (
              // For login page, no ProtectedRoute and no sidebar
              <>{children}</>
            )}
          </main>
        </div>
        </ToastProvider>
      </ConfirmProvider>
    </AuthProvider>
  );
}
