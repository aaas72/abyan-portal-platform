import React, { useEffect, useRef } from "react";

export interface Column<T> {
  key: string;
  header: string;
  isPrimary?: boolean;
  align?: "right" | "center" | "left";
  render?: (item: T, index: number) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  emptyMessage?: string;
}

export default function AdminDataTable<T extends { _id?: string }>({
  columns,
  data,
  onEdit,
  onDelete,
  isLoading,
  onLoadMore,
  hasMore,
  isLoadingMore,
  emptyMessage = "لا توجد بيانات متاحة حالياً.",
}: AdminDataTableProps<T>) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (isLoading) {
    return (
      <div className="font-abyan-body text-slate-500 text-sm py-10">
        جاري تحميل البيانات...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="font-abyan-body text-slate-500 text-sm py-10">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-right border-collapse">
        <thead className="bg-white border-b border-slate-200 sticky top-32 z-30">
          <tr>
            <th className="pt-3 pb-3 px-4 text-right align-middle w-12">
              <span className="font-abyan-title text-slate-900 font-normal text-[13px]">
                #
              </span>
            </th>
            {columns.map((col) => {
              const alignClass =
                col.align === "center"
                  ? "text-center"
                  : col.align === "left"
                  ? "text-left"
                  : "text-right";
              return (
                <th
                  key={col.key}
                  className={`pt-3 pb-3 px-4 align-middle ${alignClass}`}
                >
                  <span className="font-abyan-title text-slate-900 font-normal text-[13px]">
                    {col.header}
                  </span>
                </th>
              );
            })}
            {(onEdit || onDelete) && (
              <th className="pt-3 pb-3 px-4 text-left align-middle w-28">
                <span className="font-abyan-title text-slate-900 font-normal text-[13px]">
                  الإجراءات
                </span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item._id || index}
              className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
            >
              <td className="font-abyan-body text-slate-400 text-sm py-4 px-4 align-middle text-right w-12">
                {index + 1}
              </td>
              {columns.map((col) => {
                const alignClass =
                  col.align === "center"
                    ? "text-center"
                    : col.align === "left"
                    ? "text-left"
                    : "text-right";
                return (
                  <td
                    key={`${item._id}-${col.key}`}
                    className={`py-4 px-4 align-middle ${alignClass} ${
                      col.isPrimary
                        ? "font-abyan-title text-[#059669] text-sm"
                        : "font-abyan-body text-slate-700 text-sm"
                    }`}
                  >
                    <div className="truncate max-w-[280px]">
                      {col.render ? col.render(item, index) : (item as any)[col.key]}
                    </div>
                  </td>
                );
              })}

              {(onEdit || onDelete) && (
                <td className="py-4 px-4 text-left align-middle w-28">
                  <div className="flex items-center justify-end gap-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="font-abyan-body text-xs text-[#0ea5e9] hover:text-sky-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        تعديل
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="font-abyan-body text-xs text-rose-500 hover:text-rose-700 transition-colors bg-transparent border-none cursor-pointer p-0"
                      >
                        حذف
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {(hasMore || isLoadingMore) && (
        <div ref={observerTarget} className="flex justify-center py-8 w-full">
          {isLoadingMore && (
            <div className="flex items-center gap-2 text-slate-400">
              <svg className="animate-spin h-5 w-5 text-[#10b981]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-abyan-body text-sm">جاري تحميل المزيد...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
