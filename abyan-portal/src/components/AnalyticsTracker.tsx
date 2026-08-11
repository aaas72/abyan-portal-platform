"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackVisitSafe } from '@/lib/analytics';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;

    // We only want to track public main sections
    let section = '';
    
    if (pathname === '/') {
      section = 'home';
    } else if (pathname.startsWith('/pioneers')) {
      section = 'pioneers';
    } else if (pathname.startsWith('/landmarks')) {
      section = 'landmarks';
    } else if (pathname.startsWith('/districts')) {
      section = 'districts';
    } else if (pathname.startsWith('/history')) {
      section = 'history';
    } else if (pathname.startsWith('/culture')) {
      section = 'culture';
    } else if (pathname.startsWith('/economy')) {
      section = 'economy';
    } else if (pathname.startsWith('/gallery')) {
      section = 'gallery';
    } else if (pathname.startsWith('/about')) {
      section = 'about';
    }

    if (section) {
      // Prevent double tracking in React strict mode or immediate re-renders
      if (trackedPaths.current.has(pathname)) return;
      trackedPaths.current.add(pathname);

      // Extract entityId if we are on a specific item page (e.g., /pioneers/[slug])
      let entityId: string | undefined = undefined;
      let entityName: string | undefined = undefined;
      
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 1 && section !== 'home' && section !== 'about') {
        // parts[0] is the section, parts[1] is the slug/entityId
        entityId = parts[1];
        // Create a readable fallback name from the slug
        entityName = decodeURIComponent(entityId).replace(/-/g, ' ');
      }

      // Send to backend silently (debounced by localStorage)
      trackVisitSafe(section, entityId, entityName);
    }
  }, [pathname]);

  return null;
}
