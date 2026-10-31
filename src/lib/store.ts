'use client';

import {
  UserProfile,
  Product,
  SubscriptionPlan,
  QuotationTemplate,
  Subscription,
  SubscriptionLine,
  TaxRule,
  DiscountRule,
  Invoice,
  InvoiceLine,
  InvoiceStatus,
  Payment,
  ActivityLog,
  FinanceSummary,
  UserRole
} from './types';

// ==============================================================================
// INITIAL BRIGHTLOOP SEED DATA
// ==============================================================================

const SEED_PROFILES: UserProfile[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@brightloop.com',
    full_name: 'Sarah Connor',
    role: 'admin',
    company_name: 'Brightloop HQ',
    phone: '+1 (555) 019-2834',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-staff-1',
    email: 'staff@brightloop.com',
    full_name: 'Alex Rivera',
    role: 'staff',
    company_name: 'Brightloop Operations',
    phone: '+1 (555) 014-9921',
    created_at: '2026-01-10T00:00:00Z'
  },
  {
    id: 'usr-cust-1',
    email: 'marcus@acmecorp.com',
    full_name: 'Marcus Vance',
    role: 'customer',
    company_name: 'Acme Corporation',
    phone: '+1 (555) 438-1190',
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'usr-cust-2',
    email: 'priya@zenithretail.com',
    full_name: 'Priya Sharma',
    role: 'customer',
    company_name: 'Zenith Retail Outlets',
    phone: '+91 98200 12345',
    created_at: '2026-02-15T00:00:00Z'
  },
  {
    id: 'usr-cust-3',
    email: 'david@cloudpeak.io',
    full_name: 'David Lindqvist',
    role: 'customer',
    company_name: 'CloudPeak Software',
    phone: '+46 8 123 4567',
    created_at: '2026-03-01T00:00:00Z'
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Brightloop Enterprise ERP',
    type: 'Software',
    sales_price: 1200,
    cost_price: 450,
    notes: 'Core modular business software with accounting, sales, and automated billing',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    variants: [
      {
        id: 'var-1a',
        product_id: 'prod-1',
        attribute_name: 'Brand',
        attribute_value: 'Odoo Brand Edition',
        price_extra: 560, // PDF Scene 2 explicit requirement!
        sku: 'BL-ERP-ODOO'
      },
      {
        id: 'var-1b',
        product_id: 'prod-1',
        attribute_name: 'Brand',
        attribute_value: 'Brightloop Standard',
        price_extra: 0,
        sku: 'BL-ERP-STD'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Automated CRM & Lead Engine',
    type: 'Software',
    sales_price: 490,
    cost_price: 120,
    notes: 'Real-time sales pipeline, customer journey tracking, and AI email summaries',
    is_active: true,
    created_at: '2026-01-05T00:00:00Z',
    variants: [
      {
        id: 'var-2a',
        product_id: 'prod-2',
        attribute_name: 'Tier',
        attribute_value: 'Pro Tier (+50k Contacts)',
        price_extra: 150,
        sku: 'BL-CRM-PRO'
      }
    ]
  },
  {
    id: 'prod-3',
    name: '24/7 Dedicated SLA Support',
    type: 'Service',
    sales_price: 350,
    cost_price: 100,
    notes: 'Guaranteed 15-minute response time with a designated solutions architect',
    is_active: true,
    created_at: '2026-01-10T00:00:00Z',
    variants: []
  },
  {
    id: 'prod-4',
    name: 'Cloud Security & Compliance Shield',
    type: 'Add-on',
    sales_price: 250,
    cost_price: 60,
    notes: 'Automated SOC2 compliance logs, audit trails, and encrypted offsite backups',
    is_active: true,
    created_at: '2026-01-12T00:00:00Z',
    variants: []
  }
];

const SEED_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-monthly-biz',
    name: 'Business Monthly Pro',
    code: 'BIZ-MONTHLY',
    price: 1200,
    billing_interval: 'monthly',
    min_quantity: 1,
    start_date: '2026-01-01',
    auto_close_on_expiry: false,
    allow_early_close: true,
    allow_pause: true,
    allow_renew: true,
    notes: 'Billed monthly. Can be paused, renewed, or closed early at customer request.',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-yearly-ent',
    name: 'Enterprise Annual Contract',
    code: 'ENT-YEARLY',
    price: 11500,
    billing_interval: 'yearly',
    min_quantity: 3,
    start_date: '2026-01-01',
    auto_close_on_expiry: true,
    allow_early_close: false,
    allow_pause: false,
    allow_renew: true,
    notes: 'Fixed 1-year contract. Auto-closes upon expiry unless renewed. No early cancellation.',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-weekly-sprint',
    name: 'Agile Weekly Sprint',
    code: 'DEV-WEEKLY',
    price: 350,
    billing_interval: 'weekly',
    min_quantity: 1,
    start_date: '2026-01-01',
    auto_close_on_expiry: true,
    allow_early_close: true,
    allow_pause: false,
    allow_renew: true,
    notes: 'Billed weekly for temporary high-intensity projects.',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-daily-kiosk',
    name: 'Daily Kiosk / Event License',
    code: 'EVENT-DAILY',
    price: 75,
    billing_interval: 'daily',
    min_quantity: 2,
    start_date: '2026-01-01',
    auto_close_on_expiry: true,
    allow_early_close: false,
    allow_pause: false,
    allow_renew: false,
    notes: 'Daily billing for conferences and pop-up kiosks. Self-terminates on end date.',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

const SEED_QUOTATION_TEMPLATES: QuotationTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Odoo Enterprise SaaS Bundle',
    plan_id: 'plan-monthly-biz',
    plan_name: 'Business Monthly Pro',
    validity_days: 15, // PDF Scene 3: "stays valid for a set number of days"
    notes: 'Standard enterprise package including Odoo Brand edition, SLA support, and Security add-on.',
    created_at: '2026-01-10T00:00:00Z',
    lines: [
      {
        id: 'tmpl-line-1',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_id: 'var-1a',
        variant_name: 'Odoo Brand Edition (+560)',
        quantity: 1,
        unit_price: 1760 // 1200 base + 560 variant
      },
      {
        id: 'tmpl-line-2',
        product_id: 'prod-3',
        product_name: '24/7 Dedicated SLA Support',
        quantity: 1,
        unit_price: 350
      },
      {
        id: 'tmpl-line-3',
        product_id: 'prod-4',
        product_name: 'Cloud Security & Compliance Shield',
        quantity: 1,
        unit_price: 250
      }
    ]
  },
  {
    id: 'tmpl-2',
    name: 'Startup Quick-Launch Pack',
    plan_id: 'plan-monthly-biz',
    plan_name: 'Business Monthly Pro',
    validity_days: 30,
    notes: 'Affordable setup for emerging teams with standard ERP and Marketing engine.',
    created_at: '2026-01-15T00:00:00Z',
    lines: [
      {
        id: 'tmpl-line-4',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_id: 'var-1b',
        variant_name: 'Brightloop Standard',
        quantity: 1,
        unit_price: 1200
      },
      {
        id: 'tmpl-line-5',
        product_id: 'prod-2',
        product_name: 'Automated CRM & Lead Engine',
        quantity: 1,
        unit_price: 490
      }
    ]
  }
];

const SEED_TAXES: TaxRule[] = [
  {
    id: 'tax-18',
    name: 'Standard GST (18%)',
    rate: 18.0,
    type: 'percent',
    is_default: true,
    description: 'Applicable on domestic business SaaS subscriptions',
    is_active: true
  },
  {
    id: 'tax-10',
    name: 'Cross-Border Tech VAT (10%)',
    rate: 10.0,
    type: 'percent',
    is_default: false,
    description: 'Reduced digital service rate for regional EU/APAC',
    is_active: true
  },
  {
    id: 'tax-0',
    name: 'Zero-Rated / SEZ (0%)',
    rate: 0.0,
    type: 'percent',
    is_default: false,
    description: 'Export sales or Special Economic Zone tax exemption',
    is_active: true
  }
];

const SEED_DISCOUNTS: DiscountRule[] = [
  {
    id: 'disc-volume-15',
    code: 'VOLUME15',
    name: '15% Volume Seat Discount',
    type: 'percent',
    value: 15.0, // 15% off
    min_purchase_amount: 1000,
    min_quantity: 3,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    max_usage_limit: 100,
    current_usage_count: 8,
    scope: 'whole_subscription',
    is_active: true,
    created_by: 'admin@brightloop.com',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'disc-fixed-200',
    code: 'ODOO200',
    name: '$200 Welcome Credit for Odoo Brand',
    type: 'fixed',
    value: 200,
    min_purchase_amount: 1500,
    min_quantity: 1,
    start_date: '2026-01-01',
    end_date: '2026-12-31',
    max_usage_limit: 50,
    current_usage_count: 14,
    scope: 'specific_product',
    target_product_id: 'prod-1',
    target_product_name: 'Brightloop Enterprise ERP',
    is_active: true,
    created_by: 'admin@brightloop.com',
    created_at: '2026-01-02T00:00:00Z'
  }
];

const SEED_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-001',
    sub_number: 'SUB-2026-0001',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    customer_email: 'marcus@acmecorp.com',
    plan_id: 'plan-monthly-biz',
    plan_name: 'Business Monthly Pro',
    status: 'active',
    start_date: '2026-09-01',
    expiry_date: '2027-08-31',
    next_billing_date: '2026-11-01', // Due tomorrow / ready for billing day!
    last_billed_date: '2026-10-01',
    payment_terms: 'net30',
    applied_discount_id: 'disc-volume-15',
    applied_discount_code: 'VOLUME15',
    subtotal: 2360,
    tax_total: 360.84,
    discount_total: 354.00,
    total_amount: 2366.84,
    notes: 'Key enterprise account. Billed monthly on 1st. Odoo brand edition active.',
    created_by: 'staff@brightloop.com',
    created_at: '2026-09-01T10:00:00Z',
    updated_at: '2026-10-01T10:00:00Z',
    lines: [
      {
        id: 'sub-line-1',
        subscription_id: 'sub-001',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_id: 'var-1a',
        variant_name: 'Odoo Brand Edition (+560)',
        quantity: 1,
        unit_price: 1760,
        tax_rate: 18,
        discount_amount: 264,
        subtotal: 1760,
        total: 1765.28
      },
      {
        id: 'sub-line-2',
        subscription_id: 'sub-001',
        product_id: 'prod-3',
        product_name: '24/7 Dedicated SLA Support',
        quantity: 1,
        unit_price: 350,
        tax_rate: 18,
        discount_amount: 52.5,
        subtotal: 350,
        total: 351.05
      },
      {
        id: 'sub-line-3',
        subscription_id: 'sub-001',
        product_id: 'prod-4',
        product_name: 'Cloud Security & Compliance Shield',
        quantity: 1,
        unit_price: 250,
        tax_rate: 18,
        discount_amount: 37.5,
        subtotal: 250,
        total: 250.51
      }
    ]
  },
  {
    id: 'sub-002',
    sub_number: 'SUB-2026-0002',
    customer_id: 'usr-cust-2',
    customer_name: 'Priya Sharma (Zenith Retail)',
    customer_email: 'priya@zenithretail.com',
    plan_id: 'plan-yearly-ent',
    plan_name: 'Enterprise Annual Contract',
    status: 'active',
    start_date: '2026-03-01',
    expiry_date: '2027-02-28',
    next_billing_date: '2027-03-01',
    last_billed_date: '2026-03-01',
    payment_terms: 'net30',
    subtotal: 11500,
    tax_total: 2070,
    discount_total: 0,
    total_amount: 13570,
    notes: 'Annual upfront contract for 12 retail locations.',
    created_by: 'staff@brightloop.com',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-01T09:00:00Z',
    lines: [
      {
        id: 'sub-line-4',
        subscription_id: 'sub-002',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_id: 'var-1b',
        variant_name: 'Brightloop Standard',
        quantity: 3,
        unit_price: 3833.33,
        tax_rate: 18,
        discount_amount: 0,
        subtotal: 11500,
        total: 13570
      }
    ]
  },
  {
    id: 'sub-003',
    sub_number: 'SUB-2026-0003',
    customer_id: 'usr-cust-3',
    customer_name: 'David Lindqvist (CloudPeak)',
    customer_email: 'david@cloudpeak.io',
    plan_id: 'plan-monthly-biz',
    plan_name: 'Business Monthly Pro',
    status: 'confirmed',
    start_date: '2026-11-01',
    expiry_date: '2027-10-31',
    next_billing_date: '2026-11-01', // Ready for first billing cycle!
    payment_terms: 'net15',
    subtotal: 1690,
    tax_total: 169, // 10% VAT
    discount_total: 0,
    total_amount: 1859,
    notes: 'Confirmed quotation. Awaiting initial billing run.',
    created_by: 'staff@brightloop.com',
    created_at: '2026-10-25T11:00:00Z',
    updated_at: '2026-10-25T11:00:00Z',
    lines: [
      {
        id: 'sub-line-5',
        subscription_id: 'sub-003',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_id: 'var-1b',
        variant_name: 'Brightloop Standard',
        quantity: 1,
        unit_price: 1200,
        tax_rate: 10,
        discount_amount: 0,
        subtotal: 1200,
        total: 1320
      },
      {
        id: 'sub-line-6',
        subscription_id: 'sub-003',
        product_id: 'prod-2',
        product_name: 'Automated CRM & Lead Engine',
        quantity: 1,
        unit_price: 490,
        tax_rate: 10,
        discount_amount: 0,
        subtotal: 490,
        total: 539
      }
    ]
  },
  {
    id: 'sub-004',
    sub_number: 'SUB-2026-0004',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    plan_id: 'plan-weekly-sprint',
    plan_name: 'Agile Weekly Sprint',
    customer_email: 'marcus@acmecorp.com',
    status: 'quotation',
    start_date: '2026-11-05',
    expiry_date: '2026-12-05',
    next_billing_date: '2026-11-05',
    payment_terms: 'immediate',
    subtotal: 350,
    tax_total: 63,
    discount_total: 0,
    total_amount: 413,
    notes: 'Quotation sent to client for short-term QA audit.',
    created_by: 'staff@brightloop.com',
    created_at: '2026-10-29T14:30:00Z',
    updated_at: '2026-10-29T14:30:00Z',
    lines: [
      {
        id: 'sub-line-7',
        subscription_id: 'sub-004',
        product_id: 'prod-3',
        product_name: '24/7 Dedicated SLA Support',
        quantity: 1,
        unit_price: 350,
        tax_rate: 18,
        discount_amount: 0,
        subtotal: 350,
        total: 413
      }
    ]
  }
];

const SEED_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    invoice_number: 'INV-2026-0001',
    subscription_id: 'sub-001',
    subscription_number: 'SUB-2026-0001',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    customer_email: 'marcus@acmecorp.com',
    status: 'paid',
    issue_date: '2026-09-01',
    due_date: '2026-10-01',
    billing_period_start: '2026-09-01',
    billing_period_end: '2026-09-30',
    subtotal: 2360,
    tax_amount: 360.84,
    discount_amount: 354.00,
    total_amount: 2366.84,
    amount_paid: 2366.84,
    amount_due: 0,
    payment_terms: 'net30',
    notes: 'September recurring cycle. Paid in full via Bank Transfer.',
    sent_at: '2026-09-01T10:15:00Z',
    created_at: '2026-09-01T10:00:00Z',
    lines: [
      {
        id: 'inv-line-1',
        invoice_id: 'inv-001',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_name: 'Odoo Brand Edition (+560)',
        quantity: 1,
        unit_price: 1760,
        tax_rate: 18,
        tax_amount: 269.28,
        discount_amount: 264,
        line_total: 1765.28
      },
      {
        id: 'inv-line-2',
        invoice_id: 'inv-001',
        product_id: 'prod-3',
        product_name: '24/7 Dedicated SLA Support',
        quantity: 1,
        unit_price: 350,
        tax_rate: 18,
        tax_amount: 53.55,
        discount_amount: 52.5,
        line_total: 351.05
      },
      {
        id: 'inv-line-3',
        invoice_id: 'inv-001',
        product_id: 'prod-4',
        product_name: 'Cloud Security & Compliance Shield',
        quantity: 1,
        unit_price: 250,
        tax_rate: 18,
        tax_amount: 38.01,
        discount_amount: 37.5,
        line_total: 250.51
      }
    ]
  },
  {
    id: 'inv-002',
    invoice_number: 'INV-2026-0002',
    subscription_id: 'sub-001',
    subscription_number: 'SUB-2026-0001',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    customer_email: 'marcus@acmecorp.com',
    status: 'confirmed',
    issue_date: '2026-10-01',
    due_date: '2026-10-15', // Past due! Demonstrates overdue chasing!
    billing_period_start: '2026-10-01',
    billing_period_end: '2026-10-31',
    subtotal: 2360,
    tax_amount: 360.84,
    discount_amount: 354.00,
    total_amount: 2366.84,
    amount_paid: 1000.00, // Partial payment
    amount_due: 1366.84, // Outstanding overdue
    payment_terms: 'net15',
    notes: 'October recurring cycle. Partially paid, chasing remaining balance.',
    sent_at: '2026-10-01T10:15:00Z',
    created_at: '2026-10-01T10:00:00Z',
    lines: [
      {
        id: 'inv-line-4',
        invoice_id: 'inv-002',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_name: 'Odoo Brand Edition (+560)',
        quantity: 1,
        unit_price: 1760,
        tax_rate: 18,
        tax_amount: 269.28,
        discount_amount: 264,
        line_total: 1765.28
      },
      {
        id: 'inv-line-5',
        invoice_id: 'inv-002',
        product_id: 'prod-3',
        product_name: '24/7 Dedicated SLA Support',
        quantity: 1,
        unit_price: 350,
        tax_rate: 18,
        tax_amount: 53.55,
        discount_amount: 52.5,
        line_total: 351.05
      },
      {
        id: 'inv-line-6',
        invoice_id: 'inv-002',
        product_id: 'prod-4',
        product_name: 'Cloud Security & Compliance Shield',
        quantity: 1,
        unit_price: 250,
        tax_rate: 18,
        tax_amount: 38.01,
        discount_amount: 37.5,
        line_total: 250.51
      }
    ]
  },
  {
    id: 'inv-003',
    invoice_number: 'INV-2026-0003',
    subscription_id: 'sub-002',
    subscription_number: 'SUB-2026-0002',
    customer_id: 'usr-cust-2',
    customer_name: 'Priya Sharma (Zenith Retail)',
    customer_email: 'priya@zenithretail.com',
    status: 'paid',
    issue_date: '2026-03-01',
    due_date: '2026-03-31',
    billing_period_start: '2026-03-01',
    billing_period_end: '2027-02-28',
    subtotal: 11500,
    tax_amount: 2070,
    discount_amount: 0,
    total_amount: 13570,
    amount_paid: 13570,
    amount_due: 0,
    payment_terms: 'net30',
    notes: 'Annual upfront payment received via Wire Transfer.',
    sent_at: '2026-03-01T09:30:00Z',
    created_at: '2026-03-01T09:00:00Z',
    lines: [
      {
        id: 'inv-line-7',
        invoice_id: 'inv-003',
        product_id: 'prod-1',
        product_name: 'Brightloop Enterprise ERP',
        variant_name: 'Brightloop Standard',
        quantity: 3,
        unit_price: 3833.33,
        tax_rate: 18,
        tax_amount: 2070,
        discount_amount: 0,
        line_total: 13570
      }
    ]
  }
];

const SEED_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    payment_number: 'PAY-2026-0001',
    invoice_id: 'inv-001',
    invoice_number: 'INV-2026-0001',
    subscription_id: 'sub-001',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    amount: 2366.84,
    payment_method: 'Bank Transfer',
    payment_date: '2026-09-15',
    reference_note: 'Wire ref #ACH-889021-US',
    status: 'completed',
    created_at: '2026-09-15T14:20:00Z'
  },
  {
    id: 'pay-002',
    payment_number: 'PAY-2026-0002',
    invoice_id: 'inv-003',
    invoice_number: 'INV-2026-0003',
    subscription_id: 'sub-002',
    customer_id: 'usr-cust-2',
    customer_name: 'Priya Sharma (Zenith Retail)',
    amount: 13570.00,
    payment_method: 'Bank Transfer',
    payment_date: '2026-03-10',
    reference_note: 'Direct RTGS #HDFC-0091823',
    status: 'completed',
    created_at: '2026-03-10T11:00:00Z'
  },
  {
    id: 'pay-003',
    payment_number: 'PAY-2026-0003',
    invoice_id: 'inv-002',
    invoice_number: 'INV-2026-0002',
    subscription_id: 'sub-001',
    customer_id: 'usr-cust-1',
    customer_name: 'Marcus Vance (Acme Corp)',
    amount: 1000.00,
    payment_method: 'Credit Card',
    payment_date: '2026-10-10',
    reference_note: 'Partial charge on Corp Amex ending *4012',
    status: 'completed',
    created_at: '2026-10-10T16:45:00Z'
  }
];

const SEED_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-1',
    action: 'Subscription Created',
    entity: 'subscription',
    entity_id: 'SUB-2026-0001',
    user_email: 'staff@brightloop.com',
    details: 'Created enterprise subscription from Odoo Enterprise SaaS Bundle template',
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'act-2',
    action: 'Automated Invoice Generated',
    entity: 'invoice',
    entity_id: 'INV-2026-0001',
    user_email: 'system@brightloop.com',
    details: 'Billing day automated run generated invoice for SUB-2026-0001 with 18% GST',
    created_at: '2026-09-01T10:15:00Z'
  },
  {
    id: 'act-3',
    action: 'Payment Recorded',
    entity: 'payment',
    entity_id: 'PAY-2026-0001',
    user_email: 'staff@brightloop.com',
    details: 'Recorded $2,366.84 via Bank Transfer for invoice INV-2026-0001. Marked as Paid.',
    created_at: '2026-09-15T14:20:00Z'
  }
];

// ==============================================================================
// LOCAL STORAGE KEYS & STORE CLASS
// ==============================================================================

const STORAGE_KEYS = {
  CURRENT_USER: 'brightloop_current_user',
  PROFILES: 'brightloop_profiles',
  PRODUCTS: 'brightloop_products',
  PLANS: 'brightloop_plans',
  TEMPLATES: 'brightloop_templates',
  SUBSCRIPTIONS: 'brightloop_subscriptions',
  TAXES: 'brightloop_taxes',
  DISCOUNTS: 'brightloop_discounts',
  INVOICES: 'brightloop_invoices',
  PAYMENTS: 'brightloop_payments',
  ACTIVITY: 'brightloop_activity'
};

class BrightloopDataStore {
  private initialized = false;

  private currentUser: UserProfile = SEED_PROFILES[0]; // Admin by default
  private profiles: UserProfile[] = SEED_PROFILES;
  private products: Product[] = SEED_PRODUCTS;
  private plans: SubscriptionPlan[] = SEED_PLANS;
  private templates: QuotationTemplate[] = SEED_QUOTATION_TEMPLATES;
  private subscriptions: Subscription[] = SEED_SUBSCRIPTIONS;
  private taxes: TaxRule[] = SEED_TAXES;
  private discounts: DiscountRule[] = SEED_DISCOUNTS;
  private invoices: Invoice[] = SEED_INVOICES;
  private payments: Payment[] = SEED_PAYMENTS;
  private activityLogs: ActivityLog[] = SEED_ACTIVITY;

  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((l) => l());
  }

  private loadFromStorage() {
    try {
      const get = (key: string, fallback: any) => {
        const val = localStorage.getItem(key);
        return val ? JSON.parse(val) : fallback;
      };

      this.currentUser = get(STORAGE_KEYS.CURRENT_USER, SEED_PROFILES[0]);
      this.profiles = get(STORAGE_KEYS.PROFILES, SEED_PROFILES);
      this.products = get(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
      this.plans = get(STORAGE_KEYS.PLANS, SEED_PLANS);
      this.templates = get(STORAGE_KEYS.TEMPLATES, SEED_QUOTATION_TEMPLATES);
      this.subscriptions = get(STORAGE_KEYS.SUBSCRIPTIONS, SEED_SUBSCRIPTIONS);
      this.taxes = get(STORAGE_KEYS.TAXES, SEED_TAXES);
      this.discounts = get(STORAGE_KEYS.DISCOUNTS, SEED_DISCOUNTS);
      this.invoices = get(STORAGE_KEYS.INVOICES, SEED_INVOICES);
      this.payments = get(STORAGE_KEYS.PAYMENTS, SEED_PAYMENTS);
      this.activityLogs = get(STORAGE_KEYS.ACTIVITY, SEED_ACTIVITY);
      this.initialized = true;
    } catch (e) {
      console.warn('LocalStorage load error, using memory seed:', e);
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(this.profiles));
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(this.products));
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(this.plans));
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(this.templates));
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(this.subscriptions));
      localStorage.setItem(STORAGE_KEYS.TAXES, JSON.stringify(this.taxes));
      localStorage.setItem(STORAGE_KEYS.DISCOUNTS, JSON.stringify(this.discounts));
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(this.invoices));
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));
      localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(this.activityLogs));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  public resetToDefaults() {
    this.currentUser = SEED_PROFILES[0];
    this.profiles = [...SEED_PROFILES];
    this.products = [...SEED_PRODUCTS];
    this.plans = [...SEED_PLANS];
    this.templates = [...SEED_QUOTATION_TEMPLATES];
    this.subscriptions = [...SEED_SUBSCRIPTIONS];
    this.taxes = [...SEED_TAXES];
    this.discounts = [...SEED_DISCOUNTS];
    this.invoices = [...SEED_INVOICES];
    this.payments = [...SEED_PAYMENTS];
    this.activityLogs = [...SEED_ACTIVITY];
    this.notify();
  }

  // ============================================================================
  // AUTH & USER PROFILES
  // ============================================================================

  public getCurrentUser(): UserProfile {
    return this.currentUser;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = user;
    this.notify();
  }

  public switchDemoRole(role: UserRole) {
    const found = this.profiles.find((p) => p.role === role);
    if (found) {
      this.setCurrentUser(found);
    }
  }

  public getProfiles(): UserProfile[] {
    return this.profiles;
  }

  public addStaffMember(name: string, email: string): { success: boolean; message: string } {
    if (this.currentUser.role !== 'admin') {
      return { success: false, message: 'Only an admin can add new members of staff.' };
    }
    if (this.profiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'A user with this email address already exists.' };
    }

    const newStaff: UserProfile = {
      id: `usr-staff-${Date.now()}`,
      email,
      full_name: name,
      role: 'staff',
      company_name: 'Brightloop Staff',
      created_at: new Date().toISOString()
    };
    this.profiles.push(newStaff);
    this.logActivity('Staff Member Added', 'auth', newStaff.id, `Admin created internal staff account for ${email}`);
    this.notify();
    return { success: true, message: `Staff member ${name} (${email}) created successfully!` };
  }

  // ============================================================================
  // PRODUCTS & VARIANTS (PDF Scene 2)
  // ============================================================================

  public getProducts(): Product[] {
    return this.products;
  }

  public addProduct(product: Omit<Product, 'id' | 'created_at'>): Product {
    const newProd: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.products.unshift(newProd);
    this.logActivity('Product Created', 'plan', newProd.id, `Created product "${newProd.name}" (${newProd.type}) with ${newProd.variants.length} variants`);
    this.notify();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.notify();
    return true;
  }

  // ============================================================================
  // SUBSCRIPTION PLANS (PDF Scene 2: daily, weekly, monthly, yearly + rules)
  // ============================================================================

  public getPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  public addPlan(plan: Omit<SubscriptionPlan, 'id' | 'created_at'>): SubscriptionPlan {
    const newPlan: SubscriptionPlan = {
      ...plan,
      id: `plan-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.plans.unshift(newPlan);
    this.logActivity('Plan Launched', 'plan', newPlan.id, `Launched new plan "${newPlan.name}" billed ${newPlan.billing_interval}`);
    this.notify();
    return newPlan;
  }

  // ============================================================================
  // QUOTATION TEMPLATES (PDF Scene 3)
  // ============================================================================

  public getTemplates(): QuotationTemplate[] {
    return this.templates;
  }

  public addTemplate(tmpl: Omit<QuotationTemplate, 'id' | 'created_at'>): QuotationTemplate {
    const newTmpl: QuotationTemplate = {
      ...tmpl,
      id: `tmpl-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.templates.unshift(newTmpl);
    this.notify();
    return newTmpl;
  }

  // ============================================================================
  // SUBSCRIPTIONS STATE MACHINE & WORKFLOW (PDF Scene 3 & 4)
  // Transitions: Draft -> Quotation -> Confirmed -> Active -> Closed
  // Extra: Paused, Renewed
  // ============================================================================

  public getSubscriptions(): Subscription[] {
    return this.subscriptions;
  }

  public getCustomerSubscriptions(customerEmail: string): Subscription[] {
    return this.subscriptions.filter(
      (s) => s.customer_email.toLowerCase() === customerEmail.toLowerCase()
    );
  }

  public createSubscriptionFromTemplate(
    templateId: string,
    customer: { id: string; name: string; email: string },
    notes?: string
  ): Subscription | null {
    const tmpl = this.templates.find((t) => t.id === templateId);
    if (!tmpl) return null;

    const plan = this.plans.find((p) => p.id === tmpl.plan_id);
    const count = this.subscriptions.length + 1;
    const subNumber = `SUB-2026-${String(count).padStart(4, '0')}`;

    const defaultTax = this.taxes.find((t) => t.is_default)?.rate || 18;
    const now = new Date();
    const startDate = now.toISOString().split('T')[0];
    
    // Compute expiry according to validity_days or 1 year default
    const exp = new Date(now);
    exp.setDate(exp.getDate() + tmpl.validity_days);
    const expiryDate = exp.toISOString().split('T')[0];

    // Compute lines
    let subtotal = 0;
    const lines: SubscriptionLine[] = tmpl.lines.map((tl, i) => {
      const lineSub = tl.quantity * tl.unit_price;
      subtotal += lineSub;
      const taxAmt = (lineSub * defaultTax) / 100;
      return {
        id: `subline-${Date.now()}-${i}`,
        subscription_id: '',
        product_id: tl.product_id,
        product_name: tl.product_name,
        variant_id: tl.variant_id,
        variant_name: tl.variant_name,
        quantity: tl.quantity,
        unit_price: tl.unit_price,
        tax_rate: defaultTax,
        discount_amount: 0,
        subtotal: lineSub,
        total: lineSub + taxAmt
      };
    });

    const taxTotal = (subtotal * defaultTax) / 100;

    const newSub: Subscription = {
      id: `sub-${Date.now()}`,
      sub_number: subNumber,
      customer_id: customer.id,
      customer_name: customer.name,
      customer_email: customer.email,
      plan_id: tmpl.plan_id,
      plan_name: tmpl.plan_name,
      status: 'draft', // Starts at Draft
      start_date: startDate,
      expiry_date: expiryDate,
      next_billing_date: startDate,
      payment_terms: 'net30',
      subtotal,
      tax_total: taxTotal,
      discount_total: 0,
      total_amount: subtotal + taxTotal,
      notes: notes || `Created from template "${tmpl.name}" (Valid for ${tmpl.validity_days} days)`,
      created_by: this.currentUser.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      lines
    };

    // Link lines
    newSub.lines.forEach((l) => (l.subscription_id = newSub.id));
    this.subscriptions.unshift(newSub);
    this.logActivity('Quote Created', 'subscription', subNumber, `Created quote ${subNumber} from template "${tmpl.name}" for ${customer.name}`);
    this.notify();
    return newSub;
  }

  public updateSubscriptionStatus(
    id: string,
    newStatus: Subscription['status'],
    reason?: string
  ): { success: boolean; message: string } {
    const sub = this.subscriptions.find((s) => s.id === id);
    if (!sub) return { success: false, message: 'Subscription not found.' };

    const plan = this.plans.find((p) => p.id === sub.plan_id);

    // Validate plan rules
    if (newStatus === 'closed' && plan && !plan.allow_early_close && sub.status === 'active') {
      const isExpired = new Date(sub.expiry_date) <= new Date();
      if (!isExpired) {
        return { success: false, message: `Plan "${plan.name}" does not permit early closure before contract expiry date.` };
      }
    }

    if (newStatus === 'paused' && plan && !plan.allow_pause) {
      return { success: false, message: `Plan "${plan.name}" does not allow pausing.` };
    }

    if (sub.status === 'closed' && newStatus !== 'active') {
      return { success: false, message: 'Closed subscriptions cannot transition to intermediate states.' };
    }

    const oldStatus = sub.status;
    sub.status = newStatus;
    sub.updated_at = new Date().toISOString();

    this.logActivity(
      'Status Changed',
      'subscription',
      sub.sub_number,
      `Transitioned ${sub.sub_number} from "${oldStatus}" to "${newStatus}"${reason ? ` (${reason})` : ''}`
    );
    this.notify();
    return { success: true, message: `Subscription ${sub.sub_number} is now ${newStatus.toUpperCase()}` };
  }

  // Self-service actions for customer portal
  public customerPauseSubscription(id: string, customerEmail: string): { success: boolean; message: string } {
    const sub = this.subscriptions.find((s) => s.id === id && s.customer_email.toLowerCase() === customerEmail.toLowerCase());
    if (!sub) return { success: false, message: 'Subscription not found or unauthorized.' };
    return this.updateSubscriptionStatus(id, 'paused', 'Customer self-service pause');
  }

  public customerResumeSubscription(id: string, customerEmail: string): { success: boolean; message: string } {
    const sub = this.subscriptions.find((s) => s.id === id && s.customer_email.toLowerCase() === customerEmail.toLowerCase());
    if (!sub) return { success: false, message: 'Subscription not found or unauthorized.' };
    return this.updateSubscriptionStatus(id, 'active', 'Customer self-service resume');
  }

  public customerRenewSubscription(id: string, customerEmail: string): { success: boolean; message: string } {
    const sub = this.subscriptions.find((s) => s.id === id && s.customer_email.toLowerCase() === customerEmail.toLowerCase());
    if (!sub) return { success: false, message: 'Subscription not found.' };

    const plan = this.plans.find((p) => p.id === sub.plan_id);
    if (plan && !plan.allow_renew) {
      return { success: false, message: 'This plan does not permit self-renewal.' };
    }

    const currentExpiry = new Date(sub.expiry_date);
    const newExpiry = new Date(currentExpiry);
    if (plan?.billing_interval === 'yearly') newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    else if (plan?.billing_interval === 'weekly') newExpiry.setDate(newExpiry.getDate() + 7);
    else if (plan?.billing_interval === 'daily') newExpiry.setDate(newExpiry.getDate() + 1);
    else newExpiry.setMonth(newExpiry.getMonth() + 1);

    sub.expiry_date = newExpiry.toISOString().split('T')[0];
    sub.status = 'active';
    sub.updated_at = new Date().toISOString();

    this.logActivity('Subscription Renewed', 'subscription', sub.sub_number, `Customer renewed subscription to ${sub.expiry_date}`);
    this.notify();
    return { success: true, message: `Renewed until ${sub.expiry_date}` };
  }

  // ============================================================================
  // DISCOUNT RULES ENGINE (PDF Scene 5: Admin only, fixed or %, limits, scope)
  // ============================================================================

  public getDiscounts(): DiscountRule[] {
    return this.discounts;
  }

  public addDiscountRule(rule: Omit<DiscountRule, 'id' | 'current_usage_count' | 'created_at' | 'created_by'>): { success: boolean; message: string; rule?: DiscountRule } {
    if (this.currentUser.role !== 'admin') {
      return { success: false, message: 'Only the admin can create discount rules.' };
    }

    if (this.discounts.some((d) => d.code.toUpperCase() === rule.code.toUpperCase())) {
      return { success: false, message: `Discount code ${rule.code} already exists.` };
    }

    const newDisc: DiscountRule = {
      ...rule,
      code: rule.code.toUpperCase().trim(),
      id: `disc-${Date.now()}`,
      current_usage_count: 0,
      created_by: this.currentUser.email,
      created_at: new Date().toISOString()
    };
    this.discounts.unshift(newDisc);
    this.logActivity('Discount Rule Created', 'discount', newDisc.code, `Admin created discount ${newDisc.code} (${newDisc.value}${newDisc.type === 'percent' ? '%' : '$'} off, limit: ${newDisc.max_usage_limit})`);
    this.notify();
    return { success: true, message: `Discount rule ${newDisc.code} created!`, rule: newDisc };
  }

  public applyDiscountToSubscription(subscriptionId: string, discountCode: string): { success: boolean; message: string } {
    const sub = this.subscriptions.find((s) => s.id === subscriptionId);
    if (!sub) return { success: false, message: 'Subscription not found.' };

    const disc = this.discounts.find(
      (d) => d.code.toUpperCase() === discountCode.toUpperCase() && d.is_active
    );
    if (!disc) return { success: false, message: 'Invalid or inactive discount code.' };

    const today = new Date().toISOString().split('T')[0];
    if (today < disc.start_date || today > disc.end_date) {
      return { success: false, message: `Discount has expired (valid: ${disc.start_date} to ${disc.end_date}).` };
    }

    if (disc.current_usage_count >= disc.max_usage_limit) {
      return { success: false, message: `Discount usage limit (${disc.max_usage_limit}) has been reached.` };
    }

    if (disc.min_purchase_amount && sub.subtotal < disc.min_purchase_amount) {
      return { success: false, message: `Minimum purchase of $${disc.min_purchase_amount} required to apply this discount.` };
    }

    // Apply
    sub.applied_discount_id = disc.id;
    sub.applied_discount_code = disc.code;
    this.recalculateSubscription(sub);
    this.notify();
    return { success: true, message: `Discount ${disc.code} applied to subscription ${sub.sub_number}!` };
  }

  private recalculateSubscription(sub: Subscription) {
    let subtotal = 0;
    sub.lines.forEach((l) => {
      subtotal += l.quantity * l.unit_price;
    });

    let discountTotal = 0;
    if (sub.applied_discount_id) {
      const disc = this.discounts.find((d) => d.id === sub.applied_discount_id);
      if (disc && disc.is_active) {
        if (disc.scope === 'whole_subscription') {
          discountTotal = disc.type === 'percent' ? (subtotal * disc.value) / 100 : Math.min(disc.value, subtotal);
        } else if (disc.scope === 'specific_product' && disc.target_product_id) {
          const matchLine = sub.lines.find((l) => l.product_id === disc.target_product_id);
          if (matchLine) {
            const lineSub = matchLine.quantity * matchLine.unit_price;
            discountTotal = disc.type === 'percent' ? (lineSub * disc.value) / 100 : Math.min(disc.value, lineSub);
          }
        }
      }
    }

    const defaultTaxRate = this.taxes.find((t) => t.is_default)?.rate || 18;
    const taxableAmount = Math.max(0, subtotal - discountTotal);
    const taxTotal = (taxableAmount * defaultTaxRate) / 100;

    sub.subtotal = subtotal;
    sub.discount_total = discountTotal;
    sub.tax_total = taxTotal;
    sub.total_amount = taxableAmount + taxTotal;
  }

  // ============================================================================
  // TAX RULES (PDF Scene 4: rules set by admin)
  // ============================================================================

  public getTaxes(): TaxRule[] {
    return this.taxes;
  }

  public addTaxRule(tax: Omit<TaxRule, 'id'>): TaxRule {
    const newTax: TaxRule = {
      ...tax,
      id: `tax-${Date.now()}`
    };
    if (newTax.is_default) {
      this.taxes.forEach((t) => (t.is_default = false));
    }
    this.taxes.unshift(newTax);
    this.notify();
    return newTax;
  }

  // ============================================================================
  // BILLING DAY AUTOMATED ENGINE (PDF Scene 4)
  // "It is billing day, and hundreds of subscriptions are due at once.
  // Nobody should be typing invoices by hand. Each one should be created from its
  // subscription, with customer details, product lines, taxes and totals already filled in.
  // Nothing should be billed twice or skipped."
  // ============================================================================

  public getSubscriptionsDueForBilling(targetDate?: string): Subscription[] {
    const cutoff = targetDate || '2026-11-02';
    return this.subscriptions.filter((s) => {
      // Must be Active or Confirmed
      if (s.status !== 'active' && s.status !== 'confirmed') return false;
      // Must be due: next_billing_date <= cutoff
      if (s.next_billing_date > cutoff) return false;
      // Must not be already billed for this billing cycle date
      if (s.last_billed_date && s.last_billed_date >= s.next_billing_date) return false;
      return true;
    });
  }

  public runBillingDay(targetDate?: string): {
    generatedCount: number;
    invoices: Invoice[];
    skippedCount: number;
    totalBilledAmount: number;
    errors: string[];
  } {
    const today = targetDate || '2026-11-02';
    const dueSubs = this.getSubscriptionsDueForBilling(today);
    const newInvoices: Invoice[] = [];
    let totalBilled = 0;
    const errors: string[] = [];

    dueSubs.forEach((sub) => {
      // Idempotency check: guard against duplicate billing
      const alreadyBilledThisCycle = this.invoices.some(
        (inv) =>
          inv.subscription_id === sub.id &&
          inv.billing_period_start === sub.next_billing_date &&
          inv.status !== 'cancelled'
      );

      if (alreadyBilledThisCycle) {
        return; // Guard: skip duplicate
      }

      const invCount = this.invoices.length + newInvoices.length + 1;
      const invNumber = `INV-2026-${String(invCount).padStart(4, '0')}`;

      // Calculate period end based on plan interval
      const plan = this.plans.find((p) => p.id === sub.plan_id);
      const interval = plan?.billing_interval || 'monthly';
      const periodStart = sub.next_billing_date;

      const pStartDate = new Date(periodStart);
      const pEndDate = new Date(pStartDate);
      const nextBillDate = new Date(pStartDate);

      if (interval === 'daily') {
        pEndDate.setDate(pEndDate.getDate() + 1);
        nextBillDate.setDate(nextBillDate.getDate() + 1);
      } else if (interval === 'weekly') {
        pEndDate.setDate(pEndDate.getDate() + 7);
        nextBillDate.setDate(nextBillDate.getDate() + 7);
      } else if (interval === 'yearly') {
        pEndDate.setFullYear(pEndDate.getFullYear() + 1);
        nextBillDate.setFullYear(nextBillDate.getFullYear() + 1);
      } else {
        // monthly default
        pEndDate.setMonth(pEndDate.getMonth() + 1);
        nextBillDate.setMonth(nextBillDate.getMonth() + 1);
      }

      // Check discount expiration & usage
      let discountAmount = 0;
      if (sub.applied_discount_id) {
        const disc = this.discounts.find((d) => d.id === sub.applied_discount_id);
        if (disc && disc.is_active) {
          const isDateValid = today >= disc.start_date && today <= disc.end_date;
          const isUnderLimit = disc.current_usage_count < disc.max_usage_limit;
          if (isDateValid && isUnderLimit) {
            discountAmount = sub.discount_total;
            disc.current_usage_count += 1;
            if (disc.current_usage_count >= disc.max_usage_limit) {
              disc.is_active = false; // Expired by limit
            }
          } else {
            // Expired or limit reached: detach discount
            sub.applied_discount_id = undefined;
            sub.applied_discount_code = undefined;
            sub.discount_total = 0;
          }
        }
      }

      const subtotal = sub.subtotal;
      const defaultTax = this.taxes.find((t) => t.is_default)?.rate || 18;
      const taxable = Math.max(0, subtotal - discountAmount);
      const taxAmount = (taxable * defaultTax) / 100;
      const totalAmount = taxable + taxAmount;

      // Due date based on payment terms
      const dueDateObj = new Date(pStartDate);
      if (sub.payment_terms === 'net15') dueDateObj.setDate(dueDateObj.getDate() + 15);
      else if (sub.payment_terms === 'net30') dueDateObj.setDate(dueDateObj.getDate() + 30);
      else if (sub.payment_terms === 'net60') dueDateObj.setDate(dueDateObj.getDate() + 60);

      const invoiceLines: InvoiceLine[] = sub.lines.map((l, idx) => ({
        id: `invline-${Date.now()}-${idx}`,
        invoice_id: '',
        product_id: l.product_id,
        product_name: l.product_name,
        variant_name: l.variant_name,
        quantity: l.quantity,
        unit_price: l.unit_price,
        tax_rate: l.tax_rate,
        tax_amount: (l.subtotal * l.tax_rate) / 100,
        discount_amount: l.discount_amount,
        line_total: l.total
      }));

      const newInv: Invoice = {
        id: `inv-${Date.now()}-${newInvoices.length}`,
        invoice_number: invNumber,
        subscription_id: sub.id,
        subscription_number: sub.sub_number,
        customer_id: sub.customer_id,
        customer_name: sub.customer_name,
        customer_email: sub.customer_email,
        status: 'draft', // Moves from Draft to Confirmed to Paid
        issue_date: today,
        due_date: dueDateObj.toISOString().split('T')[0],
        billing_period_start: periodStart,
        billing_period_end: pEndDate.toISOString().split('T')[0],
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        amount_paid: 0,
        amount_due: totalAmount,
        payment_terms: sub.payment_terms,
        notes: `Automated billing run for ${sub.plan_name}. ${sub.applied_discount_code ? `Discount ${sub.applied_discount_code} applied.` : ''}`,
        created_at: new Date().toISOString(),
        lines: invoiceLines
      };

      invoiceLines.forEach((il) => (il.invoice_id = newInv.id));
      newInvoices.push(newInv);
      totalBilled += totalAmount;

      // Update subscription billing dates & ensure it's active
      sub.last_billed_date = periodStart;
      sub.next_billing_date = nextBillDate.toISOString().split('T')[0];
      if (sub.status === 'confirmed') sub.status = 'active';
      sub.updated_at = new Date().toISOString();
    });

    if (newInvoices.length > 0) {
      this.invoices.unshift(...newInvoices);
      this.logActivity(
        'Billing Day Executed',
        'invoice',
        `BATCH-${today}`,
        `Automated billing run generated ${newInvoices.length} invoices totaling $${totalBilled.toFixed(2)}. Zero duplicate billings.`
      );
      this.notify();
    }

    return {
      generatedCount: newInvoices.length,
      invoices: newInvoices,
      skippedCount: this.subscriptions.length - dueSubs.length,
      totalBilledAmount: totalBilled,
      errors
    };
  }

  // ============================================================================
  // INVOICES & PAYMENTS WORKFLOW (PDF Scene 4 & 6)
  // Invoices move: Draft -> Confirmed -> Paid
  // Actions: Confirm, Cancel, Send/Print
  // ============================================================================

  public getInvoices(): Invoice[] {
    return this.invoices;
  }

  public getCustomerInvoices(customerEmail: string): Invoice[] {
    return this.invoices.filter(
      (inv) => inv.customer_email.toLowerCase() === customerEmail.toLowerCase()
    );
  }

  public updateInvoiceStatus(id: string, newStatus: InvoiceStatus): boolean {
    const inv = this.invoices.find((i) => i.id === id);
    if (!inv) return false;
    inv.status = newStatus;
    if (newStatus === 'paid') {
      inv.amount_paid = inv.total_amount;
      inv.amount_due = 0;
    }
    this.logActivity('Invoice Status Updated', 'invoice', inv.invoice_number, `Invoice moved to "${newStatus}"`);
    this.notify();
    return true;
  }

  public sendInvoice(id: string): { success: boolean; message: string } {
    const inv = this.invoices.find((i) => i.id === id);
    if (!inv) return { success: false, message: 'Invoice not found.' };

    inv.sent_at = new Date().toISOString();
    if (inv.status === 'draft') inv.status = 'confirmed';

    this.logActivity(
      'Invoice Sent',
      'invoice',
      inv.invoice_number,
      `Sent invoice ${inv.invoice_number} to registered email: ${inv.customer_email}`
    );
    this.notify();
    return { success: true, message: `Invoice ${inv.invoice_number} dispatched to ${inv.customer_email}!` };
  }

  public recordPayment(params: {
    invoice_id: string;
    amount: number;
    payment_method: Payment['payment_method'];
    payment_date: string;
    reference_note: string;
  }): { success: boolean; message: string; payment?: Payment } {
    const inv = this.invoices.find((i) => i.id === params.invoice_id);
    if (!inv) return { success: false, message: 'Invoice not found.' };

    if (params.amount <= 0) return { success: false, message: 'Payment amount must be greater than zero.' };

    const payCount = this.payments.length + 1;
    const payNumber = `PAY-2026-${String(payCount).padStart(4, '0')}`;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      payment_number: payNumber,
      invoice_id: inv.id,
      invoice_number: inv.invoice_number,
      subscription_id: inv.subscription_id,
      customer_id: inv.customer_id,
      customer_name: inv.customer_name,
      amount: params.amount,
      payment_method: params.payment_method,
      payment_date: params.payment_date,
      reference_note: params.reference_note,
      status: 'completed',
      created_at: new Date().toISOString()
    };

    inv.amount_paid += params.amount;
    inv.amount_due = Math.max(0, inv.total_amount - inv.amount_paid);

    if (inv.amount_due <= 0.01) {
      inv.status = 'paid';
    } else {
      if (inv.status === 'draft') inv.status = 'confirmed';
    }

    this.payments.unshift(newPayment);
    this.logActivity(
      'Payment Recorded',
      'payment',
      payNumber,
      `Recorded $${params.amount.toFixed(2)} via ${params.payment_method} against ${inv.invoice_number}. Outstanding balance: $${inv.amount_due.toFixed(2)}`
    );
    this.notify();
    return { success: true, message: `Payment of $${params.amount.toFixed(2)} successfully recorded!`, payment: newPayment };
  }

  public getPayments(): Payment[] {
    return this.payments;
  }

  // ============================================================================
  // FINANCE LEAD ANALYTICS & EXECUTIVE REPORTING (PDF Scene 7)
  // "How many subscriptions are active? How much revenue came in, and how much is still owed?
  // Which invoices are overdue? Response < 2 seconds."
  // ============================================================================

  public getFinanceSummary(targetDate?: string): FinanceSummary {
    const today = targetDate || '2026-10-31';

    // Active subscriptions
    const activeSubs = this.subscriptions.filter((s) => s.status === 'active');
    
    // Total distinct customers
    const uniqueCustomers = new Set(this.subscriptions.map((s) => s.customer_email));

    // Calculate MRR (Monthly Recurring Revenue)
    let mrr = 0;
    activeSubs.forEach((sub) => {
      const plan = this.plans.find((p) => p.id === sub.plan_id);
      const interval = plan?.billing_interval || 'monthly';
      const monthlyTotal = sub.total_amount;

      if (interval === 'monthly') mrr += monthlyTotal;
      else if (interval === 'yearly') mrr += monthlyTotal / 12;
      else if (interval === 'weekly') mrr += monthlyTotal * 4.33;
      else if (interval === 'daily') mrr += monthlyTotal * 30;
    });

    const arr = mrr * 12;

    // Revenue collected
    const totalRevenueCollected = this.payments.reduce((acc, p) => acc + p.amount, 0);

    // Outstanding receivables
    const outstandingInvoices = this.invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled');
    const outstandingReceivables = outstandingInvoices.reduce((acc, i) => acc + i.amount_due, 0);

    // Overdue invoices
    const overdueInvoices = outstandingInvoices.filter((i) => i.due_date < today);
    const overdueAmount = overdueInvoices.reduce((acc, i) => acc + i.amount_due, 0);

    const draftInvoicesCount = this.invoices.filter((i) => i.status === 'draft').length;

    return {
      active_subscriptions_count: activeSubs.length,
      total_subscribers: uniqueCustomers.size,
      mrr: Math.round(mrr * 100) / 100,
      arr: Math.round(arr * 100) / 100,
      total_revenue_collected: Math.round(totalRevenueCollected * 100) / 100,
      outstanding_receivables: Math.round(outstandingReceivables * 100) / 100,
      overdue_invoices_count: overdueInvoices.length,
      overdue_amount: Math.round(overdueAmount * 100) / 100,
      draft_invoices_count: draftInvoicesCount
    };
  }

  public getActivityLogs(): ActivityLog[] {
    return this.activityLogs;
  }

  private logActivity(action: string, entity: ActivityLog['entity'], entity_id: string, details: string) {
    this.activityLogs.unshift({
      id: `act-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      action,
      entity,
      entity_id,
      user_email: this.currentUser?.email || 'system@brightloop.com',
      details,
      created_at: new Date().toISOString()
    });
    if (this.activityLogs.length > 100) this.activityLogs.pop();
  }
}

// Global Singleton Instance
export const store = new BrightloopDataStore();
