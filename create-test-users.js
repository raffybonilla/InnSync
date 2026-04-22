const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Replace these with your actual Supabase project details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

if (!serviceRoleKey || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTestUsers() {
  try {
    console.log('Creating test users...');

    // Create Admin User
    const adminResult = await supabase.auth.admin.createUser({
      email: 'admin@innsync.com',
      password: 'AdminPass123!',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'System Administrator',
        username: 'admin'
      }
    });

    if (adminResult.error) {
      console.error('Error creating admin user:', adminResult.error);
    } else {
      console.log('✅ Admin user created successfully');
    }

    // Create Manager User
    const managerResult = await supabase.auth.admin.createUser({
      email: 'manager@innsync.com',
      password: 'ManagerPass123!',
      email_confirm: true,
      user_metadata: {
        role: 'staff',  // Changed to staff role
        full_name: 'Hotel Manager',
        username: 'manager'
      }
    });

    if (managerResult.error) {
      console.error('Error creating manager user:', managerResult.error);
    } else {
      console.log('✅ Manager user created successfully');
    }

    // Create Staff User
    const staffResult = await supabase.auth.admin.createUser({
      email: 'staff@innsync.com',
      password: 'StaffPass123!',
      email_confirm: true,
      user_metadata: {
        role: 'staff',
        full_name: 'Hotel Staff',
        username: 'staff'
      }
    });

    if (staffResult.error) {
      console.error('Error creating staff user:', staffResult.error);
    } else {
      console.log('✅ Staff user created successfully');
    }

    // Create Regular User
    const userResult = await supabase.auth.admin.createUser({
      email: 'user@innsync.com',
      password: 'UserPass123!',
      email_confirm: true,
      user_metadata: {
        role: 'user',
        full_name: 'Regular User',
        username: 'user'
      }
    });

    if (userResult.error) {
      console.error('Error creating user:', userResult.error);
    } else {
      console.log('✅ Regular user created successfully');
    }

    console.log('\nTest users created! You can now login with:');
    console.log('Admin: admin@innsync.com / AdminPass123!');
    console.log('Manager: manager@innsync.com / ManagerPass123!');
    console.log('Staff: staff@innsync.com / StaffPass123!');
    console.log('User: user@innsync.com / UserPass123!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTestUsers();
