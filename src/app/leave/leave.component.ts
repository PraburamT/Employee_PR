import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Absence {
  Pernr: number;
  Begda: string;
  Endda: string;
  Stdaz: number;
  Abwtg: number;
  Awart: number;
  Ktart: number;
  Anzhl: number;
  Reason: string;
}

interface Quota {
  Pernr: number;
  Begda: string;
  Endda: string;
  Stdaz: number;
  Abwtg: number;
  Awart: string;
  Ktart: number;
  Anzhl: number;
  Reason: string;
}

interface LeaveSummary {
  days: string;
  hours: string;
  leaveTaken: string;
  totalQuota: string;
}

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="leave-container">
      <header class="leave-header">
        <div class="header-content">
          <button (click)="goBack()" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Leave Request</h1>
        </div>
      </header>
      
      <main class="leave-main">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading leave information...</p>
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="!isLoading && !errorMessage" class="leave-content">
         
          <!-- Summary Cards -->
          <div class="summary-cards">
            <div class="summary-card">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Total Days</h3>
                <span class="card-value">{{ summary?.days || '0' }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Total Hours</h3>
                <span class="card-value">{{ summary?.hours || '0' }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Leave Taken</h3>
                <span class="card-value">{{ summary?.leaveTaken || '0' }}</span>
              </div>
            </div>
            
            <div class="summary-card">
              <div class="card-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Total Quota</h3>
                <span class="card-value">{{ summary?.totalQuota || '0' }}</span>
              </div>
            </div>
          </div>
          
          <!-- Absences Section -->
          <div class="section">
            <h2>Leave History</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Hours</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let absence of absences">
                    <td>{{ absence.Begda | date:'mediumDate' }}</td>
                    <td>{{ absence.Endda | date:'mediumDate' }}</td>
                    <td>{{ absence.Abwtg }}</td>
                    <td>{{ absence.Stdaz }}</td>
                    <td>{{ absence.Reason }}</td>
                  </tr>
                  <tr *ngIf="absences.length === 0">
                    <td colspan="5" class="no-data">No leave history found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <!-- Quotas Section -->
          <div class="section">
            <h2>Leave Quotas</h2>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Hours</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let quota of quotas">
                    <td>{{ quota.Begda | date:'mediumDate' }}</td>
                    <td>{{ quota.Endda | date:'mediumDate' }}</td>
                    <td>{{ quota.Anzhl }}</td>
                    <td>{{ quota.Stdaz }}</td>
                    <td>{{ quota.Reason }}</td>
                  </tr>
                  <tr *ngIf="quotas.length === 0">
                    <td colspan="5" class="no-data">No quota information found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .leave-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .leave-header {
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px 0;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      gap: 30px;
    }
    
    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }
    
    .back-btn:hover {
      background: #5a6fd8;
    }
    
    .leave-header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .leave-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .error-message {
      background: #fee;
      color: #c33;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .card-icon {
      color: #667eea;
      flex-shrink: 0;
    }
    
    .card-content h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    
    .card-value {
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }
    
    .section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .section h2 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .data-table th {
      background: #f8f9fa;
      color: #333;
      font-weight: 600;
      padding: 12px;
      text-align: left;
      border-bottom: 2px solid #e9ecef;
    }
    
    .data-table td {
      padding: 12px;
      border-bottom: 1px solid #e9ecef;
      color: #333;
    }
    
    .data-table tr:hover {
      background: #f8f9fa;
    }
    
    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .data-table {
        font-size: 14px;
      }
      
      .data-table th,
      .data-table td {
        padding: 8px;
      }
    }
  `]
})
export class LeaveComponent implements OnInit {
  absences: Absence[] = [];
  quotas: Quota[] = [];
  summary: LeaveSummary | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadLeaveData();
  }

  loadLeaveData() {
    const empId = localStorage.getItem('empId');
    if (!empId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('🔍 Sending leave request with IvEmpId:', empId);
    
    // Try with different employee ID formats if needed
    const requestData = { IvEmpId: empId };
    console.log('📤 Request data:', requestData);
    
    // Test with the exact format you expect
    console.log('🧪 Testing with expected response format...');
    
    this.http.post('/employee-leave', requestData)
      .subscribe({
                 next: (response: any) => {
           console.log('✅ Leave response received:', response);
           console.log('🔍 Response structure:', {
             status: response.status,
             hasAbsences: !!response.absences,
             hasQuotas: !!response.quotas,
             hasSummary: !!response.summary,
             absencesType: typeof response.absences,
             quotasType: typeof response.quotas,
             summaryType: typeof response.summary
           });
           
           if (response.status === 'SUCCESS') {
             // Ensure we're getting arrays and objects
             this.absences = Array.isArray(response.absences) ? response.absences : [];
             this.quotas = Array.isArray(response.quotas) ? response.quotas : [];
             this.summary = response.summary && typeof response.summary === 'object' ? response.summary : null;
             
             console.log('📊 Leave data loaded:', {
               absences: this.absences.length,
               quotas: this.quotas.length,
               summary: this.summary
             });
             
             // Log the actual data structure
             if (response.absences) {
               console.log('📋 Absences data:', response.absences);
               console.log('📋 First absence:', response.absences[0]);
             }
             if (response.quotas) {
               console.log('📋 Quotas data:', response.quotas);
               console.log('📋 First quota:', response.quotas[0]);
             }
             if (response.summary) {
               console.log('📋 Summary data:', response.summary);
             }
             
             // Force change detection
             setTimeout(() => {
               console.log('🔄 Component data after timeout:', {
                 absences: this.absences.length,
                 quotas: this.quotas.length,
                 summary: this.summary
               });
             }, 100);
           } else {
             console.error('❌ Leave request failed:', response);
             this.errorMessage = 'Failed to load leave information.';
           }
         },
        error: (error) => {
          console.error('❌ Leave error:', error);
          this.errorMessage = 'Failed to load leave information. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
} 