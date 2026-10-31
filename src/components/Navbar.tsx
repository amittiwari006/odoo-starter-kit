'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { store } from '@/lib/store';
import { UserRole } from '@/lib/types';
import {
  Layers,
  FileText,
  CreditCard,
  DollarSign,
  Package,
  Clock,
  Tag,
  Users,
  Shield,
  RotateCcw,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bell
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState(store.getCurrentUser());
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);
  const [resetMsg, setResetMsg] = React.useState(false);

  React.useEffect(() => {
    const unsub = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
    return unsub;
  }, []);

  const handleRoleChange = (role: UserRole) => {
    store.switchDemoRole(role);
    setShowRoleMenu(false);
  };

  const handleReset = () => {
    if (confirm('Reset Brightloop data to default demo state?')) {
      store.resetToDefaults();
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 2500);
    }
  };

  const isPortal = pathname.includes('/portal') || currentUser.role === 'customer';

  return (
    <header className="sticky top-0 z-50 bg-[#714B67] text-white shadow-md">
      {/* Top Banner / Brand Header */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg hover:opacity-95">
            <div className="w-8 h-8 rounded bg-white text-[#714B67] flex items-center justify-center font-black shadow-sm text-base">
              B
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-white flex items-center gap-1.5 font-semibold">
                Brightloop <span className="text-purple-200 text-xs px-1.5 py-0.5 rounded bg-white/10 font-normal">SaaS</span>
              </span>
              <span className="text-[10px] text-purple-200 uppercase tracking-wider font-mono">
                Subscription & Recurring Billing
              </span>
            </div>
          </Link>
        </div>

        {/* Global Controls & Demo Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-md transition"
              title="Click to quickly switch roles for hackathon demo"
            >
              <Shield size={13} className="text-purple-200" />
              <span className="font-medium hidden sm:inline">{currentUser.full_name}</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                currentUser.role === 'admin' ? 'bg-amber-400 text-gray-950 font-black' :
                currentUser.role === 'staff' ? 'bg-teal-400 text-gray-950 font-bold' :
                'bg-blue-300 text-gray-950 font-bold'
              }`}>
                {currentUser.role}
              </span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-gray-100 font-semibold text-gray-500 uppercase tracking-wider text-[10px]">
                  Simulate Role (Hackathon Showcase)
                </div>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-purple-50 transition ${
                    currentUser.role === 'admin' ? 'bg-purple-50/80 font-bold text-[#714B67]' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold">Sarah Connor (Admin)</div>
                    <div className="text-[11px] text-gray-500">Full control, discounts, tax, staff</div>
                  </div>
                  {currentUser.role === 'admin' && <CheckCircle2 size={15} className="text-[#714B67]" />}
                </button>
                <button
                  onClick={() => handleRoleChange('staff')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-purple-50 transition ${
                    currentUser.role === 'staff' ? 'bg-purple-50/80 font-bold text-[#714B67]' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold">Alex Rivera (Staff)</div>
                    <div className="text-[11px] text-gray-500">Quotes, billing runs, payments</div>
                  </div>
                  {currentUser.role === 'staff' && <CheckCircle2 size={15} className="text-[#714B67]" />}
                </button>
                <button
                  onClick={() => handleRoleChange('customer')}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-purple-50 transition ${
                    currentUser.role === 'customer' ? 'bg-purple-50/80 font-bold text-[#714B67]' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold">Marcus Vance (Customer)</div>
                    <div className="text-[11px] text-gray-500">Self-service portal, view bills, renew</div>
                  </div>
                  {currentUser.role === 'customer' && <CheckCircle2 size={15} className="text-[#714B67]" />}
                </button>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={handleReset}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-white/10 rounded transition"
            title="Reset Brightloop catalog and seed data to defaults"
          >
            <RotateCcw size={15} />
          </button>

          {/* Portal / Admin Switch Link */}
          {currentUser.role === 'customer' ? (
            <Link
              href="/dashboard"
              className="bg-white text-[#714B67] hover:bg-purple-50 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition"
            >
              My Customer Portal
            </Link>
          ) : (
            <Link
              href="/admin"
              className="bg-white text-[#714B67] hover:bg-purple-50 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition"
            >
              Platform Workspace
            </Link>
          )}
        </div>
      </div>

      {resetMsg && (
        <div className="bg-teal-500 text-white text-xs text-center py-1 font-medium transition">
          ✓ Brightloop seed data and rules reset to defaults!
        </div>
      )}

      {/* Module Navigation Tabs (Odoo App Bar style) */}
      {setActiveTab && currentUser.role !== 'customer' && (
        <nav className="bg-[#5c3d55] border-t border-purple-800/40 px-4 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 text-xs py-1">
            {[
              { id: 'finance', label: 'Finance & Analytics', icon: DollarSign },
              { id: 'subscriptions', label: 'Subscriptions & Quotes', icon: Layers },
              { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
              { id: 'payments', label: 'Payments & Aging', icon: CreditCard },
              { id: 'plans', label: 'Plans & Pricing', icon: Clock },
              { id: 'products', label: 'Products & Variants', icon: Package },
              { id: 'templates', label: 'Quotation Templates', icon: FileText },
              { id: 'discounts', label: 'Discounts & Taxes', icon: Tag, adminOnly: true },
              { id: 'staff', label: 'Staff & Team', icon: Users, adminOnly: true }
            ]
              .filter((tab) => !tab.adminOnly || currentUser.role === 'admin')
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded font-medium whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner font-semibold'
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon size={14} className={isActive ? 'text-amber-300' : 'text-purple-300'} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
          </div>
        </nav>
      )}
    </header>
  );
}
