require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const email = 'smosina003@gmail.com';
    
    console.log('=== CHECKING MOSINA ACCOUNT ===');
    console.log('Email:', email);
    console.log();
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database!');
      console.log('\nAvailable emails:');
      const allUsers = await User.find().select('email role');
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      process.exit();
    }
    
    console.log('✓ User found');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Employee ID:', user.employeeId);
    console.log('  Department:', user.department);
    console.log('  Password exists:', !!user.password);
    console.log();
    
    // Test common passwords
    console.log('Testing passwords...');
    const passwords = ['123456', 'password', '12345', 'mosina123', 'mosina', 'test123'];
    
    for (const pwd of passwords) {
      const match = await user.matchPassword(pwd);
      if (match) {
        console.log(`✓ PASSWORD FOUND: "${pwd}"`);
        console.log('\nUse these credentials:');
        console.log(`  Email: ${email}`);
        console.log(`  Password: ${pwd}`);
        process.exit();
      }
    }
    
    console.log('❌ None of the common passwords match');
    console.log('\nResetting password to "123456"...');
    user.password = '123456';
    await user.save();
    console.log('✓ Password reset complete!');
    console.log('\nUse these credentials:');
    console.log('  Email: smosina003@gmail.com');
    console.log('  Password: 123456');
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
