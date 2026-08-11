"use client";

import React, { useState, useEffect } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/contexts/ToastContext";
import { AboutService } from "@/services/about.service";
import { AboutContent } from "@/types/schemas";
import { useConfirm } from "@/contexts/ConfirmContext";
import {
  AboutPillarFormDataSchema,
  AboutPillarFormData,
  AboutValueFormDataSchema,
  AboutValueFormData,
  AboutScopeFormDataSchema,
  AboutScopeFormData,
  AboutStatFormDataSchema,
  AboutStatFormData,
} from "@/types/schemas";

import { AboutPillarForm } from "@/components/admin/features/about/AboutPillarForm";
import { AboutValueForm } from "@/components/admin/features/about/AboutValueForm";
import { AboutScopeForm } from "@/components/admin/features/about/AboutScopeForm";
import { AboutStatForm } from "@/components/admin/features/about/AboutStatForm";

type TabId = "pillars" | "values" | "scopes" | "stats";

export default function AdminAboutPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabId>("pillars");
  const [aboutData, setAboutData] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Forms
  const pillarForm = useForm<AboutPillarFormData>({
    resolver: zodResolver(AboutPillarFormDataSchema),
  });
  const valueForm = useForm<AboutValueFormData>({
    resolver: zodResolver(AboutValueFormDataSchema),
  });
  const scopeForm = useForm<AboutScopeFormData>({
    resolver: zodResolver(AboutScopeFormDataSchema),
  });
  const statForm = useForm<AboutStatFormData>({
    resolver: zodResolver(AboutStatFormDataSchema),
  });

  const loadData = async () => {
    setIsLoading(true);
    const data = await AboutService.getAdminAboutContent();
    if (data) {
      setAboutData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddDrawer = () => {
    setEditingItem(null);
    setEditingIndex(null);
    if (activeTab === "pillars")
      pillarForm.reset({ title: "", description: "" });
    if (activeTab === "values") valueForm.reset({ title: "", description: "" });
    if (activeTab === "scopes")
      scopeForm.reset({ title: "", summary: "", items: [] });
    if (activeTab === "stats") statForm.reset({ number: "", label: "" });
    setIsDrawerOpen(true);
  };

  const openEditDrawer = (item: any) => {
    setEditingItem(item);
    const idx = aboutData ? (aboutData[activeTab] as any[]).indexOf(item) : -1;
    setEditingIndex(idx);
    if (activeTab === "pillars") pillarForm.reset(item);
    if (activeTab === "values") valueForm.reset(item);
    if (activeTab === "scopes") scopeForm.reset(item);
    if (activeTab === "stats") statForm.reset(item);
    setIsDrawerOpen(true);
  };

  const saveToBackend = async (newData: AboutContent) => {
    try {
      const response = await AboutService.updateAboutContent(newData);
      if (!response.success) throw new Error("Failed to save");
      const freshData = await AboutService.getAdminAboutContent();
      setAboutData(freshData || newData);
      setIsDrawerOpen(false);
      toast.success("تم حفظ التعديلات بنجاح");
    } catch (error) {
      console.error("Save about error:", error);
      toast.error("حدث خطأ أثناء الحفظ");
    }
  };

  const handleSave = async (data: any) => {
    if (!aboutData) return;

    const newData = { ...aboutData };
    const arr = [...(newData[activeTab] as any[])];

    if (editingItem !== null) {
      let index = editingIndex ?? -1;
      if (index === -1 && editingItem._id) {
        index = arr.findIndex((i) => i._id && String(i._id) === String(editingItem._id));
      }
      if (index === -1) {
        index = arr.findIndex((i) =>
          (i.title && i.title === editingItem.title) ||
          (i.label && i.label === editingItem.label && i.number === editingItem.number)
        );
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
    if (!aboutData) return;
    const confirmed = await confirm({
      title: "حذف العنصر",
      description: `هل أنت متأكد من حذف "${item.title || item.label || item.number}"؟`,
      confirmText: "نعم، احذف",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (confirmed) {
      const newData = { ...aboutData };
      const arr = [...(newData[activeTab] as any[])];
      newData[activeTab] = arr.filter((i) => {
        if (i === item) return false;
        if (item._id && i._id && String(i._id) === String(item._id)) return false;
        if (item.title && i.title && i.title === item.title) return false;
        if (item.label && i.label && i.label === item.label && i.number === item.number) return false;
        return true;
      });
      await saveToBackend(newData);
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case "pillars":
      case "values":
        return [
          { key: "title", header: "العنوان", isPrimary: true },
          { key: "description", header: "الوصف" },
        ];
      case "scopes":
        return [
          { key: "title", header: "النطاق", isPrimary: true },
          { key: "summary", header: "الملخص" },
          {
            key: "items",
            header: "العناصر",
            render: (item: any) => `${item.items?.length || 0} عناصر`,
          },
        ];
      case "stats":
        return [
          { key: "number", header: "الرقم", isPrimary: true },
          { key: "label", header: "التسمية" },
        ];
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="إدارة صفحة عن البوابة" />

      <AdminTabs
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabId)}
        actionLabel="إضافة عنصر جديد"
        onAction={openAddDrawer}
        tabs={[
          {
            id: "pillars",
            label: "الأهداف والركائز",
            count: aboutData?.pillars?.length,
          },
          {
            id: "values",
            label: "القيم والمبادئ",
            count: aboutData?.values?.length,
          },
          {
            id: "scopes",
            label: "مجالات التوثيق",
            count: aboutData?.scopes?.length,
          },
          { id: "stats", label: "الإحصائيات", count: aboutData?.stats?.length },
        ]}
      />

      <AdminDataTable
        columns={getColumns()}
        data={aboutData ? aboutData[activeTab] : []}
        isLoading={isLoading}
        onEdit={openEditDrawer}
        onDelete={handleDelete}
        emptyMessage="لا يوجد عناصر مضافة بعد."
      />

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? "تعديل عنصر" : "إضافة عنصر جديد"}
        formId="drawer-form"
        saveLabel={editingItem ? "تحديث العنصر" : "حفظ العنصر"}
      >
        <div className="p-6">
          {activeTab === "pillars" && (
            <form
              id="drawer-form"
              onSubmit={pillarForm.handleSubmit(handleSave)}
            >
              <AboutPillarForm form={pillarForm} />
            </form>
          )}
          {activeTab === "values" && (
            <form
              id="drawer-form"
              onSubmit={valueForm.handleSubmit(handleSave)}
            >
              <AboutValueForm form={valueForm} />
            </form>
          )}
          {activeTab === "scopes" && (
            <form
              id="drawer-form"
              onSubmit={scopeForm.handleSubmit(handleSave)}
            >
              <AboutScopeForm form={scopeForm} />
            </form>
          )}
          {activeTab === "stats" && (
            <form id="drawer-form" onSubmit={statForm.handleSubmit(handleSave)}>
              <AboutStatForm form={statForm} />
            </form>
          )}
        </div>
      </AdminDrawer>
    </div>
  );
}
