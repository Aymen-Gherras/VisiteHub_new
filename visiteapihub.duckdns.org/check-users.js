const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'exped360',
    user: 'postgres',
    password: 'postgres'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check users table
    const usersResult = await client.query('SELECT id, email, "firstName", "lastName", type FROM users');
    console.log('\nUsers in database:');
    usersResult.rows.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Type: ${user.type}`);
    });

    // Check if admin user exists
    const adminResult = await client.query('SELECT * FROM users WHERE email = $1', ['admin@exped360.com']);
    if (adminResult.rows.length > 0) {
      console.log('\nAdmin user found:');
      console.log(adminResult.rows[0]);
    } else {
      console.log('\nNo admin user found with email: admin@exped360.com');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();
