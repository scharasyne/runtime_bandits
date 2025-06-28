# Credibee Supabase Integration Setup Guide

This guide will help you set up Supabase for the Credibee application with all the necessary tables, Row Level Security (RLS) policies, and TypeScript integration.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new account or sign in
2. Click "New Project"
3. Choose your organization and enter project details:
   - **Name**: `credibee` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to your users
4. Wait for the project to be created (usually takes 2-3 minutes)

### 2. Get Your Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" to find your credentials:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Anon Key**: Your public API key (safe to use in client-side code)
   - **Service Role Key**: Your private API key (keep this secret)

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 4. Set Up Database Schema

1. In your Supabase project dashboard, go to the SQL Editor
2. Copy the entire contents of `supabase-setup.sql`
3. Paste it into the SQL Editor and click "Run"
4. You should see a success message confirming all tables and policies were created

## 📊 Database Schema

The setup creates the following tables:

### Users Table
- **Purpose**: Store user profile information
- **Fields**: id, email, first_name, last_name, business_name, phone, avatar_url
- **RLS**: Users can only access their own profile

### Invoices Table
- **Purpose**: Store invoice data for billing clients
- **Fields**: invoice_number, client info, amounts, due_date, status
- **RLS**: Users can only access their own invoices
- **Features**: Automatic updated_at timestamp, status validation

### Receipts Table
- **Purpose**: Store expense receipts and transactions
- **Fields**: transaction_id, amount, payment_method, category, description
- **RLS**: Users can only access their own receipts

### Feedback Table
- **Purpose**: Store client feedback and reviews
- **Fields**: client info, rating (1-5), review text, is_public flag
- **RLS**: Users can access their own feedback + anyone can view public feedback

### Credit Scores Table
- **Purpose**: Store calculated credit scores and factors
- **Fields**: score (300-850), factors (JSON), last_calculated timestamp
- **RLS**: Users can only access their own credit scores

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- Public feedback is accessible to everyone
- No unauthorized data access is possible

### Authentication Integration
- Uses Supabase Auth for user management
- Policies are tied to `auth.uid()` for automatic user identification
- Supports email/password authentication out of the box

## 🛠 Usage Examples

### Authentication
```typescript
import { useSupabase } from '@/hooks/useSupabase'

function LoginForm() {
  const { signIn, user, loading } = useSupabase()
  
  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    if (error) {
      console.error('Login failed:', error)
    }
  }
  
  if (loading) return <div>Loading...</div>
  if (user) return <div>Welcome, {user.email}!</div>
  
  // Render login form...
}
```

### Database Operations
```typescript
import { createInvoice, getInvoices } from '@/lib/database'

// Create a new invoice
const newInvoice = await createInvoice({
  user_id: user.id,
  invoice_number: 'INV-001',
  client_name: 'John Doe',
  client_email: 'john@example.com',
  amount: 100.00,
  tax: 10.00,
  total: 110.00,
  due_date: '2024-02-01',
  status: 'pending'
})

// Get all invoices for the current user
const invoices = await getInvoices(user.id)
```

### Credit Score Calculation
```typescript
import { getLatestCreditScore } from '@/lib/database'

// Get user's latest credit score
const creditScore = await getLatestCreditScore(user.id)
console.log(`Credit Score: ${creditScore?.score}`)
```

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── database.ts          # Database utility functions
├── types/
│   └── database.ts          # TypeScript types for all tables
├── hooks/
│   └── useSupabase.ts       # React hook for authentication
└── ...
```

## 🔧 Advanced Configuration

### Custom Policies
You can add custom RLS policies in the SQL editor:

```sql
-- Allow managers to view all invoices in their organization
CREATE POLICY "Managers can view org invoices"
  ON invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'manager'
    )
  );
```

### Database Functions
The setup includes helper functions:

- `calculate_credit_score(user_uuid)`: Calculates credit score based on payment history
- `update_user_credit_score(user_uuid)`: Updates credit score record

### Real-time Subscriptions
Enable real-time updates for any table:

```typescript
import { supabase } from '@/lib/supabase'

// Listen for invoice changes
const subscription = supabase
  .channel('invoices')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'invoices' },
    (payload) => {
      console.log('Invoice changed:', payload)
    }
  )
  .subscribe()
```

## 🚨 Troubleshooting

### Common Issues

1. **RLS Policies Blocking Access**
   - Ensure you're authenticated: `supabase.auth.getUser()`
   - Check that policies match your use case
   - Test policies in the Supabase dashboard

2. **Environment Variables Not Loading**
   - Ensure `.env.local` is in your project root
   - Restart your development server after changes
   - Check that variables start with `NEXT_PUBLIC_` for client-side access

3. **Database Connection Issues**
   - Verify your project URL and keys are correct
   - Check if your Supabase project is paused (free tier limitation)
   - Ensure your network allows connections to Supabase

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 🎯 Next Steps

1. **Set up Authentication UI**: Create login/signup forms using the provided hooks
2. **Implement Dashboard**: Use the database functions to build user dashboards
3. **Add File Storage**: Configure Supabase Storage for receipt images
4. **Enable Real-time**: Add subscriptions for live updates
5. **Deploy**: Configure environment variables in your production environment

## 📈 Monitoring

Monitor your database usage in the Supabase dashboard:
- **Database**: Check table sizes and query performance
- **Auth**: Monitor user signups and authentication events
- **API**: Track API usage and response times
- **Logs**: Review database logs for errors or performance issues 