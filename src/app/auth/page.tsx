'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ClipboardList, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validate = () => {
    if (!form.email.includes('@')) return 'Please enter a valid email address.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (mode === 'register' && !form.name.trim()) return 'Full name is required.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name, role: role },
          },
        });
        if (signUpErr) throw signUpErr;
        if (data.user) {
          // Insert user profile
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: form.name,
            email: form.email,
            role: role,
          });
          role === 'admin' ? router.push('/admin') : router.push('/dashboard');
        }
      } else {
        const { data, error: signInErr } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (signInErr) throw signInErr;
        if (data.user) {
          const userRole = data.user.user_metadata?.role || 'user';
          userRole === 'admin' ? router.push('/admin') : router.push('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{background:'linear-gradient(135deg, #714B67 0%, #3d2438 100%)'}}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white text-sm mb-12">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ClipboardList size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">FlowDesk</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Manage requests smarter, faster, together.</h2>
          <p className="text-white/60 leading-relaxed">
            Real-time request management with powerful dashboards for users and admins. 
            Built for modern teams that demand transparency and speed.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { v: 'Dynamic DB', d: 'PostgreSQL Powered' },
            { v: 'RBAC', d: 'Role-Based Access' },
            { v: 'Real-time', d: 'Live Data Updates' },
            { v: 'Secure', d: 'Supabase Auth' },
          ].map(s => (
            <div key={s.v} className="bg-white/10 rounded-lg p-4 border border-white/10">
              <div className="font-bold text-lg">{s.v}</div>
              <div className="text-white/60 text-sm">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#714B67'}}>
              <ClipboardList size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FlowDesk</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'login' ? "Sign in to your account to continue." : "Fill in details to register."}
          </p>

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sign in as</label>
            <div className="grid grid-cols-2 gap-3">
              {(['user', 'admin'] as const).map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${role === r ? 'border-[#714B67] bg-[#f3eef1] text-[#714B67]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {r === 'user' ? '👤 User' : '🛡️ Admin'}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Amit Tiwari"
                  className="input-field" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="amittiwari006@gmail.com" className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={handleChange} placeholder="Min 6 characters" className="input-field pr-11" required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="font-semibold" style={{color:'#714B67'}}>
              {mode === 'login' ? 'Register here' : 'Sign in'}
            </button>
          </p>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-600 text-center">
            💡 <strong>Demo:</strong> Register a new User and Admin account to see both dashboards
          </div>
        </div>
      </div>
    </div>
  );
}
