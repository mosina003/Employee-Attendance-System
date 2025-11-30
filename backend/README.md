# Employee Attendance System - Backend

A comprehensive RESTful API for managing employee attendance with role-based access control for Employees and Managers.

## 🚀 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Features

### Authentication
- User registration with role-based signup
- Secure login with JWT tokens
- Password encryption with bcrypt

### Employee Features
- Check-in/Check-out system
- View personal attendance history
- Monthly attendance summary
- Dashboard with statistics
- Auto status calculation (Present/Late/Half-day)

### Manager Features
- View all employees' attendance
- Filter by date, employee, status, department
- Export attendance reports to CSV
- Team statistics and analytics
- Real-time team attendance tracking

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── attendanceController.js # Attendance management
│   └── dashboardController.js  # Dashboard statistics
├── middleware/
│   ├── auth.js              # JWT authentication & authorization
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User schema
│   └── Attendance.js        # Attendance schema
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── attendanceRoutes.js  # Attendance endpoints
│   └── dashboardRoutes.js   # Dashboard endpoints
├── seed/
│   └── seed.js              # Database seeding script
├── utils/
│   └── generateToken.js     # JWT token generator
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── server.js                # Application entry point
```

## 🔧 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy .env.example to .env
copy .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-attendance
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. **Start MongoDB**
- If using local MongoDB:
```bash
mongod
```
- Or use MongoDB Atlas connection string in MONGO_URI

5. **Seed the database** (Optional - creates sample data)
```bash
npm run seed
```

6. **Start the server**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 🔐 Sample Credentials (After Seeding)

### Manager Account
- **Email:** manager@test.com
- **Password:** password123

### Employee Accounts
- **Email:** alice@test.com (Engineering)
- **Email:** bob@test.com (Engineering)
- **Email:** carol@test.com (Sales)
- **Email:** david@test.com (Sales)
- **Email:** emma@test.com (HR)
- **Password:** password123 (for all)

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
GET    /api/auth/me           # Get current user (Protected)
```

### Attendance - Employee
```
POST   /api/attendance/checkin         # Check in
POST   /api/attendance/checkout        # Check out
GET    /api/attendance/my-history      # My attendance history
GET    /api/attendance/my-summary      # Monthly summary
GET    /api/attendance/today           # Today's status
```

### Attendance - Manager
```
GET    /api/attendance/all             # All employees attendance
GET    /api/attendance/employee/:id    # Specific employee
GET    /api/attendance/summary         # Team summary
GET    /api/attendance/export          # Export to CSV
GET    /api/attendance/today-status    # Today's team status
```

### Dashboard
```
GET    /api/dashboard/employee         # Employee dashboard stats
GET    /api/dashboard/manager          # Manager dashboard stats
```

## 📝 API Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee",
  "employeeId": "EMP006",
  "department": "IT"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Check In
```http
POST /api/attendance/checkin
Authorization: Bearer <token>
```

### Get Attendance History
```http
GET /api/attendance/my-history?month=11&year=2023
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  employeeId: String (unique),
  department: String,
  createdAt: Date
}
```

### Attendance Model
```javascript
{
  userId: ObjectId (ref: User),
  date: Date,
  checkInTime: Date,
  checkOutTime: Date,
  status: String (present/absent/late/half-day),
  totalHours: Number,
  createdAt: Date
}
```

## 🎯 Business Rules

1. **Late Status**: Check-in after 9:30 AM
2. **Half-Day Status**: Total hours < 4 hours
3. **Present Status**: Check-in before 9:30 AM and hours >= 4
4. **Working Days**: Monday to Friday (excludes weekends)
5. **One Check-in per Day**: Cannot check-in twice on same day

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Token is returned upon successful login/registration and expires in 30 days.

## 🛠️ Development

### Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with sample data
```

### Testing with Postman/Thunder Client

1. Import the API endpoints
2. Register/Login to get JWT token
3. Add token to Authorization header
4. Test all endpoints

## 🚨 Error Handling

The API uses consistent error responses:
```json
{
  "message": "Error description",
  "stack": "Stack trace (dev only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 📊 Features Highlights

✅ Role-based access control (Employee/Manager)  
✅ Automatic status calculation  
✅ Monthly attendance summaries  
✅ CSV export functionality  
✅ Department-wise filtering  
✅ Real-time dashboard statistics  
✅ Secure password hashing  
✅ JWT authentication  
✅ Input validation  
✅ Error handling middleware  

## 🔮 Future Enhancements

- [ ] Email notifications for absent employees
- [ ] Leave management system
- [ ] Shift management
- [ ] Overtime tracking
- [ ] Geolocation check-in
- [ ] Face recognition integration
- [ ] Mobile app support

## 📄 License

MIT

## 👥 Author

Your Name

---

**Need Help?** Check the documentation or raise an issue!
