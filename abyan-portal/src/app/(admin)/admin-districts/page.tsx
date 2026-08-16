"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import DistrictForm, { DistrictFormData } from "@/components/admin/forms/DistrictForm";
import DistrictRegionForm, { DistrictRegionFormData } from "@/components/admin/forms/DistrictRegionForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { DistrictsService } from "@/services/districts.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";

import { AdminDistrict, AdminDistrictRegion } from "@/types/admin.types";

export default function AdminDistrictsPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  
  const [activeTab, setActiveTab] = useState<'districts' | 'regions'>('districts');

  const [districts, setDistricts] = useState<AdminDistrict[]>([]);
  const [regions, setRegions] = useState<AdminDistrictRegion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  
  // District Drawer State
  const [isDistrictDrawerOpen, setIsDistrictDrawerOpen] = useState(false);
  const [currentEditingDistrictId, setCurrentEditingDistrictId] = useState<string | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<DistrictFormData | null>(null);
  const [isDistrictPublished, setIsDistrictPublished] = useState(true);

  // Region Drawer State
  const [isRegionDrawerOpen, setIsRegionDrawerOpen] = useState(false);
  const [currentEditingRegionId, setCurrentEditingRegionId] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<DistrictRegionFormData | null>(null);
  const [isRegionPublished, setIsRegionPublished] = useState(true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDistricts = async () => {
    try {
      const res = await DistrictsService.getAdminDistricts();
      setDistricts(res.data || []);
    } catch (error) {
      console.error("Failed to fetch districts:", error);
    }
  };

  const fetchRegions = async () => {
    try {
      const res = await DistrictsService.getAdminRegions();
      setRegions(res.data || []);
    } catch (error) {
      console.error("Failed to fetch regions:", error);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([fetchDistricts(), fetchRegions()]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- District Handlers ---
  const handleDeleteDistrict = async (item: AdminDistrict) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف المديرية "${item.name}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      confirmText: "حذف المديرية",
      cancelText: "إلغاء",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        await DistrictsService.deleteDistrict(item._id);
        toast.success("تم حذف المديرية بنجاح");
        fetchDistricts();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleEditDistrict = (item: AdminDistrict) => {
    setCurrentEditingDistrictId(item._id);
    setCurrentDistrict({
      name: item.name,
      title: item.title || "",
      region: item.region || "",
      regionLabel: item.regionLabel || "",
      capital: item.capital || "",
      areaKm2: item.areaKm2 || "",
      areaPercentage: item.areaPercentage || "",
      authorName: item.authorName || "",
      sourceName: item.sourceName || "",
      sourceUrl: item.sourceUrl || "",
      sources: item.sources && item.sources.length > 0 ? item.sources : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []),
      crops: item.crops || [],
      landmarks: item.landmarks || [],
      villages: item.villages || [],
      description: item.description || "",
      geography: item.geography || "",
      images: item.images || [],
      isPublished: item.isActive,
    });
    setIsDistrictPublished(item.isActive);
    setIsDistrictDrawerOpen(true);
  };

  const handleSaveDistrict = async (formData: DistrictFormData) => {
    try {
      const { isPublished, ...restFormData } = formData;
      const dataToSave = { ...restFormData, isActive: isDistrictPublished };
      
      if (currentEditingDistrictId) {
        await DistrictsService.updateDistrict(currentEditingDistrictId, dataToSave);
        toast.success("تم تحديث المديرية بنجاح");
      } else {
        await DistrictsService.createDistrict(dataToSave);
        toast.success("تم إضافة المديرية بنجاح");
      }
      setIsDistrictDrawerOpen(false);
      fetchDistricts();
    } catch (error) {
      console.error("Failed to save district:", error, error?.response?.data);
      let errorMessage = error?.response?.data?.message || "فشل في حفظ السجل";
      const detailedErrors = error?.response?.data?.errors;
      if (Array.isArray(detailedErrors) && detailedErrors.length > 0) {
        errorMessage = `${errorMessage}: ${detailedErrors[0]}`;
      }
      toast.error(typeof errorMessage === 'string' ? errorMessage : "فشل في حفظ السجل");
    }
  };

  // --- Region Handlers ---
  const handleEditRegion = (item: AdminDistrictRegion) => {
    setCurrentEditingRegionId(item._id);
    setCurrentRegion({
      regionKey: item.regionKey,
      regionLabel: item.regionLabel,
      description: item.description,
      isActive: item.isActive,
    });
    setIsRegionPublished(item.isActive);
    setIsRegionDrawerOpen(true);
  };

  const handleDeleteRegion = async (item: AdminDistrictRegion) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف إقليم "${item.regionLabel}"؟`,
      confirmText: "حذف التقسيم",
      cancelText: "إلغاء",
      variant: "danger"
    });

    if (isConfirmed) {
      try {
        await DistrictsService.deleteRegion(item._id);
        toast.success("تم حذف التقسيم بنجاح");
        fetchRegions();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSaveRegion = async (formData: DistrictRegionFormData) => {
    setIsSubmitting(true);
    try {
      const dataToSave = { ...formData, isActive: isRegionPublished };
      if (currentEditingRegionId) {
        await DistrictsService.updateRegion(currentEditingRegionId, dataToSave);
        toast.success("تم تحديث التقسيم بنجاح");
      } else {
        await DistrictsService.createRegion(formData);
        toast.success("تم إضافة التقسيم بنجاح");
      }
      setIsRegionDrawerOpen(false);
      fetchRegions();
    } catch (error) {
      console.error("Failed to save region:", error, error?.response?.data);
      let errorMessage = error?.response?.data?.message || "فشل في حفظ السجل";
      const detailedErrors = error?.response?.data?.errors;
      if (Array.isArray(detailedErrors) && detailedErrors.length > 0) {
        errorMessage = `${errorMessage}: ${detailedErrors[0]}`;
      }
      toast.error(typeof errorMessage === 'string' ? errorMessage : "فشل في حفظ السجل");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Columns ---
  const districtColumns: Column<AdminDistrict>[] = [
    { key: "name", header: "اسم المديرية", isPrimary: true },
    { key: "capital", header: "المركز (العاصمة)" },
    { 
      key: "regionLabel", 
      header: "التقسيم العُرفي",
      render: (item) => {
        const region = regions.find(r => r.regionKey === item.region);
        return region ? region.regionLabel : (item.regionLabel || 'غير محدد');
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

  const regionColumns: Column<AdminDistrictRegion>[] = [
    { key: "regionLabel", header: "اسم التقسيم (عربي)", isPrimary: true },

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

  // Filtered Districts
  const filteredDistricts = useMemo(() => {
    return districts.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.name.toLowerCase().includes(q) ||
        (item.capital && item.capital.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.geography && item.geography.toLowerCase().includes(q));

      const matchesRegion = !selectedRegion || selectedRegion === "all" ||
        item.region === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [districts, searchQuery, selectedRegion]);

  // Filtered Regions
  const filteredRegions = useMemo(() => {
    return regions.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.regionLabel.toLowerCase().includes(q) ||
        item.regionKey.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [regions, searchQuery]);

  return (
    <div>
      <AdminPageHeader
        title="إدارة المديريات والتقسيم العُرفي"
        description="إدارة جميع البيانات الخاصة بمديريات أبين وفئاتها الجغرافية (التقسيم العُرفي)."
      >
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={activeTab === 'districts' ? "بحث بالاسم، العاصمة، الوصف..." : "بحث في فئات التقسيم..."}
          categoryFilter={activeTab === 'districts' ? selectedRegion : undefined}
          onCategoryChange={activeTab === 'districts' ? setSelectedRegion : undefined}
          categoryOptions={activeTab === 'districts' ? regions.map((r) => ({ label: r.regionLabel, value: r.regionKey })) : []}
          categoryPlaceholder="كل فئات التقسيم العرفي"
          totalCount={activeTab === 'districts' ? districts.length : regions.length}
          filteredCount={activeTab === 'districts' ? filteredDistricts.length : filteredRegions.length}
        />
      </AdminPageHeader>

      {/* Tabs */}
      <AdminTabs
        tabs={[
          { id: 'districts', label: 'المديريات', count: filteredDistricts.length },
          { id: 'regions', label: 'فئات التقسيم العُرفي', count: filteredRegions.length },
        ]}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as 'districts' | 'regions');
          setSelectedRegion("");
        }}
        actionLabel={activeTab === 'districts' ? "إضافة مديرية جديدة" : "إضافة تقسيم جديد"}
        onAction={() => {
          if (activeTab === 'districts') {
            setCurrentEditingDistrictId(null);
            setCurrentDistrict(null);
            setIsDistrictPublished(true);
            setIsDistrictDrawerOpen(true);
          } else {
            setCurrentEditingRegionId(null);
            setCurrentRegion(null);
            setIsRegionPublished(true);
            setIsRegionDrawerOpen(true);
          }
        }}
      />

      {activeTab === 'districts' ? (
        <AdminDataTable
          columns={districtColumns}
          data={filteredDistricts}
          isLoading={isLoading}
          onEdit={handleEditDistrict}
          onDelete={handleDeleteDistrict}
          emptyMessage={searchQuery || selectedRegion ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد مديريات متاحة حالياً."}
        />
      ) : (
        <AdminDataTable
          columns={regionColumns}
          data={filteredRegions}
          isLoading={isLoading}
          onEdit={handleEditRegion}
          onDelete={handleDeleteRegion}
          emptyMessage={searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد أقسام جغرافية متاحة حالياً."}
        />
      )}

      {/* District Drawer */}
      <AdminDrawer
        isOpen={isDistrictDrawerOpen}
        onClose={() => setIsDistrictDrawerOpen(false)}
        title={currentDistrict ? "تعديل مديرية" : "إضافة مديرية جديدة"}
        formId="district-form"
        saveLabel="حفظ المديرية"
        headerActions={
          <AdminToggle
            label="نشر السجل"
            checked={isDistrictPublished}
            onChange={setIsDistrictPublished}
          />
        }
      >
        <DistrictForm
          id="district-form"
          initialData={currentDistrict}
          regions={regions.map(r => ({ id: r.regionKey, label: r.regionLabel }))}
          isPublished={isDistrictPublished}
          onPublishedChange={setIsDistrictPublished}
          onSave={handleSaveDistrict}
        />
      </AdminDrawer>

      {/* Region Drawer */}
      <AdminDrawer
        isOpen={isRegionDrawerOpen}
        onClose={() => setIsRegionDrawerOpen(false)}
        title={currentRegion ? "تعديل التقسيم العُرفي" : "إضافة تقسيم عُرفي جديد"}
        formId="region-form"
        saveLabel="حفظ التقسيم العُرفي"
        headerActions={
          <AdminToggle
            label="نشر السجل"
            checked={isRegionPublished}
            onChange={setIsRegionPublished}
          />
        }
      >
        <DistrictRegionForm
          id="region-form"
          initialData={currentRegion}
          onSubmit={handleSaveRegion}
          isSubmitting={isSubmitting}
        />
      </AdminDrawer>
    </div>
  );
}
