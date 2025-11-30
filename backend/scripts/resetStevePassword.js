require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');
    
    const steve = await User.findOne({ email: 'steve@gmail.com' });
    
    if (steve) {
      console.log('Found Steve account');
      console.log('Current role:', steve.role);
      
      // Reset password to '123456'
      steve.password = '123456';
      await steve.save();
      
      console.log('✓ Password reset to: 123456');
      console.log('✓ You can now login with:');
      console.log('  Email: steve@gmail.com');
      console.log('  Password: 123456');
    } else {
      console.log('Steve account not found!');
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
