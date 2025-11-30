# Employee Attendance System - Frontend

React-based frontend application for the Employee Attendance System with Redux Toolkit state management.

## 🚀 Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📋 Features Implemented

### Authentication Pages ✅
- **Employee Login** - `/employee/login`
- **Employee Registration** - `/employee/register`
- **Manager Login** - `/manager/login`

### Key Features:
- Beautiful gradient UI with Tailwind CSS
- Form validation
- Loading states
- Error handling with toast notifications
- Role-based login (Employee vs Manager)
- Demo credentials displayed on login pages
- Responsive design

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- Backend server running on `http://localhost:5000`

### Steps

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🌐 Available Routes

### Public Routes
- `/` - Redirects to employee login
- `/employee/login` - Employee login page
- `/employee/register` - Employee registration page
- `/manager/login` - Manager login page

### Protected Routes (Coming Soon)
- `/employee/dashboard` - Employee dashboard
- `/manager/dashboard` - Manager dashboard

## 🎨 Design Features

### Employee Login Page
- Blue gradient theme
- Email and password fields with icons
- Loading spinner during authentication
- Demo credentials box
- Links to registration and manager login

### Manager Login Page
- Purple/Indigo gradient theme
- Professional manager icon
- Email and password fields
- Demo credentials box
- Link to employee login

### Employee Registration Page
- Green gradient theme
- Full form with validation:
  - Full Name
  - Email
  - Employee ID (auto-uppercase)
  - Department (dropdown)
  - Password
  - Confirm Password
- Form validation and error messages

## 📦 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   └── auth/
│   │       ├── EmployeeLogin.jsx
│   │       ├── ManagerLogin.jsx
│   │       └── EmployeeRegister.jsx
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       └── authSlice.js
│   ├── services/
│   │   └── authService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔐 Demo Credentials

### Employee Login
- **Email:** alice@test.com
- **Password:** password123

### Manager Login
- **Email:** manager@test.com
- **Password:** password123

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔄 State Management

Using **Redux Toolkit** with slices:
- **authSlice**: Handles authentication (login, register, logout)
  - Actions: `login`, `register`, `logout`, `reset`
  - State: `user`, `isLoading`, `isError`, `isSuccess`, `message`

## 🌟 Features

✅ Role-based authentication (Employee/Manager)  
✅ Form validation  
✅ Loading states  
✅ Toast notifications  
✅ Responsive design  
✅ Local storage for auth persistence  
✅ Auto-redirect after login  
✅ Beautiful gradient UI  
✅ Icon-enhanced forms  

## 🔮 Coming Next

- [ ] Employee Dashboard
- [ ] Manager Dashboard
- [ ] Attendance marking (Check In/Out)
- [ ] Attendance history
- [ ] Calendar view
- [ ] Reports and analytics
- [ ] Profile management
- [ ] Protected routes

## 🎯 API Integration

Frontend communicates with backend via:
- **Base URL:** `http://localhost:5000/api`
- **Proxy:** Configured in `vite.config.js`

### Endpoints Used:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## 📱 Responsive Design

All pages are fully responsive and work on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Color Scheme

- **Employee Theme:** Blue (#3B82F6)
- **Manager Theme:** Indigo/Purple (#6366F1)
- **Success:** Green (#10B981)
- **Error:** Red (#EF4444)
- **Warning:** Amber (#F59E0B)

---

**Frontend Status:** ✅ Authentication Complete  
**Next:** Build Dashboard Components
