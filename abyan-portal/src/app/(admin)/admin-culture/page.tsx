"use client";

import React, { useEffect, useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import CultureCategoryForm, {
  CultureCategoryFormData,
} from "@/components/admin/forms/CultureCategoryForm";
import CultureItemForm, {
  CultureItemFormData,
} from "@/components/admin/forms/CultureItemForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { CultureService } from "@/services/culture.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import {
  AdminCultureCategory,
  AdminCultureItem,
} from "@/types/admin.types";

export default function AdminCulturePage() {
  const toast = useToast();
  const { confirm } = useConfirm();

  const [activeTab, setActiveTab] = useState<"items" | "categories">("items");

  // Data states
  const [categories, setCategories] = useState<AdminCultureCategory[]>([]);
  const [items, setItems] = useState<AdminCultureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Drawer states
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);

  const [currentEditingCategoryId, setCurrentEditingCategoryId] = useState<
    string | null
  >(null);
  const [currentCategory, setCurrentCategory] =
    useState<CultureCategoryFormData | null>(null);

  const [currentEditingItemId, setCurrentEditingItemId] = useState<
    string | null
  >(null);
  const [currentItem, setCurrentItem] =
    useState<CultureItemFormData | null>(null);

  const [isActiveStatus, setIsActiveStatus] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await CultureService.getCategoriesAdmin();
      setCategories(res.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await CultureService.getItems();
      setItems(res.data || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCategories(), fetchItems()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  // --- Category Handlers ---
  const handleEditCategory = (item: AdminCultureCategory) => {
    setCurrentEditingCategoryId(item._id);
    setCurrentCategory({
      categoryName: item.categoryName,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || "",
      primaryTags: item.primaryTags || [],
      details: item.details || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsCategoryDrawerOpen(true);
  };

  const handleDeleteCategory = async (item: AdminCultureCategory) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف فئة "${item.title}"؟ سيؤدي ذلك أيضاً إلى تأثر العناصر المرتبطة بها.`,
      confirmText: "حذف الفئة",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await CultureService.deleteCategory(item._id);
        toast.success("تم حذف الفئة بنجاح");
        fetchCategories();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSaveCategory = async (formData: CultureCategoryFormData) => {
    try {
      const dataToSave = { ...formData, isActive: isActiveStatus };
      if (currentEditingCategoryId) {
        await CultureService.updateCategory(
          currentEditingCategoryId,
          dataToSave,
        );
        toast.success("تم تحديث الفئة بنجاح");
      } else {
        await CultureService.createCategory(dataToSave);
        toast.success("تم إضافة الفئة بنجاح");
      }
      setIsCategoryDrawerOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(
        "Save culture category error:",
        error?.response?.data || error,
      );
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- Item Handlers ---
  const handleEditItem = (item: AdminCultureItem) => {
    setCurrentEditingItemId(item._id);
    setCurrentItem({
      category:
        typeof item.category === "object"
          ? (item.category as any)._id
          : item.category,
      title: item.title,
      tag: item.tag,
      location: item.location,
      description: item.description || "",
      bgGradient: item.bgGradient || "",
      images: item.images || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsItemDrawerOpen(true);
  };

  const handleDeleteItem = async (item: AdminCultureItem) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف عنصر "${item.title}"؟`,
      confirmText: "حذف العنصر",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await CultureService.deleteItem(item._id);
        toast.success("تم حذف العنصر بنجاح");
        fetchItems();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSaveItem = async (formData: CultureItemFormData) => {
    try {
      const dataToSave = {
        ...formData,
        isActive: isActiveStatus,
        bgGradient:
          formData.bgGradient || "from-emerald-600/90 to-slate-900/90",
      };
      if (currentEditingItemId) {
        await CultureService.updateItem(
          currentEditingItemId,
          dataToSave,
        );
        toast.success("تم تحديث العنصر بنجاح");
      } else {
        await CultureService.createItem(dataToSave);
        toast.success("تم إضافة العنصر بنجاح");
      }
      setIsItemDrawerOpen(false);
      fetchItems();
    } catch (error) {
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- Columns ---
  const categoryColumns: Column<AdminCultureCategory>[] = [

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

  const itemColumns: Column<AdminCultureItem>[] = [
    { key: "title", header: "العنوان", isPrimary: true },
    { key: "tag", header: "النوع" },
    { key: "location", header: "الموقع" },
    {
      key: "category",
      header: "الفئة",
      render: (item) => {
        const cat =
          typeof item.category === "object"
            ? item.category
            : categories.find((c) => c._id === item.category);
        return (cat as any)?.title || item.category || "غير محدد";
      },
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
        title="إدارة الثقافة والموروث"
        description="إضافة وتعديل وحذف العادات، التقاليد، الفنون، والأكلات الشعبية الأبينية."
      />

      <AdminTabs
        tabs={[
          { id: "items", label: "العناصر والتراث" },
          { id: "categories", label: "فئات الثقافة" },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as "categories" | "items")}
        actionLabel={
          activeTab === "categories" ? "إضافة فئة جديدة" : "إضافة عنصر جديد"
        }
        onAction={() => {
          setIsActiveStatus(true);
          if (activeTab === "categories") {
            setCurrentEditingCategoryId(null);
            setCurrentCategory(null);
            setIsCategoryDrawerOpen(true);
          } else {
            setCurrentEditingItemId(null);
            setCurrentItem(null);
            setIsItemDrawerOpen(true);
          }
        }}
      />

      {activeTab === "categories" ? (
        <AdminDataTable
          columns={categoryColumns}
          data={categories}
          isLoading={isLoading}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      ) : (
        <AdminDataTable
          columns={itemColumns}
          data={items}
          isLoading={isLoading}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      <AdminDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        title={currentCategory ? "تعديل فئة" : "إضافة فئة جديدة"}
        formId="culture-category-form"
        saveLabel="حفظ الفئة"
        headerActions={
          <AdminToggle
            label="تفعيل الفئة"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <CultureCategoryForm
          id="culture-category-form"
          initialData={currentCategory}
          isPublished={isActiveStatus}
          onPublishedChange={setIsActiveStatus}
          onSave={handleSaveCategory}
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={isItemDrawerOpen}
        onClose={() => setIsItemDrawerOpen(false)}
        title={currentItem ? "تعديل عنصر" : "إضافة عنصر جديد"}
        formId="culture-item-form"
        saveLabel="حفظ العنصر"
        headerActions={
          <AdminToggle
            label="تفعيل العنصر"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <CultureItemForm
          id="culture-item-form"
          initialData={currentItem}
          categories={categories.map((c) => ({ value: c._id, label: c.title }))}
          isPublished={isActiveStatus}
          onPublishedChange={setIsActiveStatus}
          onSave={handleSaveItem}
        />
      </AdminDrawer>
    </div>
  );
}
