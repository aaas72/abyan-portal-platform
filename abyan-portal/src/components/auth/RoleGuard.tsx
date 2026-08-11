"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

/**
 * Renders its children ONLY if the authenticated user has one of the allowed roles.
 */
export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { hasRole, isLoading } = useAuth();

  if (isLoading || !hasRole(allowedRoles)) {
    return null;
  }

  return <>{children}</>;
}
