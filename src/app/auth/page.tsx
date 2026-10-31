'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { Eye, EyeOff, ArrowLeft, Shield, Check, X, Mail, Lock, Sparkles, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  // Password requirements specified in PDF Scene 1:
  // "more than eight characters, with an uppercase letter, a lowercase letter and a special character"
  const passwordChecks = {
    length: form.password.length > 8,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password)
  };

  const isPasswordValid =
    passwordChecks.length &&
    passwordChecks.upper &&
    passwordChecks.lower &&
    passwordChecks.special;

  const validate = () => {
    if (!form.email.includes('@')) return 'Please enter a valid email address.';
    if (mode === 'register') {
      if (!form.name.trim()) return 'Full name is required.';
      if (!passwordChecks.length) return 'Password must be more than 8 characters.';
      if (!passwordChecks.upper) return 'Password must include at least one uppercase letter.';
      if (!passwordChecks.lower) return 'Password must include at least one lowercase letter.';
      if (!passwordChecks.special) return 'Password must include at least one special character.';
    } else {
      if (!form.password) return 'Password is required.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError('');

    // Check unique email in existing profiles
    const existing = store.getProfiles().find(
      (p) => p.email.toLowerCase() === form.email.toLowerCase()
    );

    if (mode === 'register') {
      if (existing) {
        setError('This email address already belongs to an existing Brightloop account.');
        setLoading(false);
        return;
      }

      // Create new customer account (customers register self-service; staff is admin-only)
      const newCustomer = {
        id: `usr-cust-${Date.now()}`,
        email: form.email,
        full_name: form.name,
        role: 'customer' as UserRole,
        company_name: form.company || 'Private Business',
        created_at: new Date().toISOString()
      };

      store.setCurrentUser(newCustomer);
      store.getProfiles().push(newCustomer);
      router.push('/dashboard');
    } else {
      // Login mode
      if (existing) {
        store.setCurrentUser(existing);
        if (existing.role === 'customer') {
          router.push('/dashboard');
        } else {
          router.push('/admin');
        }
      } else {
        // Fallback demo login
        const demoUser = {
          id: `usr-${Date.now()}`,
          email: form.email,
          full_name: form.name || 'Demo User',
          role: 'customer' as UserRole,
          created_at: new Date().toISOString()
        };
        store.setCurrentUser(demoUser);
        router.push('/dashboard');
      }
    }
    setLoading(false);
  };

  const handleQuickLogin = (role: UserRole) => {
    store.switchDemoRole(role);
    if (role === 'customer') {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setResetSent(true);
    setTimeout(() => {
      setResetSent(false);
      setForgotOpen(false);
      setSuccessMsg(`A password reset link was dispatched to ${forgotEmail}`);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex items-stretch font-sans"
      style={{ background: 'linear-gradient(135deg, #714B67 0%, #3d2438 100%)' }}
    >
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-white/80 hover:text-white text-xs mb-10"
          >
            <ArrowLeft size={14} /> Back to Homepage
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white text-[#714B67] rounded-lg flex items-center justify-center font-black text-xl shadow-md">
              B
            </div>
            <div>
              <span className="text-2xl font-black">Brightloop Software</span>
              <p className="text-xs text-purple-200">Unified Subscription & Recurring Billing</p>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold mb-4 leading-snug">
            Run your plans, recurring billing & revenue in one digital backbone.
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-md">
            No more lost renewals, manual spreadsheets, or typing invoices by hand. Brightloop unites
            quotations, automated billing runs, discount rules, and customer self-service.
          </p>
        </div>

        {/* Rapid 1-Click Role Access for Hackathon Judges */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/20 text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-purple-200 mb-3 text-[11px]">
            <Sparkles size={14} className="text-amber-300" />
            1-Click Demo Personas (For Odoo Jury Review)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              className="bg-white text-[#714B67] hover:bg-purple-50 font-bold p-2.5 rounded-lg text-left transition shadow-xs"
            >
              <div className="text-[10px] uppercase text-gray-500">Admin Control</div>
              <div className="font-bold text-xs">Sarah Connor</div>
            </button>
            <button
              onClick={() => handleQuickLogin('staff')}
              className="bg-white text-[#714B67] hover:bg-purple-50 font-bold p-2.5 rounded-lg text-left transition shadow-xs"
            >
              <div className="text-[10px] uppercase text-gray-500">Internal Staff</div>
              <div className="font-bold text-xs">Alex Rivera</div>
            </button>
            <button
              onClick={() => handleQuickLogin('customer')}
              className="bg-white text-[#714B67] hover:bg-purple-50 font-bold p-2.5 rounded-lg text-left transition shadow-xs"
            >
              <div className="text-[10px] uppercase text-gray-500">Customer Portal</div>
              <div className="font-bold text-xs">Marcus Vance</div>
            </button>
          </div>
        </div>
      </div>

      {/* Right Login / Register Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900">
                {mode === 'login' ? 'Sign In to Brightloop' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {mode === 'login'
                  ? 'Access your unified platform or customer portal'
                  : 'Start your business subscription with Brightloop'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6 text-xs">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 font-bold rounded-md transition ${
                mode === 'login'
                  ? 'bg-white text-[#714B67] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 font-bold rounded-md transition ${
                mode === 'register'
                  ? 'bg-white text-[#714B67] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Register Customer
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg mb-4 font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg mb-4 font-semibold">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Contact Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={form.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                    Business / Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="e.g. Acme Corporation"
                    value={form.company}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-bold text-gray-700 uppercase tracking-wide block mb-1">
                Email Address (Unique per account) *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700 uppercase tracking-wide">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setForgotOpen(true)}
                    className="text-xs text-[#714B67] hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Password Requirements Checklist (PDF Scene 1) */}
              {mode === 'register' && form.password.length > 0 && (
                <div className="mt-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-lg space-y-1 text-[11px]">
                  <span className="font-bold text-gray-500 uppercase text-[10px] block">
                    Security Requirements:
                  </span>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.length ? 'text-emerald-700 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {passwordChecks.length ? <Check size={13} /> : <X size={13} />}
                    <span>More than eight characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.upper ? 'text-emerald-700 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {passwordChecks.upper ? <Check size={13} /> : <X size={13} />}
                    <span>At least one uppercase letter (A-Z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.lower ? 'text-emerald-700 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {passwordChecks.lower ? <Check size={13} /> : <X size={13} />}
                    <span>At least one lowercase letter (a-z)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${
                      passwordChecks.special ? 'text-emerald-700 font-bold' : 'text-gray-400'
                    }`}
                  >
                    {passwordChecks.special ? <Check size={13} /> : <X size={13} />}
                    <span>At least one special character (!@#$%...)</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (mode === 'register' && !isPasswordValid)}
              className="btn-primary w-full py-2.5 justify-center text-sm font-bold shadow-md mt-2"
            >
              {loading
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In to Portal'
                : 'Create Account & Enter Portal'}
            </button>
          </form>

          {/* Quick Demo Switcher on Mobile */}
          <div className="mt-6 pt-6 border-t border-gray-100 lg:hidden">
            <span className="font-bold uppercase text-[10px] text-gray-400 block mb-2 text-center">
              Quick Judge Demo Personas
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleQuickLogin('admin')}
                className="flex-1 text-center py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-[11px] text-[#714B67]"
              >
                Admin
              </button>
              <button
                onClick={() => handleQuickLogin('staff')}
                className="flex-1 text-center py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-[11px] text-[#714B67]"
              >
                Staff
              </button>
              <button
                onClick={() => handleQuickLogin('customer')}
                className="flex-1 text-center py-1.5 bg-gray-100 hover:bg-gray-200 rounded font-bold text-[11px] text-[#714B67]"
              >
                Customer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal (PDF Scene 1: "reset link should arrive at their registered email") */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-xs border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-[#714B67]" />
              <h4 className="font-bold text-sm text-gray-900">Reset Account Password</h4>
            </div>
            <p className="text-gray-500 mb-4">
              Enter your registered Brightloop email address. A password reset link will be sent to your inbox.
            </p>

            {resetSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-center font-bold">
                ✓ Reset link dispatched! Check your email.
              </div>
            ) : (
              <form onSubmit={handleSendReset} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary text-xs">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
