# 🎯 Employee Attendance System

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application for managing employee attendance with role-based access control for employees and managers.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-green)
![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Node](https://img.shields.io/badge/Node-22.14-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-blue)

## 📋 Features

### 👤 Employee Features
- ✅ Employee registration and login
- ✅ Check-in/Check-out functionality
- ✅ View personal attendance history
- ✅ Monthly attendance summary
- ✅ Calendar view of attendance
- ✅ Profile management
- ✅ Animated dashboard with statistics
- ✅ Activity timeline
- ✅ Attendance pie charts
- ✅ Circular progress indicators

### 👨‍💼 Manager Features
- ✅ Manager login with dedicated dashboard
- ✅ View all employee attendance records
- ✅ Filter by employee, date range, status, department
- ✅ Export attendance reports to CSV
- ✅ Team attendance calendar
- ✅ Department-wise statistics
- ✅ Today's attendance status
- ✅ Weekly attendance trends
- ✅ Interactive charts and graphs
- ✅ Pagination for large datasets
- ✅ Real-time attendance tracking

### 🎨 UI/UX Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Framer Motion animations
- ✅ Beautiful gradient backgrounds
- ✅ Status badges with icons
- ✅ Toast notifications
- ✅ Loading states
- ✅ Modern card-based layout
- ✅ Interactive charts (Recharts)
- ✅ Circular progress bars

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Toastify** - Notifications
- **Axios** - HTTP client

### Backend
- **Node.js 22.14.0** - Runtime
- **Express.js 4.18.2** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **json2csv** - CSV export
- **dotenv** - Environment variables

## 📦 Installation

### Prerequisites
- Node.js (v22.14.0 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/mosina003/Employee-Attendance-System.git
cd Employee-Attendance-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Seed Database (Optional)
```bash
cd backend
node seed/seed.js
```

This will create sample users:
- **Manager**: manager@test.com / password123
- **Employees**: alice@test.com, bob@test.com, carol@test.com / password123

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Screenshots

### Employee Dashboard
- Check-in/Check-out buttons
- Monthly attendance rate
- Recent activity timeline
- Attendance distribution pie chart

### Manager Dashboard
- Team statistics overview
- Weekly attendance trends (area chart)
- Today's attendance breakdown
- Absent employees list
- Department-wise analytics

### Attendance Management
- Advanced filtering (employee, date, status, department)
- Pagination for large datasets
- Export to CSV
- Responsive table view

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Protected routes require valid tokens
- Role-based access control (employee vs manager)
- Automatic token validation on requests

## 📊 Database Schema

### User Model
- name, email, password (hashed)
- employeeId (auto-generated)
- role (employee/manager)
- department, phone, joinDate

### Attendance Model
- userId (reference to User)
- date, checkInTime, checkOutTime
- status (present/absent/late/half-day)
- totalHours (auto-calculated)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register employee
- `POST /api/auth/login` - Login user

### Attendance (Employee)
- `POST /api/attendance/checkin` - Check in
- `POST /api/attendance/checkout` - Check out
- `GET /api/attendance/my-history` - Get personal history
- `GET /api/attendance/my-summary` - Get monthly summary
- `GET /api/attendance/today` - Get today's status

### Attendance (Manager)
- `GET /api/attendance/all` - Get all attendance
- `GET /api/attendance/employee/:id` - Get employee attendance
- `GET /api/attendance/summary` - Get team summary
- `GET /api/attendance/today-status` - Today's team status
- `GET /api/attendance/export` - Export to CSV

### Dashboard
- `GET /api/dashboard/employee` - Employee dashboard data
- `GET /api/dashboard/manager` - Manager dashboard data

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/attendance
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=/api
VITE_APP_ENV=development
```

## 📝 Features in Detail

### Attendance Status Logic
- **Present**: Check-in before 9:00 AM
- **Late**: Check-in after 9:00 AM
- **Half-day**: Less than 4 hours worked
- **Absent**: No check-in record

### Auto-calculations
- Total hours worked (check-out - check-in)
- Monthly attendance percentage
- Department-wise statistics
- Working days (excluding weekends)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Mosina**
- GitHub: [@mosina003](https://github.com/mosina003)

## 🙏 Acknowledgments

- React Team for the amazing library
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework
- Recharts for beautiful data visualization
- Framer Motion for smooth animations

## 📞 Support

For support, email mosina003@github.com or create an issue in the repository.

---

**Made with ❤️ using MERN Stack**
