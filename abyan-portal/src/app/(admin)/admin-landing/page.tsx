"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import LandingSectionForm, {
  LandingSectionFormData,
} from "@/components/admin/forms/LandingSectionForm";
import HighlightForm, {
  HighlightItemFormData,
} from "@/components/admin/forms/HighlightForm";
import { HighlightsService } from "@/services/highlights.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { AdminHighlightItem, AdminLandingSection } from "@/types/admin.types";



export default function AdminLandingPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [activeTab, setActiveTab] = useState<"sections" | "highlights">("sections");

  // Data States
  const [sections, setSections] = useState<AdminLandingSection[]>([]);
  const [highlights, setHighlights] = useState<AdminHighlightItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Drawer States
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState(false);
  const [isHighlightDrawerOpen, setIsHighlightDrawerOpen] = useState(false);

  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState<LandingSectionFormData | null>(null);

  const [currentHighlightId, setCurrentHighlightId] = useState<string | null>(null);
  const [currentHighlight, setCurrentHighlight] = useState<HighlightItemFormData | null>(null);

  const [isActiveStatus, setIsActiveStatus] = useState(true);

  const fetchHighlights = async () => {
    try {
      setIsLoading(true);
      const res = await HighlightsService.getHighlights();
      if (res.data && res.data.length > 0) {
        setHighlights(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch highlights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const res = await HighlightsService.getLandingSections();
      if (res.data && res.data.length > 0) {
        setSections(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch landing sections:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHighlights();
    fetchSections();
  }, []);

  // --- Landing Section Handlers ---
  const handleEditSection = (item: AdminLandingSection) => {
    setCurrentSectionId(item._id);
    setCurrentSection({
      sectionId: item.sectionId,
      name: item.name,
      title: item.title || "",
      subtitle: item.subtitle || "",
      images: item.images || [],

      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsSectionDrawerOpen(true);
  };

  const handleSaveSection = async (formData: LandingSectionFormData) => {
    try {
      if (currentSectionId && !currentSectionId.startsWith("temp")) {
        await HighlightsService.updateLandingSection(currentSectionId, {
          ...formData,
          isActive: isActiveStatus,
        });
        toast.success("تم تحديث القسم بنجاح");
        fetchSections();
      } else if (currentSectionId) {
        // Fallback local update
        setSections((prev) =>
          prev.map((s) =>
            s._id === currentSectionId
              ? { ...s, ...formData, isActive: isActiveStatus }
              : s
          )
        );
        toast.success("تم تحديث القسم بنجاح");
      } else {
        try {
          await HighlightsService.createLandingSection({
            ...formData,
            isActive: isActiveStatus,
          });
          toast.success("تم إضافة القسم بنجاح");
          fetchSections();
        } catch {
          // Local fallback add
          const newSec: AdminLandingSection = {
            _id: `temp_${Date.now()}`,
            ...formData,
            isActive: isActiveStatus,
          };
          setSections((prev) => [...prev, newSec]);
          toast.success("تم إضافة القسم بنجاح");
        }
      }
      setIsSectionDrawerOpen(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ القسم");
    }
  };

  const handleDeleteSection = async (item: AdminLandingSection) => {
    toast.error("لا يمكن حذف الأقسام الأساسية.");
  };


  // --- Highlight Handlers ---
  const handleEditHighlight = (item: AdminHighlightItem) => {
    setCurrentHighlightId(item._id);
    setCurrentHighlight({
      title: item.title,
      category: item.category,
      description: item.description,
      linkText: item.linkText,
      href: item.href,
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsHighlightDrawerOpen(true);
  };

  const handleSaveHighlight = async (formData: HighlightItemFormData) => {
    try {
      if (currentHighlightId && !currentHighlightId.startsWith("h")) {
        await HighlightsService.updateHighlight(currentHighlightId, {
          ...formData,
          isActive: isActiveStatus,
        });
        toast.success("تم تحديث البطاقة بنجاح");
        fetchHighlights();
      } else if (currentHighlightId) {
        // Fallback local update
        setHighlights((prev) =>
          prev.map((h) =>
            h._id === currentHighlightId
              ? { ...h, ...formData, isActive: isActiveStatus }
              : h
          )
        );
        toast.success("تم تحديث البطاقة بنجاح");
      } else {
        try {
          await HighlightsService.createHighlight({
            ...formData,
            isActive: isActiveStatus,
          });
          toast.success("تم إضافة البطاقة بنجاح");
          fetchHighlights();
        } catch {
          // Local fallback add
          const newH: AdminHighlightItem = {
            _id: `h_${Date.now()}`,
            ...formData,
            isActive: isActiveStatus,
          };
          setHighlights((prev) => [...prev, newH]);
          toast.success("تم إضافة البطاقة بنجاح");
        }
      }
      setIsHighlightDrawerOpen(false);
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البطاقة المبرزة");
    }
  };

  const handleDeleteHighlight = async (item: AdminHighlightItem) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف البطاقة المبرزة "${item.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف البطاقة",
      cancelText: "إلغاء",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        if (!item._id.startsWith("h")) {
          await HighlightsService.deleteHighlight(item._id);
        }
        setHighlights((prev) => prev.filter((h) => h._id !== item._id));
        toast.success("تم حذف البطاقة بنجاح");
      } catch (error) {
        toast.error("حدث خطأ أثناء حذف البطاقة");
      }
    }
  };

  // Table Columns
  const sectionColumns: Column<AdminLandingSection>[] = [
    { key: "name", header: "اسم القسم الرئيسي", isPrimary: true },
    {
      key: "title",
      header: "العنوان البارز والرمزية",
      render: (item) => item.title || item.subtitle || "لا يوجد عنوان",
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (item) => (
        <span className={item.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {item.isActive ? "نشط" : "مسودة"}
        </span>
      ),
    },
  ];

  const highlightColumns: Column<AdminHighlightItem>[] = [
    { key: "title", header: "عنوان البطاقة المبرزة", isPrimary: true },
    { key: "category", header: "التصنيف" },
    { key: "description", header: "الوصف" },
    {
      key: "linkText",
      header: "الرابط",
      render: (item) => `${item.linkText} (${item.href})`,
    },
    {
      key: "isActive",
      header: "الحالة",
      render: (item) => (
        <span className={item.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {item.isActive ? "نشط" : "مسودة"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="أقسام صفحة الهبوط"
        description="إدارة وتخصيص الأقسام والبطاقات المبرزة المعروضة في الواجهة الرئيسية للمنصة."
      />

      <AdminTabs
        tabs={[
          { id: "sections", label: "أقسام صفحة الهبوط" },
          { id: "highlights", label: "البطاقات المبرزة بالرئيسية" },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as "sections" | "highlights")}
        actionLabel={
          activeTab === "sections" ? undefined : "إضافة بطاقة مبرزة جديدة"
        }
        onAction={
          activeTab === "sections"
            ? undefined
            : () => {
                setCurrentHighlightId(null);
                setCurrentHighlight(null);
                setIsActiveStatus(true);
                setIsHighlightDrawerOpen(true);
              }
        }
      />

      {activeTab === "sections" ? (
        <AdminDataTable
          columns={sectionColumns}
          data={sections}
          isLoading={isLoading}
          onEdit={handleEditSection}
        />
      ) : (
        <AdminDataTable
          columns={highlightColumns}
          data={highlights}
          isLoading={isLoading}
          onEdit={handleEditHighlight}
          onDelete={handleDeleteHighlight}
        />
      )}

      {/* Drawer: Landing Section */}
      <AdminDrawer
        isOpen={isSectionDrawerOpen}
        onClose={() => setIsSectionDrawerOpen(false)}
        title={currentSection ? "تعديل قسم الرئيسية" : "إضافة قسم جديد"}
        formId="landing-section-form"
        saveLabel="حفظ القسم"
        headerActions={
          <AdminToggle
            label="تفعيل القسم"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <LandingSectionForm
          id="landing-section-form"
          initialData={currentSection}
          isActive={isActiveStatus}
          onActiveChange={setIsActiveStatus}
          onSave={handleSaveSection}
        />
      </AdminDrawer>

      {/* Drawer: Highlight Item */}
      <AdminDrawer
        isOpen={isHighlightDrawerOpen}
        onClose={() => setIsHighlightDrawerOpen(false)}
        title={currentHighlight ? "تعديل بطاقة مبرزة" : "إضافة بطاقة مبرزة جديدة"}
        formId="landing-highlight-form"
        saveLabel="حفظ البطاقة"
        headerActions={
          <AdminToggle
            label="تفعيل البطاقة"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <HighlightForm
          id="landing-highlight-form"
          initialData={currentHighlight}
          isActive={isActiveStatus}
          onActiveChange={setIsActiveStatus}
          onSave={handleSaveHighlight}
        />
      </AdminDrawer>
    </div>
  );
}
