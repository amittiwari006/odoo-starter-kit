export type UserRole = 'admin' | 'staff' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_name?: string;
  phone?: string;
  created_at: string;
}

export type ProductType = 'Software' | 'Add-on' | 'Service' | 'Hardware';

export interface ProductVariant {
  id: string;
  product_id: string;
  attribute_name: string; // e.g., 'Brand', 'Edition', 'Tier'
  attribute_value: string; // e.g., 'Odoo Brand', 'Enterprise', 'Standard'
  price_extra: number; // e.g. +560 for Odoo Brand
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  sales_price: number;
  cost_price: number;
  notes?: string;
  variants: ProductVariant[];
  is_active: boolean;
  created_at: string;
}

export type BillingInterval = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  price: number;
  billing_interval: BillingInterval;
  min_quantity: number;
  start_date: string;
  end_date?: string;
  // Lifecycle rules specified in PDF Scene 2:
  auto_close_on_expiry: boolean;
  allow_early_close: boolean;
  allow_pause: boolean;
  allow_renew: boolean;
  notes?: string;
  is_active: boolean;
  created_at: string;
}

export interface QuotationTemplateLine {
  id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  plan_id: string;
  plan_name: string;
  validity_days: number;
  notes?: string;
  lines: QuotationTemplateLine[];
  created_at: string;
}

export type SubscriptionStatus = 'draft' | 'quotation' | 'confirmed' | 'active' | 'paused' | 'closed';

export type PaymentTerms = 'immediate' | 'net15' | 'net30' | 'net60';

export interface SubscriptionLine {
  id: string;
  subscription_id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number; // percentage, e.g. 18
  discount_amount: number;
  subtotal: number;
  total: number;
}

export interface Subscription {
  id: string;
  sub_number: string; // e.g. SUB-2026-0001
  customer_id: string;
  customer_name: string;
  customer_email: string;
  plan_id: string;
  plan_name: string;
  status: SubscriptionStatus;
  start_date: string;
  expiry_date: string;
  next_billing_date: string;
  last_billed_date?: string;
  payment_terms: PaymentTerms;
  applied_discount_id?: string;
  applied_discount_code?: string;
  subtotal: number;
  tax_total: number;
  discount_total: number;
  total_amount: number;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  lines: SubscriptionLine[];
}

export interface TaxRule {
  id: string;
  name: string;
  rate: number; // percentage, e.g. 18.0
  type: 'percent' | 'fixed';
  is_default: boolean;
  description?: string;
  is_active: boolean;
}

export type DiscountType = 'fixed' | 'percent';
export type DiscountScope = 'whole_subscription' | 'specific_product';

export interface DiscountRule {
  id: string;
  code: string;
  name: string;
  type: DiscountType;
  value: number; // e.g. 15 for 15% or 50 for $50
  min_purchase_amount?: number;
  min_quantity?: number;
  start_date: string;
  end_date: string;
  max_usage_limit: number;
  current_usage_count: number;
  scope: DiscountScope;
  target_product_id?: string;
  target_product_name?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
}

export type InvoiceStatus = 'draft' | 'confirmed' | 'paid' | 'cancelled';

export interface InvoiceLine {
  id: string;
  invoice_id: string;
  product_id: string;
  product_name: string;
  variant_name?: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  line_total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string; // e.g. INV-2026-0001
  subscription_id: string;
  subscription_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  billing_period_start: string;
  billing_period_end: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  payment_terms: PaymentTerms;
  notes?: string;
  sent_at?: string;
  created_at: string;
  lines: InvoiceLine[];
}

export type PaymentMethod = 'Bank Transfer' | 'Credit Card' | 'Cash' | 'UPI' | 'Cheque';

export interface Payment {
  id: string;
  payment_number: string; // e.g. PAY-2026-0001
  invoice_id: string;
  invoice_number: string;
  subscription_id?: string;
  customer_id: string;
  customer_name: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_date: string;
  reference_note: string;
  status: 'completed' | 'pending';
  created_at: string;
}

export interface FinanceSummary {
  active_subscriptions_count: number;
  total_subscribers: number;
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  total_revenue_collected: number;
  outstanding_receivables: number;
  overdue_invoices_count: number;
  overdue_amount: number;
  draft_invoices_count: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: 'subscription' | 'invoice' | 'payment' | 'plan' | 'discount' | 'auth';
  entity_id: string;
  user_email: string;
  details: string;
  created_at: string;
}
