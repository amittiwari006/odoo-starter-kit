'use client';

import React from 'react';
import { FinanceSummary, Subscription, Invoice, Payment } from '@/lib/types';
import { TrendingUp, DollarSign, Clock, AlertTriangle, Users, Layers, ShieldCheck } from 'lucide-react';

interface ExecutiveChartsProps {
  summary: FinanceSummary;
  subscriptions: Subscription[];
  invoices: Invoice[];
  payments: Payment[];
}

export default function ExecutiveCharts({
  summary,
  subscriptions,
  invoices,
  payments
}: ExecutiveChartsProps) {
  const [todayTimestamp, setTodayTimestamp] = React.useState<number>(() => Date.parse('2026-10-31T00:00:00Z'));

  React.useEffect(() => {
    setTodayTimestamp(Date.now());
  }, []);

  // 1. Calculate status distribution
  const statusCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 2. Calculate aging buckets for outstanding invoices
  const aging = {
    current: 0,
    days1to30: 0,
    days31to60: 0,
    days60plus: 0
  };

  invoices.forEach((inv) => {
    if (inv.status === 'paid' || inv.status === 'cancelled') return;
    const dueTime = Date.parse(inv.due_date);
    const diffTime = todayTimestamp - dueTime;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) aging.current += inv.amount_due;
    else if (diffDays <= 30) aging.days1to30 += inv.amount_due;
    else if (diffDays <= 60) aging.days31to60 += inv.amount_due;
    else aging.days60plus += inv.amount_due;
  });

  const totalAging = aging.current + aging.days1to30 + aging.days31to60 + aging.days60plus || 1;

  // 3. Plan Distribution
  const planDistribution = subscriptions.reduce((acc, sub) => {
    acc[sub.plan_name] = (acc[sub.plan_name] || 0) + sub.total_amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Active Subscriptions */}
        <div className="odoo-card p-4 border-l-4 border-l-[#714B67]">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Active Subs</span>
            <Layers size={15} className="text-[#714B67]" />
          </div>
          <div className="text-2xl font-black text-gray-900">{summary.active_subscriptions_count}</div>
          <span className="text-[10px] text-gray-500">{summary.total_subscribers} distinct clients</span>
        </div>

        {/* MRR */}
        <div className="odoo-card p-4 border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">MRR</span>
            <TrendingUp size={15} className="text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">${summary.mrr.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Monthly recurring base</span>
        </div>

        {/* ARR */}
        <div className="odoo-card p-4 border-l-4 border-l-indigo-500">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">ARR Run-Rate</span>
            <DollarSign size={15} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-indigo-900">${summary.arr.toLocaleString()}</div>
          <span className="text-[10px] text-gray-500">Annualized contraction</span>
        </div>

        {/* Cash Collected */}
        <div className="odoo-card p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Cash Collected</span>
            <ShieldCheck size={15} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            ${summary.total_revenue_collected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Reconciled in bank</span>
        </div>

        {/* Outstanding Receivables */}
        <div className="odoo-card p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Receivables</span>
            <Clock size={15} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-800">
            ${summary.outstanding_receivables.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Unpaid invoice balance</span>
        </div>

        {/* Overdue Invoices */}
        <div className="odoo-card p-4 border-l-4 border-l-red-500 bg-red-50/20">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-[11px] uppercase font-bold tracking-wider">Overdue</span>
            <AlertTriangle size={15} className="text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-600">
            ${summary.overdue_amount.toLocaleString()}
          </div>
          <span className="text-[10px] text-red-700 font-bold">
            {summary.overdue_invoices_count} invoices needing chase
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receivables Aging Analysis Bar */}
        <div className="odoo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Accounts Receivable Aging
            </h4>
            <span className="text-[11px] text-gray-500">Outstanding: ${summary.outstanding_receivables.toFixed(2)}</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Current (Not Due Yet) */}
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Current (Within Terms)</span>
                <span className="font-semibold text-gray-900">${aging.current.toFixed(2)}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(aging.current / totalAging) * 100}%` }}
                />
              </div>
            </div>

            {/* 1-30 Days Overdue */}
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>1 - 30 Days Overdue</span>
                <span className="font-semibold text-amber-700">${aging.days1to30.toFixed(2)}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(aging.days1to30 / totalAging) * 100}%` }}
                />
              </div>
            </div>

            {/* 31-60 Days Overdue */}
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>31 - 60 Days Overdue</span>
                <span className="font-semibold text-orange-700">${aging.days31to60.toFixed(2)}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(aging.days31to60 / totalAging) * 100}%` }}
                />
              </div>
            </div>

            {/* 60+ Days Overdue */}
            <div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span className="text-red-700 font-bold">60+ Days (High Risk)</span>
                <span className="font-bold text-red-700">${aging.days60plus.toFixed(2)}</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${(aging.days60plus / totalAging) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Lifecycle State Funnel */}
        <div className="odoo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Subscription Pipeline Funnel
            </h4>
            <span className="text-[11px] text-gray-500">{subscriptions.length} total records</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { status: 'active', label: 'Active (Recurring Billing)', color: 'bg-emerald-500', count: statusCounts['active'] || 0 },
              { status: 'confirmed', label: 'Confirmed (Pending 1st Run)', color: 'bg-blue-500', count: statusCounts['confirmed'] || 0 },
              { status: 'quotation', label: 'Quotation Sent', color: 'bg-indigo-400', count: statusCounts['quotation'] || 0 },
              { status: 'draft', label: 'Draft Offer', color: 'bg-gray-400', count: statusCounts['draft'] || 0 },
              { status: 'paused', label: 'Paused by Customer', color: 'bg-amber-400', count: statusCounts['paused'] || 0 },
              { status: 'closed', label: 'Closed / Expired', color: 'bg-red-400', count: statusCounts['closed'] || 0 },
            ].map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-gray-700 font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{item.count}</span>
                  <span className="text-[10px] text-gray-400">
                    ({Math.round(((item.count) / (subscriptions.length || 1)) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Contribution by Plan */}
        <div className="odoo-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Revenue By Plan Tier
            </h4>
            <span className="text-[11px] text-purple-700 font-semibold">Active ARR Driver</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(planDistribution).map(([planName, amount]) => {
              const totalAmount = Object.values(planDistribution).reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((amount / totalAmount) * 100);
              return (
                <div key={planName}>
                  <div className="flex justify-between text-gray-700 mb-1">
                    <span className="font-medium truncate max-w-[180px]">{planName}</span>
                    <span className="font-bold text-gray-900">${amount.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#714B67] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
