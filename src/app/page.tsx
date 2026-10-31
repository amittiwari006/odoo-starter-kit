'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import {
  Layers,
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Tag,
  Users,
  Package
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchRole = (role: 'admin' | 'staff' | 'customer') => {
    store.switchDemoRole(role);
    if (role === 'customer') {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#714B67] text-white flex items-center justify-center font-black text-lg shadow-sm">
              B
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Brightloop</span>
              <span className="text-xs text-[#714B67] font-bold ml-1.5 px-2 py-0.5 rounded-full bg-purple-50">
                Software
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link href="/auth" className="text-gray-600 hover:text-gray-900 font-semibold px-3 py-1.5">
              Sign In
            </Link>
            <button
              onClick={() => handleLaunchRole('admin')}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              Open Platform Workspace <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-white"
        style={{
          background: 'linear-gradient(135deg, #714B67 0%, #5c3d55 50%, #3d2438 100%)'
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-purple-100 text-xs px-4 py-1.5 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Odoo × FLUX Lucknow Hackathon 2026 • Official Problem Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight tracking-tight">
            The Digital Backbone for <br />
            <span className="text-purple-200">Subscription & Recurring Billing</span>
          </h1>

          <p className="text-base sm:text-lg text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
            Eliminate missed renewals, manual spreadsheet reconciliations, and typed invoices. Brightloop
            unifies product variants, flexible billing frequencies, automated batch invoicing,
            dynamic discount rules, and self-service customer portals in under two-second response time.
          </p>

          {/* Quick Demo Personas Launch Bar */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 max-w-3xl mx-auto">
            <div className="text-[11px] uppercase tracking-wider text-purple-200 font-bold mb-3">
              Direct Judge Evaluation Access (Instant Persona Launch)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleLaunchRole('admin')}
                className="bg-white hover:bg-purple-50 text-[#714B67] p-3 rounded-xl font-bold text-left transition shadow-md group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Admin
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition text-[#714B67]" />
                </div>
                <div className="text-sm font-black text-gray-900">Amit Tiwari</div>
                <div className="text-[11px] text-gray-500 font-normal">Full control, rules & staff</div>
              </button>

              <button
                onClick={() => handleLaunchRole('staff')}
                className="bg-white hover:bg-purple-50 text-[#714B67] p-3 rounded-xl font-bold text-left transition shadow-md group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    Staff
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition text-[#714B67]" />
                </div>
                <div className="text-sm font-black text-gray-900">Utkarsh & Shiwanshi</div>
                <div className="text-[11px] text-gray-500 font-normal">Quotes, billing & payments</div>
              </button>

              <button
                onClick={() => handleLaunchRole('customer')}
                className="bg-white hover:bg-purple-50 text-[#714B67] p-3 rounded-xl font-bold text-left transition shadow-md group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Customer
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition text-[#714B67]" />
                </div>
                <div className="text-sm font-black text-gray-900">Rahul Verma</div>
                <div className="text-[11px] text-gray-500 font-normal">Self-service portal & renew</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points vs Brightloop Architecture (How Things Run Today) */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-[#714B67] tracking-wider block mb-1">
              The Brightloop Transformation
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              From Broken Spreadsheets to Automated Revenue
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Old Painful Way */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-6">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-4">
                ❌ How Things Ran Yesterday (Pain Points)
              </span>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Spreadsheet Subscriptions:</strong> Manually tracked in disconnected sheets with zero relational integrity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Forgotten Renewals:</strong> Expired contracts kept running unnoticed or were remembered at the last second.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Manual Invoicing:</strong> Hundreds of invoices retyped by hand every month leading to costly human errors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Bank Statement Scrolling:</strong> Trying to match random bank transfers to open invoices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span><strong>Zero MRR Visibility:</strong> Finance lead taking days at end-of-quarter to calculate true recurring revenue.</span>
                </li>
              </ul>
            </div>

            {/* The Brightloop Software Solution */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-6">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-4">
                ✅ The Brightloop Software Platform
              </span>
              <ul className="space-y-3 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Unified Relational Models:</strong> PostgreSQL schema connecting products, plans, quotes, subscriptions, and payments.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automated Billing Day:</strong> 1-Click batch run generating verified invoices with taxes & discounts. Zero double-billing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Quotation Templates:</strong> Instant quote generation with pre-filled line items and validity countdowns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Customer Self-Service:</strong> Dedicated portal where clients view bills, self-pause, and renew contracts directly.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Executive Live Analytics:</strong> Real-time MRR, ARR, cash collection, and overdue aging in under two seconds.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Breakdown by Problem Statement Scenes */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-[#714B67] tracking-wider block mb-1">
              Functional Completeness
            </span>
            <h2 className="text-3xl font-black text-gray-900">
              Engineered To Fulfill Every Problem Scene
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="odoo-card p-5 border-t-4 border-t-[#714B67]">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <Users size={16} className="text-[#714B67]" />
                Scene 1: Customer Signup & RBAC
              </div>
              <p className="text-gray-600 leading-relaxed">
                Unique email enforcement, strict password complexity (&gt;8 chars, uppercase, lowercase, special char), password reset link, and strict admin-only staff creation.
              </p>
            </div>

            <div className="odoo-card p-5 border-t-4 border-t-purple-600">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <Package size={16} className="text-purple-600" />
                Scene 2: Plans, Pricing & Variants
              </div>
              <p className="text-gray-600 leading-relaxed">
                Products with sales/cost prices, dynamic variants (e.g. Odoo brand adds +$560), and multi-interval plans (daily, weekly, monthly, yearly) with lifecycle rules.
              </p>
            </div>

            <div className="odoo-card p-5 border-t-4 border-t-indigo-600">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <FileText size={16} className="text-indigo-600" />
                Scene 3: Quotation to Subscription
              </div>
              <p className="text-gray-600 leading-relaxed">
                Quotation templates with validity days. Moves cleanly through Odoo state bar: Draft → Quotation → Confirmed → Active → Closed.
              </p>
            </div>

            <div className="odoo-card p-5 border-t-4 border-t-teal-600">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <Zap size={16} className="text-teal-600" />
                Scene 4: Automated Billing Day
              </div>
              <p className="text-gray-600 leading-relaxed">
                1-Click batch engine evaluates due dates, applies admin tax rules, prevents duplicate billing, and enables print/PDF and email dispatch.
              </p>
            </div>

            <div className="odoo-card p-5 border-t-4 border-t-amber-600">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <Tag size={16} className="text-amber-600" />
                Scene 5: Discount Rules Engine
              </div>
              <p className="text-gray-600 leading-relaxed">
                Admin-only discounts: fixed or %, minimum purchase, usage limits, and product or whole-subscription scope with automated recurrence.
              </p>
            </div>

            <div className="odoo-card p-5 border-t-4 border-t-emerald-600">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-900 text-sm">
                <DollarSign size={16} className="text-emerald-600" />
                Scene 6 & 7: Cash & Finance Lead
              </div>
              <p className="text-gray-600 leading-relaxed">
                Multi-method payment recording against invoices, accounts receivable aging tracker, overdue invoice chasing, and sub-2-second MRR/ARR analytics by Aakriti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 px-6 border-t border-gray-800 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#714B67] text-white flex items-center justify-center font-bold text-sm">
              B
            </div>
            <span className="font-bold text-sm">Brightloop Software Platform</span>
          </div>
          <div className="text-gray-400 text-center sm:text-right">
            Built for Odoo × FLUX Lucknow Hackathon 2026 by Amit Tiwari, Utkarsh, Shiwanshi, Aakriti (<span className="text-white">@amittiwari006</span>)
          </div>
        </div>
      </footer>
    </div>
  );
}
