const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...\n');
    console.log('URL: http://localhost:5000/api/auth/login');
    console.log('Email: smosina003@gmail.com');
    console.log('Password: password\n');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'smosina003@gmail.com',
      password: 'password'
    });
    
    console.log('✓ LOGIN SUCCESSFUL!\n');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.role) {
      console.log('\n=== USER DETAILS ===');
      console.log('Role:', response.data.role);
      console.log('Name:', response.data.name);
      console.log('Email:', response.data.email);
      console.log('Token exists:', !!response.data.token);
    }
    
  } catch (error) {
    console.log('❌ LOGIN FAILED!\n');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error message:', error.response.data?.message || error.response.data);
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Is the backend server running on port 5000?');
    } else {
      console.log('Error:', error.message);
    }
  }
}

testLogin();
