// Debug exactly what NextAuth's authorize function does
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function debugNextAuthAuthorize() {
  try {
    console.log('=== Debugging NextAuth Authorize Function ===');
    
    // Simulate the exact credentials
    const credentials = {
      email: 'admin@americanhairline.com',
      password: 'Admin12345'
    };
    
    console.log('Credentials:', credentials);
    
    // Determine API URL exactly as in auth.ts
    const apiUrl =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:3000/api';
      
    console.log('API URL:', apiUrl);
    
    // Make the exact same call
    const res = await axios.post(
      `${apiUrl}/users/login`,
      {
        email: credentials.email,
        password: credentials.password,
      },
      { timeout: 15000 }
    );

    console.log('✅ Backend Response:');
    console.log('   Status:', res.status);
    console.log('   Success:', res.data.success);
    
    const user = res.data?.user || res.data?.data?.user;
    const token = res.data?.token || res.data?.data?.accessToken;
    const refreshToken = res.data?.refreshToken || res.data?.data?.refreshToken;
    
    console.log('   User:', user ? `${user.email} (${user.role})` : 'null');
    console.log('   Access Token:', token ? 'present' : 'null');
    console.log('   Refresh Token:', refreshToken ? 'present' : 'null');
    
    // This is what our authorize function returns
    if (user && token) {
      // Check if user is admin (exact copy from auth.ts)
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        console.log('❌ AUTHORIZATION FAILED: User role not authorized');
        console.log('   User role:', user.role);
        console.log('   Required: ADMIN or SUPER_ADMIN');
        return null;
      }
      
      const authUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accessToken: token,
        refreshToken,
      };
      
      console.log('✅ AUTHORIZATION SUCCESS:');
      console.log('   Returning user object:', JSON.stringify(authUser, null, 2));
      return authUser;
    }
    
    console.log('❌ AUTHORIZATION FAILED: No user or token');
    return null;
    
  } catch (error) {
    console.log('❌ AUTHORIZATION ERROR:');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Data:', error.response.data);
    } else if (error.request) {
      console.log('   No response received');
    } else {
      console.log('   Error:', error.message);
    }
    return null;
  }
}

// Run the debug
debugNextAuthAuthorize().then(result => {
  console.log('\n=== FINAL RESULT ===');
  console.log('NextAuth authorize would return:', result ? 'VALID USER OBJECT' : 'NULL (would cause "Invalid credentials")');
});