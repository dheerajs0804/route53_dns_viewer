import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export interface DeleteDialogData {
  recordName: string;
  recordType: string;
  recordValues: string[];
  zoneName: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="warning-icon">
          <span class="icon-text">⚠️</span>
        </div>
        <h2 mat-dialog-title>Delete DNS Record</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <div class="warning-message">
          <p>Are you sure you want to delete this DNS record? This action cannot be undone.</p>
        </div>
        
        <div class="record-details">
          <div class="detail-row">
            <span class="detail-label">Zone:</span>
            <span class="detail-value">{{ data.zoneName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Record Name:</span>
            <span class="detail-value record-name">{{ data.recordName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">
              <span class="type-badge" [class]="'type-' + data.recordType.toLowerCase()">
                {{ data.recordType }}
              </span>
            </span>
          </div>
          <div class="detail-row" *ngIf="data.recordValues.length > 0">
            <span class="detail-label">Values:</span>
            <div class="detail-values">
              <div *ngFor="let value of data.recordValues" class="value-item">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="confirmation-note">
          <p><strong>Note:</strong> DNS changes may take up to 48 hours to propagate globally.</p>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancel
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="delete-btn">
          <span class="icon-text">🗑️</span>
          Delete Record
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: #232738;
      color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      min-width: 450px;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 0 24px;
    }
    
    .warning-icon {
      background: #f59e0b;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      
      .icon-text {
        font-size: 24px;
      }
    }
    
    h2 {
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .dialog-content {
      padding: 20px 24px;
      color: #d1d5db;
    }
    
    .warning-message {
      margin-bottom: 20px;
      
      p {
        color: #f87171;
        font-weight: 500;
        margin: 0;
        line-height: 1.5;
      }
    }
    
    .record-details {
      background: #1f2937;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .detail-label {
      font-weight: 500;
      color: #9ca3af;
      min-width: 90px;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .detail-value {
      color: #ffffff;
      font-size: 14px;
      word-break: break-all;
      flex: 1;
    }
    
    .record-name {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      background: #374151;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .type-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      
      &.type-a {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
      }
      
      &.type-aaaa {
        background: rgba(139, 92, 246, 0.2);
        color: #a78bfa;
      }
      
      &.type-cname {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
      }
      
      &.type-mx {
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
      }
      
      &.type-txt {
        background: rgba(236, 72, 153, 0.2);
        color: #f472b6;
      }
      
      &.type-ns {
        background: rgba(168, 85, 247, 0.2);
        color: #c084fc;
      }
      
      &.type-soa {
        background: rgba(14, 165, 233, 0.2);
        color: #38bdf8;
      }
    }
    
    .detail-values {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .value-item {
      background: #374151;
      color: #d1d5db;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .confirmation-note {
      background: rgba(30, 64, 175, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 6px;
      padding: 12px;
      
      p {
        color: #93c5fd;
        font-size: 13px;
        margin: 0;
      }
    }
    
    .dialog-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .cancel-btn {
      color: #9ca3af;
      border: 1px solid #4b5563;
      border-radius: 6px;
      
      &:hover {
        background: rgba(156, 163, 175, 0.1);
        color: #ffffff;
        border-color: #6b7280;
      }
    }
    
    .delete-btn {
      background: #dc2626 !important;
      color: white !important;
      border-radius: 6px !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      font-weight: 500 !important;
      
      &:hover {
        background: #b91c1c !important;
      }
      
      .icon-text {
        font-size: 14px;
      }
    }
    
    @media (max-width: 600px) {
      .dialog-container {
        min-width: 300px;
      }
      
      .dialog-header {
        padding: 16px 16px 0 16px;
      }
      
      .dialog-content {
        padding: 16px;
      }
      
      .dialog-actions {
        padding: 12px 16px 16px 16px;
        flex-direction: column;
        
        .cancel-btn,
        .delete-btn {
          width: 100%;
        }
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteDialogData {
  recordName: string;
  recordType: string;
  recordValues: string[];
  zoneName: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <div class="warning-icon">
          <span class="icon-text">⚠️</span>
        </div>
        <h2 mat-dialog-title>Delete DNS Record</h2>
      </div>
      
      <mat-dialog-content class="dialog-content">
        <div class="warning-message">
          <p>Are you sure you want to delete this DNS record? This action cannot be undone.</p>
        </div>
        
        <div class="record-details">
          <div class="detail-row">
            <span class="detail-label">Zone:</span>
            <span class="detail-value">{{ data.zoneName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Record Name:</span>
            <span class="detail-value record-name">{{ data.recordName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">
              <span class="type-badge" [class]="'type-' + data.recordType.toLowerCase()">
                {{ data.recordType }}
              </span>
            </span>
          </div>
          <div class="detail-row" *ngIf="data.recordValues.length > 0">
            <span class="detail-label">Values:</span>
            <div class="detail-values">
              <div *ngFor="let value of data.recordValues" class="value-item">
                {{ value }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="confirmation-note">
          <p><strong>Note:</strong> DNS changes may take up to 48 hours to propagate globally.</p>
        </div>
      </mat-dialog-content>
      
      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          Cancel
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="delete-btn">
          <span class="icon-text">🗑️</span>
          Delete Record
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: #232738;
      color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 0 24px;
    }
    
    .warning-icon {
      background: #f59e0b;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .icon-text {
        font-size: 24px;
      }
    }
    
    h2 {
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
    
    .dialog-content {
      padding: 20px 24px;
      color: #d1d5db;
    }
    
    .warning-message {
      margin-bottom: 20px;
      
      p {
        color: #f87171;
        font-weight: 500;
        margin: 0;
      }
    }
    
    .record-details {
      background: #1f2937;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .detail-label {
      font-weight: 500;
      color: #9ca3af;
      min-width: 90px;
      font-size: 14px;
    }
    
    .detail-value {
      color: #ffffff;
      font-size: 14px;
      word-break: break-all;
      flex: 1;
    }
    
    .record-name {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .type-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      
      &.type-a {
        background: rgba(59, 130, 246, 0.2);
        color: #60a5fa;
      }
      
      &.type-aaaa {
        background: rgba(139, 92, 246, 0.2);
        color: #a78bfa;
      }
      
      &.type-cname {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
      }
      
      &.type-mx {
        background: rgba(34, 197, 94, 0.2);
        color: #4ade80;
      }
      
      &.type-txt {
        background: rgba(236, 72, 153, 0.2);
        color: #f472b6;
      }
    }
    
    .detail-values {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .value-item {
      background: #374151;
      color: #d1d5db;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
    }
    
    .confirmation-note {
      background: #1e40af;
      background: rgba(30, 64, 175, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 6px;
      padding: 12px;
      
      p {
        color: #93c5fd;
        font-size: 13px;
        margin: 0;
      }
    }
    
    .dialog-actions {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }
    
    .cancel-btn {
      color: #9ca3af;
      border: 1px solid #4b5563;
      border-radius: 6px;
      
      &:hover {
        background: rgba(156, 163, 175, 0.1);
        color: #ffffff;
      }
    }
    
    .delete-btn {
      background: #dc2626 !important;
      color: white !important;
      border-radius: 6px !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
      
      &:hover {
        background: #b91c1c !important;
      }
      
      .icon-text {
        font-size: 14px;
      }
    }
    
    ::ng-deep .mat-mdc-dialog-container {
      background: transparent;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}