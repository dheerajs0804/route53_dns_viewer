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
      prefix: params.prefix
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
        weight: record.Weight || record.weight
      }))),
      catchError(error => {
        console.error('Error listing DNS records:', error);
        return throwError(() => new Error(`Failed to list DNS records: ${error.message}`));
      })
    );
  }
}
