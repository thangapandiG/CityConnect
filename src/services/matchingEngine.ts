import { Disruption, Resident, AffectedResidentMatch } from '../types';

/**
 * Calculates the great-circle distance between two points on the Earth
 * using the Haversine formula. Returns distance in kilometers.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function matchResidentsToDisruption(
  disruption: Disruption,
  residents: Resident[]
): {
  matches: AffectedResidentMatch[];
  affectedResidents: Resident[];
  unaffectedResidents: Resident[];
  totalResidents: number;
  affectedCount: number;
  unaffectedCount: number;
  affectedPercentage: number;
  isExpiredDisruption: boolean;
} {
  const isExpired = disruption.status === 'Expired';
  const matches: AffectedResidentMatch[] = [];
  const affectedResidents: Resident[] = [];
  const unaffectedResidents: Resident[] = [];

  for (const resident of residents) {
    let isLocationMatch = false;
    let isRouteMatch = false;
    let distanceKm: number | null = null;
    let matchType: 'Location' | 'Route' | 'Both' | 'Location Unknown Fallback' | 'None' = 'None';

    // Edge Case 1: Missing location coordinates
    if (resident.latitude === null || resident.longitude === null) {
      // Check route matching or zone match as fallback
      isRouteMatch = disruption.affectedRoutes.includes(resident.assignedRoute);
      const isZoneMatch = resident.zone.toLowerCase() === disruption.affectedArea.toLowerCase();

      if (isRouteMatch || isZoneMatch) {
        matchType = 'Location Unknown Fallback';
        affectedResidents.push(resident);
      } else {
        unaffectedResidents.push(resident);
      }

      matches.push({
        resident,
        isLocationMatch: false,
        isRouteMatch,
        distanceKm: null,
        matchType,
      });
      continue;
    }

    // Normal coordinate-based Haversine distance check
    distanceKm = calculateHaversineDistance(
      resident.latitude,
      resident.longitude,
      disruption.latitude,
      disruption.longitude
    );

    isLocationMatch = distanceKm <= disruption.radius;
    isRouteMatch = disruption.affectedRoutes.includes(resident.assignedRoute);

    if (isLocationMatch && isRouteMatch) {
      matchType = 'Both';
    } else if (isLocationMatch) {
      matchType = 'Location';
    } else if (isRouteMatch) {
      matchType = 'Route';
    }

    if (isLocationMatch || isRouteMatch) {
      affectedResidents.push(resident);
    } else {
      unaffectedResidents.push(resident);
    }

    matches.push({
      resident,
      isLocationMatch,
      isRouteMatch,
      distanceKm: Math.round(distanceKm * 100) / 100,
      matchType,
    });
  }

  const totalResidents = residents.length;
  const affectedCount = affectedResidents.length;
  const unaffectedCount = unaffectedResidents.length;
  const affectedPercentage = totalResidents > 0 ? Math.round((affectedCount / totalResidents) * 100) : 0;

  return {
    matches,
    affectedResidents,
    unaffectedResidents,
    totalResidents,
    affectedCount,
    unaffectedCount,
    affectedPercentage,
    isExpiredDisruption: isExpired,
  };
}
