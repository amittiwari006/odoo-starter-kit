'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { STATUS_COLORS, formatDate } from '@/lib/utils';
import {
  ClipboardList, LogOut, Search, Filter, ChevronDown,
  CheckCircle2, XCircle, AlertCircle, Clock, Users,
  BarChart3, TrendingUp, RefreshCw
} from 'lucide-react';

type Request = {
  id: number; title: string; description: string; category: string;
  status: string; priority: string; created_at: string;
  user_name: string; user_email: string;
};

const STATUS_FLOW: Record<string, { next: string; label: string; color: string }[]> = {
  pending:      [{ next: 'in-progress', label: '▶ Start', color: '#2563eb' }, { next: 'rejected', label: '✕ Reject', color: '#dc2626' }],
  'in-progress':[{ next: 'completed', label: '✓ Complete', color: '#16a34a' }, { next: 'rejected', label: '✕ Reject', color: '#dc2626' }],
  completed:    [],
  rejected:     [{ next: 'pending', label: '↩ Reopen', color: '#714B67' }],
};

const priorityColor: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-100 text-blue-700',
  High: 'bg-orange-100 text-orange-700',
  Urgent: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filtered, setFiltered] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [updating, setUpdating] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'requests' | 'analytics'>('requests');

  useEffect(() => { checkAdmin(); }, []);

  useEffect(() => {
    let result = [...requests];
    if (search) result = result.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== 'all') result = result.filter(r => r.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(r => r.category === categoryFilter);
    setFiltered(result);
  }, [search, statusFilter, categoryFilter, requests]);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/auth'); return; }
    const role = user.user_metadata?.role;
    if (role !== 'admin') { router.push('/dashboard'); return; }
    setAdmin(user);
    fetchAllRequests();
  }

  async function fetchAllRequests() {
    setLoading(true);
    const { data } = await supabase
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  async function updateStatus(id: number, newStatus: string) {
    setUpdating(id);
    const { error } = await supabase
      .from('requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    setUpdating(null);
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
    users: new Set(requests.map(r => r.user_email)).size,
  };

  const categories = ['all', ...Array.from(new Set(requests.map(r => r.category)))];

  // Analytics
  const categoryData = categories.filter(c => c !== 'all').map(c => ({
    name: c,
    count: requests.filter(r => r.category === c).length,
    pct: Math.round((requests.filter(r => r.category === c).length / (requests.length || 1)) * 100),
  })).sort((a, b) => b.count - a.count);

  const resolutionRate = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#714B67'}}>
              <ClipboardList size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-base">FlowDesk</span>
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
            {/* Nav Tabs */}
            <div className="hidden md:flex items-center gap-1 ml-6 bg-gray-100 rounded-lg p-1">
              {(['requests', 'analytics'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab === 'requests' ? '📋 Requests' : '📊 Analytics'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAllRequests} title="Refresh"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <RefreshCw size={16} />
            </button>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900">{admin?.user_metadata?.full_name || 'Admin'}</div>
              <div className="text-xs text-gray-400">{admin?.email}</div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{background:'#714B67'}}>
              {(admin?.user_metadata?.full_name || admin?.email || 'A')[0].toUpperCase()}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 hover:bg-red-50 rounded-lg">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {[
            { label: 'Total', value: counts.total, icon: ClipboardList, color: '#714B67', bg: '#f3eef1' },
            { label: 'Pending', value: counts.pending, icon: Clock, color: '#d97706', bg: '#fffbeb' },
            { label: 'In Progress', value: counts.inProgress, icon: AlertCircle, color: '#2563eb', bg: '#eff6ff' },
            { label: 'Completed', value: counts.completed, icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Rejected', value: counts.rejected, icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Users', value: counts.users, icon: Users, color: '#7c3aed', bg: '#f5f3ff' },
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

        {activeTab === 'requests' ? (
          <>
            {/* Filters */}
            <div className="odoo-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, user name or email..."
                  className="input-field pl-9" />
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field pr-8 appearance-none w-40">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                    className="input-field pr-8 appearance-none w-36">
                    {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="odoo-card overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{borderColor:'#714B67', borderTopColor:'transparent'}} />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                  <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="font-semibold text-gray-600 mb-1">No requests found</h3>
                  <p className="text-sm text-gray-400">Adjust your filters to see more results.</p>
                </div>
              ) : (
                <table className="odoo-table">
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Request Details</th>
                      <th>Submitted By</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((req) => (
                      <tr key={req.id}>
                        <td className="text-gray-400 text-xs font-mono">{String(req.id).padStart(4,'0')}</td>
                        <td>
                          <div className="font-medium text-gray-900 max-w-xs">{req.title}</div>
                          {req.description && (
                            <div className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{req.description}</div>
                          )}
                        </td>
                        <td>
                          <div className="text-sm font-medium text-gray-700">{req.user_name}</div>
                          <div className="text-xs text-gray-400">{req.user_email}</div>
                        </td>
                        <td><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{req.category}</span></td>
                        <td><span className={`text-xs px-2 py-1 rounded font-medium ${priorityColor[req.priority] || 'bg-gray-100 text-gray-600'}`}>{req.priority}</span></td>
                        <td>
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {req.status === 'in-progress' ? 'In Progress' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="text-xs text-gray-400 whitespace-nowrap">{formatDate(req.created_at)}</td>
                        <td>
                          <div className="flex items-center gap-1.5">
                            {updating === req.id ? (
                              <span className="w-5 h-5 border-2 rounded-full animate-spin inline-block" style={{borderColor:'#714B67', borderTopColor:'transparent'}} />
                            ) : (
                              STATUS_FLOW[req.status]?.map(action => (
                                <button key={action.next} onClick={() => updateStatus(req.id, action.next)}
                                  className="text-xs px-2.5 py-1 rounded font-medium text-white whitespace-nowrap hover:opacity-90"
                                  style={{background: action.color}}>
                                  {action.label}
                                </button>
                              ))
                            )}
                            {STATUS_FLOW[req.status]?.length === 0 && (
                              <span className="text-xs text-gray-400 italic">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2 px-1">Showing {filtered.length} of {requests.length} requests</div>
          </>
        ) : (
          /* Analytics Tab */
          <div className="grid md:grid-cols-2 gap-6">
            {/* Resolution Rate */}
            <div className="odoo-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} style={{color:'#714B67'}} />
                <h3 className="font-semibold text-gray-900">Resolution Rate</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#714B67" strokeWidth="3"
                      strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{resolutionRate}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Completed', count: counts.completed, color: '#16a34a' },
                    { label: 'In Progress', count: counts.inProgress, color: '#2563eb' },
                    { label: 'Pending', count: counts.pending, color: '#d97706' },
                    { label: 'Rejected', count: counts.rejected, color: '#dc2626' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{background: s.color}} />
                      <span className="text-gray-600">{s.label}</span>
                      <span className="ml-auto font-semibold text-gray-900">{s.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="odoo-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} style={{color:'#714B67'}} />
                <h3 className="font-semibold text-gray-900">Category Breakdown</h3>
              </div>
              {categoryData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {categoryData.map((c, i) => (
                    <div key={c.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{c.name}</span>
                        <span className="text-gray-500">{c.count} ({c.pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{width:`${c.pct}%`, background: ['#714B67','#2563eb','#16a34a','#d97706','#dc2626','#7c3aed'][i % 6]}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="odoo-card p-6 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList size={18} style={{color:'#714B67'}} />
                <h3 className="font-semibold text-gray-900">Recent Activity (Last 5 Requests)</h3>
              </div>
              {requests.slice(0, 5).map(req => (
                <div key={req.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{background:'#714B67'}}>
                      {req.user_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{req.title}</div>
                      <div className="text-xs text-gray-400">by {req.user_name} · {formatDate(req.created_at)}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {req.status === 'in-progress' ? 'In Progress' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
