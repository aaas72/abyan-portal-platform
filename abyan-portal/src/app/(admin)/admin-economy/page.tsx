"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminSearchFilterBar from "@/components/admin/AdminSearchFilterBar";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminTabs from "@/components/admin/AdminTabs";
import EconomyPillarForm, { EconomyPillarFormData } from "@/components/admin/forms/EconomyPillarForm";
import EconomyPhotoCardForm, { EconomyPhotoCardFormData } from "@/components/admin/forms/EconomyPhotoCardForm";
import AdminToggle from "@/components/admin/form-fields/AdminToggle";
import { EconomyService } from "@/services/economy.service";
import { useToast } from "@/contexts/ToastContext";
import { useConfirm } from "@/contexts/ConfirmContext";
import { AdminEconomyPillar, AdminEconomyPhotoCard } from "@/types/admin.types";

export default function AdminEconomyPage() {
  const toast = useToast();
  const { confirm } = useConfirm();
  
  const [activeTab, setActiveTab] = useState<'items' | 'pillars'>('items');
  
  // Data states
  const [pillars, setPillars] = useState<AdminEconomyPillar[]>([]);
  const [photoCards, setPhotoCards] = useState<AdminEconomyPhotoCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("");

  // Drawer states
  const [isPillarDrawerOpen, setIsPillarDrawerOpen] = useState(false);
  const [isPhotoCardDrawerOpen, setIsPhotoCardDrawerOpen] = useState(false);
  
  const [currentEditingPillarId, setCurrentEditingPillarId] = useState<string | null>(null);
  const [currentPillar, setCurrentPillar] = useState<EconomyPillarFormData | null>(null);
  
  const [currentEditingPhotoCardId, setCurrentEditingPhotoCardId] = useState<string | null>(null);
  const [currentPhotoCard, setCurrentPhotoCard] = useState<EconomyPhotoCardFormData | null>(null);
  
  const [isActiveStatus, setIsActiveStatus] = useState(true);

  const fetchPillars = async () => {
    try {
      const res = await EconomyService.getPillarsAdmin();
      setPillars(res.data || []);
    } catch (error) {
      console.error("Failed to fetch pillars:", error);
    }
  };

  const fetchPhotoCards = async () => {
    try {
      const res = await EconomyService.getPhotoCards();
      setPhotoCards(res.data || []);
    } catch (error) {
      console.error("Failed to fetch photo cards:", error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPillars(), fetchPhotoCards()]);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  // --- Pillar Handlers ---
  const handleEditPillar = (item: AdminEconomyPillar) => {
    setCurrentEditingPillarId(item._id);
    setCurrentPillar({
      pillarName: item.pillarName,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || "",
      keyProducts: item.keyProducts || [],
      details: item.details || [],
      images: item.images || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsPillarDrawerOpen(true);
  };

  const handleDeletePillar = async (item: AdminEconomyPillar) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف قطاع "${item.title}"؟ سيؤدي ذلك أيضاً إلى تأثر العناصر المرتبطة به.`,
      confirmText: "حذف القطاع",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await EconomyService.deletePillar(item._id);
        toast.success("تم حذف القطاع بنجاح");
        fetchPillars();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSavePillar = async (formData: EconomyPillarFormData) => {
    try {
      const dataToSave = { ...formData, isActive: isActiveStatus };
      if (currentEditingPillarId) {
        await EconomyService.updatePillar(currentEditingPillarId, dataToSave);
        toast.success("تم تحديث القطاع بنجاح");
      } else {
        await EconomyService.createPillar(dataToSave);
        toast.success("تم إضافة القطاع بنجاح");
      }
      setIsPillarDrawerOpen(false);
      fetchPillars();
    } catch (error) {
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- PhotoCard Handlers ---
  const handleEditPhotoCard = (item: AdminEconomyPhotoCard) => {
    setCurrentEditingPhotoCardId(item._id);
    setCurrentPhotoCard({
      pillar: typeof item.pillar === 'object' ? (item.pillar as any)._id : item.pillar,
      title: item.title,
      tag: item.tag,
      location: item.location,
      authorName: item.authorName || "",
      sourceName: item.sourceName || "",
      sourceUrl: item.sourceUrl || "",
      sources: item.sources && item.sources.length > 0 ? item.sources : (item.sourceName ? [{ name: item.sourceName, url: item.sourceUrl }] : []),
      description: item.description || "",
      bgGradient: item.bgGradient || "",
      images: item.images || [],
      isActive: item.isActive,
    });
    setIsActiveStatus(item.isActive);
    setIsPhotoCardDrawerOpen(true);
  };

  const handleDeletePhotoCard = async (item: AdminEconomyPhotoCard) => {
    const isConfirmed = await confirm({
      title: "تأكيد الحذف",
      description: `هل أنت متأكد من حذف عنصر "${item.title}"؟`,
      confirmText: "حذف العنصر",
      cancelText: "تراجع",
      variant: "danger",
    });

    if (isConfirmed) {
      try {
        await EconomyService.deletePhotoCard(item._id);
        toast.success("تم حذف العنصر بنجاح");
        fetchPhotoCards();
      } catch (error) {
        toast.error("فشل في حذف السجل");
      }
    }
  };

  const handleSavePhotoCard = async (formData: EconomyPhotoCardFormData) => {
    try {
      const dataToSave = { 
        ...formData, 
        isActive: isActiveStatus,
        bgGradient: formData.bgGradient || 'from-sky-600/90 to-slate-900/90'
      };
      
      if (currentEditingPhotoCardId) {
        await EconomyService.updatePhotoCard(currentEditingPhotoCardId, dataToSave);
        toast.success("تم تحديث العنصر بنجاح");
      } else {
        await EconomyService.createPhotoCard(dataToSave);
        toast.success("تم إضافة العنصر بنجاح");
      }
      setIsPhotoCardDrawerOpen(false);
      fetchPhotoCards();
    } catch (error) {
      toast.error("فشل في حفظ السجل");
    }
  };

  // --- Columns ---
  const pillarColumns: Column<AdminEconomyPillar>[] = [

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

  const photoCardColumns: Column<AdminEconomyPhotoCard>[] = [
    { key: "title", header: "العنوان", isPrimary: true },
    { 
      key: "pillar", 
      header: "القطاع",
      render: (item) => {
        const pillar = typeof item.pillar === 'object' 
          ? item.pillar 
          : pillars.find(p => p._id === item.pillar);
        return (pillar as any)?.title || item.pillar || 'غير محدد';
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

  // Filtered PhotoCards
  const filteredPhotoCards = useMemo(() => {
    return photoCards.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));

      const matchesPillar = !selectedPillar || selectedPillar === "all" ||
        item.pillar === selectedPillar;

      return matchesSearch && matchesPillar;
    });
  }, [photoCards, searchQuery, selectedPillar]);

  // Filtered Pillars
  const filteredPillars = useMemo(() => {
    return pillars.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q ||
        item.pillarName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q));
      return matchesSearch;
    });
  }, [pillars, searchQuery]);

  return (
    <div>
      <AdminPageHeader
        title="إدارة الاقتصاد والتنمية"
        description="إضافة وتعديل وحذف القطاعات الاقتصادية والمحاصيل الزراعية والثروات الأبينية."
      >
        <AdminSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={activeTab === 'items' ? "بحث في المحاصيل، الثروات، الوصف..." : "بحث في القطاعات الاقتصادية..."}
          categoryFilter={activeTab === 'items' ? selectedPillar : undefined}
          onCategoryChange={activeTab === 'items' ? setSelectedPillar : undefined}
          categoryOptions={activeTab === 'items' ? pillars.map((p) => ({ label: p.title || p.pillarName, value: p.pillarName })) : []}
          categoryPlaceholder="كل القطاعات الاقتصادية"
          totalCount={activeTab === 'items' ? photoCards.length : pillars.length}
          filteredCount={activeTab === 'items' ? filteredPhotoCards.length : filteredPillars.length}
        />
      </AdminPageHeader>

      <AdminTabs 
        tabs={[
          { id: 'items', label: 'العناصر والمحاصيل', count: filteredPhotoCards.length },
          { id: 'pillars', label: 'القطاعات الاقتصادية', count: filteredPillars.length }
        ]}
        activeTab={activeTab}
        onTabChange={(id) => {
          setActiveTab(id as 'pillars' | 'items');
          setSelectedPillar("");
        }}
        actionLabel={activeTab === 'pillars' ? "إضافة قطاع جديد" : "إضافة عنصر جديد"}
        onAction={() => {
          setIsActiveStatus(true);
          if (activeTab === 'pillars') {
            setCurrentEditingPillarId(null);
            setCurrentPillar(null);
            setIsPillarDrawerOpen(true);
          } else {
            setCurrentEditingPhotoCardId(null);
            setCurrentPhotoCard(null);
            setIsPhotoCardDrawerOpen(true);
          }
        }}
      />

      {activeTab === 'pillars' ? (
        <AdminDataTable
          columns={pillarColumns}
          data={filteredPillars}
          isLoading={isLoading}
          onEdit={handleEditPillar}
          onDelete={handleDeletePillar}
          emptyMessage={searchQuery ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد قطاعات اقتصادية متاحة حالياً."}
        />
      ) : (
        <AdminDataTable
          columns={photoCardColumns}
          data={filteredPhotoCards}
          isLoading={isLoading}
          onEdit={handleEditPhotoCard}
          onDelete={handleDeletePhotoCard}
          emptyMessage={searchQuery || selectedPillar ? "لا توجد نتائج مطابقة لبحثك." : "لا توجد عناصر أو محاصيل متاحة حالياً."}
        />
      )}

      <AdminDrawer
        isOpen={isPillarDrawerOpen}
        onClose={() => setIsPillarDrawerOpen(false)}
        title={currentPillar ? "تعديل قطاع" : "إضافة قطاع جديد"}
        formId="economy-pillar-form"
        saveLabel="حفظ القطاع"
        headerActions={
          <AdminToggle
            label="تفعيل القطاع"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <EconomyPillarForm
          id="economy-pillar-form"
          initialData={currentPillar}
          isPublished={isActiveStatus}
          onPublishedChange={setIsActiveStatus}
          onSave={handleSavePillar}
        />
      </AdminDrawer>

      <AdminDrawer
        isOpen={isPhotoCardDrawerOpen}
        onClose={() => setIsPhotoCardDrawerOpen(false)}
        title={currentPhotoCard ? "تعديل عنصر" : "إضافة عنصر جديد"}
        formId="economy-photocard-form"
        saveLabel="حفظ العنصر"
        headerActions={
          <AdminToggle
            label="تفعيل العنصر"
            checked={isActiveStatus}
            onChange={setIsActiveStatus}
          />
        }
      >
        <EconomyPhotoCardForm
          id="economy-photocard-form"
          initialData={currentPhotoCard}
          pillars={pillars.map(p => ({ value: p._id, label: p.title }))}
          isPublished={isActiveStatus}
          onPublishedChange={setIsActiveStatus}
          onSave={handleSavePhotoCard}
        />
      </AdminDrawer>
    </div>
  );
}
