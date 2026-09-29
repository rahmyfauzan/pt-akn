'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Trash2, Search, Plus } from 'lucide-react';
import { Quotation } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchQuotations = async () => {
    try {
      const res = await fetch('/api/quotations');
      if (res.ok) {
        const data = await res.json();
        setQuotations(data.quotations || []);
      }
    } catch (error) {
      console.error('Failed to fetch', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus quotation ini?')) return;
    try {
      const res = await fetch(`/api/quotations/${id}`, { method: 'DELETE' });
      if (res.ok) fetchQuotations();
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  const filtered = quotations.filter(q => 
    q.client_name.toLowerCase().includes(search.toLowerCase()) || 
    q.quotation_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Daftar Penawaran</h1>
          <p className="text-slate-500 mt-1">Kelola semua surat penawaran (quotation)</p>
        </div>
        <Link 
          href="/admin/quotations/create" 
          className="inline-flex items-center justify-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Buat Penawaran Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Cari nama klien atau no. quotation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium whitespace-nowrap">No. Quotation</th>
                <th className="px-6 py-3 font-medium">Nama Klien</th>
                <th className="px-6 py-3 font-medium">Perusahaan</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Dibuat oleh</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-slate-500">Tidak ada data ditemukan.</td>
                </tr>
              ) : (
                filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{q.quotation_number}</td>
                    <td className="px-6 py-4 text-slate-700">{q.client_name}</td>
                    <td className="px-6 py-4 text-slate-600">{q.client_company || '-'}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium whitespace-nowrap">{formatCurrency(q.grand_total)}</td>
                    <td className="px-6 py-4"><StatusBadge status={q.status} /></td>
                    <td className="px-6 py-4 text-slate-600">{q.created_by_name}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{formatDate(q.created_at)}</td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <Link 
                        href={`/admin/quotations/${q.id}`}
                        className="inline-flex p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="inline-flex p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
