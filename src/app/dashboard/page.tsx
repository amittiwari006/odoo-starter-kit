'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { STATUS_COLORS, CATEGORIES, formatDate, formatTime } from '@/lib/utils';
import {
  PlusCircle, ClipboardList, LogOut, Clock, CheckCircle2,
  XCircle, AlertCircle, Search, Filter, ChevronDown, X
} from 'lucide-react';

type Request = {
  id: number; title: string; description: string; category: string;
  status: string; priority: string; created_at: string; updated_at: string;
  user_name: string; user_email: string;
};

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filtered, setFiltered] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', category: 'General', priority: 'Medium' });
  const [formErr, setFormErr] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    let result = [...requests];
    if (search) result = result.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    setFiltered(result);
  }, [search, statusFilter, requests]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    setUser(user);
    fetchRequests(user.id, user.email!, user.user_metadata?.full_name || user.email!);
  }

  async function fetchRequests(userId: string, email: string, name: string) {
    setLoading(true);
    const { data } = await supabase
      .from('requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim() || form.title.length < 5) errs.title = 'Title must be at least 5 characters.';
    if (!form.description.trim() || form.description.length < 10) errs.description = 'Description must be at least 10 characters.';
    return errs;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) { setFormErr(errs); return; }
    setSubmitting(true);
    const { data: { user: u } } = await supabase.auth.getUser();
    const { error } = await supabase.from('requests').insert([{
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      status: 'pending',
      user_id: u?.id,
      user_name: u?.user_metadata?.full_name || u?.email,
      user_email: u?.email,
    }]);
    if (!error) {
      setForm({ title: '', description: '', category: 'General', priority: 'Medium' });
      setFormErr({});
      setShowModal(false);
      fetchRequests(u!.id, u!.email!, u!.user_metadata?.full_name || u!.email!);
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/auth');
  }

  const counts = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  const priorityColor: Record<string, string> = {
    Low: 'bg-slate-100 text-slate-600',
    Medium: 'bg-blue-100 text-blue-700',
    High: 'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#714B67'}}>
              <ClipboardList size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base">FlowDesk</span>
              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">User</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{user?.user_metadata?.full_name || 'User'}</div>
              <div className="text-xs text-gray-400">{user?.email}</div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{background:'#714B67'}}>
              {(user?.user_metadata?.full_name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg">
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track and manage all your submitted requests</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <PlusCircle size={16} /> New Request
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Total', value: counts.total, icon: ClipboardList, color: '#714B67', bg: '#f3eef1' },
            { label: 'Pending', value: counts.pending, icon: Clock, color: '#d97706', bg: '#fffbeb' },
            { label: 'In Progress', value: counts.inProgress, icon: AlertCircle, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Completed', value: counts.completed, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
          ].map((m) => (
            <div key={m.label} className="odoo-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: m.bg}}>
                <m.icon size={20} style={{color: m.color}} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">{m.value}</div>
                <div className="text-xs text-gray-500">{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="odoo-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description or category..."
              className="input-field pl-9" />
          </div>
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pl-9 pr-8 appearance-none w-full sm:w-44">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="odoo-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{borderColor:'#714B67', borderTopColor:'transparent'}} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
              <h3 className="font-semibold text-gray-600 mb-1">
                {requests.length === 0 ? 'No requests yet' : 'No matching requests'}
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                {requests.length === 0 ? 'Submit your first request to get started.' : 'Try adjusting your search or filter.'}
              </p>
              {requests.length === 0 && (
                <button onClick={() => setShowModal(true)} className="btn-primary">
                  <PlusCircle size={15} /> New Request
                </button>
              )}
            </div>
          ) : (
            <table className="odoo-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, i) => (
                  <tr key={req.id}>
                    <td className="text-gray-400 text-xs font-mono">{String(req.id).padStart(4,'0')}</td>
                    <td>
                      <div className="font-medium text-gray-900">{req.title}</div>
                      {req.description && (
                        <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{req.description}</div>
                      )}
                    </td>
                    <td><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{req.category}</span></td>
                    <td><span className={`text-xs px-2 py-1 rounded font-medium ${priorityColor[req.priority] || 'bg-gray-100 text-gray-600'}`}>{req.priority}</span></td>
                    <td>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {req.status === 'in-progress' ? 'In Progress' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>
                    </td>
                    <td className="text-xs text-gray-400">{formatDate(req.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2 px-1">
          Showing {filtered.length} of {requests.length} requests
        </div>
      </main>

      {/* New Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.5)'}}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-lg font-bold text-gray-900">New Request</h2>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to submit your request</p>
              </div>
              <button onClick={() => { setShowModal(false); setFormErr({}); }} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Request Title *</label>
                <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Brief title describing your request"
                  className={`input-field ${formErr.title ? 'border-red-400' : ''}`} />
                {formErr.title && <p className="text-xs text-red-500 mt-1">{formErr.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
                  placeholder="Provide detailed description of your request..."
                  rows={4} className={`input-field resize-none ${formErr.description ? 'border-red-400' : ''}`} />
                {formErr.description && <p className="text-xs text-red-500 mt-1">{formErr.description}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})} className="input-field">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setFormErr({}); }} className="btn-secondary flex-1 justify-center">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
