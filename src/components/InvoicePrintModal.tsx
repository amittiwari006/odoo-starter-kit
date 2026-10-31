'use client';

import React from 'react';
import { Invoice } from '@/lib/types';
import { X, Printer, CheckCircle, Clock, Send, DollarSign } from 'lucide-react';

interface InvoicePrintModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onSend?: (id: string) => void;
  onRegisterPayment?: (invoice: Invoice) => void;
}

export default function InvoicePrintModal({
  invoice,
  onClose,
  onSend,
  onRegisterPayment
}: InvoicePrintModalProps) {
  if (!invoice) return null;

  const [todayStr, setTodayStr] = React.useState('2026-10-31');

  React.useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const isPaid = invoice.status === 'paid';
  const isOverdue = invoice.status !== 'paid' && invoice.due_date < todayStr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-200 my-8">
        {/* Actions Header (hidden during print) */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800 text-sm">Invoice View</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                invoice.status === 'paid'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : invoice.status === 'confirmed'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : invoice.status === 'cancelled'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSend && (
              <button
                onClick={() => onSend(invoice.id)}
                className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Send size={13} />
                Send by Email
              </button>
            )}
            {onRegisterPayment && invoice.status !== 'paid' && (
              <button
                onClick={() => onRegisterPayment(invoice)}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <DollarSign size={13} />
                Register Payment
              </button>
            )}
            <button
              onClick={handlePrint}
              className="bg-gray-800 hover:bg-black text-white text-xs font-medium py-1.5 px-3 rounded-md flex items-center gap-1.5 transition"
            >
              <Printer size={13} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-200 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 sm:p-10 font-sans text-gray-800 print:p-0">
          {/* Top Brand & Metadata */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-gray-200 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded bg-[#714B67] text-white flex items-center justify-center font-black text-lg">
                  B
                </div>
                <span className="text-2xl font-black text-[#714B67] tracking-tight">
                  Brightloop
                </span>
                <span className="text-gray-500 font-semibold text-sm">Software Inc.</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                450 Innovation Parkway, Suite 800<br />
                Financial Tech Corridor, CA 94105<br />
                billing@brightloop.com | +1 (800) 555-LOOP
              </p>
            </div>

            <div className="text-right sm:min-w-[200px]">
              <h2 className="text-3xl font-black text-gray-900 mb-1">{invoice.invoice_number}</h2>
              <div className="text-xs text-gray-500 space-y-1">
                <div>
                  <span className="font-semibold text-gray-700">Issue Date:</span>{' '}
                  {invoice.issue_date}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Due Date:</span>{' '}
                  <span className={isOverdue ? 'text-red-600 font-bold' : ''}>
                    {invoice.due_date} {isOverdue && '(OVERDUE)'}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Subscription:</span>{' '}
                  {invoice.subscription_number}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Payment Terms:</span>{' '}
                  <span className="uppercase">{invoice.payment_terms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billed To / Billing Period */}
          <div className="grid grid-cols-2 gap-8 my-8 text-xs">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Billed To
              </span>
              <p className="font-bold text-gray-900 text-sm">{invoice.customer_name}</p>
              <p className="text-gray-600 mt-0.5">{invoice.customer_email}</p>
              <p className="text-gray-500 mt-1">Customer ID: {invoice.customer_id}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">
                Billing Period
              </span>
              <p className="font-semibold text-gray-900 text-sm">
                {invoice.billing_period_start} to {invoice.billing_period_end}
              </p>
              <p className="text-gray-600 mt-1">
                Status:{' '}
                <span className="font-bold capitalize text-[#714B67]">{invoice.status}</span>
              </p>
              {invoice.sent_at && (
                <p className="text-[11px] text-teal-700 mt-1">
                  Dispatched via electronic mail on {new Date(invoice.sent_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-xs text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-gray-200 text-gray-600 uppercase tracking-wider text-[11px]">
                <th className="py-2.5">Item & Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Tax</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoice.lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-3">
                    <div className="font-semibold text-gray-900">{line.product_name}</div>
                    {line.variant_name && (
                      <div className="text-[11px] text-[#714B67] font-medium">
                        Variant: {line.variant_name}
                      </div>
                    )}
                  </td>
                  <td className="py-3 text-center font-medium">{line.quantity}</td>
                  <td className="py-3 text-right text-gray-600">${line.unit_price.toFixed(2)}</td>
                  <td className="py-3 text-right text-gray-500">{line.tax_rate}%</td>
                  <td className="py-3 text-right font-bold text-gray-900">
                    ${line.line_total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Financial Totals */}
          <div className="flex justify-between items-start gap-6 border-t border-gray-200 pt-6">
            <div className="text-xs text-gray-500 max-w-sm">
              <span className="font-bold text-gray-700 block mb-1">Notes & Payment Details</span>
              <p className="leading-relaxed">{invoice.notes || 'Payment due upon receipt.'}</p>
              <div className="mt-3 p-2 bg-purple-50/70 border border-purple-100 rounded text-[11px] text-[#714B67]">
                Electronic bank transfer ACH/NEFT to Brightloop Software Inc. Account #400192837.
              </div>
            </div>

            <div className="w-64 text-xs space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount Applied:</span>
                  <span>-${invoice.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Taxes:</span>
                <span className="font-medium">${invoice.tax_amount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-black text-sm text-gray-900">
                <span>Total Amount:</span>
                <span>${invoice.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-1">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-600">${invoice.amount_paid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-[#714B67] border-t-2 border-[#714B67] pt-2">
                <span>Balance Due:</span>
                <span>${invoice.amount_due.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* PAID Watermark Badge */}
          {isPaid && (
            <div className="mt-8 border-2 border-emerald-500 bg-emerald-50 rounded-lg p-3 text-center text-emerald-800 font-black tracking-widest text-sm uppercase flex items-center justify-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              Fully Paid & Reconciled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
