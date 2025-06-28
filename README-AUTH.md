# Credibee Authentication System

This document outlines the comprehensive authentication system implemented for Credibee using Supabase Auth.

## Features

### 🔐 Authentication
- **Email/Password Authentication** with secure validation
- **Email Confirmation** workflow for new users
- **Password Reset** functionality via email
- **Session Management** with automatic token refresh
- **Protected Routes** with middleware
- **Role-based Access Control** with Row Level Security (RLS)

### 👤 User Management
- **Automatic Profile Creation** after registration
- **Profile Updates** with business information
- **Avatar Upload** to Supabase Storage
- **Session Persistence** across browser tabs
- **Automatic Logout** on token expiry

### 🌏 Filipino-Friendly Features
- **Bilingual UI** with Filipino error messages
- **Philippine Phone Number** validation
- **Local Business Fields** (business name, etc.)
- **Cultural UX Patterns** optimized for Filipino users

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Main authentication context
├── hooks/
│   ├── useAuth.ts              # Authentication hooks
│   └── useSupabase.ts          # Supabase utilities
├── lib/
│   ├── supabase.ts             # Supabase client configuration
│   ├── supabase-storage.ts     # File upload utilities
│   └── validations/
│       └── auth.ts             # Zod validation schemas
├── components/
│   ├── ProfileManager.tsx      # Profile management component
│   └── ui/                     # Reusable UI components
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── callback/
│   └── (root)/
│       └── profile/            # Protected profile page
└── middleware.ts               # Route protection middleware
```

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Database Setup

Run the SQL scripts in your Supabase SQL editor:

1. First run `supabase-setup.sql` to create tables and basic policies
2. Then run `supabase-auth-setup.sql` to set up authentication and storage

### 3. Supabase Dashboard Configuration

#### Authentication Settings
1. Go to **Authentication > Settings**
2. Enable **Email confirmations**
3. Set **Site URL**: `http://localhost:3000` (development) or your production URL
4. Set **Redirect URLs**: 
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

#### Email Templates
1. Go to **Authentication > Email Templates**
2. Customize the templates with Filipino-friendly content (see `supabase-auth-setup.sql` for examples)

#### Storage Setup
1. Go to **Storage**
2. Verify that the following buckets are created:
   - `avatars` (public)
   - `receipts` (private)
   - `documents` (private)

### 4. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install @hookform/resolvers react-hook-form zod
npm install lucide-react
```

## Usage Examples

### Basic Authentication

```tsx
import { useAuth } from '@/contexts/AuthContext'

function LoginExample() {
  const { signIn, user, loading } = useAuth()

  const handleLogin = async () => {
    try {
      await signIn('user@example.com', 'password')
      // User will be redirected automatically
    } catch (error) {
      console.error('Login failed:', error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (user) return <div>Welcome, {user.email}!</div>

  return <button onClick={handleLogin}>Login</button>
}
```

### Protected Routes

```tsx
import { useRequireAuth } from '@/hooks/useAuth'

function ProtectedPage() {
  const { user, loading } = useRequireAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return null // Will redirect to login

  return <div>Protected content for {user.email}</div>
}
```

### Profile Management

```tsx
import ProfileManager from '@/components/ProfileManager'

function ProfilePage() {
  return (
    <div>
      <h1>Profile Settings</h1>
      <ProfileManager />
    </div>
  )
}
```

## Authentication Flow

### Registration Flow
1. User fills registration form with validation
2. Supabase sends confirmation email
3. User clicks email link → `/auth/callback`
4. Account is confirmed → redirected to dashboard
5. User profile is automatically created in database

### Login Flow
1. User enters email/password
2. Supabase validates credentials
3. Session is created and stored
4. User is redirected to dashboard or intended page

### Password Reset Flow
1. User requests password reset
2. Supabase sends reset email
3. User clicks email link → `/auth/callback?type=recovery`
4. User is redirected to reset password page
5. New password is set via Supabase Auth

## Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Automatic user ID matching in all queries
- Storage files are protected by user ownership

### Validation
- Strong password requirements (8+ chars, mixed case, numbers, special chars)
- Philippine phone number format validation
- File upload validation (size, type)
- Form validation with Zod schemas

### Session Management
- Automatic token refresh
- Session persistence across tabs
- Secure cookie handling
- Automatic logout on expiry

## Error Handling

The system includes comprehensive error handling with Filipino-friendly messages:

```tsx
// Example error messages
const errors = {
  'Invalid login credentials': 'Mali ang email o password',
  'Email already registered': 'Ginagamit na ang email na ito',
  'Password too weak': 'Mahina ang password. Mag-lagay ng mas mahaba',
}
```

## File Upload System

### Avatar Upload
- Automatic file validation
- Optimized for profile pictures
- Public access URLs
- User-scoped storage paths

```tsx
// Example usage
const uploadAvatar = async (file: File) => {
  const { url, error } = await uploadFile('avatars', file, user.id)
  if (!error) {
    await updateProfile({ avatar_url: url })
  }
}
```

## Mobile Optimization

The authentication system is optimized for mobile devices:
- Responsive design for all screen sizes
- Touch-friendly form elements
- Optimized keyboard layouts
- Fast loading with minimal JavaScript

## Troubleshooting

### Common Issues

1. **Email not received**
   - Check spam folder
   - Verify email template configuration
   - Check Supabase logs

2. **Session not persisting**
   - Verify cookie settings
   - Check domain configuration
   - Clear browser storage

3. **RLS policy errors**
   - Verify user is authenticated
   - Check policy conditions
   - Review Supabase logs

4. **File upload failures**
   - Check bucket permissions
   - Verify file size limits
   - Check storage policies

### Debug Tips

```tsx
// Add this to debug authentication state
const { user, session } = useAuth()
console.log('User:', user)
console.log('Session:', session)
console.log('Is authenticated:', !!user)
```

## Contributing

When contributing to the authentication system:

1. Follow TypeScript best practices
2. Add proper error handling
3. Include Filipino translations
4. Test on mobile devices
5. Update this documentation
6. Add proper test coverage

## Security Considerations

- Never expose service role keys in client code
- Validate all user input on both client and server
- Use environment variables for sensitive data
- Regularly audit user permissions
- Monitor authentication logs
- Keep dependencies updated
- Use HTTPS in production

## Support

For issues with the authentication system:
1. Check Supabase dashboard logs
2. Review this documentation
3. Check common troubleshooting steps
4. Contact the development team

---

Built with ❤️ for Filipino businesses using Supabase, Next.js, and TypeScript. 