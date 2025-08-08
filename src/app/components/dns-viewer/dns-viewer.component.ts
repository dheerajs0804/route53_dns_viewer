import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { AwsRoute53Service } from '../../services/aws-route53.service';
import { AuthService } from '../../services/auth.service';
import { DnsRecord, HostedZone, DnsSearchParams } from '../../models/dns-record.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dns-viewer',
  templateUrl: './dns-viewer.component.html',
  styleUrls: ['./dns-viewer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule
  ]
})
export class DnsViewerComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchForm: FormGroup;
  hostedZones: HostedZone[] = [];
  dnsRecords: DnsRecord[] = [];
  dataSource = new MatTableDataSource<DnsRecord>([]);
  displayedColumns: string[] = ['name', 'type', 'ttl', 'values', 'actions'];
  
  isLoading = false;
  isLoadingZones = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private awsService: AwsRoute53Service,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      hostedZoneId: ['', [Validators.required]],
      prefix: ['']
    });
  }

  ngOnInit(): void {
    this.loadHostedZones();
    
    // Auto-search when prefix changes (with debounce)
    this.searchForm.get('prefix')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (this.searchForm.get('hostedZoneId')?.value) {
          this.searchRecords();
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHostedZones(): void {
    this.isLoadingZones = true;
    
    this.awsService.listHostedZones().subscribe({
      next: (zones) => {
        this.hostedZones = zones;
        this.isLoadingZones = false;
        
        // Auto-select first zone if available
        if (zones.length > 0 && !this.searchForm.get('hostedZoneId')?.value) {
          this.searchForm.patchValue({ hostedZoneId: zones[0].id });
          this.searchRecords();
        }
      },
      error: (error) => {
        this.isLoadingZones = false;
        this.snackBar.open(`Failed to load hosted zones: ${error.message}`, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  searchRecords(): void {
    if (this.searchForm.valid) {
      this.isLoading = true;
      const params: DnsSearchParams = this.searchForm.value;
      
      this.awsService.listDnsRecords(params).subscribe({
        next: (records) => {
          this.dnsRecords = records;
          this.dataSource.data = records;
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(`Failed to load DNS records: ${error.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onZoneSelectionChange(): void {
    // Auto-search when zone is selected
    if (this.searchForm.get('hostedZoneId')?.value) {
      this.searchRecords();
    }
  }

  clearSearch(): void {
    this.searchForm.patchValue({ prefix: '' });
    this.searchRecords();
  }

  exportToCsv(): void {
    if (this.dnsRecords.length === 0) {
      this.snackBar.open('No records to export', 'Close', {
        duration: 3000
      });
      return;
    }

    const csvContent = this.generateCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dns-records-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    this.snackBar.open('CSV exported successfully', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private generateCsvContent(): string {
    const headers = ['Name', 'Type', 'TTL', 'Values', 'Alias Target'];
    const rows = this.dnsRecords.map(record => [
      record.name,
      record.type,
      record.ttl || '',
      record.values.join('; '),
      record.aliasTarget || ''
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getZoneName(zoneId: string): string {
    const zone = this.hostedZones.find(z => z.id === zoneId);
    return zone ? zone.name : zoneId;
  }

  formatValues(values: string[]): string {
    if (values.length === 0) return '-';
    if (values.length === 1) return values[0];
    return values.join(', ');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.snackBar.open('Copied to clipboard', 'Close', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      this.snackBar.open('Failed to copy to clipboard', 'Close', {
        duration: 2000,
        panelClass: ['error-snackbar']
      });
    });
  }
}