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
}

export interface HostedZone {
  id: string;
  name: string;
  resourceRecordSetCount?: number;
}

export interface DnsSearchParams {
  hostedZoneId: string;
  prefix: string;
}

