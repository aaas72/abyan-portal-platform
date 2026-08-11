import React from 'react';
import AdminClientLayout from '@/components/admin/AdminClientLayout';

export const metadata = {
  title: 'لوحة التحكم | بوابة أبين',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
