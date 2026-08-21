"use client";

import React, { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { PrivacyService } from "@/services/privacy.service";
import {
  PrivacyContent,
  PrivacyItemSchema,
  PrivacyItem,
} from "@/types/schemas";

import { PrivacySectionForm } from "@/components/admin/features/privacy/PrivacySectionForm";

type TabId = "intro" | "dataCollection" | "usageAndProtection" | "cookiesAndAnalytics";

export default function AdminPrivacyPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabId>("intro");
  const [privacyData, setPrivacyData] = useState<PrivacyContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form
  const sectionForm = useForm<PrivacyItem>({
    resolver: zodResolver(PrivacyItemSchema),
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await PrivacyService.getAdminPrivacyContent();
    if (data && !Array.isArray(data)) {
      setPrivacyData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddDrawer = () => {
    setEditingItem(null);
    setEditingIndex(null);
    sectionForm.reset({ title: "", description: "" });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item: any) => {
    setEditingItem(item);
    const idx = privacyData ? (privacyData[activeTab] as any[]).indexOf(item) : -1;
    setEditingIndex(idx);
    sectionForm.reset({
      title: item.title || "",
      description: item.description || "",
      summary: item.summary || "",
      items: item.items || [],
    });
    setIsDrawerOpen(true);
  };

  const saveToBackend = async (newData: PrivacyContent) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const response = await PrivacyService.updatePrivacyContent(newData);
      if (!response.success) throw new Error("Failed to save");
      const freshData = await PrivacyService.getAdminPrivacyContent();
      setPrivacyData(freshData || newData);
      setIsDrawerOpen(false);
      toast.success("تم حفظ التعديلات بنجاح");
    } catch (error) {
      console.error("Save privacy error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (data: PrivacyItem) => {
    if (!privacyData) return;

    const newData = { ...privacyData };
    const arr = [...(newData[activeTab] as any[])];

    if (editingItem !== null) {
      let index = editingIndex ?? -1;
      if (index === -1 && editingItem._id) {
        index = arr.findIndex((i) => i._id && String(i._id) === String(editingItem._id));
      }
      if (index === -1) {
        index = arr.findIndex((i) => i.title && i.title === editingItem.title);
      }

      if (index > -1) {
        arr[index] = { ...arr[index], ...data };
      } else {
        arr.push(data);
      }
    } else {
      arr.push(data);
    }

    newData[activeTab] = arr;
    await saveToBackend(newData);
  };

  const handleDelete = async (item: any) => {
    if (!privacyData) return;
    const confirmed = await confirm({
      title: "حذف العنصر",
      description: `هل أنت متأكد من حذف "${item.title}"؟`,
      confirmText: "نعم، احذف",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (confirmed) {
      const newData = { ...privacyData };
      const arr = [...(newData[activeTab] as any[])];
      newData[activeTab] = arr.filter((i) => {
        if (i === item) return false;
        if (item._id && i._id && String(i._id) === String(item._id)) return false;
        if (item.title && i.title && i.title === item.title) return false;
        return true;
      });
      await saveToBackend(newData);
    }
  };

  const getColumns = () => [
    { key: "title", header: "العنوان", isPrimary: true },
    { key: "description", header: "الشرح والتفاصيل" },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader title="إدارة سياسة الخصوصية وحماية البيانات" />

      <AdminTabs
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        actionLabel="إضافة بند جديد"
        onAction={openAddDrawer}
        tabs={[
          {
            id: "intro",
            label: "الالتزام الأخلاقي",
            count: privacyData?.intro?.length,
          },
          {
            id: "dataCollection",
            label: "طبيعة البيانات والتجميع",
            count: privacyData?.dataCollection?.length,
          },
          {
            id: "usageAndProtection",
            label: "الأمان وعدم المشاركة",
            count: privacyData?.usageAndProtection?.length,
          },
          {
            id: "cookiesAndAnalytics",
            label: "ملفات الارتباط وحقوق الحذف",
            count: privacyData?.cookiesAndAnalytics?.length,
          },
        ]}
      />

      <AdminDataTable
        columns={getColumns()}
        data={privacyData && Array.isArray(privacyData[activeTab]) ? privacyData[activeTab] : []}
        isLoading={isLoading}
        onEdit={openEditDrawer}
        onDelete={handleDelete}
        emptyMessage="لا يوجد بنود مضافة بعد."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "تعديل بند" : "إضافة بند جديد"}
        formId="drawer-form"
        saveLabel={editingItem ? "تحديث البند" : "حفظ البند"}
        isSaving={isSaving}
      >
        <div className="p-6">
          <form
            id="drawer-form"
            onSubmit={sectionForm.handleSubmit(handleSave)}
          >
            <PrivacySectionForm form={sectionForm} />
          </form>
        </div>
      </AdminDrawer>
    </div>
  );
}
