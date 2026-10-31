'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import StatusBar from '@/components/StatusBar';
import InvoicePrintModal from '@/components/InvoicePrintModal';
import BillingDayModal from '@/components/BillingDayModal';
import RegisterPaymentModal from '@/components/RegisterPaymentModal';
import ExecutiveCharts from '@/components/ExecutiveCharts';
import { store } from '@/lib/store';
import {
  Subscription,
  Invoice,
  Payment,
  Product,
  SubscriptionPlan,
  QuotationTemplate,
  DiscountRule,
  TaxRule,
  UserProfile,
  SubscriptionStatus
} from '@/lib/types';
import {
  Layers,
  FileText,
  DollarSign,
  Plus,
  Search,
  Filter,
  Play,
  Calendar,
  Send,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Tag,
  Package,
  Users,
  Eye,
  CreditCard,
  Check,
  XCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

export default function AdminWorkspacePage() {
  const [activeTab, setActiveTab] = useState<string>('finance');
  const [currentUser, setCurrentUser] = useState<UserProfile>(store.getCurrentUser());

  // Store data states
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(store.getSubscriptions());
  const [invoices, setInvoices] = useState<Invoice[]>(store.getInvoices());
  const [payments, setPayments] = useState<Payment[]>(store.getPayments());
  const [products, setProducts] = useState<Product[]>(store.getProducts());
  const [plans, setPlans] = useState<SubscriptionPlan[]>(store.getPlans());
  const [templates, setTemplates] = useState<QuotationTemplate[]>(store.getTemplates());
  const [discounts, setDiscounts] = useState<DiscountRule[]>(store.getDiscounts());
  const [taxes, setTaxes] = useState<TaxRule[]>(store.getTaxes());
  const [profiles, setProfiles] = useState<UserProfile[]>(store.getProfiles());
  const [financeSummary, setFinanceSummary] = useState(store.getFinanceSummary());

  // Modals & Drawers
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isNewQuoteOpen, setIsNewQuoteOpen] = useState(false);
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [isNewDiscountOpen, setIsNewDiscountOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subViewMode, setSubViewMode] = useState<'list' | 'kanban'>('list');
  const [todayStr, setTodayStr] = useState<string>('2026-10-31');

  // New Staff State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffMsg, setStaffMsg] = useState<{ text: string; success: boolean } | null>(null);

  // Sync with store
  const refreshData = () => {
    setCurrentUser(store.getCurrentUser());
    setSubscriptions([...store.getSubscriptions()]);
    setInvoices([...store.getInvoices()]);
    setPayments([...store.getPayments()]);
    setProducts([...store.getProducts()]);
    setPlans([...store.getPlans()]);
    setTemplates([...store.getTemplates()]);
    setDiscounts([...store.getDiscounts()]);
    setTaxes([...store.getTaxes()]);
    setProfiles([...store.getProfiles()]);
    setFinanceSummary(store.getFinanceSummary());
  };

  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
    const unsub = store.subscribe(() => {
      refreshData();
    });
    return unsub;
  }, []);

  const dueForBillingCount = store.getSubscriptionsDueForBilling().length;

  // ==========================================================================
  // SUBSCRIPTION HANDLERS
  // ==========================================================================
  const handleSubscriptionStageChange = (newStage: string) => {
    if (!selectedSubscription) return;
    const res = store.updateSubscriptionStatus(
      selectedSubscription.id,
      newStage as SubscriptionStatus
    );
    if (!res.success) {
      alert(res.message);
    } else {
      setSelectedSubscription({
        ...selectedSubscription,
        status: newStage as SubscriptionStatus
      });
      refreshData();
    }
  };

  const handleApplyDiscountToSub = (subId: string, code: string) => {
    const res = store.applyDiscountToSubscription(subId, code);
    alert(res.message);
    if (res.success) {
      const updated = store.getSubscriptions().find((s) => s.id === subId);
      if (updated) setSelectedSubscription(updated);
      refreshData();
    }
  };

  // ==========================================================================
  // STAFF INVITATION HANDLER (PDF Scene 1: Admin only)
  // ==========================================================================
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName || !staffEmail) return;
    const res = store.addStaffMember(staffName, staffEmail);
    setStaffMsg({ text: res.message, success: res.success });
    if (res.success) {
      setStaffName('');
      setStaffEmail('');
      setTimeout(() => setStaffMsg(null), 3500);
    }
  };

  // ==========================================================================
  // FILTERED DATA
  // ==========================================================================
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchQuery =
      sub.sub_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.plan_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const filteredInvoices = invoices.filter((inv) => {
    const matchQuery =
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.subscription_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchQuery && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Header & Fast Actions */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {activeTab === 'finance'
                  ? 'Executive Financial Control'
                  : activeTab === 'subscriptions'
                  ? 'Subscriptions & Quotes'
                  : activeTab === 'invoices'
                  ? 'Invoices & Billing Center'
                  : activeTab === 'payments'
                  ? 'Payments & Receivables'
                  : activeTab === 'plans'
                  ? 'Subscription Plans & Rules'
                  : activeTab === 'products'
                  ? 'Product & Variant Catalog'
                  : activeTab === 'templates'
                  ? 'Quotation Templates'
                  : activeTab === 'discounts'
                  ? 'Discount Rules & Taxes'
                  : 'Staff & Access Management'}
              </h1>
              {dueForBillingCount > 0 && activeTab !== 'finance' && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                  {dueForBillingCount} due for billing
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Brightloop Software Operations Platform • Unified Subscription Lifecycle
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Run Billing Day Engine Button */}
            <button
              onClick={() => setIsBillingModalOpen(true)}
              className="btn-primary text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-sm"
              title="Run automated billing cycle for all due subscriptions"
            >
              <Play size={13} className="text-amber-300" />
              <span>Run Billing Day</span>
              {dueForBillingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#714B67] font-black text-[10px] flex items-center justify-center">
                  {dueForBillingCount}
                </span>
              )}
            </button>

            {/* New Quote Button */}
            <button
              onClick={() => setIsNewQuoteOpen(true)}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>New Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* ================================================================== */}
        {/* TAB 1: EXECUTIVE FINANCIAL SUMMARY (Scene 7) */}
        {/* ================================================================== */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <ExecutiveCharts
              summary={financeSummary}
              subscriptions={subscriptions}
              invoices={invoices}
              payments={payments}
            />

            {/* Overdue Invoices Requiring Chase Table */}
            <div className="odoo-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" />
                  <h3 className="font-bold text-sm text-gray-900">
                    Overdue Invoices Requiring Chase ({financeSummary.overdue_invoices_count})
                  </h3>
                </div>
                <span className="text-xs text-gray-500">
                  Total Outstanding Overdue: ${financeSummary.overdue_amount.toFixed(2)}
                </span>
              </div>

              {invoices.filter((i) => i.status !== 'paid' && i.due_date < todayStr).length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-500">
                  No invoices are currently overdue. All receivables are in good standing!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="odoo-table text-xs">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Customer</th>
                        <th>Subscription</th>
                        <th>Due Date</th>
                        <th>Total Amount</th>
                        <th>Balance Due</th>
                        <th>Status</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices
                        .filter((i) => i.status !== 'paid' && i.due_date < todayStr)
                        .map((inv) => (
                          <tr key={inv.id}>
                            <td className="font-bold text-[#714B67]">{inv.invoice_number}</td>
                            <td className="font-medium text-gray-900">{inv.customer_name}</td>
                            <td>{inv.subscription_number}</td>
                            <td className="text-red-600 font-bold">{inv.due_date}</td>
                            <td>${inv.total_amount.toFixed(2)}</td>
                            <td className="font-bold text-red-600">${inv.amount_due.toFixed(2)}</td>
                            <td>
                              <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                Overdue
                              </span>
                            </td>
                            <td className="text-right space-x-2">
                              <button
                                onClick={() => setSelectedInvoiceForPayment(inv)}
                                className="text-xs text-[#714B67] hover:underline font-semibold"
                              >
                                Record Pay
                              </button>
                              <button
                                onClick={() => {
                                  store.sendInvoice(inv.id);
                                  alert(`Payment reminder sent to ${inv.customer_email}`);
                                }}
                                className="text-xs bg-purple-50 text-[#714B67] px-2.5 py-1 rounded hover:bg-purple-100 font-medium"
                              >
                                Chase
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: SUBSCRIPTIONS & QUOTES (Scene 3) */}
        {/* ================================================================== */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 w-full sm:w-80">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search number, customer, plan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-xs py-1.5"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-gray-500 font-medium">Stage:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field text-xs py-1.5 w-36"
                >
                  <option value="all">All Stages</option>
                  <option value="draft">Draft</option>
                  <option value="quotation">Quotation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>

                <div className="border-l border-gray-200 pl-2 flex gap-1">
                  <button
                    onClick={() => setSubViewMode('list')}
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      subViewMode === 'list'
                        ? 'bg-[#714B67] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setSubViewMode('kanban')}
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      subViewMode === 'kanban'
                        ? 'bg-[#714B67] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Kanban
                  </button>
                </div>
              </div>
            </div>

            {/* List View */}
            {subViewMode === 'list' ? (
              <div className="odoo-card overflow-hidden">
                <table className="odoo-table text-xs">
                  <thead>
                    <tr>
                      <th>Subscription #</th>
                      <th>Customer</th>
                      <th>Plan</th>
                      <th>Next Billing</th>
                      <th>Contract Expiry</th>
                      <th>Terms</th>
                      <th className="text-right">Total</th>
                      <th className="text-center">Stage</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="cursor-pointer hover:bg-purple-50/40">
                        <td
                          className="font-bold text-[#714B67]"
                          onClick={() => setSelectedSubscription(sub)}
                        >
                          {sub.sub_number}
                        </td>
                        <td onClick={() => setSelectedSubscription(sub)}>
                          <div className="font-semibold text-gray-900">{sub.customer_name}</div>
                          <div className="text-[11px] text-gray-400">{sub.customer_email}</div>
                        </td>
                        <td onClick={() => setSelectedSubscription(sub)}>
                          <span className="font-medium text-gray-700">{sub.plan_name}</span>
                        </td>
                        <td onClick={() => setSelectedSubscription(sub)}>
                          <span
                            className={
                              sub.next_billing_date <= todayStr
                                ? 'text-amber-700 font-bold'
                                : 'text-gray-600'
                            }
                          >
                            {sub.next_billing_date}
                          </span>
                        </td>
                        <td onClick={() => setSelectedSubscription(sub)}>{sub.expiry_date}</td>
                        <td onClick={() => setSelectedSubscription(sub)}>
                          <span className="uppercase text-[11px] font-semibold text-gray-500">
                            {sub.payment_terms}
                          </span>
                        </td>
                        <td
                          className="text-right font-black text-gray-900"
                          onClick={() => setSelectedSubscription(sub)}
                        >
                          ${sub.total_amount.toFixed(2)}
                        </td>
                        <td className="text-center" onClick={() => setSelectedSubscription(sub)}>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              sub.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sub.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : sub.status === 'quotation'
                                ? 'bg-indigo-100 text-indigo-800'
                                : sub.status === 'paused'
                                ? 'bg-amber-100 text-amber-800'
                                : sub.status === 'closed'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => setSelectedSubscription(sub)}
                            className="text-xs text-[#714B67] hover:underline font-bold"
                          >
                            Manage →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Kanban Pipeline View */
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {(['draft', 'quotation', 'confirmed', 'active', 'closed'] as SubscriptionStatus[]).map(
                  (stage) => {
                    const stageSubs = subscriptions.filter((s) => s.status === stage);
                    return (
                      <div key={stage} className="bg-gray-100/70 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                            {stage}
                          </span>
                          <span className="text-[11px] bg-white text-gray-600 px-2 py-0.5 rounded-full font-bold shadow-xs">
                            {stageSubs.length}
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {stageSubs.map((sub) => (
                            <div
                              key={sub.id}
                              onClick={() => setSelectedSubscription(sub)}
                              className="bg-white p-3 rounded-md border border-gray-200 shadow-xs hover:border-[#714B67] hover:shadow-sm cursor-pointer transition"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-[#714B67] text-xs">
                                  {sub.sub_number}
                                </span>
                                <span className="font-black text-xs text-gray-900">
                                  ${sub.total_amount.toFixed(0)}
                                </span>
                              </div>
                              <p className="font-semibold text-gray-800 text-xs truncate">
                                {sub.customer_name}
                              </p>
                              <p className="text-[11px] text-gray-500 mt-1">{sub.plan_name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: INVOICES & BILLING (Scene 4) */}
        {/* ================================================================== */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 w-full sm:w-80">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoice #, customer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field text-xs py-1.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field text-xs py-1.5 w-36"
                >
                  <option value="all">All Invoices</option>
                  <option value="draft">Draft</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>

            <div className="odoo-card overflow-hidden">
              <table className="odoo-table text-xs">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Subscription</th>
                    <th>Billing Period</th>
                    <th>Due Date</th>
                    <th>Total Amount</th>
                    <th>Amount Due</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((inv) => {
                    const isOverdue =
                      inv.status !== 'paid' && inv.due_date < todayStr;
                    return (
                      <tr key={inv.id} className="hover:bg-purple-50/30">
                        <td
                          className="font-bold text-[#714B67] cursor-pointer"
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                        >
                          {inv.invoice_number}
                        </td>
                        <td>
                          <div className="font-semibold text-gray-900">{inv.customer_name}</div>
                          <div className="text-[11px] text-gray-400">{inv.customer_email}</div>
                        </td>
                        <td>{inv.subscription_number}</td>
                        <td className="text-gray-600">
                          {inv.billing_period_start} to {inv.billing_period_end}
                        </td>
                        <td>
                          <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {inv.due_date} {isOverdue && '(OVERDUE)'}
                          </span>
                        </td>
                        <td className="font-bold text-gray-900">${inv.total_amount.toFixed(2)}</td>
                        <td className="font-bold text-[#714B67]">${inv.amount_due.toFixed(2)}</td>
                        <td>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : inv.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="text-right space-x-1.5">
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="p-1.5 text-gray-500 hover:text-[#714B67] hover:bg-purple-50 rounded"
                            title="View & Print Invoice"
                          >
                            <Printer size={14} />
                          </button>
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="btn-primary text-xs py-1 px-2.5"
                            >
                              Pay
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: PAYMENTS & AGING (Scene 6) */}
        {/* ================================================================== */}
        {activeTab === 'payments' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Recorded Collections</h3>
                <p className="text-xs text-gray-500">
                  Every incoming payment linked directly against invoice and subscription.
                </p>
              </div>
            </div>

            <div className="odoo-card overflow-hidden">
              <table className="odoo-table text-xs">
                <thead>
                  <tr>
                    <th>Payment #</th>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Payment Method</th>
                    <th>Payment Date</th>
                    <th>Reference / Notes</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="font-bold text-[#714B67]">{p.payment_number}</td>
                      <td className="font-semibold text-gray-800">{p.invoice_number}</td>
                      <td className="font-medium text-gray-900">{p.customer_name}</td>
                      <td>
                        <span className="bg-purple-50 text-[#714B67] px-2 py-0.5 rounded font-semibold text-[11px]">
                          {p.payment_method}
                        </span>
                      </td>
                      <td>{p.payment_date}</td>
                      <td className="text-gray-500">{p.reference_note}</td>
                      <td className="text-right font-black text-emerald-600">
                        ${p.amount.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 5: PLANS & PRICING (Scene 2) */}
        {/* ================================================================== */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Subscription Plans Catalog</h3>
                <p className="text-xs text-gray-500">
                  Configure frequencies (daily, weekly, monthly, yearly) and lifecycle termination rules.
                </p>
              </div>
              <button
                onClick={() => setIsNewPlanOpen(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="odoo-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400">
                        {plan.code}
                      </span>
                      <span className="bg-purple-100 text-[#714B67] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                        {plan.billing_interval}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{plan.name}</h4>
                    <div className="text-2xl font-black text-gray-900 mb-3">
                      ${plan.price.toFixed(2)}
                      <span className="text-xs font-normal text-gray-500">/{plan.billing_interval}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{plan.notes}</p>

                    {/* Lifecycle Rules Flags (PDF Scene 2) */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-3 text-[11px]">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Auto-Close on Expiry:</span>
                        <span className={plan.auto_close_on_expiry ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                          {plan.auto_close_on_expiry ? '✓ Yes' : '✕ No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Allow Early Closure:</span>
                        <span className={plan.allow_early_close ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                          {plan.allow_early_close ? '✓ Yes' : '✕ No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Allow Pausing:</span>
                        <span className={plan.allow_pause ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                          {plan.allow_pause ? '✓ Yes' : '✕ No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Allow Renewal:</span>
                        <span className={plan.allow_renew ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
                          {plan.allow_renew ? '✓ Yes' : '✕ No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 6: PRODUCTS & VARIANTS (Scene 2: Odoo brand +560) */}
        {/* ================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Product & Variant Catalog</h3>
                <p className="text-xs text-gray-500">
                  Products with cost/sales prices and dynamic attribute variants (e.g. Odoo brand +$560).
                </p>
              </div>
              <button
                onClick={() => setIsNewProductOpen(true)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="odoo-card overflow-hidden">
              <table className="odoo-table text-xs">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Type</th>
                    <th>Sales Price</th>
                    <th>Cost Price</th>
                    <th>Gross Margin</th>
                    <th>Configured Variants</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((prod) => (
                    <tr key={prod.id}>
                      <td className="font-bold text-gray-900">{prod.name}</td>
                      <td>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium text-[11px]">
                          {prod.type}
                        </span>
                      </td>
                      <td className="font-black text-gray-900">${prod.sales_price.toFixed(2)}</td>
                      <td className="text-gray-500">${prod.cost_price.toFixed(2)}</td>
                      <td className="font-bold text-emerald-600">
                        ${(prod.sales_price - prod.cost_price).toFixed(2)}
                      </td>
                      <td>
                        {prod.variants.length > 0 ? (
                          <div className="space-y-1">
                            {prod.variants.map((v) => (
                              <div
                                key={v.id}
                                className="inline-block bg-purple-50 text-[#714B67] border border-purple-200 px-2 py-0.5 rounded text-[11px] mr-1.5"
                              >
                                {v.attribute_value} {v.price_extra > 0 && `(+$${v.price_extra})`}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">No variants</span>
                        )}
                      </td>
                      <td className="text-gray-500 max-w-xs truncate">{prod.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 7: QUOTATION TEMPLATES (Scene 3) */}
        {/* ================================================================== */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Quotation Templates</h3>
                <p className="text-xs text-gray-500">
                  Pre-assembled packages with default plans, product lines, and set validity days.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((tmpl) => (
                <div key={tmpl.id} className="odoo-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-sm">{tmpl.name}</h4>
                      <span className="bg-purple-100 text-[#714B67] text-[10px] font-bold px-2 py-0.5 rounded">
                        Valid for {tmpl.validity_days} days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{tmpl.notes}</p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block mb-1.5">
                        Pre-Configured Product Lines
                      </span>
                      <div className="space-y-1.5 text-xs">
                        {tmpl.lines.map((l) => (
                          <div key={l.id} className="flex justify-between text-gray-700">
                            <span>
                              {l.quantity}x {l.product_name}
                              {l.variant_name && (
                                <span className="text-purple-700 text-[11px] font-medium ml-1">
                                  ({l.variant_name})
                                </span>
                              )}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${(l.quantity * l.unit_price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      // Instant Quote Generation for Acme Corp
                      const newSub = store.createSubscriptionFromTemplate(tmpl.id, {
                        id: 'usr-cust-1',
                        name: 'Marcus Vance (Acme Corp)',
                        email: 'marcus@acmecorp.com'
                      });
                      if (newSub) {
                        alert(`Created quote ${newSub.sub_number} from template!`);
                        setActiveTab('subscriptions');
                        setSelectedSubscription(newSub);
                      }
                    }}
                    className="btn-primary text-xs py-2 w-full justify-center"
                  >
                    Generate Quote From Template →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 8: DISCOUNTS & TAXES (Scene 4 & 5: Admin Only) */}
        {/* ================================================================== */}
        {activeTab === 'discounts' && (
          <div className="space-y-6">
            {/* Discounts Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Discount Rules Engine</h3>
                  <p className="text-xs text-gray-500">
                    Admin-only discount rules: fixed or %, minimum purchase, usage limits, and automatic recurrence.
                  </p>
                </div>
                <button
                  onClick={() => setIsNewDiscountOpen(true)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Discount Rule
                </button>
              </div>

              <div className="odoo-card overflow-hidden">
                <table className="odoo-table text-xs">
                  <thead>
                    <tr>
                      <th>Discount Code</th>
                      <th>Rule Name</th>
                      <th>Discount Value</th>
                      <th>Scope</th>
                      <th>Min Purchase</th>
                      <th>Usage Limit</th>
                      <th>Validity Period</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discounts.map((disc) => (
                      <tr key={disc.id}>
                        <td className="font-black text-[#714B67]">{disc.code}</td>
                        <td className="font-semibold text-gray-900">{disc.name}</td>
                        <td className="font-bold text-emerald-600">
                          {disc.type === 'percent' ? `${disc.value}% OFF` : `$${disc.value} OFF`}
                        </td>
                        <td>
                          <span className="capitalize text-gray-700">
                            {disc.scope.replace('_', ' ')}
                          </span>
                        </td>
                        <td>${disc.min_purchase_amount || 0}</td>
                        <td>
                          <span className="font-bold">{disc.current_usage_count}</span> /{' '}
                          {disc.max_usage_limit} used
                        </td>
                        <td className="text-gray-500">
                          {disc.start_date} to {disc.end_date}
                        </td>
                        <td>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              disc.is_active && disc.current_usage_count < disc.max_usage_limit
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {disc.is_active && disc.current_usage_count < disc.max_usage_limit
                              ? 'Active'
                              : 'Exhausted / Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tax Rules Section */}
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base">Tax Calculation Rules</h3>
                <p className="text-xs text-gray-500">
                  Configured tax rates applied automatically on invoice line items during billing runs.
                </p>
              </div>

              <div className="odoo-card overflow-hidden">
                <table className="odoo-table text-xs">
                  <thead>
                    <tr>
                      <th>Tax Name</th>
                      <th>Rate (%)</th>
                      <th>Default Rate</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxes.map((tax) => (
                      <tr key={tax.id}>
                        <td className="font-bold text-gray-900">{tax.name}</td>
                        <td className="font-black text-[#714B67]">{tax.rate}%</td>
                        <td>
                          {tax.is_default ? (
                            <span className="bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                              Default Rule
                            </span>
                          ) : (
                            <span className="text-gray-400">Optional</span>
                          )}
                        </td>
                        <td className="text-gray-500">{tax.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 9: STAFF & ACCESS (Scene 1: Only admin can add staff) */}
        {/* ================================================================== */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="odoo-card p-6 max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-[#714B67]" />
                <h3 className="font-bold text-base text-gray-900">Add Internal Staff Member</h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                As specified in Scene 1: Only the administrator has permission to onboard and add new internal staff members.
              </p>

              {staffMsg && (
                <div
                  className={`p-3 rounded-lg text-xs font-semibold mb-4 ${
                    staffMsg.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {staffMsg.text}
                </div>
              )}

              <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Staff Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. maya@brightloop.com"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary text-xs py-2 px-4 mt-2">
                  Create Staff Account
                </button>
              </form>
            </div>

            {/* Existing Users & Roles List */}
            <div className="odoo-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-gray-700 tracking-wider">
                  Brightloop Directory ({profiles.length} Accounts)
                </span>
              </div>
              <table className="odoo-table text-xs">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Assigned Role</th>
                    <th>Organization</th>
                    <th>Registered Since</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id}>
                      <td className="font-bold text-gray-900">{p.full_name}</td>
                      <td>{p.email}</td>
                      <td>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${
                            p.role === 'admin'
                              ? 'bg-amber-100 text-amber-900'
                              : p.role === 'staff'
                              ? 'bg-teal-100 text-teal-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {p.role}
                        </span>
                      </td>
                      <td className="text-gray-600">{p.company_name || 'Individual'}</td>
                      <td className="text-gray-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ================================================================== */}
      {/* SUBSCRIPTION DETAIL DRAWER / MODAL (Odoo Style Status Bar) */}
      {/* ================================================================== */}
      {selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-200 my-6">
            {/* Top Bar with Number & Close */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  {selectedSubscription.sub_number}
                </h3>
                <p className="text-xs text-gray-500">
                  Customer: <span className="font-semibold text-gray-800">{selectedSubscription.customer_name}</span> ({selectedSubscription.customer_email})
                </p>
              </div>
              <button
                onClick={() => setSelectedSubscription(null)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            {/* Odoo Status Bar & Action Controls */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <StatusBar
                stages={[
                  { key: 'draft', label: 'Draft' },
                  { key: 'quotation', label: 'Quotation' },
                  { key: 'confirmed', label: 'Confirmed' },
                  { key: 'active', label: 'Active' },
                  { key: 'closed', label: 'Closed' }
                ]}
                currentStage={selectedSubscription.status}
                onStageChange={handleSubscriptionStageChange}
              />

              {/* Lifecycle Actions */}
              <div className="flex items-center gap-2">
                {selectedSubscription.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleSubscriptionStageChange('paused')}
                      className="btn-secondary text-xs py-1 px-2.5"
                    >
                      Pause
                    </button>
                    <button
                      onClick={() => handleSubscriptionStageChange('closed')}
                      className="text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded px-2.5 py-1 font-semibold"
                    >
                      Close Early
                    </button>
                  </>
                )}
                {selectedSubscription.status === 'paused' && (
                  <button
                    onClick={() => handleSubscriptionStageChange('active')}
                    className="btn-primary text-xs py-1 px-2.5"
                  >
                    Resume Active
                  </button>
                )}
              </div>
            </div>

            {/* Detail Information */}
            <div className="p-6 space-y-6 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">Plan</span>
                  <span className="font-bold text-gray-900 text-sm">{selectedSubscription.plan_name}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">Start Date</span>
                  <span className="font-semibold text-gray-800">{selectedSubscription.start_date}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">Expiry Date</span>
                  <span className="font-semibold text-gray-800">{selectedSubscription.expiry_date}</span>
                </div>
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">Next Billing</span>
                  <span className="font-bold text-amber-700">{selectedSubscription.next_billing_date}</span>
                </div>
              </div>

              {/* Product Lines Table */}
              <div>
                <span className="font-bold text-gray-700 uppercase tracking-wide block mb-2">
                  Subscription Lines
                </span>
                <table className="odoo-table text-xs">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Variant</th>
                      <th>Quantity</th>
                      <th className="text-right">Unit Price</th>
                      <th className="text-right">Tax Rate</th>
                      <th className="text-right">Discount</th>
                      <th className="text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSubscription.lines.map((line) => (
                      <tr key={line.id}>
                        <td className="font-semibold text-gray-900">{line.product_name}</td>
                        <td className="text-purple-700 font-medium">{line.variant_name || '-'}</td>
                        <td className="font-bold">{line.quantity}</td>
                        <td className="text-right">${line.unit_price.toFixed(2)}</td>
                        <td className="text-right">{line.tax_rate}%</td>
                        <td className="text-right text-emerald-600">
                          -${line.discount_amount.toFixed(2)}
                        </td>
                        <td className="text-right font-black text-gray-900">
                          ${line.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Discount Application Widget */}
              <div className="bg-purple-50/50 border border-purple-100 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-[#714B67] block">Apply Discount Rule</span>
                  <p className="text-[11px] text-gray-500">
                    {selectedSubscription.applied_discount_code ? (
                      <span className="text-emerald-700 font-bold">
                        Applied code: {selectedSubscription.applied_discount_code} (-${selectedSubscription.discount_total.toFixed(2)})
                      </span>
                    ) : (
                      'No discount attached to this subscription yet.'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    id="discount-select"
                    className="input-field text-xs py-1 px-2.5 w-48 bg-white"
                  >
                    <option value="">Select Discount Rule...</option>
                    {discounts
                      .filter((d) => d.is_active)
                      .map((d) => (
                        <option key={d.id} value={d.code}>
                          {d.code} ({d.value}{d.type === 'percent' ? '%' : '$'} off)
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = (document.getElementById('discount-select') as HTMLSelectElement).value;
                      if (sel) handleApplyDiscountToSub(selectedSubscription.id, sel);
                    }}
                    className="btn-primary text-xs py-1 px-3"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end border-t border-gray-100 pt-4">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${selectedSubscription.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedSubscription.discount_total > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount:</span>
                      <span>-${selectedSubscription.discount_total.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes:</span>
                    <span>${selectedSubscription.tax_total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-[#714B67] border-t border-gray-200 pt-1.5">
                    <span>Total Amount:</span>
                    <span>${selectedSubscription.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 1: BILLING DAY ENGINE */}
      {/* ================================================================== */}
      <BillingDayModal
        isOpen={isBillingModalOpen}
        onClose={() => setIsBillingModalOpen(false)}
        onBillingCompleted={() => {
          refreshData();
          setActiveTab('invoices');
        }}
      />

      {/* ================================================================== */}
      {/* MODAL 2: INVOICE PRINT VIEW */}
      {/* ================================================================== */}
      <InvoicePrintModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        onSend={(id) => {
          store.sendInvoice(id);
          refreshData();
          alert('Invoice sent to registered client email!');
        }}
        onRegisterPayment={(inv) => {
          setSelectedInvoiceForPrint(null);
          setSelectedInvoiceForPayment(inv);
        }}
      />

      {/* ================================================================== */}
      {/* MODAL 3: REGISTER PAYMENT */}
      {/* ================================================================== */}
      <RegisterPaymentModal
        invoice={selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onPaymentRecorded={() => {
          refreshData();
        }}
      />

      {/* ================================================================== */}
      {/* MODAL 4: NEW QUOTE / SUBSCRIPTION CREATION */}
      {/* ================================================================== */}
      {isNewQuoteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Create New Quote / Subscription</h3>
              <button onClick={() => setIsNewQuoteOpen(false)}>✕</button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 uppercase block mb-1">
                  Start From Quotation Template (Recommended)
                </label>
                <select
                  id="template-choice"
                  className="input-field font-medium"
                  defaultValue={templates[0]?.id}
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Valid {t.validity_days} days)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 uppercase block mb-1">
                  Select Customer
                </label>
                <select
                  id="customer-choice"
                  className="input-field font-medium"
                  defaultValue="usr-cust-1"
                >
                  {profiles
                    .filter((p) => p.role === 'customer')
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} ({c.email}) - {c.company_name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
                <button onClick={() => setIsNewQuoteOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const tmplId = (document.getElementById('template-choice') as HTMLSelectElement).value;
                    const custId = (document.getElementById('customer-choice') as HTMLSelectElement).value;
                    const cust = profiles.find((p) => p.id === custId);
                    if (cust) {
                      const newSub = store.createSubscriptionFromTemplate(tmplId, {
                        id: cust.id,
                        name: `${cust.full_name} (${cust.company_name})`,
                        email: cust.email
                      });
                      if (newSub) {
                        setIsNewQuoteOpen(false);
                        setSelectedSubscription(newSub);
                        refreshData();
                      }
                    }
                  }}
                  className="btn-primary text-xs"
                >
                  Create Quote Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 5: NEW PRODUCT CREATION */}
      {/* ================================================================== */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Add New Product & Variants</h3>
              <button onClick={() => setIsNewProductOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const name = form.prodName.value;
                const type = form.prodType.value;
                const sales = parseFloat(form.salesPrice.value) || 0;
                const cost = parseFloat(form.costPrice.value) || 0;
                const notes = form.notes.value;
                const varName = form.varName.value;
                const varExtra = parseFloat(form.varExtra.value) || 0;

                const variants = varName
                  ? [
                      {
                        id: `var-${Date.now()}`,
                        product_id: '',
                        attribute_name: 'Brand',
                        attribute_value: varName,
                        price_extra: varExtra
                      }
                    ]
                  : [];

                store.addProduct({
                  name,
                  type,
                  sales_price: sales,
                  cost_price: cost,
                  notes,
                  variants,
                  is_active: true
                });

                setIsNewProductOpen(false);
                refreshData();
              }}
              className="p-6 space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name *</label>
                <input name="prodName" required placeholder="e.g. Brightloop Analytics" className="input-field" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Type *</label>
                  <select name="prodType" className="input-field">
                    <option value="Software">Software</option>
                    <option value="Add-on">Add-on</option>
                    <option value="Service">Service</option>
                    <option value="Hardware">Hardware</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Sales Price ($) *</label>
                  <input name="salesPrice" type="number" step="0.01" required className="input-field" defaultValue="500" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Cost Price ($)</label>
                  <input name="costPrice" type="number" step="0.01" className="input-field" defaultValue="150" />
                </div>
              </div>
              <div className="bg-purple-50/60 p-3 rounded-lg border border-purple-100">
                <span className="font-bold text-[#714B67] block mb-1.5">Optional Variant (e.g. Odoo Brand)</span>
                <div className="grid grid-cols-2 gap-2">
                  <input name="varName" placeholder="Variant (e.g. Odoo Edition)" className="input-field bg-white" />
                  <input name="varExtra" type="number" placeholder="Extra Price (e.g. 560)" className="input-field bg-white" />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Notes</label>
                <textarea name="notes" placeholder="Product details..." className="input-field h-16" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewProductOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 6: NEW PLAN CREATION */}
      {/* ================================================================== */}
      {isNewPlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Launch New Subscription Plan</h3>
              <button onClick={() => setIsNewPlanOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                store.addPlan({
                  name: form.planName.value,
                  code: form.planCode.value.toUpperCase(),
                  price: parseFloat(form.price.value) || 0,
                  billing_interval: form.interval.value,
                  min_quantity: parseInt(form.minQty.value) || 1,
                  start_date: form.startDate.value,
                  auto_close_on_expiry: form.autoClose.checked,
                  allow_early_close: form.allowEarlyClose.checked,
                  allow_pause: form.allowPause.checked,
                  allow_renew: form.allowRenew.checked,
                  notes: form.notes.value,
                  is_active: true
                });
                setIsNewPlanOpen(false);
                refreshData();
              }}
              className="p-6 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Plan Name *</label>
                  <input name="planName" required placeholder="e.g. Quarterly Team" className="input-field" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Plan Code *</label>
                  <input name="planCode" required placeholder="e.g. QTR-TEAM" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Billing Interval *</label>
                  <select name="interval" className="input-field">
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price ($) *</label>
                  <input name="price" type="number" step="0.01" required className="input-field" defaultValue="750" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Qty *</label>
                  <input name="minQty" type="number" min="1" className="input-field" defaultValue="1" />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Available Start Date *</label>
                <input name="startDate" type="date" className="input-field" defaultValue="2026-10-31" />
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                <span className="font-bold text-gray-700 block mb-1">Plan Lifecycle Rules (PDF Scene 2)</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="autoClose" type="checkbox" defaultChecked />
                  <span>Auto-close on expiration date</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="allowEarlyClose" type="checkbox" defaultChecked />
                  <span>Allow early cancellation by customer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="allowPause" type="checkbox" defaultChecked />
                  <span>Allow customer to pause subscription</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="allowRenew" type="checkbox" defaultChecked />
                  <span>Allow subscription renewal</span>
                </label>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Notes</label>
                <textarea name="notes" className="input-field h-14" placeholder="Terms and details..." />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewPlanOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Launch Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* MODAL 7: NEW DISCOUNT CREATION (Scene 5: Admin Only) */}
      {/* ================================================================== */}
      {isNewDiscountOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Create Discount Rule (Admin Only)</h3>
              <button onClick={() => setIsNewDiscountOpen(false)}>✕</button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                const res = store.addDiscountRule({
                  code: form.code.value,
                  name: form.discName.value,
                  type: form.discType.value,
                  value: parseFloat(form.val.value) || 0,
                  min_purchase_amount: parseFloat(form.minPurchase.value) || 0,
                  min_quantity: parseInt(form.minQty.value) || 0,
                  start_date: form.startD.value,
                  end_date: form.endD.value,
                  max_usage_limit: parseInt(form.limit.value) || 50,
                  scope: form.scope.value,
                  is_active: true
                });
                alert(res.message);
                if (res.success) {
                  setIsNewDiscountOpen(false);
                  refreshData();
                }
              }}
              className="p-6 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Code *</label>
                  <input name="code" required placeholder="e.g. FLASH25" className="input-field" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Rule Name *</label>
                  <input name="discName" required placeholder="e.g. 25% Flash Discount" className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Discount Type *</label>
                  <select name="discType" className="input-field">
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Value *</label>
                  <input name="val" type="number" step="0.01" required className="input-field" defaultValue="20" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Usage Limit *</label>
                  <input name="limit" type="number" min="1" className="input-field" defaultValue="100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Min Purchase Amount ($)</label>
                  <input name="minPurchase" type="number" step="0.01" defaultValue="500" className="input-field" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Application Scope *</label>
                  <select name="scope" className="input-field">
                    <option value="whole_subscription">Whole Subscription</option>
                    <option value="specific_product">Specific Product</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Start Date *</label>
                  <input name="startD" type="date" required className="input-field" defaultValue="2026-01-01" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">End Date *</label>
                  <input name="endD" type="date" required className="input-field" defaultValue="2026-12-31" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsNewDiscountOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
