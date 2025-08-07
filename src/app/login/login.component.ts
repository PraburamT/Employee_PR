import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Employee Portal</h2>
          <p>Please login to access your dashboard</p>
        </div>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="login-form">
          <div class="form-group">
            <label for="empId">Employee ID</label>
            <input 
              type="text" 
              id="empId" 
              name="empId" 
              [(ngModel)]="loginData.EmpId" 
              required 
              class="form-control"
              placeholder="Enter your Employee ID">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="loginData.Password" 
              required 
              class="form-control"
              placeholder="Enter your password">
          </div>
          
          <button type="submit" [disabled]="!loginForm.valid || isLoading" class="login-btn">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-header h2 {
      color: #333;
      margin-bottom: 8px;
      font-size: 28px;
      font-weight: 600;
    }
    
    .login-header p {
      color: #666;
      margin: 0;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-group label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }
    
    .form-control {
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .login-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    
    .login-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .login-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .error-message {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 6px;
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
    }
  `]
})
export class LoginComponent {
  loginData = {
    EmpId: '',
    Password: ''
  };
  
  isLoading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onLogin() {
    if (!this.loginData.EmpId || !this.loginData.Password) {
      this.errorMessage = 'Please enter both Employee ID and Password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post('/employee-login', this.loginData)
      .subscribe({
        next: (response: any) => {
          if (response.status === 'SUCCESS') {
            // Store employee ID in localStorage
            localStorage.setItem('empId', this.loginData.EmpId);
            // Navigate to dashboard
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = 'Login failed. Please check your credentials.';
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please try again.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
} 