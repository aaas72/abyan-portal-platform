"use client";

import React, { useState, useEffect, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { usersService, User } from "@/services/users.service";
import WriterForm, { UserFormData } from "@/components/admin/forms/WriterForm";

export default function AdminWritersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [activeTab, setActiveTab] = useState<'writer' | 'admin'>('writer');

  const toast = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await usersService.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        throw new Error("فشل في استرجاع الكُتاب");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء جلب البيانات",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsActiveStatus(true);
    setDrawerOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsActiveStatus(user.isActive);
    setDrawerOpen(true);
  };

  const handleDelete = async (user: User) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من رغبتك في حذف الحساب "${user.name}"؟ لا يمكن التراجع عن هذا الإجراء وسيتم حرمان المستخدم من الوصول للمنصة.`,
      confirmText: "حذف الحساب",
      cancelText: "إلغاء",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        const res = await usersService.deleteUser(user._id);
        if (res.success) {
          toast.success("تم حذف الكاتب بنجاح");
          setUsers((prev) => prev.filter((u) => u._id !== user._id));
        } else {
          throw new Error("فشل في حذف الكاتب");
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || err.message || "حدث خطأ أثناء الحذف",
        );
      }
    }
  };

  const handleSave = async (data: UserFormData) => {
    try {
      if (selectedUser) {
        const res = await usersService.updateUser(selectedUser._id, data);
        if (res.success && res.data) {
          toast.success("تم تحديث بيانات الكاتب بنجاح");
          setUsers((prev) =>
            prev.map((u) => (u._id === selectedUser._id ? res.data : u)),
          );
          setDrawerOpen(false);
        } else {
          throw new Error("فشل في تحديث الكاتب");
        }
      } else {
        const res = await usersService.createUser(data);
        if (res.success && res.data) {
          toast.success("تم إضافة الكاتب بنجاح");
          setUsers((prev) => [...prev, res.data]);
          setDrawerOpen(false);
        } else {
          throw new Error("فشل في إضافة الكاتب");
        }
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "حدث خطأ أثناء الحفظ",
      );
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.role === activeTab);
  }, [users, activeTab]);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "الاسم",
      isPrimary: true,
      render: (row) => (
        <div className="font-medium text-slate-900">{row.name}</div>
      ),
    },
    {
      key: "username",
      header: "اسم المستخدم",
      render: (row) => (
        <div className="text-slate-600 font-mono text-xs" dir="ltr">
          {row.username}
        </div>
      ),
    },
    {
      key: "role",
      header: "الصلاحية",
      render: (row) => {
        if (row.role === "admin") {
          return (
            <span className="text-xs font-medium text-sky-600">
              مدير نظام
            </span>
          );
        }
        return (
          <span className="text-xs font-medium text-slate-700">
            كاتب محتوى
          </span>
        );
      },
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (row) => (
        <span className={row.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {row.isActive ? "نشط" : "معطل"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "تاريخ الإضافة",
      render: (row) => new Date(row.createdAt).toLocaleDateString("ar-SA"),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="إدارة الحسابات"
        description="إدارة حسابات وصلاحيات كُتّاب المحتوى ومدراء النظام."
      />

      <AdminTabs
        tabs={[
          { id: 'writer', label: 'الكُتّاب' },
          { id: 'admin', label: 'المشرفين' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab as (id: string) => void}
        actionLabel={activeTab === 'writer' ? 'إضافة كاتب جديد' : 'إضافة مشرف جديد'}
        onAction={handleAddNew}
      />

      {!isLoading && users.length === 0 ? (
        <EmptyState
          title="لا يوجد كُتّاب حالياً"
          message="لم يتم إضافة أي كُتّاب بعد. ابدأ بإضافة كاتب جديد للمنصة."
        />
      ) : (
        <AdminDataTable
          columns={columns}
          data={filteredUsers}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="لم يتم العثور على أي كُتّاب يطابقون بحثك."
        />
      )}

      <AdminDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedUser ? "تعديل بيانات الكاتب" : "إضافة كاتب جديد"}
        formId="writer-form"
        saveLabel="حفظ الكاتب"
        headerActions={
          <AdminToggle
            label="حالة الحساب"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <WriterForm
          id="writer-form"
          initialData={selectedUser}
          isEditMode={!!selectedUser}
          isActive={isActiveStatus}
          onActiveChange={setIsActiveStatus}
          onSubmit={handleSave}
        />
      </AdminDrawer>
    </div>
  );
}
