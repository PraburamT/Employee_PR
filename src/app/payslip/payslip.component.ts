import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Payroll {
  Pernr: number;
  Costcenter: string;
  Paytype: number;
  Payarea: number;
  Paygroup: number;
  Paylevel: number;
  Wagetype: string;
  Curr: string;
  Salary: number;
  Annual: number;
  Capacity: number;
  Workhrs: number;
  BankName: string;
  BankKey: string;
  AccNo: string;
}

@Component({
  selector: 'app-payslip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payslip-container">
      <header class="payslip-header">
        <div class="header-content">
          <button (click)="goBack()" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Payslip</h1>
        </div>
      </header>
      
      <main class="payslip-main">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading payslip information...</p>
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="!isLoading && !errorMessage" class="payslip-content">
          <!-- Payroll Information -->
          <div class="payslip-card">
            <div class="card-header">
              <h2>Payroll Information</h2>
              <button (click)="downloadPayslip()" class="download-btn" [disabled]="isDownloading">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {{ isDownloading ? 'Downloading...' : 'Download Payslip PDF' }}
              </button>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <label>Employee Number</label>
                <span>{{ payroll?.Pernr }}</span>
              </div>
              
              <div class="info-item">
                <label>Cost Center</label>
                <span>{{ payroll?.Costcenter }}</span>
              </div>
              
              <div class="info-item">
                <label>Pay Type</label>
                <span>{{ payroll?.Paytype }}</span>
              </div>
              
              <div class="info-item">
                <label>Pay Area</label>
                <span>{{ payroll?.Payarea }}</span>
              </div>
              
              <div class="info-item">
                <label>Pay Group</label>
                <span>{{ payroll?.Paygroup }}</span>
              </div>
              
              <div class="info-item">
                <label>Pay Level</label>
                <span>{{ payroll?.Paylevel }}</span>
              </div>
              
              <div class="info-item">
                <label>Wage Type</label>
                <span>{{ payroll?.Wagetype }}</span>
              </div>
              
              <div class="info-item">
                <label>Currency</label>
                <span>{{ payroll?.Curr }}</span>
              </div>
              
              <div class="info-item">
                <label>Salary</label>
                <span>{{ payroll?.Salary | currency:payroll?.Curr }}</span>
              </div>
              
              <div class="info-item">
                <label>Annual Salary</label>
                <span>{{ payroll?.Annual | currency:payroll?.Curr }}</span>
              </div>
              
              <div class="info-item">
                <label>Capacity (%)</label>
                <span>{{ payroll?.Capacity }}%</span>
              </div>
              
              <div class="info-item">
                <label>Work Hours</label>
                <span>{{ payroll?.Workhrs }} hours</span>
              </div>
            </div>
            
            <!-- Bank Information -->
            <div class="bank-section">
              <h3>Bank Information</h3>
              <div class="bank-grid">
                <div class="info-item">
                  <label>Bank Name</label>
                  <span>{{ payroll?.BankName || 'Not provided' }}</span>
                </div>
                
                <div class="info-item">
                  <label>Bank Key</label>
                  <span>{{ payroll?.BankKey || 'Not provided' }}</span>
                </div>
                
                <div class="info-item">
                  <label>Account Number</label>
                  <span>{{ payroll?.AccNo || 'Not provided' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- PDF Preview Section -->
          <div class="pdf-section">
            <h3>Payslip PDF</h3>
            <div class="pdf-container">
              <div class="pdf-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
                <p>Click the download button above to get your payslip PDF</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .payslip-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .payslip-header {
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
    
    .payslip-header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .payslip-main {
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
    
    .payslip-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 20px;
    }
    
    .card-header h2 {
      color: #333;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    
    .download-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #28a745;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .download-btn:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-2px);
    }
    
    .download-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .info-item label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-item span {
      color: #333;
      font-size: 16px;
      padding: 8px 0;
    }
    
    .bank-section {
      border-top: 2px solid #f0f0f0;
      padding-top: 30px;
    }
    
    .bank-section h3 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .bank-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .pdf-section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .pdf-section h3 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .pdf-container {
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
    }
    
    .pdf-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      color: #666;
    }
    
    .pdf-placeholder svg {
      color: #ccc;
    }
    
    .pdf-placeholder p {
      margin: 0;
      font-size: 16px;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .card-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .info-grid,
      .bank-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PayslipComponent implements OnInit {
  payroll: Payroll | null = null;
  isLoading = false;
  isDownloading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPayrollData();
  }

  loadPayrollData() {
    const empId = localStorage.getItem('empId');
    if (!empId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('/employee-payroll', { IvPernr: empId })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            this.payroll = response.payroll;
          } else {
            this.errorMessage = 'Failed to load payroll information.';
          }
        },
        error: (error) => {
          console.error('Payroll error:', error);
          this.errorMessage = 'Failed to load payroll information. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  downloadPayslip() {
    const empId = localStorage.getItem('empId');
    if (!empId) {
      this.errorMessage = 'Employee ID not found. Please login again.';
      return;
    }

    this.isDownloading = true;
    this.errorMessage = '';

    // Send the request with proper data format
    console.log('🔍 Sending payslip PDF request with pernr:', empId);
    
    // Try with padded employee ID (SAP often expects 8-digit format)
    const paddedEmpId = empId.padStart(8, '0');
    console.log('🔍 Using padded pernr:', paddedEmpId);
    
    this.http.post('/api/payslip-pdf', { pernr: paddedEmpId }, { responseType: 'blob' })
      .subscribe({
        next: (blob: Blob) => {
          console.log('✅ PDF received, size:', blob.size, 'bytes');
          // Create a download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `payslip_${empId}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('❌ PDF download error:', error);
          this.errorMessage = 'Failed to download payslip PDF. Please try again.';
        },
        complete: () => {
          this.isDownloading = false;
        }
      });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
} 