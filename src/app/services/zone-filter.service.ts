import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HostedZone } from '../models/dns-record.interface';

@Injectable({
  providedIn: 'root'
})
export class ZoneFilterService {

  /**
   * Check if a hosted zone should be visible based on environment configuration
   */
  isZoneVisible(zone: HostedZone): boolean {
    if (!environment.hostedZoneFilter?.enabled) {
      return true; // If filtering is disabled, show all zones
    }

    const { allowedZones, allowedZonePatterns } = environment.hostedZoneFilter;

    // Check exact zone name/ID matches
    if (allowedZones && allowedZones.length > 0) {
      if (allowedZones.includes(zone.name) || allowedZones.includes(zone.id)) {
        return true;
      }
    }

    // Check pattern matches
    if (allowedZonePatterns && allowedZonePatterns.length > 0) {
      for (const pattern of allowedZonePatterns) {
        if (this.matchesPattern(zone.name, pattern) || this.matchesPattern(zone.id, pattern)) {
          return true;
        }
      }
    }

    // If no patterns are defined, show all zones
    if ((!allowedZones || allowedZones.length === 0) && 
        (!allowedZonePatterns || allowedZonePatterns.length === 0)) {
      return true;
    }

    return false;
  }

  /**
   * Filter an array of hosted zones based on environment configuration
   */
  filterZones(zones: HostedZone[]): HostedZone[] {
    if (!environment.hostedZoneFilter?.enabled) {
      return zones; // If filtering is disabled, return all zones
    }

    return zones.filter(zone => this.isZoneVisible(zone));
  }

  /**
   * Check if a string matches a pattern (supports wildcards)
   */
  private matchesPattern(value: string, pattern: string): boolean {
    if (!value || !pattern) return false;

    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.') // Escape dots
      .replace(/\*/g, '.*')  // Convert * to .*
      .replace(/\?/g, '.');  // Convert ? to .

    const regex = new RegExp(`^${regexPattern}$`, 'i'); // Case insensitive
    return regex.test(value);
  }

  /**
   * Get the current filtering configuration for debugging
   */
  getFilterConfig() {
    return {
      enabled: environment.hostedZoneFilter?.enabled || false,
      allowedZones: environment.hostedZoneFilter?.allowedZones || [],
      allowedZonePatterns: environment.hostedZoneFilter?.allowedZonePatterns || [],
      totalZones: 0,
      visibleZones: 0
    };
  }

  /**
   * Update filter configuration at runtime (useful for testing)
   */
  updateFilterConfig(config: Partial<typeof environment.hostedZoneFilter>) {
    if (environment.hostedZoneFilter) {
      Object.assign(environment.hostedZoneFilter, config);
    }
  }
}
