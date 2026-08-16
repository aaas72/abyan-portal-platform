"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import ArchiveItemForm, {
  ArchiveItemFormData,
} from "@/components/admin/forms/ArchiveItemForm";
import ArchiveCategoryForm from "@/components/admin/forms/ArchiveCategoryForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { GalleryService } from "@/services/gallery.service";
import { DistrictsService } from "@/services/districts.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { AdminDistrict, AdminArchiveCategory } from "@/types/admin.types";
import { ArchiveCategoryFormData } from "@/types/schemas";

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  categoryLabel?: string;
  date: string;
  isActive: boolean;
  year?: string;
  location?: string;
  authorName?: string;
  description?: string;
  images?: string[];
}

export default function AdminGalleryPage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');

  const [data, setData] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<AdminArchiveCategory[]>([]);
  const [districts, setDistricts] = useState<AdminDistrict[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Items Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [currentGalleryItem, setCurrentGalleryItem] = useState<ArchiveItemFormData | null>(null);
  const [isPublished, setIsPublished] = useState(true);

  // Categories Drawer
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [currentEditingCategoryId, setCurrentEditingCategoryId] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<ArchiveCategoryFormData | null>(null);
  const [isCategoryPublished, setIsCategoryPublished] = useState(true);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const [res, distRes, catRes] = await Promise.all([
        GalleryService.getAdminImages(),
        DistrictsService.getAdminDistricts(),
        GalleryService.getCategories()
      ]);
      setData(res.data || []);
      setDistricts(distRes.data || []);
      setCategories((catRes.data as AdminArchiveCategory[]) || []);
    } catch (error) {
      console.error("Failed to fetch gallery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDeleteItem = async (item: GalleryImage) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف الصورة "${item.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف الصورة",
      cancelText: "إلغاء",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        await GalleryService.deleteImage(item._id);
        toast.success("تم حذف السجل بنجاح");
        fetchItems();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "فشل في حذف السجل");
      }
    }
  };

  const handleEditItem = (item: any) => {
    setCurrentEditingId(item._id);
    setCurrentGalleryItem({
      title: item.title,
      categoryLabel: item.categoryLabel || item.category || "",
      year: item.year || item.date || "",
      location: item.location || "",
      authorName: item.authorName || "",
      sourceName: item.sourceName || "",
      sourceUrl: item.sourceUrl || "",
      sources: item.sources && item.sources.length > 0 ? item.sources : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []),
      description: item.description || "",
      images: item.images || [],
      isPublished: item.isActive,
    });
    setIsPublished(item.isActive);
    setIsDrawerOpen(true);
  };

  const handleSaveItem = async (formData: ArchiveItemFormData) => {
    try {
      // Find the selected category to get its programmatic name
      const selectedCategory = categories.find(c => c.title === formData.categoryLabel);
      const category = selectedCategory ? selectedCategory.categoryName : "other";

      const { isPublished: _unused, ...cleanFormData } = formData as any;
      const dataToSave = { 
        ...cleanFormData, 
        category,
        aspectRatio: "16/9",
        bgGradient: "bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent",
        isActive: isPublished 
      };
      
      if (currentEditingId) {
        await GalleryService.updateImage(currentEditingId, dataToSave);
        toast.success("تم تحديث السجل بنجاح");
      } else {
        await GalleryService.createImage(dataToSave);
        toast.success("تم إضافة السجل بنجاح");
      }
      setIsDrawerOpen(false);
      fetchItems();
      } catch (error: any) {
        console.error("Failed to save archive item:", error?.response?.data || error);
        toast.error(error?.response?.data?.message || "فشل في حفظ السجل");
      }
  };

  const handleDeleteCategory = async (cat: AdminArchiveCategory) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف التصنيف "${cat.title}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف التصنيف",
      cancelText: "إلغاء",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        await GalleryService.deleteCategory(cat._id);
        toast.success("تم حذف التصنيف بنجاح");
        fetchItems();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "فشل في حذف التصنيف");
      }
    }
  };

  const handleEditCategory = (cat: AdminArchiveCategory) => {
    setCurrentEditingCategoryId(cat._id);
    setCurrentCategory({
      categoryName: cat.categoryName,
      title: cat.title,
      subtitle: cat.subtitle,
      description: cat.description || "",
      keyTags: cat.keyTags || [],
      details: cat.details || [],
      isActive: cat.isActive,
    });
    setIsCategoryPublished(cat.isActive);
    setIsCategoryDrawerOpen(true);
  };

  const handleSaveCategory = async (formData: ArchiveCategoryFormData) => {
    try {
      if (currentEditingCategoryId) {
        await GalleryService.updateCategory(currentEditingCategoryId, formData);
        toast.success("تم تحديث التصنيف بنجاح");
      } else {
        await GalleryService.createCategory(formData);
        toast.success("تم إضافة التصنيف بنجاح");
      }
      setIsCategoryDrawerOpen(false);
      fetchItems();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "فشل في حفظ التصنيف");
    }
  };

  const itemColumns: Column<GalleryImage>[] = [
    { key: "title", header: "عنوان الصورة", isPrimary: true },
    { key: "categoryLabel", header: "التصنيف" },
    { key: "year", header: "سنة التوثيق" },
    {
      key: "isActive",
      header: "الحالة",
      render: (item) => (
        <span className={item.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {item.isActive ? "منشور" : "مخفي"}
        </span>
      ),
    },
  ];

  const categoryColumns: Column<AdminArchiveCategory>[] = [
    { key: "title", header: "عنوان التصنيف", isPrimary: true },

    {
      key: "isActive",
      header: "الحالة",
      render: (item) => (
        <span className={item.isActive ? "text-[#10b981]" : "text-slate-400"}>
          {item.isActive ? "نشط" : "مخفي"}
        </span>
      ),
    },
  ];

  // Filtered Archive Items
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.year && item.year.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesCategory = !selectedCategory || selectedCategory === "all" ||
        item.category === selectedCategory || item.categoryLabel === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data, searchQuery, selectedCategory]);

  // Filtered Categories
  const filteredCategories = useMemo(() => {
    return categories.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.categoryName.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [categories, searchQuery]);

  const tabs = [
    { id: 'items', label: 'محتوى الأرشيف', count: filteredData.length },
    { id: 'categories', label: 'التصنيفات الأرشيفية', count: filteredCategories.length },
  ];

  return (
    <div>
      <AdminPageHeader
        title="معرض الصور والأرشيف"
        description="إدارة مكتبة الصور والوثائق والمخطوطات التراثية وتصنيفاتها."
      >
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={activeTab === 'items' ? "بحث في الوثائق، الصور، الموقع..." : "بحث في التصنيفات..."}
          categoryFilter={activeTab === 'items' ? selectedCategory : undefined}
          onCategoryChange={activeTab === 'items' ? setSelectedCategory : undefined}
          categoryOptions={activeTab === 'items' ? categories.map((c) => ({ label: c.title, value: c.categoryName })) : []}
          categoryPlaceholder="كل تصنيفات الأرشيف"
          totalCount={activeTab === 'items' ? data.length : categories.length}
          filteredCount={activeTab === 'items' ? filteredData.length : filteredCategories.length}
        />
      </AdminPageHeader>

      <AdminTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab as any);
          setSelectedCategory("");
        }} 
        actionLabel={activeTab === 'items' ? "رفع وثيقة جديدة" : "إضافة تصنيف جديد"}
        onAction={() => {
          if (activeTab === 'items') {
            setCurrentEditingId(null);
            setCurrentGalleryItem(null);
            setIsPublished(true);
            setIsDrawerOpen(true);
          } else {
            setCurrentEditingCategoryId(null);
            setCurrentCategory(null);
            setIsCategoryPublished(true);
            setIsCategoryDrawerOpen(true);
          }
        }}
      />

      <div className="mt-8">
        {activeTab === 'items' ? (
          <AdminDataTable
            columns={itemColumns}
            data={filteredData}
            isLoading={isLoading}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            emptyMessage={searchQuery || selectedCategory ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد وثائق متاحة حالياً."}
          />
        ) : (
          <AdminDataTable
            columns={categoryColumns}
            data={filteredCategories}
            isLoading={isLoading}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
            emptyMessage={searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد تصنيفات متاحة حالياً."}
          />
        )}
      </div>

      {/* Items Drawer */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={currentEditingId ? "تعديل الوثيقة" : "رفع وثيقة جديدة"}
        formId="archive-form"
        saveLabel="حفظ الوثيقة"
      >
        <ArchiveItemForm
          id="archive-form"
          initialData={currentGalleryItem}
          categories={categories.map(c => ({ label: c.title, value: c.title }))}
          districts={districts}
          isPublished={isPublished}
          onPublishedChange={setIsPublished}
          onSave={handleSaveItem}
        />
      </AdminDrawer>

      {/* Categories Drawer */}
      <AdminDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        title={currentEditingCategoryId ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
        formId="archive-category-form"
        saveLabel="حفظ التصنيف"
        headerActions={
          <AdminToggle
            label="تفعيل التصنيف"
            checked={isCategoryPublished}
            onChange={setIsCategoryPublished}
          />
        }
      >
        <ArchiveCategoryForm
          id="archive-category-form"
          initialData={currentCategory}
          isPublished={isCategoryPublished}
          onPublishedChange={setIsCategoryPublished}
          onSubmit={handleSaveCategory}
        />
      </AdminDrawer>
    </div>
  );
}
