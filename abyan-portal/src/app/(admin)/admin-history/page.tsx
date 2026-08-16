"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import HistoryEraForm from "@/components/admin/features/history/HistoryEraForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { HistoryService } from "@/services/history.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { AdminHistoryEra } from "@/types/admin.types";
import { HistoryEraFormData } from "@/types/schemas";

export default function AdminHistoryPage() {
  const [data, setData] = useState<AdminHistoryEra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEra, setCurrentEra] = useState<HistoryEraFormData | null>(null);
  const [currentEraId, setCurrentEraId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const { confirm } = useConfirm();

  const fetchEras = async () => {
    try {
      setIsLoading(true);
      const res = await HistoryService.getAdminEras();
      setData(res.data || []);
    } catch (error) {
      console.error("Failed to fetch eras:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEras();
  }, []);

  const handleCreateNew = () => {
    setCurrentEra(null);
    setCurrentEraId(null);
    setIsPublished(true);
    setIsDrawerOpen(true);
  };

  const handleEdit = (row: AdminHistoryEra) => {
    setCurrentEra({
      startYear: row.startYear,
      endYear: row.endYear,
      eraTitle: row.eraTitle,
      historicalCapital: row.historicalCapital,
      authorName: row.authorName || "",
      sourceName: row.sourceName || "",
      sourceUrl: row.sourceUrl || "",
      sources: row.sources && row.sources.length > 0 ? row.sources : (row.sourceName ? [{ name: row.sourceName, url: row.sourceUrl }] : []),
      shortSummary: row.shortSummary,
      fullDescription: row.fullDescription,
      images: row.images || [],
      keyEvents: row.keyEvents || [],
      notableLandmarks: row.notableLandmarks || [],
      isActive: row.isActive,
    });
    setCurrentEraId(row._id);
    setIsPublished(row.isActive);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (row: AdminHistoryEra) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف حقبة "${row.eraTitle}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف الحقبة",
      cancelText: "إلغاء",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await HistoryService.deleteEra(row._id);
        toast.success("تم الحذف بنجاح");
        fetchEras();
      } catch (error) {
        toast.error("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleSave = async (formData: HistoryEraFormData) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (currentEraId) {
        await HistoryService.updateEra(currentEraId, formData);
        toast.success("تم التحديث بنجاح");
      } else {
        await HistoryService.createEra(formData);
        toast.success("تمت الإضافة بنجاح");
      }
      setIsDrawerOpen(false);
      fetchEras();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setIsSaving(false);
    }
  };



  const columns: Column<AdminHistoryEra>[] = [
    {
      key: "eraTitle",
      header: "اسم الحقبة",
      isPrimary: true,
    },
    {
      key: "timeframe",
      header: "الإطار الزمني",
      render: (row) => (
        <span dir="ltr" className="inline-block text-slate-500 font-abyan-body">
          {row.startYear} - {row.endYear}
        </span>
      ),
    },
    {
      key: "historicalCapital",
      header: "العاصمة / المركز",
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (item) => (
        <span
         className={item.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {item.isActive ? "نشط" : "مسودة"}
        </span>
      ),
    },
  ];

  // Filtered Eras
  const filteredEras = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.eraTitle.toLowerCase().includes(q) ||
        (item.historicalCapital && item.historicalCapital.toLowerCase().includes(q)) ||
        (item.startYear && item.startYear.toLowerCase().includes(q)) ||
        (item.endYear && item.endYear.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        (item.shortSummary && item.shortSummary.toLowerCase().includes(q)) ||
        (item.fullDescription && item.fullDescription.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [data, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <AdminPageHeader
        title="التاريخ والحقب"
        description="إدارة الخط الزمني لتاريخ أبين والحقب الزمنية"
      >
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="بحث في الحقب، العواصم، التواريخ..."
          totalCount={data.length}
          filteredCount={filteredEras.length}
        />
      </AdminPageHeader>

      <AdminTabs
        tabs={[
          { id: 'eras', label: 'الحقب الزمنية', count: filteredEras.length },
        ]}
        activeTab="eras"
        onTabChange={() => {}}
        actionLabel="إضافة حقبة جديدة"
        onAction={handleCreateNew}
      />

      <div className="flex-1 p-6">
        <AdminDataTable
          columns={columns}
          data={filteredEras}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد حقب زمنية مضافة بعد."}
        />
      </div>

      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={currentEraId ? "تعديل الحقبة" : "إضافة حقبة جديدة"}
        formId="history-era-form"
        saveLabel={currentEraId ? "حفظ التعديلات" : "حفظ الحقبة"}
        isSaving={isSaving}
        headerActions={
          <AdminToggle
            checked={isPublished}
            onChange={setIsPublished}
            label="نشر الحقبة"
          />
        }
      >
        <div className="p-6">
          <HistoryEraForm
            id="history-era-form"
            initialData={currentEra}
            isPublished={isPublished}
            onPublishedChange={setIsPublished}
            onSave={handleSave}
          />
        </div>
      </AdminDrawer>
    </div>
  );
}
