require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    // Simulate the exact login flow
    const email = 'steve@gmail.com';
    const password = '123456';
    
    console.log('=== SIMULATING LOGIN REQUEST ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log();
    
    // Step 1: Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      process.exit();
    }
    
    console.log('✓ User found in database');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Employee ID:', user.employeeId);
    console.log();
    
    // Step 2: Check password
    const isPasswordMatch = await user.matchPassword(password);
    console.log('Password match:', isPasswordMatch);
    
    if (!isPasswordMatch) {
      console.log('❌ Password does not match');
      console.log('\nTrying other passwords...');
      
      const passwords = ['password', '12345', '123', 'test123', 'steve', 'steve123'];
      for (const pwd of passwords) {
        const match = await user.matchPassword(pwd);
        if (match) {
          console.log(`✓ Found matching password: "${pwd}"`);
          break;
        }
      }
      process.exit();
    }
    
    console.log('✓ Password matches');
    console.log();
    
    // Step 3: Check what response would be sent
    console.log('=== RESPONSE THAT WOULD BE SENT ===');
    console.log({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      department: user.department
    });
    
    console.log();
    console.log('=== FRONTEND CHECK ===');
    if (user.role === 'employee') {
      console.log('✓ User role is "employee" - should navigate to /employee/dashboard');
    } else {
      console.log('❌ User role is NOT "employee" - will show error: "Please use the manager login page"');
      console.log('   Actual role:', user.role);
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
