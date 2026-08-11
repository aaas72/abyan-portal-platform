"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login, optionally passing the return URL
        router.push(`/admin-login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        // If authenticated but unauthorized role, redirect to dashboard root or show error
        router.push('/admin-dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, allowedRoles, hasRole]);

  // While checking auth status, show a loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-4 border-[#10b981]/30 border-t-[#10b981] animate-spin"></div>
      </div>
    );
  }

  // If not authenticated or unauthorized, don't render children
  if (!isAuthenticated || (allowedRoles.length > 0 && !hasRole(allowedRoles))) {
    return null;
  }

  return <>{children}</>;
}
