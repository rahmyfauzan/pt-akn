'use client';

import { useEffect, useState } from 'react';
import { FileText, Edit, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Quotation } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/quotations');
        if (res.ok) {
          const data = await res.json();
          setQuotations(data.quotations || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse p-8 text-center text-slate-500">Memuat dashboard...</div>;
  }

  const draftCount = quotations.filter(q => q.status === 'DRAFT').length;
  const sentCount = quotations.filter(q => q.status === 'SENT').length;
  const acceptedCount = quotations.filter(q => q.status === 'ACCEPTED').length;

  const today = new Date();
  const expiredCount = quotations.filter(q => {
    if (q.status !== 'SENT') return false;
    const qDate = new Date(q.created_at);
    qDate.setDate(qDate.getDate() + (q.valid_days || 7));
    return qDate < today; // Passed validity date
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">Selamat datang di Admin Panel PT AKN</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{quotations.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Draft</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{draftCount}</p>
            </div>
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg"><Edit size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Terkirim</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{sentCount}</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><Send size={20} /></div>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-200 border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 uppercase">Expired / Unprocessed</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{expiredCount}</p>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={20} /></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Diterima</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{acceptedCount}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800">Quotation Terbaru</h2>
          <Link href="/admin/quotations" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
            Lihat Semua
          </Link>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">No. Quotation</th>
                <th className="px-6 py-3 font-medium">Klien</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotations.slice(0, 5).map((q) => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <Link href={`/admin/quotations/${q.id}`} className="hover:text-amber-600 transition-colors">
                      {q.quotation_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{q.client_name}</td>
                  <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(q.created_at)}</td>
                </tr>
              ))}
              {quotations.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada data quotation.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="block md:hidden divide-y divide-slate-100">
           {quotations.slice(0, 5).map((q) => (
              <Link key={q.id} href={`/admin/quotations/${q.id}`} className="block p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-slate-500">{q.quotation_number}</span>
                  <StatusBadge status={q.status} />
                </div>
                <h3 className="font-medium text-slate-800 text-sm mb-1">{q.client_name}</h3>
                <p className="text-xs text-slate-500">{formatDate(q.created_at)}</p>
              </Link>
           ))}
           {quotations.length === 0 && (
             <div className="p-8 text-center text-slate-500 text-sm">Belum ada data quotation.</div>
           )}
        </div>
      </div>
    </div>
  );
}
