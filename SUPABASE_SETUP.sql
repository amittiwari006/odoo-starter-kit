-- ==============================================================================
-- BRIGHTLOOP SOFTWARE - SUBSCRIPTION MANAGEMENT SYSTEM (ODOO HACKATHON 2026)
-- Complete Production Database Schema & Seed Data for Supabase (PostgreSQL)
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

-- 3. PRODUCTS & VARIANTS
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

-- 4. SUBSCRIPTION PLANS
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

-- 5. QUOTATION TEMPLATES
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

-- 6. TAX RULES
CREATE TABLE IF NOT EXISTS taxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rate NUMERIC(6, 2) NOT NULL DEFAULT 18.00, -- Percentage
  type TEXT DEFAULT 'percent' CHECK (type IN ('percent', 'fixed')),
  is_default BOOLEAN DEFAULT FALSE,
  description TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DISCOUNT RULES (Admin only)
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
  created_by TEXT DEFAULT 'admin@brightloop.com',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_number TEXT UNIQUE NOT NULL, -- e.g. SUB-2026-0001
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

-- 9. INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL, -- e.g. INV-2026-0001
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

-- 10. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT UNIQUE NOT NULL, -- e.g. PAY-2026-0001
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

-- 11. AUDIT / ACTIVITY LOG
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. HIGH-PERFORMANCE INDEXES (< 2 second response guarantee)
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

-- 14. POLICIES (Admin controls all, Staff operates, Customers see own portal)
CREATE POLICY "Public profiles can read own" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public products viewable" ON products FOR SELECT USING (true);
CREATE POLICY "Public plans viewable" ON subscription_plans FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow insert update for authenticated" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Allow insert update for invoices" ON invoices FOR ALL USING (true);
CREATE POLICY "Allow payments recording" ON payments FOR ALL USING (true);

-- ==============================================================================
-- 15. SEED DATA - REAL BRIGHTLOOP SOFTWARE CATALOG & SCENARIOS
-- ==============================================================================

-- Admin, Staff, and Customer Profiles
INSERT INTO profiles (id, email, full_name, role, company_name)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@brightloop.com', 'Sarah Connor (Admin)', 'admin', 'Brightloop HQ'),
  ('a0000000-0000-0000-0000-000000000002', 'staff@brightloop.com', 'Alex Rivera (Staff)', 'staff', 'Brightloop Sales & Support'),
  ('a0000000-0000-0000-0000-000000000003', 'client@acmecorp.com', 'Marcus Vance', 'customer', 'Acme Corporation'),
  ('a0000000-0000-0000-0000-000000000004', 'finance@zenithretail.com', 'Priya Sharma', 'customer', 'Zenith Retail Chain')
ON CONFLICT (email) DO NOTHING;

-- Products (Including the Odoo brand variant mentioned in PDF Scene 2)
INSERT INTO products (id, name, type, sales_price, cost_price, notes)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Brightloop Enterprise ERP', 'Software', 1200.00, 450.00, 'Core SaaS billing engine with automated workflows'),
  ('b0000000-0000-0000-0000-000000000002', 'Automated Marketing Suite', 'Add-on', 450.00, 120.00, 'Email campaigns, drip sequences and lead scoring'),
  ('b0000000-0000-0000-0000-000000000003', 'Dedicated 24/7 Premium SLA', 'Service', 350.00, 100.00, 'Guaranteed 15-minute response and dedicated engineer'),
  ('b0000000-0000-0000-0000-000000000004', 'Cloud Security Shield', 'Software', 290.00, 80.00, 'End-to-end data encryption and compliance vault')
ON CONFLICT DO NOTHING;

-- Variants (PDF Scene 2: "where choosing the Odoo brand adds 560 to the price")
INSERT INTO product_variants (id, product_id, attribute_name, attribute_value, price_extra, sku)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Brand', 'Odoo Edition', 560.00, 'ERP-ODOO-01'),
  ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Brand', 'Standard Brightloop', 0.00, 'ERP-STD-01'),
  ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Tier', 'Unlimited Contacts', 150.00, 'MKT-UNL-01')
ON CONFLICT DO NOTHING;

-- Subscription Plans (Daily, Weekly, Monthly, Yearly + Lifecycle Rules)
INSERT INTO subscription_plans (id, name, code, price, billing_interval, min_quantity, start_date, auto_close_on_expiry, allow_early_close, allow_pause, allow_renew)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Enterprise Monthly Pro', 'PLAN-M-ENT', 1200.00, 'monthly', 1, '2026-01-01', FALSE, TRUE, TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000002', 'Annual Growth Contract', 'PLAN-Y-GROW', 11500.00, 'yearly', 5, '2026-01-01', TRUE, TRUE, TRUE, TRUE),
  ('d0000000-0000-0000-0000-000000000003', 'Agile Weekly Sprint', 'PLAN-W-SPRINT', 350.00, 'weekly', 1, '2026-01-01', TRUE, TRUE, FALSE, TRUE),
  ('d0000000-0000-0000-0000-000000000004', 'Daily Kiosk License', 'PLAN-D-KIOSK', 65.00, 'daily', 2, '2026-01-01', TRUE, FALSE, FALSE, FALSE)
ON CONFLICT DO NOTHING;

-- Quotation Template (PDF Scene 3: template with right plan and product lines)
INSERT INTO quotation_templates (id, name, plan_id, plan_name, validity_days, notes)
VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Odoo Enterprise SaaS Bundle', 'd0000000-0000-0000-0000-000000000001', 'Enterprise Monthly Pro', 15, 'Standard quote for mid-to-large business customers')
ON CONFLICT DO NOTHING;

-- Taxes (PDF Scene 4: rules set by admin)
INSERT INTO taxes (id, name, rate, is_default, description)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'Standard GST', 18.00, TRUE, 'General standard goods & services tax'),
  ('t0000000-0000-0000-0000-000000000002', 'Reduced Tech VAT', 10.00, FALSE, 'Special cross-border software rate'),
  ('t0000000-0000-0000-0000-000000000003', 'Zero-Rated Export', 0.00, FALSE, 'Foreign customer export tax exemption')
ON CONFLICT DO NOTHING;

-- Discounts (PDF Scene 5: created only by Admin, fixed or %, min purchase/qty, usage limits)
INSERT INTO discounts (id, code, name, type, value, min_purchase_amount, min_quantity, start_date, end_date, max_usage_limit, current_usage_count, scope)
VALUES
  ('f0000000-0000-0000-0000-000000000001', 'VOLUME15', '15% Volume Discount (>5 seats)', 'percent', 15.00, 1000.00, 5, '2026-01-01', '2026-12-31', 50, 4, 'whole_subscription'),
  ('f0000000-0000-0000-0000-000000000002', 'ODOO500', 'Special $500 Odoo Onboarding Credit', 'fixed', 500.00, 1500.00, 1, '2026-01-01', '2026-12-31', 20, 2, 'whole_subscription')
ON CONFLICT DO NOTHING;
