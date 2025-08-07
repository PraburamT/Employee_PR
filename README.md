# Employee Portal

A modern Angular-based employee portal with login functionality and dashboard featuring profile management, leave requests, and payslip access.

## Features

- **Secure Login**: Employee authentication with Employee ID and Password
- **Dashboard**: Central hub with three main sections
- **Profile Management**: View detailed employee profile information
- **Leave Management**: Track leave history and quotas
- **Payslip Access**: View payroll information and download PDF payslips
- **Responsive Design**: Modern UI that works on all devices
- **Local Storage**: Employee ID persistence across sessions

## Prerequisites

- Node.js (v16 or higher)
- Angular CLI (v17 or higher)
- Backend server running on port 3000

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd employee
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the backend server**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   The backend should be running on `http://localhost:3000`

4. **Start the Angular application**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:4200`

## Usage

### Login
- Navigate to `http://localhost:4200`
- Use the following test credentials:
  - **Employee ID**: `1`
  - **Password**: `12345`

### Dashboard
After successful login, you'll be redirected to the dashboard with three main cards:
- **Profile**: View employee information
- **Leave Request**: Check leave history and quotas
- **Payslip**: Access payroll data and download PDF

### Navigation
- Each card can be clicked to view detailed information
- Use the "Back to Dashboard" button to return to the main dashboard
- Use the "Logout" button to sign out

## API Endpoints

The application connects to the following backend endpoints:

- `POST /employee-login` - Employee authentication
- `POST /employee-profile` - Get employee profile data
- `POST /employee-leave` - Get leave information
- `POST /employee-payroll` - Get payroll information
- `POST /api/payslip-pdf` - Download payslip PDF

## Project Structure

```
src/
├── app/
│   ├── login/
│   │   └── login.component.ts
│   ├── dashboard/
│   │   └── dashboard.component.ts
│   ├── profile/
│   │   └── profile.component.ts
│   ├── leave/
│   │   └── leave.component.ts
│   ├── payslip/
│   │   └── payslip.component.ts
│   ├── app.component.ts
│   ├── app.component.html
│   ├── app.routes.ts
│   └── app.config.ts
├── index.html
└── main.ts
```

## Development

### Adding New Features
1. Create new components in the `src/app/` directory
2. Update routes in `app.routes.ts`
3. Add any new API endpoints to the backend server

### Styling
- All components use inline styles for better encapsulation
- Responsive design with CSS Grid and Flexbox
- Modern gradient backgrounds and card-based layouts

### State Management
- Employee ID is stored in localStorage for session persistence
- No external state management libraries required

## Troubleshooting

### CORS Issues
The application includes a proxy configuration (`proxy.conf.json`) to handle CORS issues. If you encounter CORS errors:

1. Ensure the backend server is running on port 3000
2. Check that the proxy configuration is properly set in `angular.json`
3. Restart the Angular development server

### Login Issues
- Verify the backend server is running
- Check that the test credentials are correct
- Ensure the API endpoints are accessible

### PDF Download Issues
- Make sure the backend PDF endpoint is working
- Check browser console for any errors
- Verify the employee ID is properly stored in localStorage

## Technologies Used

- **Frontend**: Angular 17, TypeScript, CSS3
- **Backend**: Node.js, Express.js
- **HTTP Client**: Angular HttpClient
- **Routing**: Angular Router
- **State Management**: LocalStorage

## License

This project is for demonstration purposes only.

## Support

For any issues or questions, please check the troubleshooting section above or contact the development team.
