import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DnsRecord, HostedZone, DnsSearchParams } from '../models/dns-record.interface';

const API_BASE_URL = 'https://j125ycvo89.execute-api.eu-north-1.amazonaws.com/prod';

@Injectable({
  providedIn: 'root'
})
export class AwsRoute53Service {
  constructor(private http: HttpClient) {}

  /**
   * List all hosted zones via Lambda API
   */
  listHostedZones(): Observable<HostedZone[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/zones`).pipe(
      map((zones: any[]) => zones.map(zone => ({
        id: zone.Id?.replace('/hostedzone/', '') || zone.id || '',
        name: zone.Name || zone.name || '',
        resourceRecordSetCount: zone.ResourceRecordSetCount || zone.resourceRecordSetCount
      }))),
      catchError(error => {
        console.error('Error listing hosted zones:', error);
        return throwError(() => new Error(`Failed to list hosted zones: ${error.message}`));
      })
    );
  }

  /**
   * List DNS records for a hosted zone with prefix filter via Lambda API
   */
  listDnsRecords(params: DnsSearchParams): Observable<DnsRecord[]> {
    const body = {
      hostedZoneId: params.hostedZoneId,
      prefix: params.prefix,
      allZones: params.allZones || false
    };
    return this.http.post<any[]>(`${API_BASE_URL}/records`, body).pipe(
      map((records: any[]) => records.map(record => ({
        name: record.Name || record.name || '',
        type: record.Type || record.type || '',
        ttl: record.TTL || record.ttl,
        values: (record.ResourceRecords ? record.ResourceRecords.map((rr: any) => rr.Value || '') : record.values) || [],
        aliasTarget: record.AliasTarget?.DNSName || record.aliasTarget,
        healthCheckId: record.HealthCheckId || record.healthCheckId,
        region: record.Region || record.region,
        failover: record.Failover || record.failover,
        geolocation: record.GeoLocation?.CountryCode || record.geolocation,
        latency: record.Region || record.latency,
        multivalueAnswer: record.MultiValueAnswer || record.multivalueAnswer,
        weight: record.Weight || record.weight,
        hostedZoneName: record.HostedZoneName || record.hostedZoneName
      }))),
      catchError(error => {
        console.error('Error listing DNS records:', error);
        return throwError(() => new Error(`Failed to list DNS records: ${error.message}`));
      })
    );
  }

  /**
   * Delete a DNS record
   */
  deleteDnsRecord(hostedZoneId: string, record: DnsRecord): Observable<any> {
    const body = {
      hostedZoneId: hostedZoneId,
      action: 'DELETE',
      record: {
        name: record.name,
        type: record.type,
        ttl: record.ttl,
        values: record.values,
        aliasTarget: record.aliasTarget
      }
    };

    return this.http.post<any>(`${API_BASE_URL}/records/delete`, body).pipe(
      catchError(error => {
        console.error('Error deleting DNS record:', error);
        let errorMessage = 'Unknown error occurred';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.status === 403) {
          errorMessage = 'Access denied. Check your AWS permissions.';
        } else if (error.status === 404) {
          errorMessage = 'Record not found or already deleted.';
        } else if (error.status === 400) {
          errorMessage = 'Invalid request. Cannot delete this record.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Check if a record can be safely deleted
   */
  canDeleteRecord(record: DnsRecord, zoneName: string): boolean {
    // Prevent deletion of critical record types
    const criticalTypes = ['NS', 'SOA'];
    if (criticalTypes.includes(record.type)) {
      return false;
    }
    
    // Prevent deletion of root zone records
    if (record.name === zoneName || record.name === `${zoneName}.`) {
      return false;
    }
    
    return true;
  }
}