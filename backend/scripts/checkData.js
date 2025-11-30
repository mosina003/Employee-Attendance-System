const mongoose = require('mongoose');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB\n');

    // Check users
    const users = await User.find({});
    console.log(`Total users: ${users.length}`);
    console.log('Users breakdown:');
    const managers = users.filter(u => u.role === 'manager');
    const employees = users.filter(u => u.role === 'employee');
    console.log(`  Managers: ${managers.length}`);
    console.log(`  Employees: ${employees.length}\n`);

    // Check attendance records
    const attendance = await Attendance.find({});
    console.log(`Total attendance records: ${attendance.length}`);
    
    if (attendance.length > 0) {
      const statusBreakdown = {
        present: attendance.filter(a => a.status === 'present').length,
        late: attendance.filter(a => a.status === 'late').length,
        'half-day': attendance.filter(a => a.status === 'half-day').length,
        absent: attendance.filter(a => a.status === 'absent').length,
      };
      
      console.log('Status breakdown:');
      console.log(`  Present: ${statusBreakdown.present}`);
      console.log(`  Late: ${statusBreakdown.late}`);
      console.log(`  Half-day: ${statusBreakdown['half-day']}`);
      console.log(`  Absent: ${statusBreakdown.absent}\n`);

      // Get date range
      const dates = attendance.map(a => new Date(a.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      console.log('Date range:');
      console.log(`  From: ${minDate.toLocaleDateString()}`);
      console.log(`  To: ${maxDate.toLocaleDateString()}\n`);
      
      // Check recent records
      console.log('Most recent 5 records:');
      const recent = await Attendance.find({})
        .populate('userId', 'name employeeId')
        .sort({ date: -1 })
        .limit(5);
      
      recent.forEach(r => {
        console.log(`  ${new Date(r.date).toLocaleDateString()} - ${r.userId?.name || 'Unknown'} (${r.userId?.employeeId || 'N/A'}) - ${r.status}`);
      });
    } else {
      console.log('No attendance records found in database!');
    }

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
  });
