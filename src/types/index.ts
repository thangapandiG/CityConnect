export type DepartmentType = 
  | 'Roads & Transport' 
  | 'Water Department' 
  | 'Electricity Department' 
  | 'Public Works' 
  | 'Events & Permits';

export interface Department {
  id: string;
  name: string;
  contact: string;
  departmentType: DepartmentType;
}

export type SupportedLanguage = 'English' | 'Tamil' | 'Hindi' | 'Telugu' | 'Malayalam';

export type AccessibilityPreference = 
  | 'Standard' 
  | 'Large text' 
  | 'Screen reader friendly' 
  | 'High contrast' 
  | 'Easy-read' 
  | 'Audio-ready'
  | 'Unknown';

export type NotificationChannel = 'SMS' | 'Email' | 'App notification';

export interface Resident {
  id: string;
  name: string;
  location: string;
  latitude: number | null; // Nullable for Edge Case 1: Missing location
  longitude: number | null;
  zone: string;
  assignedRoute: string;
  preferredLanguage: string; // May be unsupported for Edge Case 2
  accessibilityNeeds: AccessibilityPreference; // May be 'Unknown' for Edge Case 3
  notificationChannel: NotificationChannel;
}

export type DisruptionType = 
  | 'Road closure' 
  | 'Road construction' 
  | 'Water interruption' 
  | 'Electricity interruption' 
  | 'Public event' 
  | 'Permit-related closure' 
  | 'Utility work';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type DisruptionStatus = 'Draft' | 'Pending Review' | 'Active' | 'Expired';

export interface Disruption {
  id: string;
  title: string;
  department: string;
  disruptionType: DisruptionType;
  description: string;
  affectedArea: string;
  affectedRoutes: string[];
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  startTime: string;
  endTime: string;
  severity: SeverityLevel;
  status: DisruptionStatus;
  requiresApproval?: boolean;
  approvedBy?: string | null;
}

export type ErrorType = 
  | 'None'
  | 'Location error' 
  | 'Route error' 
  | 'Language error' 
  | 'Accessibility error' 
  | 'Timing error' 
  | 'Data error';

export interface NotificationRecord {
  id: string;
  residentId: string;
  disruptionId: string;
  baselineMessage: string;
  personalizedMessage: string;
  language: string;
  accessibilityFormat: string;
  sentAt: string;
  deliveryStatus: 'Delivered' | 'Pending' | 'Failed';
  understandability: 'Yes' | 'No' | 'Pending' | null;
  relevance: 'Yes' | 'No' | 'Pending' | null;
  isLanguageFallback: boolean;
  isLocationUnknown: boolean;
  isAccessibilityDefault: boolean;
  isApiFallback: boolean;
  errorType: ErrorType;
  feedbackText?: string;
}

export interface AffectedResidentMatch {
  resident: Resident;
  isLocationMatch: boolean;
  isRouteMatch: boolean;
  distanceKm: number | null;
  matchType: 'Location' | 'Route' | 'Both' | 'Location Unknown Fallback' | 'None';
}

export interface MetricComparison {
  metric: string;
  baseline: string;
  target: string;
  prototype: string;
  status: 'Pass' | 'Fail';
  numericBaseline: number;
  numericPrototype: number;
  unit: string;
}

export interface ErrorCategorySummary {
  category: ErrorType;
  count: number;
  percentage: number;
  example: string;
  cause: string;
  fix: string;
}

export interface TestResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  details: string;
  executionTimeMs: number;
}

export interface PerformanceMetrics {
  locationMatchingTimeMs: number;
  messageGenerationTimeMs: number;
  notificationPrepTimeMs: number;
  totalResidentsProcessed: number;
  notificationsGenerated: number;
  apiFallbackCount: number;
  errorCount: number;
}
