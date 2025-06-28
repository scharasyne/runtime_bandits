-- Credibee Database Setup
-- Run this SQL in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  tax DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tax >= 0),
  total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipts table
CREATE TABLE IF NOT EXISTS receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
  payment_method TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  receipt_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit scores table
CREATE TABLE IF NOT EXISTS credit_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 300 AND score <= 850),
  factors JSONB NOT NULL,
  last_calculated TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Invoices indexes
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Receipts indexes
CREATE INDEX IF NOT EXISTS idx_receipts_user_id ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_category ON receipts(category);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON receipts(created_at);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_is_public ON feedback(is_public);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- Credit scores indexes
CREATE INDEX IF NOT EXISTS idx_credit_scores_user_id ON credit_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_scores_created_at ON credit_scores(created_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Triggers for invoices table
DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Invoices policies
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own invoices" ON invoices;
CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own invoices" ON invoices;
CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own invoices" ON invoices;
CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Receipts policies
DROP POLICY IF EXISTS "Users can view own receipts" ON receipts;
CREATE POLICY "Users can view own receipts"
  ON receipts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own receipts" ON receipts;
CREATE POLICY "Users can insert own receipts"
  ON receipts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own receipts" ON receipts;
CREATE POLICY "Users can update own receipts"
  ON receipts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own receipts" ON receipts;
CREATE POLICY "Users can delete own receipts"
  ON receipts FOR DELETE
  USING (auth.uid() = user_id);

-- Feedback policies
DROP POLICY IF EXISTS "Users can view own feedback" ON feedback;
CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view public feedback" ON feedback;
CREATE POLICY "Anyone can view public feedback"
  ON feedback FOR SELECT
  USING (is_public = true);

DROP POLICY IF EXISTS "Users can insert own feedback" ON feedback;
CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own feedback" ON feedback;
CREATE POLICY "Users can update own feedback"
  ON feedback FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own feedback" ON feedback;
CREATE POLICY "Users can delete own feedback"
  ON feedback FOR DELETE
  USING (auth.uid() = user_id);

-- Credit scores policies
DROP POLICY IF EXISTS "Users can view own credit scores" ON credit_scores;
CREATE POLICY "Users can view own credit scores"
  ON credit_scores FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own credit scores" ON credit_scores;
CREATE POLICY "Users can insert own credit scores"
  ON credit_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own credit scores" ON credit_scores;
CREATE POLICY "Users can update own credit scores"
  ON credit_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to calculate user credit score based on invoices and feedback
CREATE OR REPLACE FUNCTION calculate_credit_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  payment_score INTEGER := 0;
  feedback_score INTEGER := 0;
  invoice_count INTEGER := 0;
  paid_count INTEGER := 0;
  avg_rating DECIMAL := 0;
  final_score INTEGER := 300; -- Base score
BEGIN
  -- Get invoice statistics
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'paid')
  INTO invoice_count, paid_count
  FROM invoices
  WHERE user_id = user_uuid;
  
  -- Calculate payment history score (40% of total)
  IF invoice_count > 0 THEN
    payment_score := ROUND((paid_count::DECIMAL / invoice_count) * 220); -- Max 220 points
  END IF;
  
  -- Get average feedback rating
  SELECT AVG(rating)
  INTO avg_rating
  FROM feedback
  WHERE user_id = user_uuid;
  
  -- Calculate feedback score (30% of total)
  IF avg_rating IS NOT NULL THEN
    feedback_score := ROUND((avg_rating / 5.0) * 165); -- Max 165 points
  END IF;
  
  -- Calculate final score
  final_score := final_score + payment_score + feedback_score;
  
  -- Ensure score is within valid range
  final_score := GREATEST(300, LEAST(850, final_score));
  
  RETURN final_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update credit score automatically
CREATE OR REPLACE FUNCTION update_user_credit_score(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  new_score INTEGER;
  score_factors JSONB;
BEGIN
  -- Calculate new score
  new_score := calculate_credit_score(user_uuid);
  
  -- Create factors JSON
  score_factors := jsonb_build_object(
    'paymentHistory', 40,
    'creditUtilization', 30,
    'lengthOfCreditHistory', 15,
    'newCredit', 10,
    'creditMix', 5
  );
  
  -- Insert new credit score record
  INSERT INTO credit_scores (user_id, score, factors, last_calculated)
  VALUES (user_uuid, new_score, score_factors, NOW());
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (Optional - Remove if not needed)
-- ============================================================================

-- Insert sample categories for receipts (you can modify these)
-- This creates a simple lookup table for common expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO expense_categories (name, description) VALUES
  ('Office Supplies', 'Pens, paper, software licenses, etc.'),
  ('Travel', 'Business travel expenses'),
  ('Meals', 'Business meals and entertainment'),
  ('Marketing', 'Advertising and promotional expenses'),
  ('Equipment', 'Computer hardware, machinery, etc.'),
  ('Utilities', 'Internet, phone, electricity for business'),
  ('Professional Services', 'Legal, accounting, consulting fees'),
  ('Insurance', 'Business insurance premiums'),
  ('Training', 'Professional development and courses'),
  ('Other', 'Miscellaneous business expenses')
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Credibee database setup completed successfully!';
  RAISE NOTICE 'Tables created: users, invoices, receipts, feedback, credit_scores, expense_categories';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'Indexes and triggers configured';
  RAISE NOTICE 'Helper functions created for credit score calculation';
END $$; 