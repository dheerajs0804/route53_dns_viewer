export interface DnsRecord {
  name: string;
  type: string;
  ttl?: number;
  values: string[];
  aliasTarget?: string;
  healthCheckId?: string;
  region?: string;
  failover?: string;
  geolocation?: string;
  latency?: string;
  multivalueAnswer?: boolean;
  weight?: number;
  hostedZoneName?: string; // Add zone name for multi-zone searches
}

export interface HostedZone {
  id: string;
  name: string;
  resourceRecordSetCount?: number;
}

export interface DnsSearchParams {
  hostedZoneId: string;
  prefix: string;
  allZones?: boolean; // Add option to search across all zones
}

