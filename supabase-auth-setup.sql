-- Credibee Authentication Setup
-- Run this SQL in your Supabase SQL editor AFTER running the main supabase-setup.sql

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('receipts', 'receipts', false),
  ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Avatar storage policies
CREATE POLICY "Users can view own avatar" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Receipts storage policies  
CREATE POLICY "Users can view own receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own receipts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own receipts" ON storage.objects
  FOR UPDATE USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own receipts" ON storage.objects
  FOR DELETE USING (bucket_id = 'receipts' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Documents storage policies
CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own documents" ON storage.objects
  FOR UPDATE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own documents" ON storage.objects
  FOR DELETE USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================================
-- FUNCTIONS FOR USER MANAGEMENT
-- ============================================================================

-- Function to handle user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ADDITIONAL RLS POLICIES
-- ============================================================================

-- Allow users to read their own auth data
CREATE POLICY "Users can read own auth data" ON auth.users
  FOR SELECT USING (auth.uid() = id);

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get user profile with additional data
CREATE OR REPLACE FUNCTION get_user_profile(user_id UUID)
RETURNS JSON AS $$
DECLARE
  profile JSON;
BEGIN
  SELECT to_json(u.*) INTO profile
  FROM users u
  WHERE u.id = user_id;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user last seen
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET updated_at = NOW()
  WHERE id = auth.uid();
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- EMAIL TEMPLATES (Optional - for custom auth emails)
-- ============================================================================

-- You can customize these in your Supabase dashboard under Authentication > Templates

/*
Confirmation Email Template:
Subject: Verify your Credibee account
Body:
Kumusta {{ .Name }},

Salamat sa pag-join sa Credibee! Para ma-activate ang inyong account, pakiclick ang link na ito:

{{ .ConfirmationURL }}

Kung hindi ninyo ginawa ang account na ito, pwede ninyong i-ignore ang email na ito.

Salamat,
Credibee Team
*/

/*
Password Reset Template:
Subject: Reset your Credibee password
Body:
Kumusta {{ .Name }},

Nag-request kayo ng password reset para sa inyong Credibee account. Pakiclick ang link na ito para mag-set ng bagong password:

{{ .ConfirmationURL }}

Kung hindi ninyo nirequest ang password reset na ito, pwede ninyong i-ignore ang email na ito.

Salamat,
Credibee Team
*/

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

/*
IMPORTANT SECURITY CONSIDERATIONS:

1. Enable email confirmation in Supabase dashboard:
   - Go to Authentication > Settings
   - Enable "Enable email confirmations"
   - Set confirmation URL to: https://yourdomain.com/auth/callback

2. Configure password requirements:
   - Minimum length: 8 characters
   - Require uppercase, lowercase, numbers, and special characters

3. Set up rate limiting for auth endpoints in your application

4. Enable 2FA for admin accounts

5. Regularly audit user permissions and access logs

6. Consider implementing session timeout for sensitive operations

7. Use environment variables for all sensitive configuration
*/ 