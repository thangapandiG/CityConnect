import express, { Request, Response } from 'express';
import cors from 'cors';
import { store } from './store';
import { matchResidentsToDisruption } from '../src/services/matchingEngine';
import { generateBaselineMessage, generatePersonalizedMessage } from '../src/services/messageGenerator';
import { calculateExperimentMetrics } from '../src/services/metricsEngine';
import { runAllAutomatedTests } from './testRunner';
import { Disruption, NotificationRecord } from '../src/types';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API 1: Get Departments
app.get('/api/departments', (req: Request, res: Response) => {
  res.json(store.getDepartments());
});

// API 2: Get Residents
app.get('/api/residents', (req: Request, res: Response) => {
  const { zone, route, language } = req.query;
  let residents = store.getResidents();

  if (zone) residents = residents.filter(r => r.zone === zone);
  if (route) residents = residents.filter(r => r.assignedRoute === route);
  if (language) residents = residents.filter(r => r.preferredLanguage === language);

  res.json(residents);
});

// API 3: Update/Create Resident
app.post('/api/residents', (req: Request, res: Response) => {
  const updated = store.updateResident(req.body);
  res.json(updated);
});

// API 4: Get Disruptions
app.get('/api/disruptions', (req: Request, res: Response) => {
  res.json(store.getDisruptions());
});

// API 5: Create Disruption
app.post('/api/disruptions', (req: Request, res: Response) => {
  const disruptionData = req.body;
  if (!disruptionData.title || !disruptionData.affectedArea) {
    return res.status(400).json({ error: 'Title and Affected Area are required.' });
  }
  const newDisruption = store.createDisruption(disruptionData);
  res.status(201).json(newDisruption);
});

// API 6: Disruption Status Update
app.put('/api/disruptions/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;
  const updated = store.updateDisruptionStatus(id, status, approvedBy);
  if (!updated) return res.status(404).json({ error: 'Disruption not found' });
  res.json(updated);
});

// API 7: Calculate Location & Route Matches for a Disruption
app.post('/api/disruptions/:id/match', (req: Request, res: Response) => {
  const { id } = req.params;
  const disruption = store.getDisruptionById(id);
  if (!disruption) return res.status(404).json({ error: 'Disruption not found' });

  const residents = store.getResidents();
  const startTime = performance.now();
  const matchResult = matchResidentsToDisruption(disruption, residents);
  const matchTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

  res.json({
    ...matchResult,
    matchTimeMs,
  });
});

// API 8: Broadcast Notifications for Disruption
app.post('/api/disruptions/:id/broadcast', (req: Request, res: Response) => {
  const { id } = req.params;
  const disruption = store.getDisruptionById(id);
  if (!disruption) return res.status(404).json({ error: 'Disruption not found' });

  if (disruption.status === 'Expired') {
    return res.status(400).json({ error: 'Cannot broadcast notifications for expired disruption.' });
  }

  const residents = store.getResidents();
  const matchResult = matchResidentsToDisruption(disruption, residents);
  const generatedNotifs: NotificationRecord[] = [];

  for (const affected of matchResult.affectedResidents) {
    const msgResult = generatePersonalizedMessage(disruption, affected);
    const baseline = generateBaselineMessage(disruption);

    const notif: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      residentId: affected.id,
      disruptionId: disruption.id,
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

    store.addNotification(notif);
    generatedNotifs.push(notif);
  }

  res.json({
    disruptionId: disruption.id,
    affectedCount: matchResult.affectedCount,
    notificationsSent: generatedNotifs.length,
    notifications: generatedNotifs,
  });
});

// API 9: Get Notification History
app.get('/api/notifications', (req: Request, res: Response) => {
  const { residentId, disruptionId } = req.query;
  let notifications = store.getNotifications();

  if (residentId) notifications = notifications.filter(n => n.residentId === residentId);
  if (disruptionId) notifications = notifications.filter(n => n.disruptionId === disruptionId);

  res.json(notifications);
});

// API 10: Resident Feedback Submission
app.post('/api/notifications/:id/feedback', (req: Request, res: Response) => {
  const { id } = req.params;
  const { understandability, relevance, feedbackText } = req.body;
  const updated = store.submitFeedback(id, understandability, relevance, feedbackText);
  if (!updated) return res.status(404).json({ error: 'Notification not found' });
  res.json(updated);
});

// API 11: Get Metrics & Analytics
app.get('/api/metrics', (req: Request, res: Response) => {
  const notifications = store.getNotifications();
  const disruptions = store.getDisruptions();
  const residents = store.getResidents();
  const analytics = calculateExperimentMetrics(notifications, disruptions, residents);
  res.json(analytics);
});

// API 12: Run Automated Tests
app.get('/api/tests', (req: Request, res: Response) => {
  const testResults = runAllAutomatedTests();
  res.json(testResults);
});

// API 13: Demo Mode Trigger (Full End-to-End Automation)
app.post('/api/demo/run', (req: Request, res: Response) => {
  store.resetToSeed();

  // Create demo disruption
  const demoDisruption = store.createDisruption({
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

  // Calculate matches
  const residents = store.getResidents();
  const matchResult = matchResidentsToDisruption(demoDisruption, residents);

  // Broadcast notifications
  const demoNotifs: NotificationRecord[] = [];
  for (const affected of matchResult.affectedResidents) {
    const msgResult = generatePersonalizedMessage(demoDisruption, affected);
    const baseline = generateBaselineMessage(demoDisruption);

    const notif: NotificationRecord = {
      id: `demo-notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      residentId: affected.id,
      disruptionId: demoDisruption.id,
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
      feedbackText: 'Automated demo feedback verified.',
    };
    store.addNotification(notif);
    demoNotifs.push(notif);
  }

  const metrics = calculateExperimentMetrics(store.getNotifications(), store.getDisruptions(), store.getResidents());

  res.json({
    message: 'Demo Mode executed successfully! Complete scenario created, matched, notified, and measured.',
    disruption: demoDisruption,
    matchSummary: matchResult,
    notificationsCount: demoNotifs.length,
    metrics,
  });
});

app.listen(PORT, () => {
  console.log(`CityConnect Express Server running on http://localhost:${PORT}`);
});
