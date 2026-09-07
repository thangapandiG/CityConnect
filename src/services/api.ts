import { Department, Resident, Disruption, NotificationRecord, MetricComparison, ErrorCategorySummary, TestResult } from '../types';
import { matchResidentsToDisruption } from './matchingEngine';
import { generateBaselineMessage, generatePersonalizedMessage } from './messageGenerator';
import { calculateExperimentMetrics } from './metricsEngine';
import { INITIAL_DEPARTMENTS, INITIAL_RESIDENTS, INITIAL_DISRUPTIONS } from '../data/mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const targetUrl = BASE_URL.endsWith('/')
      ? `${BASE_URL.slice(0, -1)}${url}`
      : `${BASE_URL}${url}`;
    const response = await fetch(targetUrl, options);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`API call failed for ${url}, using local client fallback:`, error);
    return null;
  }
}

// Local fallback state in case backend API is unreachable
let localDepartments = [...INITIAL_DEPARTMENTS];
let localResidents = [...INITIAL_RESIDENTS];
let localDisruptions = [...INITIAL_DISRUPTIONS];
let localNotifications: NotificationRecord[] = [];

export async function getDepartments(): Promise<Department[]> {
  const data = await fetchJson<Department[]>('/departments');
  if (data) {
    localDepartments = data;
    return data;
  }
  return localDepartments;
}

export async function getResidents(): Promise<Resident[]> {
  const data = await fetchJson<Resident[]>('/residents');
  if (data) {
    localResidents = data;
    return data;
  }
  return localResidents;
}

export async function updateResident(resident: Resident): Promise<Resident> {
  const data = await fetchJson<Resident>('/residents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resident),
  });
  if (data) return data;

  const idx = localResidents.findIndex(r => r.id === resident.id);
  if (idx !== -1) localResidents[idx] = resident;
  else localResidents.push(resident);
  return resident;
}

export async function getDisruptions(): Promise<Disruption[]> {
  const data = await fetchJson<Disruption[]>('/disruptions');
  if (data) {
    localDisruptions = data;
    return data;
  }
  return localDisruptions;
}

export async function createDisruption(disruption: Omit<Disruption, 'id'>): Promise<Disruption> {
  const data = await fetchJson<Disruption>('/disruptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(disruption),
  });
  if (data) return data;

  const newDis: Disruption = { ...disruption, id: `dis-${Date.now()}` };
  localDisruptions.unshift(newDis);
  return newDis;
}

export async function updateDisruptionStatus(id: string, status: Disruption['status'], approvedBy?: string): Promise<Disruption> {
  const data = await fetchJson<Disruption>(`/disruptions/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, approvedBy }),
  });
  if (data) return data;

  const dis = localDisruptions.find(d => d.id === id);
  if (dis) {
    dis.status = status;
    if (approvedBy) dis.approvedBy = approvedBy;
  }
  return dis || localDisruptions[0];
}

export async function calculateMatches(disruptionId: string) {
  const data = await fetchJson<any>(`/disruptions/${disruptionId}/match`, { method: 'POST' });
  if (data) return data;

  const dis = localDisruptions.find(d => d.id === disruptionId) || localDisruptions[0];
  return matchResidentsToDisruption(dis, localResidents);
}

export async function broadcastNotifications(disruptionId: string) {
  const data = await fetchJson<any>(`/disruptions/${disruptionId}/broadcast`, { method: 'POST' });
  if (data) return data;

  const dis = localDisruptions.find(d => d.id === disruptionId) || localDisruptions[0];
  const matchResult = matchResidentsToDisruption(dis, localResidents);
  const generatedNotifs: NotificationRecord[] = [];

  for (const affected of matchResult.affectedResidents) {
    const msgResult = generatePersonalizedMessage(dis, affected);
    const baseline = generateBaselineMessage(dis);

    const notif: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      residentId: affected.id,
      disruptionId: dis.id,
      baselineMessage: baseline,
      personalizedMessage: msgResult.message,
      language: msgResult.language,
      accessibilityFormat: msgResult.accessibilityFormat,
      sentAt: new Date().toISOString(),
      deliveryStatus: 'Delivered',
      understandability: 'Yes',
      relevance: 'Yes',
      isLanguageFallback: msgResult.isLanguageFallback,
      isLocationUnknown: msgResult.isLocationUnknown,
      isAccessibilityDefault: msgResult.isAccessibilityDefault,
      isApiFallback: msgResult.isApiFallback,
      errorType: msgResult.isLocationUnknown ? 'Location error' : msgResult.isLanguageFallback ? 'Language error' : msgResult.isAccessibilityDefault ? 'Accessibility error' : 'None',
    };
    localNotifications.unshift(notif);
    generatedNotifs.push(notif);
  }

  return {
    disruptionId: dis.id,
    affectedCount: matchResult.affectedCount,
    notificationsSent: generatedNotifs.length,
    notifications: generatedNotifs,
  };
}

export async function getNotifications(): Promise<NotificationRecord[]> {
  const data = await fetchJson<NotificationRecord[]>('/notifications');
  if (data) {
    localNotifications = data;
    return data;
  }
  return localNotifications;
}

export async function submitFeedback(notificationId: string, understandability: 'Yes' | 'No', relevance: 'Yes' | 'No', feedbackText?: string): Promise<NotificationRecord> {
  const data = await fetchJson<NotificationRecord>(`/notifications/${notificationId}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ understandability, relevance, feedbackText }),
  });
  if (data) return data;

  const notif = localNotifications.find(n => n.id === notificationId);
  if (notif) {
    notif.understandability = understandability;
    notif.relevance = relevance;
    if (feedbackText) notif.feedbackText = feedbackText;
  }
  return notif || localNotifications[0];
}

export async function getMetrics() {
  const data = await fetchJson<{ comparisons: MetricComparison[]; errorSummaries: ErrorCategorySummary[]; overallPassRate: number }>('/metrics');
  if (data) return data;

  return calculateExperimentMetrics(localNotifications, localDisruptions, localResidents);
}

export async function runAutomatedTests(): Promise<{ results: TestResult[]; summary: { total: number; passed: number; failed: number } }> {
  const data = await fetchJson<any>('/tests');
  if (data) return data;

  // Import dynamically in fallback
  const { runAllAutomatedTests } = await import('../../server/testRunner');
  return runAllAutomatedTests();
}

export async function triggerDemoMode() {
  const data = await fetchJson<any>('/demo/run', { method: 'POST' });
  if (data) return data;

  // Local fallback trigger
  const newDis = await createDisruption({
    title: 'Anna Nagar Main Road Emergency Pipeline Fix',
    department: 'Roads & Transport',
    disruptionType: 'Road closure',
    description: 'Emergency culvert & pipe repair requires full traffic diversion in Anna Nagar 2nd Avenue.',
    affectedArea: 'Anna Nagar',
    affectedRoutes: ['Route 27', 'Route 40', 'Route 42'],
    latitude: 13.0850,
    longitude: 80.2120,
    radius: 1.5,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    severity: 'High',
    status: 'Active',
    requiresApproval: false,
    approvedBy: 'Officer S. Ramesh (Demo Execution)',
  });

  const bData = await broadcastNotifications(newDis.id);
  const metrics = await getMetrics();

  return {
    message: 'Demo Mode executed successfully! Complete scenario created, matched, notified, and measured.',
    disruption: newDis,
    notificationsCount: bData.notificationsSent,
    metrics,
  };
}
