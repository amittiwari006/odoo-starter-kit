'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart3, Users, ClipboardList } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#714B67'}}>
              <ClipboardList size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FlowDesk</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth" className="btn-primary text-sm">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6" style={{background:'linear-gradient(135deg, #714B67 0%, #5c3d55 50%, #3d2438 100%)'}}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
            <Zap size={14} className="text-yellow-300" />
            Built for the Odoo × FLUX Lucknow Hackathon 2026
          </div>
          <h1 className="text-5xl font-bold text-white mb-5 leading-tight">
            Smart Request Management<br />
            <span className="text-purple-200">for Modern Teams</span>
          </h1>
          <p className="text-lg text-white/75 mb-8 max-w-2xl mx-auto">
            A unified platform for submitting, tracking, and managing requests in real-time — 
            with powerful admin controls, live analytics, and seamless workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth" style={{background:'white', color:'#714B67'}}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl">
              Start as User <ArrowRight size={16} />
            </Link>
            <Link href="/auth" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-base text-white border border-white/30 hover:bg-white/10">
              Admin Access <Shield size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Requests Managed' },
            { value: '99.9%', label: 'Uptime' },
            { value: '<2min', label: 'Avg Response' },
            { value: '2 Roles', label: 'User & Admin' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold" style={{color:'#714B67'}}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to manage requests</h2>
          <p className="text-gray-500">Built with real-time data, clean UX, and enterprise-grade workflows</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ClipboardList, title: 'Submit Requests', desc: 'Users submit categorized requests with full details. Track status in real-time from a personal dashboard.', color: '#714B67' },
            { icon: Shield, title: 'Admin Controls', desc: 'Admins view all requests, update statuses, assign priorities, and manage the full pipeline with one click.', color: '#2563eb' },
            { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time metrics, status breakdowns, category distribution and trend charts on a beautiful dashboard.', color: '#16a34a' },
            { icon: CheckCircle, title: 'Status Workflows', desc: 'Draft → Pending → In Progress → Completed. Every transition is logged with timestamps.', color: '#d97706' },
            { icon: Users, title: 'Role-Based Access', desc: 'Separate dashboards for Users and Admins. Each role sees exactly what they need — nothing more.', color: '#7c3aed' },
            { icon: Zap, title: 'Real-Time Updates', desc: 'Powered by Supabase PostgreSQL. All data is live — no page reloads needed to see changes.', color: '#db2777' },
          ].map((f) => (
            <div key={f.title} className="odoo-card p-6 hover:shadow-md">
              <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4" style={{background: f.color + '15'}}>
                <f.icon size={22} style={{color: f.color}} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 text-center" style={{background:'#714B67'}}>
        <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
        <p className="text-white/70 mb-6">No setup required. Sign in and start managing requests in seconds.</p>
        <Link href="/auth" className="inline-flex items-center gap-2 bg-white font-semibold px-8 py-3.5 rounded-lg" style={{color:'#714B67'}}>
          Launch App <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 px-6 text-center text-sm">
        <p>FlowDesk — Odoo × FLUX Lucknow Hackathon 2026 &nbsp;|&nbsp; Built by Team Amit Tiwari</p>
      </footer>
    </div>
  );
}
