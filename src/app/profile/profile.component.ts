import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface Profile {
  Persno: number;
  Company: string;
  ComName: string;
  ComName2: string;
  ComStreet: string;
  ComCity: string;
  CompPin: number;
  ComCountry: string;
  ComCountryTxt: string;
  PersArea: string;
  PersSubarea: number;
  PayArea: number;
  EmpGroup: number;
  EmpGroupTxt: string;
  EmpSubgroup: string;
  EmpSubTxt: string;
  JoinDate: string;
  PostId: number;
  FirstName: string;
  LastName: string;
  Gender: number;
  GenderText: string;
  Dob: string;
  NationalityTxt: string;
  Nationality: string;
  Street: string;
  City: string;
  PinCode: number;
  Country: string;
  CountryTxt: string;
  Email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <div class="header-content">
          <button (click)="goBack()" class="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Dashboard
          </button>
          <h1>Employee Profile</h1>
        </div>
      </header>
      
      <main class="profile-main">
        <div *ngIf="isLoading" class="loading">
          <div class="spinner"></div>
          <p>Loading profile information...</p>
        </div>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <div *ngIf="profile && !isLoading" class="profile-content">
          <div class="profile-card">
            <div class="profile-header-section">
              <div class="avatar">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="profile-info">
                <h2>{{ profile.FirstName }} {{ profile.LastName }}</h2>
                <p class="emp-id">Employee ID: {{ profile.Persno }}</p>
                <p class="position">{{ profile.EmpSubTxt }}</p>
              </div>
            </div>
            
            <div class="profile-sections">
              <!-- Personal Information -->
              <div class="section">
                <h3>Personal Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Full Name</label>
                    <span>{{ profile.FirstName }} {{ profile.LastName }}</span>
                  </div>
                  <div class="info-item">
                    <label>Date of Birth</label>
                    <span>{{ profile.Dob | date:'mediumDate' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Gender</label>
                    <span>{{ profile.GenderText }}</span>
                  </div>
                  <div class="info-item">
                    <label>Nationality</label>
                    <span>{{ profile.NationalityTxt }}</span>
                  </div>
                  <div class="info-item">
                    <label>Email</label>
                    <span>{{ profile.Email }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Employment Information -->
              <div class="section">
                <h3>Employment Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Employee Group</label>
                    <span>{{ profile.EmpGroupTxt }}</span>
                  </div>
                  <div class="info-item">
                    <label>Employee Subgroup</label>
                    <span>{{ profile.EmpSubTxt }}</span>
                  </div>
                  <div class="info-item">
                    <label>Join Date</label>
                    <span>{{ profile.JoinDate | date:'mediumDate' }}</span>
                  </div>
                  <div class="info-item">
                    <label>Personnel Area</label>
                    <span>{{ profile.PersArea }}</span>
                  </div>
                  <div class="info-item">
                    <label>Pay Area</label>
                    <span>{{ profile.PayArea }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Company Information -->
              <div class="section">
                <h3>Company Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Company</label>
                    <span>{{ profile.Company }}</span>
                  </div>
                  <div class="info-item">
                    <label>Company Name</label>
                    <span>{{ profile.ComName }}</span>
                  </div>
                  <div class="info-item">
                    <label>Company Street</label>
                    <span>{{ profile.ComStreet }}</span>
                  </div>
                  <div class="info-item">
                    <label>Company City</label>
                    <span>{{ profile.ComCity }}</span>
                  </div>
                  <div class="info-item">
                    <label>Company Country</label>
                    <span>{{ profile.ComCountryTxt }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Address Information -->
              <div class="section">
                <h3>Address Information</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <label>Street</label>
                    <span>{{ profile.Street || 'Not provided' }}</span>
                  </div>
                  <div class="info-item">
                    <label>City</label>
                    <span>{{ profile.City }}</span>
                  </div>
                  <div class="info-item">
                    <label>Pin Code</label>
                    <span>{{ profile.PinCode }}</span>
                  </div>
                  <div class="info-item">
                    <label>Country</label>
                    <span>{{ profile.CountryTxt }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .profile-header {
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
    
    .profile-header h1 {
      color: #333;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .profile-main {
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
    
    .profile-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .profile-header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      display: flex;
      align-items: center;
      gap: 30px;
    }
    
    .avatar {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .profile-info h2 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }
    
    .emp-id {
      margin: 0 0 4px 0;
      opacity: 0.9;
      font-size: 16px;
    }
    
    .position {
      margin: 0;
      opacity: 0.8;
      font-size: 14px;
    }
    
    .profile-sections {
      padding: 40px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section:last-child {
      margin-bottom: 0;
    }
    
    .section h3 {
      color: #333;
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
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
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      
      .profile-header-section {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .profile-sections {
        padding: 20px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: Profile | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const empId = localStorage.getItem('empId');
    if (!empId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('/employee-profile', { IvEmpId: empId })
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            this.profile = response.profile;
          } else {
            this.errorMessage = 'Failed to load profile information.';
          }
        },
        error: (error) => {
          console.error('Profile error:', error);
          this.errorMessage = 'Failed to load profile information. Please try again.';
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