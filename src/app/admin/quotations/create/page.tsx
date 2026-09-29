'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Save } from 'lucide-react';
import { QuotationFormData } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function CreateQuotationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<QuotationFormData>({
    client_name: '',
    client_company: '',
    client_address: '',
    client_phone: '',
    notes: 'Harga sewaktu-waktu dapat berubah.\nPembayaran ditransfer ke rekening PT AKN.',
    items: [{ item_name: '', quantity: 1, unit: 'pcs', unit_price: 0 }]
  });

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: '', quantity: 1, unit: 'pcs', unit_price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const grandTotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to create quotation');
      
      router.push('/admin/quotations');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Buat Penawaran Baru</h1>
        <p className="text-slate-500 mt-1">Isi formulir di bawah ini untuk membuat surat penawaran.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Data Klien */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Data Klien</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien <span className="text-red-500">*</span></label>
              <input 
                type="text" required 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                value={formData.client_company} onChange={e => setFormData({...formData, client_company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. HP/Telepon</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                rows={2}
                value={formData.client_address} onChange={e => setFormData({...formData, client_address: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Daftar Barang */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Daftar Barang</h2>
          
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama Barang</th>
                  <th className="px-4 py-3 font-medium w-24">Qty</th>
                  <th className="px-4 py-3 font-medium w-24">Satuan</th>
                  <th className="px-4 py-3 font-medium w-40">Harga Satuan</th>
                  <th className="px-4 py-3 font-medium w-40">Subtotal</th>
                  <th className="px-4 py-3 font-medium w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-3">
                      <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                        value={item.item_name} onChange={e => updateItem(index, 'item_name', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-right"
                        value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                        value={item.unit} onChange={e => updateItem(index, 'unit', e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <input type="number" required min="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-right"
                        value={item.unit_price} onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-2 py-3 text-right font-medium text-slate-700">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <button type="button" onClick={() => removeItem(index)} disabled={formData.items.length === 1}
                        className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center border-t border-slate-200 pt-4">
            <button type="button" onClick={addItem} className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
              <Plus size={18} /> <span>Tambah Barang</span>
            </button>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Grand Total</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Catatan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Catatan & Syarat</h2>
          <textarea 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            rows={4}
            value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit" disabled={loading}
            className="flex items-center space-x-2 bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium text-lg disabled:opacity-70"
          >
            <Save size={20} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Quotation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
