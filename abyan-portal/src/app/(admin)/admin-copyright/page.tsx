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
import { CopyrightService } from "@/services/copyright.service";
import {
  CopyrightContent,
  CopyrightSectionFormDataSchema,
  CopyrightSectionFormData,
} from "@/types/schemas";

import { CopyrightSectionForm } from "@/components/admin/features/copyright/CopyrightSectionForm";

type TabId = "declarations" | "pillars" | "guidelines" | "contactNotice";

export default function AdminCopyrightPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabId>("declarations");
  const [copyrightData, setCopyrightData] = useState<CopyrightContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Form
  const sectionForm = useForm<CopyrightSectionFormData>({
    resolver: zodResolver(CopyrightSectionFormDataSchema),
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await CopyrightService.getAdminCopyrightContent();
    if (data && !Array.isArray(data)) {
      setCopyrightData(data);
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
    const idx = copyrightData ? (copyrightData[activeTab] as any[]).indexOf(item) : -1;
    setEditingIndex(idx);
    sectionForm.reset({
      title: item.title || "",
      description: item.description || "",
      summary: item.summary || "",
      items: item.items || [],
    });
    setIsDrawerOpen(true);
  };

  const saveToBackend = async (newData: CopyrightContent) => {
    try {
      const response = await CopyrightService.updateCopyrightContent(newData);
      if (!response.success) throw new Error("Failed to save");
      const freshData = await CopyrightService.getAdminCopyrightContent();
      setCopyrightData(freshData || newData);
      setIsDrawerOpen(false);
      toast.success("تم حفظ التعديلات بنجاح");
    } catch (error) {
      console.error("Save copyright error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleSave = async (data: CopyrightSectionFormData) => {
    if (!copyrightData) return;

    const newData = { ...copyrightData };
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
    if (!copyrightData) return;
    const confirmed = await confirm({
      title: "حذف العنصر",
      description: `هل أنت متأكد من حذف "${item.title}"؟`,
      confirmText: "نعم، احذف",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (confirmed) {
      const newData = { ...copyrightData };
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
      <AdminPageHeader title="إدارة حقوق الملكية الفكرية والنشر" />

      <AdminTabs
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        actionLabel="إضافة بند جديد"
        onAction={openAddDrawer}
        tabs={[
          {
            id: "declarations",
            label: "إعلان الملكية الأصلي",
            count: copyrightData?.declarations?.length,
          },
          {
            id: "pillars",
            label: "الركائز والمنهجية",
            count: copyrightData?.pillars?.length,
          },
          {
            id: "guidelines",
            label: "ضوابط النقل والبحث",
            count: copyrightData?.guidelines?.length,
          },
          {
            id: "contactNotice",
            label: "التواصل والتعديل",
            count: copyrightData?.contactNotice?.length,
          },
        ]}
      />

      <AdminDataTable
        columns={getColumns()}
        data={copyrightData && Array.isArray(copyrightData[activeTab]) ? copyrightData[activeTab] : []}
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
      >
        <div className="p-6">
          <form
            id="drawer-form"
            onSubmit={sectionForm.handleSubmit(handleSave)}
          >
            <CopyrightSectionForm form={sectionForm} />
          </form>
        </div>
      </AdminDrawer>
    </div>
  );
}
