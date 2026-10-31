'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import InvoicePrintModal from '@/components/InvoicePrintModal';
import RegisterPaymentModal from '@/components/RegisterPaymentModal';
import { store } from '@/lib/store';
import { Subscription, Invoice, UserProfile } from '@/lib/types';
import {
  Layers,
  FileText,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  Pause,
  Play,
  RotateCw,
  Printer,
  DollarSign,
  Shield,
  AlertCircle
} from 'lucide-react';

export default function CustomerPortalPage() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(store.getCurrentUser());
  const [customerEmail, setCustomerEmail] = useState<string>('rahul@apexretail.com');
  const [todayStr, setTodayStr] = useState<string>('2026-10-31');

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(
    store.getCustomerSubscriptions(customerEmail)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(
    store.getCustomerInvoices(customerEmail)
  );

  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const refreshPortalData = () => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    const email = user.role === 'customer' ? user.email : 'rahul@apexretail.com';
    setCustomerEmail(email);
    setSubscriptions(store.getCustomerSubscriptions(email));
    setInvoices(store.getCustomerInvoices(email));
  };

  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
    refreshPortalData();
    const unsub = store.subscribe(() => {
      refreshPortalData();
    });
    return unsub;
  }, []);

  const handlePause = (subId: string) => {
    const res = store.customerPauseSubscription(subId, customerEmail);
    setFeedbackMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleResume = (subId: string) => {
    const res = store.customerResumeSubscription(subId, customerEmail);
    setFeedbackMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleRenew = (subId: string) => {
    const res = store.customerRenewSubscription(subId, customerEmail);
    setFeedbackMsg({ text: res.message, type: res.success ? 'success' : 'error' });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const outstandingBalance = invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'cancelled')
    .reduce((sum, i) => sum + i.amount_due, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Customer Header Banner */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-100 text-[#714B67] text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Self-Service Customer Portal
              </span>
              <span className="text-xs text-gray-400">• Secure Account Access</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Welcome, {currentUser.role === 'customer' ? currentUser.full_name : 'Rahul Verma'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {currentUser.role === 'customer' ? currentUser.company_name : 'Apex Retail Chain Ltd'} • Account Email: {customerEmail}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Outstanding Balance
              </span>
              <span className={`text-xl font-black ${outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                ${outstandingBalance.toFixed(2)}
              </span>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">
                Active Plans
              </span>
              <span className="text-xl font-black text-gray-900">
                {subscriptions.filter((s) => s.status === 'active').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {feedbackMsg && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {feedbackMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Section 1: Subscriptions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-[#714B67]" />
              <h2 className="text-base font-bold text-gray-900">My Subscriptions & Packages</h2>
            </div>
            <span className="text-xs text-gray-500">
              Manage your renewals and licenses without waiting on support
            </span>
          </div>

          {subscriptions.length === 0 ? (
            <div className="odoo-card p-8 text-center text-xs text-gray-500">
              No active subscriptions found for this account.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.map((sub) => (
                <div key={sub.id} className="odoo-card p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-[#714B67] text-xs">{sub.sub_number}</span>
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.status === 'paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base mb-1">{sub.plan_name}</h3>
                    <div className="text-2xl font-black text-gray-900 mb-3">
                      ${sub.total_amount.toFixed(2)}
                      <span className="text-xs font-normal text-gray-500"> / billing cycle</span>
                    </div>

                    {/* Subscription Lines */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-1.5 mb-4 text-xs">
                      <span className="font-bold text-[10px] uppercase text-gray-400 block mb-1">
                        Included Products & Variants
                      </span>
                      {sub.lines.map((l) => (
                        <div key={l.id} className="flex justify-between text-gray-700">
                          <span>
                            {l.quantity}x {l.product_name}
                            {l.variant_name && (
                              <span className="text-purple-700 font-medium ml-1">
                                ({l.variant_name})
                              </span>
                            )}
                          </span>
                          <span className="font-semibold text-gray-900">${l.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">
                          Next Billing Date
                        </span>
                        <span className="font-bold text-amber-800">{sub.next_billing_date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">
                          Contract Expiry
                        </span>
                        <span className="font-bold text-gray-800">{sub.expiry_date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Self-Service Action Buttons */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {sub.status === 'active' && (
                      <button
                        onClick={() => handlePause(sub.id)}
                        className="btn-secondary text-xs py-1.5 px-3 flex-1 justify-center gap-1.5"
                      >
                        <Pause size={13} />
                        Pause Plan
                      </button>
                    )}
                    {sub.status === 'paused' && (
                      <button
                        onClick={() => handleResume(sub.id)}
                        className="btn-primary text-xs py-1.5 px-3 flex-1 justify-center gap-1.5"
                      >
                        <Play size={13} />
                        Resume Plan
                      </button>
                    )}
                    <button
                      onClick={() => handleRenew(sub.id)}
                      className="btn-secondary text-xs py-1.5 px-3 flex-1 justify-center gap-1.5"
                    >
                      <RotateCw size={13} />
                      Renew Contract
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Invoices & Receipts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#714B67]" />
              <h2 className="text-base font-bold text-gray-900">Invoices & Billing History</h2>
            </div>
            <span className="text-xs text-gray-500">
              Download itemized PDF receipts and pay outstanding invoices
            </span>
          </div>

          <div className="odoo-card overflow-hidden">
            <table className="odoo-table text-xs">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Billing Period</th>
                  <th>Due Date</th>
                  <th>Total Billed</th>
                  <th>Amount Paid</th>
                  <th>Balance Due</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const isOverdue = inv.status !== 'paid' && inv.due_date < todayStr;
                  return (
                    <tr key={inv.id}>
                      <td className="font-bold text-[#714B67]">{inv.invoice_number}</td>
                      <td className="text-gray-600">
                        {inv.billing_period_start} to {inv.billing_period_end}
                      </td>
                      <td>
                        <span className={isOverdue ? 'text-red-600 font-bold' : 'text-gray-600'}>
                          {inv.due_date} {isOverdue && '(OVERDUE)'}
                        </span>
                      </td>
                      <td className="font-bold text-gray-900">${inv.total_amount.toFixed(2)}</td>
                      <td className="text-emerald-600 font-medium">${inv.amount_paid.toFixed(2)}</td>
                      <td className="font-black text-[#714B67]">${inv.amount_due.toFixed(2)}</td>
                      <td>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            inv.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-right space-x-2">
                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="btn-secondary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <Printer size={12} /> View / Print
                        </button>
                        {inv.status !== 'paid' && (
                          <button
                            onClick={() => setSelectedInvoiceForPayment(inv)}
                            className="btn-primary text-xs py-1 px-2.5 inline-flex items-center gap-1"
                          >
                            <DollarSign size={12} /> Pay Now
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
      </main>

      {/* Invoice Print Modal */}
      <InvoicePrintModal
        invoice={selectedInvoiceForPrint}
        onClose={() => setSelectedInvoiceForPrint(null)}
        onRegisterPayment={(inv) => {
          setSelectedInvoiceForPrint(null);
          setSelectedInvoiceForPayment(inv);
        }}
      />

      {/* Register Payment Modal */}
      <RegisterPaymentModal
        invoice={selectedInvoiceForPayment}
        onClose={() => setSelectedInvoiceForPayment(null)}
        onPaymentRecorded={() => {
          refreshPortalData();
        }}
      />
    </div>
  );
}
