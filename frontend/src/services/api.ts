/**
 * Mentor360 API Service
 * Handles client-to-backend communication over the unified /api routes.
 * In development, Vite proxies /api -> http://localhost:4000.
 * On Vercel, requests are routed to the Express backend service via top-level rewrites.
 */

const API_BASE = '/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`Health check returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Backend API health check unavailable; running offline/IndexedDB mode.', err);
    return null;
  }
}

export async function fetchSchoolsFromBackend() {
  const res = await fetch(`${API_BASE}/schools`);
  if (!res.ok) throw new Error('Failed to fetch schools');
  return (await res.json()).data;
}

export async function fetchDashboardSummaryFromBackend() {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return (await res.json()).data;
}
