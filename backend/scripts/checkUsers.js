require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    const users = await User.find().select('-password');
    
    console.log('\n=== USERS IN DATABASE ===\n');
    users.forEach((user, i) => {
      console.log(`${i + 1}. Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Employee ID: ${user.employeeId}`);
      console.log(`   Department: ${user.department}\n`);
    });
    
    console.log(`Total Users: ${users.length}`);
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
