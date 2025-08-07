import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Employee Dashboard</h1>
          <div class="header-actions">
            <span class="welcome-text">Welcome, Employee ID: {{ empId }}</span>
            <button (click)="logout()" class="logout-btn">Logout</button>
          </div>
        </div>
      </header>
      
      <main class="dashboard-main">
        <div class="cards-container">
          <!-- Profile Card -->
          <div class="card profile-card" (click)="navigateToProfile()">
            <div class="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>Profile</h3>
              <p>View and manage your employee profile information</p>
            </div>
            <div class="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
          
          <!-- Leave Request Card -->
          <div class="card leave-card" (click)="navigateToLeave()">
            <div class="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>Leave Request</h3>
              <p>View your leave history and request new leaves</p>
            </div>
            <div class="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
          
          <!-- Payslip Card -->
          <div class="card payslip-card" (click)="navigateToPayslip()">
            <div class="card-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <div class="card-content">
              <h3>Payslip</h3>
              <p>View and download your payslip information</p>
            </div>
            <div class="card-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .dashboard-header {
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px 0;
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .dashboard-header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    
    .welcome-text {
      color: #666;
      font-size: 14px;
    }
    
    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }
    
    .logout-btn:hover {
      background: #c82333;
    }
    
    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
    }
    
    .card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }
    
    .card-icon {
      color: #667eea;
      flex-shrink: 0;
    }
    
    .card-content {
      flex: 1;
    }
    
    .card-content h3 {
      color: #333;
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .card-content p {
      color: #666;
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .card-arrow {
      color: #ccc;
      transition: color 0.3s ease;
    }
    
    .card:hover .card-arrow {
      color: #667eea;
    }
    
    .profile-card:hover .card-icon {
      color: #28a745;
    }
    
    .leave-card:hover .card-icon {
      color: #ffc107;
    }
    
    .payslip-card:hover .card-icon {
      color: #17a2b8;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .cards-container {
        grid-template-columns: 1fr;
      }
      
      .card {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  empId: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Get employee ID from localStorage
    this.empId = localStorage.getItem('empId') || '';
    
    // If no employee ID, redirect to login
    if (!this.empId) {
      this.router.navigate(['/login']);
    }
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToLeave() {
    this.router.navigate(['/leave']);
  }

  navigateToPayslip() {
    this.router.navigate(['/payslip']);
  }

  logout() {
    localStorage.removeItem('empId');
    this.router.navigate(['/login']);
  }
} 