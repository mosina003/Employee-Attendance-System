# API Testing Guide

## Quick Start Testing

### 1. Start MongoDB
```bash
mongod
```

### 2. Install Dependencies & Seed Database
```bash
cd backend
npm install
npm run seed
```

### 3. Start Server
```bash
npm run dev
```

## Testing Endpoints

### Health Check
```bash
curl http://localhost:5000
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "employee",
    "employeeId": "EMP999",
    "department": "Testing"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@test.com",
    "password": "password123"
  }'
```

Save the token from login response!

### Check In (Replace YOUR_TOKEN)
```bash
curl -X POST http://localhost:5000/api/attendance/checkin \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Out
```bash
curl -X POST http://localhost:5000/api/attendance/checkout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get My History
```bash
curl http://localhost:5000/api/attendance/my-history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Employee Dashboard
```bash
curl http://localhost:5000/api/dashboard/employee \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Manager Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@test.com",
    "password": "password123"
  }'
```

### Get Manager Dashboard (Use manager token)
```bash
curl http://localhost:5000/api/dashboard/manager \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### Get All Attendance (Manager)
```bash
curl http://localhost:5000/api/attendance/all \
  -H "Authorization: Bearer MANAGER_TOKEN"
```

### Export CSV (Manager)
```bash
curl http://localhost:5000/api/attendance/export \
  -H "Authorization: Bearer MANAGER_TOKEN" \
  -o attendance_report.csv
```

## VS Code REST Client Extension

Install REST Client extension and use this file:

```http
### Health Check
GET http://localhost:5000

### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "New Employee",
  "email": "newemp@test.com",
  "password": "password123",
  "role": "employee",
  "employeeId": "EMP010",
  "department": "Engineering"
}

### Employee Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "alice@test.com",
  "password": "password123"
}

### Manager Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "manager@test.com",
  "password": "password123"
}

### Set token variable (paste your token)
@token = YOUR_JWT_TOKEN_HERE

### Get Current User
GET http://localhost:5000/api/auth/me
Authorization: Bearer {{token}}

### Check In
POST http://localhost:5000/api/attendance/checkin
Authorization: Bearer {{token}}

### Check Out
POST http://localhost:5000/api/attendance/checkout
Authorization: Bearer {{token}}

### Get Today Status
GET http://localhost:5000/api/attendance/today
Authorization: Bearer {{token}}

### Get My History
GET http://localhost:5000/api/attendance/my-history
Authorization: Bearer {{token}}

### Get My Summary
GET http://localhost:5000/api/attendance/my-summary?month=11&year=2023
Authorization: Bearer {{token}}

### Employee Dashboard
GET http://localhost:5000/api/dashboard/employee
Authorization: Bearer {{token}}

### Manager Dashboard
GET http://localhost:5000/api/dashboard/manager
Authorization: Bearer {{token}}

### Get All Attendance
GET http://localhost:5000/api/attendance/all
Authorization: Bearer {{token}}

### Get Today Team Status
GET http://localhost:5000/api/attendance/today-status
Authorization: Bearer {{token}}

### Export CSV
GET http://localhost:5000/api/attendance/export?startDate=2023-11-01&endDate=2023-11-30
Authorization: Bearer {{token}}
```
