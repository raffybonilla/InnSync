# InnSync Login System - Setup Guide

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Run the development server:**
```bash
npm run dev
```

3. **Access the application:**
   - Home: http://localhost:3000
   - User Login/Register: http://localhost:3000/auth/user
   - User Dashboard: http://localhost:3000/user/dashboard

---

## Features Implemented

### 1. **Database Setup**
- File-based JSON database (no compilation needed)
- Stored in `data/users.json`
- Password hashing with bcryptjs
- Automatic initialization on startup

### 2. **User Authentication**
- **Register:** Users can create new accounts with Full Name, Username, Email, and Password
- **Login:** Users can log in with Username and Password
- **Dashboard:** Redirected to `/user/dashboard` after successful login
- **Logout:** Clear session from localStorage
- Passwords are securely hashed using bcryptjs

---

## File Structure

```
src/
├── app/
│   ├── api/auth/
│   │   └── user/route.ts        # User login/register API
│   ├── auth/
│   │   └── user/page.tsx        # User login/register page
│   ├── user/
│   │   └── dashboard/page.tsx   # User dashboard
│   ├── page.tsx                 # Home page with login link
│   └── layout.tsx
├── lib/
│   ├── db.ts                    # File-based database functions
│   └── auth.ts                  # Password hashing/verification
```

---

## Testing the Application

### Creating a Test User Account

1. Go to http://localhost:3000
2. Click "User Login / Register"
3. Click "Register here" to switch to registration mode
4. Fill in the form:
   - Full Name: John Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: password123
5. Click "Register"
6. You'll see a success message and be returned to login

### Logging in as User

1. Fill in the login form:
   - Username: johndoe
   - Password: password123
2. Click "Sign In"
3. You'll be redirected to the user dashboard

---

## API Endpoints

### User Authentication
**POST** `/api/auth/user`

Login:
```json
{
  "username": "johndoe",
  "password": "password123",
  "action": "login"
}
```

Register:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "action": "register"
}
```

---

## Security Notes

- Passwords are hashed using bcryptjs with salt rounds: 10
- Sessions are stored in cookies (httpOnly: true for security)
- Database file is listed in .gitignore to prevent committing user data
- Consider implementing in the future:
  - JWT tokens for better security
  - Refresh token mechanism
  - Email verification
  - Password reset functionality

---

## Database Location

Users are stored in: `data/users.json` (created automatically on first run)

When you register a user, it's added to this JSON file with a hashed password.

---

## Next Steps

You can now:
1. Add hotel management features
2. Implement booking functionality
3. Add email notifications
4. Create payment integration
5. Add advanced user features
6. Implement user profile management

