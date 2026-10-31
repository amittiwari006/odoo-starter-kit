-- ==============================================================================
-- BRIGHTLOOP SOFTWARE - SUBSCRIPTION MANAGEMENT SYSTEM (ODOO HACKATHON 2026)
-- Complete Production Database Schema & Seed Data for Supabase (PostgreSQL)
-- Team: Amit Tiwari (Admin), Utkarsh (Staff), Shiwanshi (Staff), Aakriti (Finance)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  company_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS & VARIANTS (PDF Scene 2)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Software' CHECK (type IN ('Software', 'Add-on', 'Service', 'Hardware')),
  sales_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  attribute_name TEXT NOT NULL DEFAULT 'Brand',
  attribute_value TEXT NOT NULL,
  price_extra NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- e.g. +560 for Odoo Brand
  sku TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SUBSCRIPTION PLANS (PDF Scene 2)
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  billing_interval TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('daily', 'weekly', 'monthly', 'yearly')),
  min_quantity INTEGER NOT NULL DEFAULT 1,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  -- Plan Lifecycle Rules
  auto_close_on_expiry BOOLEAN DEFAULT TRUE,
  allow_early_close BOOLEAN DEFAULT TRUE,
  allow_pause BOOLEAN DEFAULT TRUE,
  allow_renew BOOLEAN DEFAULT TRUE,
  notes TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUOTATION TEMPLATES (PDF Scene 3)
CREATE TABLE IF NOT EXISTS quotation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
  plan_name TEXT NOT NULL DEFAULT '',
  validity_days INTEGER NOT NULL DEFAULT 15,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quotation_template_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES quotation_templates(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_name TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- 6. TAX RULES (PDF Scene 4)
CREATE TABLE IF NOT EXISTS taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rate NUMERIC(6, 2) NOT NULL DEFAULT 18.00,
  type TEXT DEFAULT 'percent' CHECK (type IN ('percent', 'fixed')),
  is_default BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DISCOUNT RULES (PDF Scene 5: Admin only)
CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'percent' CHECK (type IN ('percent', 'fixed')),
  value NUMERIC(12, 2) NOT NULL,
  min_purchase_amount NUMERIC(12, 2) DEFAULT 0.00,
  min_quantity INTEGER DEFAULT 0,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL,
  max_usage_limit INTEGER NOT NULL DEFAULT 100,
  current_usage_count INTEGER NOT NULL DEFAULT 0,
  scope TEXT NOT NULL DEFAULT 'whole_subscription' CHECK (scope IN ('whole_subscription', 'specific_product')),
  target_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  target_product_name TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT DEFAULT 'amit@brightloop.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUBSCRIPTIONS (PDF Scene 3 & 4)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'quotation', 'confirmed', 'active', 'paused', 'closed')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE NOT NULL,
  next_billing_date DATE NOT NULL,
  last_billed_date DATE,
  payment_terms TEXT NOT NULL DEFAULT 'net30' CHECK (payment_terms IN ('immediate', 'net15', 'net30', 'net60')),
  applied_discount_id UUID REFERENCES discounts(id) ON DELETE SET NULL,
  applied_discount_code TEXT DEFAULT '',
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  notes TEXT DEFAULT '',
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_name TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_rate NUMERIC(6, 2) NOT NULL DEFAULT 18.00,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- 9. INVOICES (PDF Scene 4)
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  subscription_number TEXT NOT NULL DEFAULT '',
  customer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'paid', 'cancelled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  amount_paid NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  amount_due NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  payment_terms TEXT NOT NULL DEFAULT 'net30',
  notes TEXT DEFAULT '',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  variant_name TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  tax_rate NUMERIC(6, 2) NOT NULL DEFAULT 18.00,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  line_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00
);

-- 10. PAYMENTS (PDF Scene 6)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT UNIQUE NOT NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Bank Transfer', 'Credit Card', 'Cash', 'UPI', 'Cheque')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_note TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. AUDIT & ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. HIGH PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_subs_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subs_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subs_next_billing ON subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_invoices_customer ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);

-- 13. ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 14. SAFE POLICY CLEANUP (Avoids Error 42710 "policy already exists")
DROP POLICY IF EXISTS "Public profiles can read own" ON profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;
DROP POLICY IF EXISTS "Public products viewable" ON products;
DROP POLICY IF EXISTS "Public plans viewable" ON subscription_plans;
DROP POLICY IF EXISTS "Allow authenticated read subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Allow authenticated read invoices" ON invoices;
DROP POLICY IF EXISTS "Allow insert update for authenticated" ON subscriptions;
DROP POLICY IF EXISTS "Allow insert update for invoices" ON invoices;
DROP POLICY IF EXISTS "Allow payments recording" ON payments;

-- CREATE CLEAN POLICIES
CREATE POLICY "Public profiles can read own" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (true);
CREATE POLICY "Public products viewable" ON products FOR SELECT USING (true);
CREATE POLICY "Public plans viewable" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow insert update for authenticated" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow insert update for invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow payments recording" ON payments FOR ALL USING (true);

-- ==============================================================================
-- 15. REALISTIC SEED DATA (Amit, Utkarsh, Shiwanshi, Aakriti & Indian Customers)
-- ==============================================================================

-- Team Members & Customers
INSERT INTO profiles (id, email, full_name, role, company_name, phone)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'amit@brightloop.com', 'Amit Tiwari', 'admin', 'Brightloop HQ', '+91 98765 43210'),
  ('a0000000-0000-0000-0000-000000000002', 'utkarsh@brightloop.com', 'Utkarsh', 'staff', 'Brightloop Operations', '+91 98123 45678'),
  ('a0000000-0000-0000-0000-000000000003', 'shiwanshi@brightloop.com', 'Shiwanshi', 'staff', 'Brightloop Sales Lead', '+91 98234 56789'),
  ('a0000000-0000-0000-0000-000000000004', 'aakriti@brightloop.com', 'Aakriti', 'staff', 'Brightloop Finance Lead', '+91 98345 67890'),
  ('a0000000-0000-0000-0000-000000000005', 'rahul@apexretail.com', 'Rahul Verma', 'customer', 'Apex Retail Chain Ltd', '+91 98456 78901'),
  ('a0000000-0000-0000-0000-000000000006', 'priya@zenithcloud.com', 'Priya Sharma', 'customer', 'Zenith Cloud Solutions', '+91 98567 89012')
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  company_name = EXCLUDED.company_name;

-- Products (PDF Scene 2: Odoo Brand variant adds +560)
INSERT INTO products (id, name, type, sales_price, cost_price, notes)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Brightloop Enterprise ERP', 'Software', 1200.00, 450.00, 'Core SaaS billing engine with automated workflows'),
  ('b0000000-0000-0000-0000-000000000002', 'Automated Marketing Suite', 'Add-on', 450.00, 120.00, 'Email campaigns, drip sequences and lead scoring'),
  ('b0000000-0000-0000-0000-000000000003', 'Dedicated 24/7 Premium SLA', 'Service', 350.00, 100.00, 'Guaranteed 15-minute response with Amit & Utkarsh tech team'),
  ('b0000000-0000-0000-0000-000000000004', 'Cloud Security Shield', 'Software', 290.00, 80.00, 'End-to-end data encryption and compliance vault')
ON CONFLICT DO NOTHING;

-- Variants (PDF Scene 2: choosing Odoo brand adds 560 to price)
INSERT INTO product_variants (id, product_id, attribute_name, attribute_value, price_extra, sku)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Brand', 'Odoo Brand Edition', 560.00, 'BL-ERP-ODOO'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Brand', 'Brightloop Standard', 0.00, 'BL-ERP-STD'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Tier', 'Unlimited Contacts', 150.00, 'BL-MKT-UNL')
ON CONFLICT DO NOTHING;

-- Subscription Plans (Daily, Weekly, Monthly, Yearly + Lifecycle Rules)
INSERT INTO subscription_plans (id, name, code, price, billing_interval, min_quantity, start_date, auto_close_on_expiry, allow_early_close, allow_pause, allow_renew)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Business Monthly Pro', 'BIZ-MONTHLY', 1200.00, 'monthly', 1, '2026-01-01', FALSE, TRUE, TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000002', 'Enterprise Annual Contract', 'ENT-YEARLY', 11500.00, 'yearly', 3, '2026-01-01', TRUE, TRUE, TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000003', 'Agile Weekly Sprint', 'DEV-WEEKLY', 350.00, 'weekly', 1, '2026-01-01', TRUE, TRUE, FALSE, TRUE),
  ('d0000000-0000-0000-0000-000000000004', 'Daily Kiosk License', 'EVENT-DAILY', 75.00, 'daily', 2, '2026-01-01', TRUE, FALSE, FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- Quotation Templates (PDF Scene 3)
INSERT INTO quotation_templates (id, name, plan_id, plan_name, validity_days, notes)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Odoo Enterprise SaaS Bundle', 'd0000000-0000-0000-0000-000000000001', 'Business Monthly Pro', 15, 'Standard quote prepared by Shiwanshi for mid-to-large customers')
ON CONFLICT DO NOTHING;

-- Taxes (PDF Scene 4)
INSERT INTO taxes (id, name, rate, is_default, description)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'Standard GST (18%)', 18.00, TRUE, 'Indian GST standard software rate'),
  ('t0000000-0000-0000-0000-000000000002', 'Tech Export VAT (10%)', 10.00, FALSE, 'Cross-border digital service export'),
  ('t0000000-0000-0000-0000-000000000003', 'Zero-Rated / SEZ (0%)', 0.00, FALSE, 'Special Economic Zone exemption')
ON CONFLICT DO NOTHING;

-- Discounts (PDF Scene 5: Admin only)
INSERT INTO discounts (id, code, name, type, value, min_purchase_amount, min_quantity, start_date, end_date, max_usage_limit, current_usage_count, scope, created_by)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'VOLUME15', '15% Volume Discount (>3 seats)', 'percent', 15.00, 1000.00, 3, '2026-01-01', '2026-12-31', 50, 4, 'whole_subscription', 'amit@brightloop.com'),
  ('f0000000-0000-0000-0000-000000000002', 'ODOO200', '$200 Odoo Welcome Credit', 'fixed', 200.00, 1500.00, 1, '2026-01-01', '2026-12-31', 20, 2, 'whole_subscription', 'amit@brightloop.com')
ON CONFLICT DO NOTHING;
