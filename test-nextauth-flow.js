// Test the NextAuth credentials flow
const axios = require('axios');

async function testNextAuthFlow() {
  try {
    console.log('Testing NextAuth credentials flow...');
    
    // This is what NextAuth does in the authorize function
    const apiUrl = 'http://localhost:3000/api';
    
    console.log(`Calling: ${apiUrl}/users/login`);
    
    const res = await axios.post(
      `${apiUrl}/users/login`,
      {
        email: 'admin@americanhairline.com',
        password: 'Admin12345'
      },
      { timeout: 15000 }
    );

    console.log('✅ Backend response received');
    console.log('   Status:', res.status);
    console.log('   Success:', res.data.success);
    
    const user = res.data?.user || res.data?.data?.user;
    const token = res.data?.token || res.data?.data?.accessToken;
    
    console.log('   User:', user ? user.email : 'null');
    console.log('   Token:', token ? 'present' : 'null');
    console.log('   Role:', user ? user.role : 'null');
    
    if (user && token) {
      // Check if user is admin (this is what NextAuth does)
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        console.log('❌ User is not authorized (not ADMIN or SUPER_ADMIN)');
        return;
      }
      
      console.log('✅ User is authorized as admin');
      
      // This is what NextAuth would return
      const nextAuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accessToken: token,
        refreshToken: res.data?.refreshToken || res.data?.data?.refreshToken || null
      };
      
      console.log('\n🎉 NextAuth would successfully authenticate this user');
      console.log('   NextAuth user object:', JSON.stringify(nextAuthUser, null, 2));
    } else {
      console.log('❌ Invalid user or token from backend');
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Backend error:', error.response.status);
      console.log('   Error data:', error.response.data);
    } else if (error.request) {
      console.log('❌ No response received:', error.message);
    } else {
      console.log('❌ Error setting up request:', error.message);
    }
  }
}

testNextAuthFlow();