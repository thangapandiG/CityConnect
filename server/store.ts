import { Department, Resident, Disruption, NotificationRecord } from '../src/types';
import { INITIAL_DEPARTMENTS, INITIAL_RESIDENTS, INITIAL_DISRUPTIONS } from './seedData';
import { matchResidentsToDisruption } from '../src/services/matchingEngine';
import { generateBaselineMessage, generatePersonalizedMessage } from '../src/services/messageGenerator';

class DataStore {
  private departments: Department[] = [...INITIAL_DEPARTMENTS];
  private residents: Resident[] = [...INITIAL_RESIDENTS];
  private disruptions: Disruption[] = [...INITIAL_DISRUPTIONS];
  private notifications: NotificationRecord[] = [];

  constructor() {
    this.seedInitialNotifications();
  }

  private seedInitialNotifications() {
    // Generate initial historical notifications for existing disruptions
    const activeDisruptions = this.disruptions.filter(d => d.status === 'Active');
    
    for (const disruption of activeDisruptions) {
      const matchResult = matchResidentsToDisruption(disruption, this.residents);
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
          understandability: affected.accessibilityNeeds === 'Easy-read' || affected.preferredLanguage === 'Tamil' ? 'Yes' : 'Yes',
          relevance: 'Yes',
          isLanguageFallback: msgResult.isLanguageFallback,
          isLocationUnknown: msgResult.isLocationUnknown,
          isAccessibilityDefault: msgResult.isAccessibilityDefault,
          isApiFallback: msgResult.isApiFallback,
          errorType: msgResult.isLocationUnknown ? 'Location error' : msgResult.isLanguageFallback ? 'Language error' : msgResult.isAccessibilityDefault ? 'Accessibility error' : 'None',
          feedbackText: 'Clear notification with exact route alternative.',
        };
        this.notifications.push(notif);
      }
    }
  }

  public getDepartments(): Department[] {
    return this.departments;
  }

  public getResidents(): Resident[] {
    return this.residents;
  }

  public getResidentById(id: string): Resident | undefined {
    return this.residents.find(r => r.id === id);
  }

  public updateResident(updated: Resident): Resident {
    const idx = this.residents.findIndex(r => r.id === updated.id);
    if (idx !== -1) {
      this.residents[idx] = updated;
    } else {
      this.residents.push(updated);
    }
    return updated;
  }

  public getDisruptions(): Disruption[] {
    return this.disruptions;
  }

  public getDisruptionById(id: string): Disruption | undefined {
    return this.disruptions.find(d => d.id === id);
  }

  public createDisruption(disruption: Omit<Disruption, 'id'>): Disruption {
    const newDisruption: Disruption = {
      ...disruption,
      id: `dis-${Date.now()}`,
    };
    this.disruptions.unshift(newDisruption);
    return newDisruption;
  }

  public updateDisruptionStatus(id: string, status: Disruption['status'], approvedBy?: string): Disruption | undefined {
    const disruption = this.disruptions.find(d => d.id === id);
    if (disruption) {
      disruption.status = status;
      if (approvedBy) disruption.approvedBy = approvedBy;
    }
    return disruption;
  }

  public getNotifications(): NotificationRecord[] {
    return this.notifications;
  }

  public addNotification(notification: NotificationRecord): NotificationRecord {
    this.notifications.unshift(notification);
    return notification;
  }

  public submitFeedback(notificationId: string, understandability: 'Yes' | 'No', relevance: 'Yes' | 'No', feedbackText?: string): NotificationRecord | undefined {
    const notif = this.notifications.find(n => n.id === notificationId);
    if (notif) {
      notif.understandability = understandability;
      notif.relevance = relevance;
      if (feedbackText) notif.feedbackText = feedbackText;
    }
    return notif;
  }

  public resetToSeed(): void {
    this.departments = [...INITIAL_DEPARTMENTS];
    this.residents = [...INITIAL_RESIDENTS];
    this.disruptions = [...INITIAL_DISRUPTIONS];
    this.notifications = [];
    this.seedInitialNotifications();
  }
}

export const store = new DataStore();
