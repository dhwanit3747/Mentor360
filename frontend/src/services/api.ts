/**
 * Mentor360 API Service
 * Handles client-to-backend communication over the unified /api routes.
 * In development, Vite proxies /api -> http://localhost:4000.
 * On Vercel, requests are routed to the Express backend service via top-level rewrites.
 */

const API_BASE = '/api';

export interface MlPriorityPrediction {
  priority_score: number;
  urgency_level: string;
  probabilities: Record<string, number>;
  primary_drivers: string[];
  ptr: number;
  model_used: string;
}

export interface MlPriorityInput {
  total_students?: number;
  total_teachers?: number;
  days_since_last_visit?: number;
  previous_visit_count?: number;
  past_followup_completion_rate?: number;
  unresolved_needs_count?: number;
  indicators?: Record<string, number | string>;
}

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

// ----------------------------------------------------
// Machine Learning Service Endpoints
// ----------------------------------------------------

export async function checkMLHealth() {
  try {
    const res = await fetch(`${API_BASE}/ml/health`);
    if (!res.ok) return null;
    return (await res.json());
  } catch (err) {
    console.warn('ML Service health check failed:', err);
    return null;
  }
}

export async function predictPriorityWithML(payload: MlPriorityInput): Promise<MlPriorityPrediction | null> {
  try {
    const res = await fetch(`${API_BASE}/ml/predict-priority`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('ML Priority prediction failed');
    return (await res.json()).data;
  } catch (err) {
    console.warn('ML Priority prediction error, falling back:', err);
    return null;
  }
}

export async function recommendActivityWithANN(payload: {
  subject: string;
  grade?: string;
  indicators: Record<string, any>;
}) {
  try {
    const res = await fetch(`${API_BASE}/ml/recommend-activity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('ANN activity recommendation failed');
    return (await res.json()).data;
  } catch (err) {
    console.warn('ANN activity recommendation error, falling back:', err);
    return null;
  }
}

export async function fetchClusterSchoolsWithML() {
  try {
    const res = await fetch(`${API_BASE}/ml/cluster-schools`);
    if (!res.ok) throw new Error('Failed to fetch cluster segmentation');
    return (await res.json()).data;
  } catch (err) {
    console.warn('Failed to fetch ML cluster segmentation:', err);
    return null;
  }
}

export async function fetchDatasetSummaryWithML() {
  try {
    const res = await fetch(`${API_BASE}/ml/dataset/summary`);
    if (!res.ok) throw new Error('Failed to fetch ML dataset summary');
    return (await res.json()).data;
  } catch (err) {
    console.warn('Failed to fetch ML dataset summary:', err);
    return null;
  }
}
