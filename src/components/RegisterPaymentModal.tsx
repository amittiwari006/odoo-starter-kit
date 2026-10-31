'use client';

import React, { useState } from 'react';
import { Invoice, PaymentMethod } from '@/lib/types';
import { store } from '@/lib/store';
import { X, DollarSign, CheckCircle2 } from 'lucide-react';

interface RegisterPaymentModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPaymentRecorded: () => void;
}

export default function RegisterPaymentModal({
  invoice,
  onClose,
  onPaymentRecorded
}: RegisterPaymentModalProps) {
  if (!invoice) return null;

  const [amount, setAmount] = useState<number>(invoice.amount_due);
  const [method, setMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paymentDate, setPaymentDate] = useState<string>('2026-10-31');

  React.useEffect(() => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
  }, []);
  const [note, setNote] = useState<string>('Received electronic confirmation');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (amount > invoice.amount_due + 0.01) {
      setError(`Amount cannot exceed outstanding balance of $${invoice.amount_due.toFixed(2)}.`);
      return;
    }

    const res = store.recordPayment({
      invoice_id: invoice.id,
      amount,
      payment_method: method,
      payment_date: paymentDate,
      reference_note: note
    });

    if (res.success) {
      onPaymentRecorded();
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
        <div className="bg-[#714B67] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-amber-300" />
            <h3 className="font-bold text-base">Register Payment</h3>
          </div>
          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white p-1 rounded hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Invoice Summary Pill */}
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[11px] text-gray-500 uppercase font-bold">Target Invoice</span>
              <p className="font-bold text-gray-900 text-sm">{invoice.invoice_number}</p>
              <p className="text-gray-500 text-[11px]">{invoice.customer_name}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-gray-500 uppercase font-bold">Balance Due</span>
              <p className="font-black text-base text-[#714B67]">${invoice.amount_due.toFixed(2)}</p>
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
              Payment Method *
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="input-field font-medium"
            >
              <option value="Bank Transfer">Bank Transfer (ACH / Wire / RTGS)</option>
              <option value="Credit Card">Credit Card (Stripe / Amex)</option>
              <option value="UPI">UPI / Instant Digital Wallet</option>
              <option value="Cash">Cash Receipt</option>
              <option value="Cheque">Commercial Cheque</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Payment Amount ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={invoice.amount_due}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="input-field font-semibold text-gray-900"
                required
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Payment Date *
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
              Reference / Transaction Note
            </label>
            <input
              type="text"
              placeholder="e.g. Bank Ref #992140 or Check #4412"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2.5">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
