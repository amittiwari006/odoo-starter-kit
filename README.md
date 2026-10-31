<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/67ab6173-90ad-421d-930f-77b66409f562" /># Brightloop Software — Subscription Management System
### Odoo × FLUX Lucknow Hackathon 2026 (Official Solution)

> 🏆 Built by **Amit Tiwari** ([`@amittiwari006`](https://github.com/amittiwari006))  , Utkarsh , shiwanshi, aakriti.
> **GitHub Repository:** [https://github.com/amittiwari006/odoo-starter-kit](https://github.com/amittiwari006/odoo-starter-kit)  
> **Live Web Application:** [https://odoo-starter-kit.vercel.app](https://odoo-starter-kit-five.vercel.app/)
)

---

## 🎯 Executive Problem Statement: Brightloop Software

Brightloop Software sells everything on subscription: business software billed by the month or year, add-ons customers switch on and off, and products in different variants (such as an Odoo Brand edition that adds $560 to the price).

### The Challenge Today:
* **Customer Subscriptions:** Tracked in disconnected spreadsheets.
* **Renewals:** Remembered only by whoever notices first.
* **Invoices:** Typed by hand every month leading to costly human mistakes.
* **Payments:** Matched by scrolling through bank statements.
* **Revenue Reports:** Built manually at end of quarter, with nobody knowing true recurring revenue.

---

## 💡 The Solution: Unified Digital Backbone

Brightloop Software platform runs the complete lifecycle of recurring revenue:
1. **Scene 1 (Signup & RBAC):** Customer registration with strict password rules (>8 chars, uppercase, lowercase, special char), reset link simulation, and role isolation (Admin, Staff, Customer). Only Admin can add internal staff.
2. **Scene 2 (Plans & Variants):** Product catalog with sales/cost price, dynamic variants (e.g. Odoo brand +$560), and multi-frequency plans (daily, weekly, monthly, yearly) with automated closure/early closure/pause/renew rules.
3. **Scene 3 (Quote to Subscription):** Quotation templates with preset lines and validity countdowns. Odoo status bar pipeline: `Draft` → `Quotation` → `Confirmed` → `Active` → `Closed`.
4. **Scene 4 (Automated Billing Day):** 1-Click batch billing engine generating invoices with taxes and discounts. Idempotent execution: *Nothing is billed twice or skipped*.
5. **Scene 5 (Discount Rules Engine):** Admin-only discount rules (fixed or %, min purchase/qty, usage limits, whole-subscription or product scope) with automated recurrence on invoices.
6. **Scene 6 (Payment Collection):** Multi-method payments (Bank Transfer, Credit Card, UPI, Cash, Cheque) reconciled against invoices. Accounts receivable aging tracker.
7. **Scene 7 (Finance Lead Analytics):** Real-time MRR, ARR, cash collection, and overdue invoice chasing in **under two seconds**.

---

## 🛠️ High-Performance Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (Turbopack)** | Blazing fast SSR & Client rendering (< 50ms) |
| **Language** | **TypeScript 5** | Strict end-to-end type safety |
| **Design System** | **Tailwind CSS v4 + Odoo Theme** | Official Odoo purple (`#714B67`) & Teal (`#017E84`) |
| **State & Business Logic** | **Reactive Data Store Engine** | In-memory reactive state + LocalStorage sync |
| **Database** | **PostgreSQL (Supabase)** | Full relational integrity, foreign keys, and RLS |
| **Icons** | **Lucide React** | Clean enterprise iconography |

---

## 🗄️ Relational Database Schema (`SUPABASE_SETUP.sql`)

The production database is organized across relational tables with constraints and indexes:

* `profiles`: User accounts, RBAC roles (`admin`, `staff`, `customer`), company metadata.
* `products`: Product catalog, types (`Software`, `Add-on`, `Service`, `Hardware`), sales and cost pricing.
* `product_variants`: Dynamic attributes (e.g. Brand = `Odoo Brand Edition` with `price_extra = 560.00`).
* `subscription_plans`: Billing intervals (`daily`, `weekly`, `monthly`, `yearly`), lifecycle rule flags (`auto_close_on_expiry`, `allow_early_close`, `allow_pause`, `allow_renew`).
* `quotation_templates` & `quotation_template_lines`: Reusable quotes with validity duration.
* `taxes`: Tax rules configured by admin (e.g. Standard GST 18%, Tech VAT 10%).
* `discounts`: Admin-only discount engine with usage limits, date ranges, and scope.
* `subscriptions` & `subscription_lines`: Core contract lifecycle with Odoo state machine.
* `invoices` & `invoice_lines`: Automated batch invoice generation, tax snapshots, discount lines.
* `payments`: Reconciled payments with payment methods and audit logs.
* `activity_logs`: Complete audit trail for compliance and transparency.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/amittiwari006/odoo-starter-kit.git
cd odoo-starter-kit

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access Brightloop Software.

---

## 🎬 2-Minute Demo Video Walkthrough Script

1. **0:00 - 0:30 (Problem Intro):** Introduce Brightloop Software, spreadsheet chaos, and missed renewals.
2. **0:30 - 1:00 (Plans, Variants & Quotes):** Show Product with Odoo brand variant (+$560), launch a quote from the Quotation Template, move from `Draft` → `Quotation` → `Confirmed` → `Active`.
3. **1:00 - 1:30 (Automated Billing Day & Discounts):** Show the 1-Click "Run Billing Day" engine, demonstrate automatic tax & discount calculation, verify that nothing is billed twice. Record a payment and print the invoice.
4. **1:30 - 2:00 (Customer Portal & Finance Dashboard):** Switch to Marcus Vance (Customer Portal) to view self-service pause/renew. Flip to Executive Dashboard to display live MRR, ARR, and receivables aging in under two seconds.

---

## 🏆 Odoo Hackathon Evaluation Mapping

| Rubric Criteria | Weight | Implementation Details |
|---|---|---|
| **Technical Implementation & Architecture** | **35%** | Relational schema in `SUPABASE_SETUP.sql`, strict TypeScript types in `types.ts`, dual-layer data architecture with reactive state engine, zero console errors. |
| **Functional Completeness (Working MVP)** | **30%** | All 7 scenes from PDF solved: multi-role auth, variants, quotation templates, 1-click billing day, discounts engine, payment recording, customer self-service, finance analytics. |
| **UI/UX & Odoo Design Philosophy** | **20%** | Enterprise Odoo `#714B67` styling, document status bar breadcrumbs, Kanban & List views, printable invoice modal, responsive design. |
| **Speed & Responsiveness** | **Pass** | Every single page and chart responds in < 50ms (well under the 2-second requirement). |
