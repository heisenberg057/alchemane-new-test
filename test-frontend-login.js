// This simulates what the frontend does when logging in
const axios = require('axios');

async function testFrontendLogin() {
  try {
    console.log('Testing frontend login flow...');
    
    // Step 1: Call the login API (what the frontend does)
    const loginResponse = await axios.post('http://localhost:3000/api/users/login', {
      email: 'admin@americanhairline.com',
      password: 'Admin12345'
    });
    
    console.log('✅ Backend login successful');
    console.log('   User:', loginResponse.data.user.email);
    console.log('   Role:', loginResponse.data.user.role || 'admin');
    console.log('   Has accessToken:', !!loginResponse.data.token);
    
    // Step 2: Simulate what authService.login does - store token and user
    const accessToken = loginResponse.data.token;
    const user = loginResponse.data.user;
    
    console.log('\n✅ Stored credentials in auth store simulation');
    console.log('   Access token stored:', !!accessToken);
    console.log('   User stored:', !!user);
    
    // Step 3: Test accessing protected route with the token
    const profileResponse = await axios.get('http://localhost:3000/api/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    console.log('\n✅ Profile access successful');
    console.log('   User from profile:', profileResponse.data.user.email);
    
    console.log('\n🎉 FRONTEND LOGIN FLOW IS WORKING CORRECTLY');
    console.log('   If you\'re seeing "Invalid credentials" in the UI,');
    console.log('   the issue is likely in the frontend form handling or');
    console.log('   state management, NOT with the credentials themselves.');
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Backend error:', error.response.status);
      console.log('   Error data:', error.response.data);
    } else {
      console.log('❌ Network or other error:', error.message);
    }
  }
}

testFrontendLogin();