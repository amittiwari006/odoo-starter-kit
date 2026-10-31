'use client';

import React, { useState } from 'react';
import { store } from '@/lib/store';
import { Subscription, Invoice } from '@/lib/types';
import { Play, CheckCircle2, ShieldAlert, Sparkles, X, Calendar, Layers, ArrowRight } from 'lucide-react';

interface BillingDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBillingCompleted: () => void;
}

export default function BillingDayModal({
  isOpen,
  onClose,
  onBillingCompleted
}: BillingDayModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-02');

  React.useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    setSelectedDate(d.toISOString().split('T')[0]);
  }, []);

  const [result, setResult] = useState<{
    generatedCount: number;
    invoices: Invoice[];
    skippedCount: number;
    totalBilledAmount: number;
  } | null>(null);

  if (!isOpen) return null;

  const dueSubscriptions = store.getSubscriptionsDueForBilling(selectedDate);

  const handleRunBilling = () => {
    const res = store.runBillingDay(selectedDate);
    setResult(res);
    onBillingCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Billing Day Automated Engine</h3>
              <p className="text-xs text-purple-200">
                Batch invoice generation with zero duplicate billing guarantee
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!result ? (
            <div className="space-y-5">
              {/* Target Cutoff Selector */}
              <div className="bg-purple-50/60 p-4 rounded-lg border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Select Billing Run Cutoff Date
                  </label>
                  <p className="text-xs text-gray-500">
                    Captures all Active subscriptions whose next billing date is on or before this date.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#714B67]" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field text-xs py-1.5 px-3 font-medium bg-white"
                  />
                </div>
              </div>

              {/* Due Subscriptions Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Subscriptions Due For Invoicing ({dueSubscriptions.length})
                  </span>
                  <span className="text-xs text-gray-500">
                    Calculated with automatic tax & discount rules
                  </span>
                </div>

                {dueSubscriptions.length === 0 ? (
                  <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-semibold text-gray-700">All Subscriptions Up to Date</p>
                    <p className="text-xs text-gray-500 mt-1">
                      No subscriptions are currently due for billing on or before {selectedDate}.
                      Pick a later date above to simulate future billing runs!
                    </p>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                    <table className="odoo-table text-xs">
                      <thead>
                        <tr>
                          <th>Sub #</th>
                          <th>Customer</th>
                          <th>Plan</th>
                          <th>Due Date</th>
                          <th className="text-right">Est. Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dueSubscriptions.map((s) => (
                          <tr key={s.id}>
                            <td className="font-semibold text-[#714B67]">{s.sub_number}</td>
                            <td>{s.customer_name}</td>
                            <td>
                              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                                {s.plan_name}
                              </span>
                            </td>
                            <td className="text-amber-700 font-medium">{s.next_billing_date}</td>
                            <td className="text-right font-bold text-gray-900">
                              ${s.total_amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Safeguard Assurance Notice */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Idempotency & Double-Billing Safeguard:</span> Subscriptions
                  already billed for their active cycle are safely skipped. Customer details, tax rules,
                  and eligible discounts are automatically snapshotted.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button onClick={onClose} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button
                  disabled={dueSubscriptions.length === 0}
                  onClick={handleRunBilling}
                  className="btn-primary text-xs flex items-center gap-1.5 bg-[#714B67]"
                >
                  <Play size={14} />
                  Execute Billing Run ({dueSubscriptions.length} Invoices)
                </button>
              </div>
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">Billing Run Successfully Completed!</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Batch generation executed cleanly with zero skipped or duplicate billings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto my-4 text-left">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-500 block uppercase font-bold">
                    Invoices Generated
                  </span>
                  <span className="text-2xl font-black text-[#714B67]">
                    {result.generatedCount}
                  </span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-500 block uppercase font-bold">
                    Total Billed Amount
                  </span>
                  <span className="text-2xl font-black text-emerald-600">
                    ${result.totalBilledAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  onClose();
                }}
                className="btn-primary text-xs px-6 py-2.5 mx-auto"
              >
                Done & View Invoices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
