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

  return (
    <AuthProvider>
      <ConfirmProvider>
        <ToastProvider>
          <div className="flex min-h-screen bg-white">
          {/* Only show Sidebar if not on login page */}
          {!isLoginPage && <AdminSidebar />}
          
          {/* Main Content Area */}
          <main className={`flex-1 min-w-0 bg-white ${!isLoginPage ? 'py-5' : ''}`}>
            {!isLoginPage ? (
              <div className="max-w-7xl mx-auto px-10">
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
