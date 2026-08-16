"use client";

/**
 * Updates URL search parameters smoothly without triggering full page reload or scroll jumping.
 */
export function updateUrlParams(paramsToSet: Record<string, string | null | undefined>) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  
  Object.entries(paramsToSet).forEach(([key, val]) => {
    if (val === null || val === undefined || val === "") {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, val);
    }
  });

  const search = url.searchParams.toString();
  const newUrl = url.pathname + (search ? `?${search}` : "");
  window.history.replaceState(null, "", newUrl);
}
