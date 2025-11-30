require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const connectDB = require('../config/db');

// Sample data
const users = [
  {
    name: 'John Manager',
    email: 'manager@test.com',
    password: 'password123',
    role: 'manager',
    employeeId: 'MGR001',
    department: 'Management'
  },
  {
    name: 'Manager',
    email: 'manager@gmail.com',
    password: 'password',
    role: 'manager',
    employeeId: 'MGR002',
    department: 'Management'
  },
  {
    name: 'Alice Johnson',
    email: 'alice@test.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP001',
    department: 'Engineering'
  },
  {
    name: 'Bob Smith',
    email: 'bob@test.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP002',
    department: 'Engineering'
  },
  {
    name: 'Carol Williams',
    email: 'carol@test.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP003',
    department: 'Sales'
  },
  {
    name: 'David Brown',
    email: 'david@test.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP004',
    department: 'Sales'
  },
  {
    name: 'Emma Davis',
    email: 'emma@test.com',
    password: 'password123',
    role: 'employee',
    employeeId: 'EMP005',
    department: 'HR'
  },
  {
    name: 'Mosina',
    email: 'smosina003@gmail.com',
    password: 'password',
    role: 'employee',
    employeeId: 'MK123',
    department: 'Engineering'
  },
  {
    name: 'steve',
    email: 'steve@gmail.com',
    password: '123456',
    role: 'employee',
    employeeId: 'SH123',
    department: 'Sales'
  }
];

// Function to generate attendance for last 30 days
const generateAttendance = (userId) => {
  const attendance = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Random chance to be absent (10% chance)
    if (Math.random() < 0.1) continue;
    
    // Random check-in time between 8:30 AM and 10:00 AM
    const checkInHour = 8 + Math.floor(Math.random() * 2);
    const checkInMinute = Math.floor(Math.random() * 60);
    const checkInTime = new Date(date);
    checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
    
    // Random check-out time between 5:00 PM and 7:00 PM
    const checkOutHour = 17 + Math.floor(Math.random() * 3);
    const checkOutMinute = Math.floor(Math.random() * 60);
    const checkOutTime = new Date(date);
    checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);
    
    // Calculate total hours
    const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    // Determine status
    let status = 'present';
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 30)) {
      status = 'late';
    }
    if (totalHours < 4) {
      status = 'half-day';
    }
    
    attendance.push({
      userId,
      date,
      checkInTime,
      checkOutTime,
      status,
      totalHours: parseFloat(totalHours.toFixed(2))
    });
  }
  
  return attendance;
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Attendance.deleteMany({});
    
    console.log('👥 Creating users...');
    // Hash passwords before insertion
    const usersWithHashedPasswords = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    const createdUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`✅ ${createdUsers.length} users created`);
    
    console.log('📅 Generating attendance records...');
    const allAttendance = [];
    
    // Generate attendance for employees only (not manager)
    const employees = createdUsers.filter(user => user.role === 'employee');
    
    for (const employee of employees) {
      const attendance = generateAttendance(employee._id);
      allAttendance.push(...attendance);
    }
    
    await Attendance.insertMany(allAttendance);
    console.log(`✅ ${allAttendance.length} attendance records created`);
    
    console.log('\n🎉 Seed data created successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Manager:');
    console.log('  Email: manager@test.com');
    console.log('  Password: password123');
    console.log('\nEmployees:');
    console.log('  Email: alice@test.com');
    console.log('  Email: bob@test.com');
    console.log('  Email: carol@test.com');
    console.log('  Email: david@test.com');
    console.log('  Email: emma@test.com');
    console.log('  Password (all): password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
