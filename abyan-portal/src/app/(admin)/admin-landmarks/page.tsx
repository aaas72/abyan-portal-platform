"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import LandmarkCategoryForm, { LandmarkCategoryFormData } from "@/components/admin/forms/LandmarkCategoryForm";
import LandmarkPhotoCardForm, { LandmarkPhotoCardFormData } from "@/components/admin/forms/LandmarkPhotoCardForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { LandmarksService } from "@/services/landmarks.service";
import { DistrictsService } from "@/services/districts.service";
import { HistoryService } from "@/services/history.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { AdminLandmarkCategory, AdminLandmarkPhotoCard, AdminDistrict } from "@/types/admin.types";

export default function AdminLandmarksPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  
  const [activeTab, setActiveTab] = useState<'categories' | 'photoCards'>('photoCards');
  
  // Data states
  const [categories, setCategories] = useState<AdminLandmarkCategory[]>([]);
  const [photoCards, setPhotoCards] = useState<AdminLandmarkPhotoCard[]>([]);
  const [districts, setDistricts] = useState<AdminDistrict[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer states
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isPhotoCardDrawerOpen, setIsPhotoCardDrawerOpen] = useState(false);
  
  const [currentEditingCategoryId, setCurrentEditingCategoryId] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<LandmarkCategoryFormData | null>(null);
  
  const [currentEditingPhotoCardId, setCurrentEditingPhotoCardId] = useState<string | null>(null);
  const [currentPhotoCard, setCurrentPhotoCard] = useState<LandmarkPhotoCardFormData | null>(null);
  
  const [isActiveStatus, setIsActiveStatus] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await LandmarksService.getAdminCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchPhotoCards = async () => {
    try {
      const res = await LandmarksService.getAdminPhotoCards();
      setPhotoCards(res.data || []);
    } catch (error) {
      console.error("Failed to fetch photo cards:", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await DistrictsService.getAdminDistricts();
      setDistricts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchPhotoCards(), fetchDistricts()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  // --- Category Handlers ---
  const handleEditCategory = (item: AdminLandmarkCategory) => {
    setCurrentEditingCategoryId(item._id);
    setCurrentCategory({
      categoryName: item.categoryName,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || "",
      keyLandmarks: item.keyLandmarks || [],
      details: item.details || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsCategoryDrawerOpen(true);
  };

  const handleDeleteCategory = async (item: AdminLandmarkCategory) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف فئة "${item.title}"؟ سيؤدي ذلك أيضاً إلى تأثر المعالم المرتبطة بها.`,
      confirmText: "حذف الفئة",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await LandmarksService.deleteCategory(item._id);
        toast.success("تم حذف الفئة بنجاح");
        fetchCategories();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSaveCategory = async (formData: LandmarkCategoryFormData) => {
    try {
      const dataToSave = { ...formData, isActive: isActiveStatus };
      if (currentEditingCategoryId) {
        await LandmarksService.updateCategory(currentEditingCategoryId, dataToSave);
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        await LandmarksService.createCategory(dataToSave);
        toast.success("تم إضافة الفئة بنجاح");
      }
      setIsCategoryDrawerOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- PhotoCard Handlers ---
  const handleEditPhotoCard = (item: AdminLandmarkPhotoCard) => {
    setCurrentEditingPhotoCardId(item._id);
    setCurrentPhotoCard({
      category: typeof item.category === 'object' ? (item.category as any)._id : item.category,
      title: item.title,
      tag: item.tag,
      location: item.location,
      description: item.description || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      bgGradient: item.bgGradient || "",
      images: item.images || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsPhotoCardDrawerOpen(true);
  };

  const handleDeletePhotoCard = async (item: AdminLandmarkPhotoCard) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف معلم "${item.title}"؟`,
      confirmText: "حذف المعلم",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await LandmarksService.deletePhotoCard(item._id);
        toast.success("تم حذف المعلم بنجاح");
        fetchPhotoCards();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSavePhotoCard = async (formData: LandmarkPhotoCardFormData) => {
    try {
      const dataToSave = { ...formData, isActive: isActiveStatus };
      if (currentEditingPhotoCardId) {
        await LandmarksService.updatePhotoCard(currentEditingPhotoCardId, dataToSave);
        toast.success("تم تحديث المعلم بنجاح");
      } else {
        await LandmarksService.createPhotoCard(dataToSave);
        toast.success("تم إضافة المعلم بنجاح");
      }
      setIsPhotoCardDrawerOpen(false);
      fetchPhotoCards();
    } catch (error) {
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- Columns ---
  const categoryColumns: Column<AdminLandmarkCategory>[] = [

    { key: "title", header: "العنوان", isPrimary: true },
    { key: "subtitle", header: "العنوان الفرعي" },
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

  const photoCardColumns: Column<AdminLandmarkPhotoCard>[] = [
    { key: "title", header: "اسم المعلم", isPrimary: true },
    { key: "tag", header: "النوع" },
    { key: "location", header: "الموقع" },
    {
      key: "category",
      header: "الفئة المرتبطة",
      render: (item) => {
        const catId = typeof item.category === 'object' ? (item.category as any)._id : item.category;
        const catObj = typeof item.category === 'object' ? item.category : categories.find((c) => c._id === catId);
        return <span>{catObj ? (catObj as any).title : catId}</span>;
      }
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
        title="إدارة المعالم"
        description="إدارة فئات المعالم وإضافة المعالم المرتبطة بها في محافظة أبين."
      />

      {/* Tabs */}
      <AdminTabs
        tabs={[
          { id: 'photoCards', label: 'المعالم' },
          { id: 'categories', label: 'فئات المعالم' },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as 'categories' | 'photoCards')}
        actionLabel={activeTab === 'categories' ? "إضافة فئة جديدة" : "إضافة معلم جديد"}
        onAction={() => {
          if (activeTab === 'categories') {
            setCurrentEditingCategoryId(null);
            setCurrentCategory(null);
            setIsActiveStatus(true);
            setIsCategoryDrawerOpen(true);
          } else {
            setCurrentEditingPhotoCardId(null);
            setCurrentPhotoCard(null);
            setIsActiveStatus(true);
            setIsPhotoCardDrawerOpen(true);
          }
        }}
      />

      {activeTab === 'categories' ? (
        <AdminDataTable
          columns={categoryColumns}
          data={categories}
          isLoading={isLoading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <AdminDataTable
          columns={photoCardColumns}
          data={photoCards}
          isLoading={isLoading}
          onEdit={handleEditPhotoCard}
          onDelete={handleDeletePhotoCard}
        />
      )}

      {/* Category Drawer */}
      <AdminDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        title={currentCategory ? "تعديل فئة المعالم" : "إضافة فئة معالم جديدة"}
        formId="landmark-category-form"
        saveLabel="حفظ الفئة"
        headerActions={
          <AdminToggle
            label="تنشيط الفئة"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <LandmarkCategoryForm
          id="landmark-category-form"
          initialData={currentCategory}
          isActive={isActiveStatus}
          onActiveChange={setIsActiveStatus}
          onSave={handleSaveCategory}
        />
      </AdminDrawer>

      {/* PhotoCard Drawer */}
      <AdminDrawer
        isOpen={isPhotoCardDrawerOpen}
        onClose={() => setIsPhotoCardDrawerOpen(false)}
        title={currentPhotoCard ? "تعديل معلم" : "إضافة معلم جديد"}
        formId="landmark-photocard-form"
        saveLabel="حفظ المعلم"
        headerActions={
          <AdminToggle
            label="نشر المعلم"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <LandmarkPhotoCardForm
          id="landmark-photocard-form"
          initialData={currentPhotoCard}
          isActive={isActiveStatus}
          onActiveChange={setIsActiveStatus}
          categories={categories.map(c => ({ value: c._id, label: c.title }))}
          districts={districts}
          onSave={handleSavePhotoCard}
        />
      </AdminDrawer>
    </div>
  );
}
