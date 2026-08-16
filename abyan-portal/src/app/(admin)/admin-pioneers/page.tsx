
"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import PioneerForm, {
  PioneerFormData,
} from "@/components/admin/forms/PioneerForm";
import PioneerCategoryForm, {
  PioneerCategoryFormData,
} from "@/components/admin/forms/PioneerCategoryForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { PioneersService } from "@/services/pioneers.service";
import { DistrictsService } from "@/services/districts.service";
import { HistoryService } from "@/services/history.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import {
  AdminPioneer,
  AdminPioneerCategory,
  AdminDistrict,
} from "@/types/admin.types";

export default function AdminPioneersPage() {
  const [activeTab, setActiveTab] = useState<"figures" | "categories">(
    "figures",
  );
  const [data, setData] = useState<AdminPioneer[]>([]);
  const [categories, setCategories] = useState<AdminPioneerCategory[]>([]);
  const [districts, setDistricts] = useState<AdminDistrict[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Figure Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentPioneer, setCurrentPioneer] = useState<PioneerFormData | null>(
    null,
  );
  const [currentPioneerId, setCurrentPioneerId] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  // Category Drawer State
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<PioneerCategoryFormData | null>(null);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(
    null,
  );
  const [isCategoryPublished, setIsCategoryPublished] = useState(true);

  const toast = useToast();
  const { confirm } = useConfirm();

  const fetchPioneers = async (pageNum = 1) => {
    try {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      const res = await PioneersService.getAdminFigures(pageNum, 10);

      if (pageNum === 1) {
        setData(res.data || []);
      } else {
        setData((prev) => [...prev, ...(res.data || [])]);
      }
      setHasMore(res.hasMore);
    } catch (error) {
      console.error("Failed to fetch pioneers:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await PioneersService.getAdminCategories();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch pioneer categories:", error);
    } finally {
      setIsLoading(false);
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
    fetchDistricts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (activeTab === "figures") {
      fetchPioneers(1);
    } else {
      fetchCategories();
    }
  }, [activeTab]);

  const handleLoadMore = () => {
    if (activeTab === "figures" && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPioneers(nextPage);
    }
  };

  // --- Figures Handlers ---
  const handleDelete = async (item: AdminPioneer) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف الشخصية "${item.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف السجل",
      cancelText: "إلغاء",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await PioneersService.deleteFigure(item._id);
        toast.success("تم حذف الشخصية بنجاح");
        fetchPioneers(1);
      } catch (error) {
        toast.error(error?.response?.data?.message || "فشل في حذف السجل");
      }
    }
  };

  const handleEdit = (item: AdminPioneer) => {
    setCurrentPioneerId(item._id);
    setCurrentPioneer({
      name: item.name,
      title: item.title,
      startYear: item.startYear || "",
      endYear: item.endYear || "",
      origin: item.origin || "",
      authorName: item.authorName || "",
      sourceName: item.sourceName || "",
      sourceUrl: item.sourceUrl || "",
      sources: item.sources && item.sources.length > 0 ? item.sources : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []),
      category: item.category || "",
      biography: item.biography || "",
      quote: item.quote || "",
      birthDate: item.birthDate || "",
      deathDate: item.deathDate || "",
      isPublished: item.isActive,
      achievements: item.achievements || [],
      images: item.images || [],
    });
    setIsPublished(item.isActive);
    setIsDrawerOpen(true);
  };

  const handleSave = async (formData: PioneerFormData) => {
    try {
      const dataToSave = { ...formData, isPublished };
      if (currentPioneerId) {
        await PioneersService.updateFigure(currentPioneerId, dataToSave);
        toast.success(`تم تحديث بيانات: ${formData.name}`);
      } else {
        await PioneersService.createFigure(dataToSave);
        toast.success(`تم إضافة الشخصية: ${formData.name}`);
      }
      setIsDrawerOpen(false);
      fetchPioneers(1);
    } catch (error) {
      let errorMsg = "حدث خطأ أثناء حفظ البيانات";
      if (error?.response?.data?.errors) {
        errorMsg = error.response.data.errors.join("، ");
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
    }
  };

  // --- Categories Handlers ---
  const handleEditCategory = (item: AdminPioneerCategory) => {
    setCurrentCategoryId(item._id);
    setCurrentCategory({
      categoryName: item.categoryName,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || "",
      keyFigures: item.keyFigures || [],
      details: item.details || [],
      isActive: item.isActive,
    });
    setIsCategoryPublished(item.isActive);
    setIsCategoryDrawerOpen(true);
  };

  const handleDeleteCategory = async (item: AdminPioneerCategory) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف الفئة "${item.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف الفئة",
      cancelText: "إلغاء",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await PioneersService.deleteCategory(item._id);
        toast.success("تم حذف الفئة بنجاح");
        fetchCategories();
      } catch (error) {
        toast.error(error?.response?.data?.message || "فشل في حذف الفئة");
      }
    }
  };

  const handleSaveCategory = async (formData: PioneerCategoryFormData) => {
    try {
      const dataToSave = { ...formData, isActive: isCategoryPublished };
      if (currentCategoryId) {
        await PioneersService.updateCategory(currentCategoryId, dataToSave);
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        await PioneersService.createCategory(dataToSave);
        toast.success("تم إضافة الفئة بنجاح");
      }
      setIsCategoryDrawerOpen(false);
      fetchCategories();
     } catch (error) {
      console.error(
        "Save pioneer category error:",
        error?.response?.data || error,
      );
      let errorMsg = "حدث خطأ أثناء حفظ الفئة";
      if (error?.response?.data?.errors) {
        errorMsg = error.response.data.errors.join("، ");
      } else if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      toast.error(errorMsg);
    }
  };

  // --- Columns ---
  const columns: Column<AdminPioneer>[] = [
    { key: "name", header: "الاسم", isPrimary: true },
    {
      key: "title",
      header: "اللقب / الصفة",
    },
    {
      key: "startYear",
      header: "الفترة (البداية-النهاية)",
      render: (item: AdminPioneer) => (
        <span>{item.startYear} - {item.endYear}</span>
      ),
    },
    {
      key: "category",
      header: "الفئة",
    },
    {
      key: "origin",
      header: "المنشأ / المديرية",
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

  const categoryColumns: Column<AdminPioneerCategory>[] = [
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

  // Filtered Figures
  const filteredFigures = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.origin && item.origin.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        (item.biography && item.biography.toLowerCase().includes(q));

      const matchesCategory = !selectedCategory || selectedCategory === "all" ||
        item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [categories, searchQuery]);

  return (
    <div>
      <AdminPageHeader
        title="إدارة رواد أبين"
        description="إضافة وتعديل وحذف الشخصيات التاريخية والأدبية والسياسية من أبين."
      >
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={activeTab === "figures" ? "بحث بالاسم، اللقب، المنشأ..." : "بحث في فئات الرواد..."}
          categoryFilter={activeTab === "figures" ? selectedCategory : undefined}
          onCategoryChange={activeTab === "figures" ? setSelectedCategory : undefined}
          categoryOptions={activeTab === "figures" ? categories.map((c) => ({ label: c.title, value: c.title })) : []}
          categoryPlaceholder="كل فئات الرواد"
          totalCount={activeTab === "figures" ? data.length : categories.length}
          filteredCount={activeTab === "figures" ? filteredFigures.length : filteredCategories.length}
        />
      </AdminPageHeader>

      <AdminTabs
        tabs={[
          { id: "figures", label: "الشخصيات والرواد", count: filteredFigures.length },
          { id: "categories", label: "فئات الشخصيات", count: filteredCategories.length },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as "figures" | "categories");
          setSelectedCategory("");
        }}
        actionLabel={
          activeTab === "figures" ? "إضافة شخصية جديدة" : "إضافة فئة جديدة"
        }
        onAction={() => {
          if (activeTab === "figures") {
            setCurrentPioneerId(null);
            setCurrentPioneer(null);
            setIsPublished(true);
            setIsDrawerOpen(true);
          } else {
            setCurrentCategoryId(null);
            setCurrentCategory(null);
            setIsCategoryPublished(true);
            setIsCategoryDrawerOpen(true);
          }
        }}
      />

      {activeTab === "figures" ? (
        <AdminDataTable
          columns={columns}
          data={filteredFigures}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore && !searchQuery && !selectedCategory}
          onLoadMore={handleLoadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage={searchQuery || selectedCategory ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد شخصيات متاحة حالياً."}
        />
      ) : (
        <AdminDataTable
          columns={categoryColumns}
          data={filteredCategories}
          isLoading={isLoading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          emptyMessage={searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد فئات متاحة حالياً."}
        />
      )}

      {/* Figures Drawer */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={currentPioneer ? "تعديل شخصية" : "إضافة شخصية جديدة"}
        formId="pioneer-form"
        saveLabel="حفظ الشخصية"
        headerActions={
          <AdminToggle
            label="نشر السجل"
            checked={isPublished}
            onChange={setIsPublished}
          />
        }
      >
        <PioneerForm
          id="pioneer-form"
          initialData={currentPioneer}
          categories={categories.map((c) => c.title)}
          districts={districts}
          isPublished={isPublished}
          onPublishedChange={setIsPublished}
          onSave={handleSave}
        />
      </AdminDrawer>

      {/* Categories Drawer */}
      <AdminDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        title={currentCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
        formId="pioneer-category-form"
        saveLabel="حفظ الفئة"
        headerActions={
          <AdminToggle
            label="نشر الفئة"
            checked={isCategoryPublished}
            onChange={setIsCategoryPublished}
          />
        }
      >
        <PioneerCategoryForm
          id="pioneer-category-form"
          initialData={currentCategory}
          isActive={isCategoryPublished}
          onActiveChange={setIsCategoryPublished}
          onSave={handleSaveCategory}
        />
      </AdminDrawer>
    </div>
  );
}
