require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const steve = await User.findOne({ email: 'steve@gmail.com' }).select('+password');
    
    if (steve) {
      console.log('=== STEVE ACCOUNT DETAILS ===');
      console.log('Name:', steve.name);
      console.log('Email:', steve.email);
      console.log('Role:', steve.role);
      console.log('Employee ID:', steve.employeeId);
      console.log('Department:', steve.department);
      console.log('Created At:', steve.createdAt);
      console.log('Password exists:', !!steve.password);
      console.log('\nTrying to match password "123456"...');
      
      const isMatch = await steve.matchPassword('123456');
      console.log('Password "123456" matches:', isMatch);
      
      if (!isMatch) {
        console.log('\nTrying other common passwords...');
        const commonPasswords = ['password', '12345', '123', 'steve123', 'steve', 'test123'];
        for (const pwd of commonPasswords) {
          const match = await steve.matchPassword(pwd);
          if (match) {
            console.log(`✓ Password "${pwd}" matches!`);
            break;
          }
        }
      }
    } else {
      console.log('Steve account not found!');
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
