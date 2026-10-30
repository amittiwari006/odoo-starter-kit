# 🗄️ Run This SQL in Supabase SQL Editor
# Go to: supabase.com → Your Project → SQL Editor → New Query → Paste & Run

-- 1. PROFILES TABLE (stores user role + name)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL DEFAULT '',
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. REQUESTS TABLE (the core data table)
CREATE TABLE IF NOT EXISTS requests (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'General',
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in-progress','completed','rejected')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT DEFAULT '',
  user_email TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- 4. PROFILES POLICIES
-- Users can read/write their own profile
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- 5. REQUESTS POLICIES
-- Users can read all requests (for admin) and insert their own
CREATE POLICY "Anyone authenticated can read requests" ON requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert own requests" ON requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own requests" ON requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can update ALL requests (for status changes)
CREATE POLICY "Admin can update all requests" ON requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 6. SEED DEMO DATA (optional - shows dashboard immediately)
-- NOTE: Run this AFTER registering at least one user/admin account
-- INSERT INTO requests (title, description, category, priority, status, user_name, user_email, user_id)
-- VALUES 
--   ('Fix broken projector in Room 201', 'The projector bulb has blown. Need urgent replacement.', 'Maintenance', 'High', 'pending', 'Demo User', 'demo@test.com', auth.uid()),
--   ('Request new whiteboard markers', 'Running low on whiteboard markers in lab section B.', 'General', 'Low', 'completed', 'Demo User', 'demo@test.com', auth.uid()),
--   ('Network connectivity issue', 'WiFi drops every 30 minutes in the reading hall.', 'Technical', 'Urgent', 'in-progress', 'Demo User', 'demo@test.com', auth.uid());
