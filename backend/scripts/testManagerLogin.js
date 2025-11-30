const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');

    const email = 'manager@gmail.com';
    const password = 'password';

    console.log('=== TESTING LOGIN FOR ===');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log();

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found!');
      const allUsers = await User.find({});
      console.log('\nAll users in database:');
      allUsers.forEach(u => console.log(`  - ${u.email} (${u.role})`));
      mongoose.connection.close();
      return;
    }

    console.log('✅ User found:');
    console.log('  Name:', user.name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Employee ID:', user.employeeId);
    console.log('  Password exists:', !!user.password);
    console.log('  Password length:', user.password ? user.password.length : 0);
    console.log('  Password value:', user.password);
    console.log();

    // Test password
    console.log('Testing password match...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? '✅ YES' : '❌ NO');

    if (!isMatch) {
      console.log('\nTrying other common passwords:');
      const testPasswords = ['password', 'password123', '123456', 'admin', 'manager'];
      for (const pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, user.password);
        if (match) {
          console.log(`✅ FOUND: "${pwd}"`);
          break;
        }
      }
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
