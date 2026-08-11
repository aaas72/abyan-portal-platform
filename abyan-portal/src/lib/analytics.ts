export const trackVisitSafe = (section: string, entityId?: string, entityName?: string) => {
  if (typeof window === 'undefined') return;

  const key = `abyan_visit_${section}_${entityId || 'main'}`;
  const now = Date.now();
  const lastVisit = localStorage.getItem(key);
  
  // 24 hours in ms
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  if (lastVisit && (now - parseInt(lastVisit, 10)) < TWENTY_FOUR_HOURS) {
    // Already visited this specific section/entity in the last 24h, do not hit the server
    return;
  }

  // Send to backend silently
  fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api'}/analytics/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ section, entityId, entityName }),
  })
  .then((res) => {
    if (res.ok) {
      // Only set in localStorage if the server successfully received it
      localStorage.setItem(key, now.toString());
    }
  })
  .catch(err => console.error("Analytics tracking failed:", err));
};
