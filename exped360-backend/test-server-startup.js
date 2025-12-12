/**
 * Test script to verify server can start without TypeORM errors
 * Run with: node test-server-startup.js
 */

const { spawn } = require('child_process');
const path = require('path');

async function testServerStartup() {
  console.log('🧪 Testing Server Startup...\n');

  return new Promise((resolve, reject) => {
    console.log('📋 Starting NestJS server...');
    
    // Start the server process
    const serverProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    let hasError = false;
    let hasSuccess = false;

    // Capture stdout
    serverProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text.trim());

      // Check for success indicators
      if (text.includes('Nest application successfully started')) {
        hasSuccess = true;
        console.log('\n✅ Server started successfully!');
        serverProcess.kill();
        resolve(true);
      }
    });

    // Capture stderr
    serverProcess.stderr.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.error(text.trim());

      // Check for specific errors
      if (text.includes('Duplicate key name')) {
        hasError = true;
        console.log('\n❌ Duplicate index error still exists!');
        serverProcess.kill();
        reject(new Error('Duplicate index error'));
      }

      if (text.includes('Index contains column that is missing')) {
        hasError = true;
        console.log('\n❌ Missing column error still exists!');
        serverProcess.kill();
        reject(new Error('Missing column error'));
      }

      if (text.includes('Unable to connect to the database')) {
        console.log('\n⚠️  Database connection issue (expected if DB not set up)');
      }
    });

    // Handle process exit
    serverProcess.on('close', (code) => {
      if (!hasSuccess && !hasError) {
        if (code === 0) {
          console.log('\n✅ Server process completed without errors');
          resolve(true);
        } else {
          console.log(`\n❌ Server process exited with code ${code}`);
          reject(new Error(`Process exited with code ${code}`));
        }
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!hasSuccess && !hasError) {
        console.log('\n⏰ Test timeout - killing server process');
        serverProcess.kill();
        
        // Check if we got past the TypeORM errors
        if (output.includes('TypeOrmModule dependencies initialized') && 
            !output.includes('Duplicate key name') && 
            !output.includes('Index contains column that is missing')) {
          console.log('\n✅ TypeORM errors are fixed! (Database connection may be the only issue)');
          resolve(true);
        } else {
          reject(new Error('Test timeout'));
        }
      }
    }, 30000);
  });
}

// Run the test
testServerStartup()
  .then(() => {
    console.log('\n🎉 Server startup test completed successfully!');
    console.log('✅ TypeORM duplicate index error is FIXED');
    console.log('\n📝 Next steps:');
    console.log('  1. Set up your database connection');
    console.log('  2. Run the migration scripts');
    console.log('  3. Start the server: npm run start:dev');
    console.log('  4. Test admin pages: /admin/promoteurs and /admin/agences');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Server startup test failed:', error.message);
    console.log('\n💡 If you see database connection errors, that\'s normal.');
    console.log('💡 The important thing is that TypeORM duplicate index errors are gone.');
    process.exit(1);
  });
