'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Save, Image as ImageIcon } from 'lucide-react';
import { QuotationFormData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Autocomplete from '@/components/admin/Autocomplete';

export default function CreateQuotationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<{ clients: any[], items: any[] }>({ clients: [], items: [] });
  
  const [formData, setFormData] = useState<QuotationFormData>({
    client_name: '',
    client_company: '',
    client_address: '',
    client_phone: '',
    discount: 0,
    tax_rate: 0,
    shipping_fee: 0,
    valid_days: 7,
    notes: 'Harga sewaktu-waktu dapat berubah.\nPembayaran ditransfer ke Rekening BCA: 123456789 a/n PT AKN.\nInfo lebih lanjut hubungi WA: +62 812-3456-7890.',
    items: [{ item_name: '', quantity: 1, unit: 'pcs', unit_price: 0, image_url: '' }]
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/suggestions').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ])
      .then(([sugData, setData]) => {
        setSuggestions({ clients: sugData.clients || [], items: sugData.items || [] });
        if (setData.settings) {
          const notes = `${setData.settings.pdf_notes || ''}\n${setData.settings.bank_account || ''}`.trim();
          if (notes) setFormData(prev => ({ ...prev, notes }));
        }
      })
      .catch(err => console.error('Failed to load initial data', err));
  }, []);

  const handleClientSelect = (name: string) => {
    const client = suggestions.clients.find((c: any) => c.client_name === name);
    if (client) {
      setFormData(prev => ({
        ...prev,
        client_name: client.client_name,
        client_company: client.client_company || prev.client_company,
        client_address: client.client_address || prev.client_address,
        client_phone: client.client_phone || prev.client_phone,
      }));
    } else {
      setFormData(prev => ({ ...prev, client_name: name }));
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { item_name: '', quantity: 1, unit: 'pcs', unit_price: 0, image_url: '' }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items] as any[];
    
    if (field === 'item_name') {
      const suggestedItem = suggestions.items.find((i: any) => i.item_name === value);
      if (suggestedItem) {
        newItems[index] = { 
          ...newItems[index], 
          item_name: value,
          unit: suggestedItem.unit || newItems[index].unit,
          unit_price: suggestedItem.unit_price || newItems[index].unit_price,
          image_url: suggestedItem.image_url || newItems[index].image_url
        };
        setFormData({ ...formData, items: newItems });
        return;
      }
    }
    
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const itemsTotal = formData.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
  const amountAfterDiscount = itemsTotal - formData.discount;
  const taxAmount = amountAfterDiscount * (formData.tax_rate / 100);
  const grandTotal = amountAfterDiscount + taxAmount + formData.shipping_fee;

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
    <div className="max-w-6xl mx-auto space-y-6">
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
            <div className="z-20">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Klien <span className="text-red-500">*</span></label>
              <Autocomplete
                value={formData.client_name}
                onChange={handleClientSelect}
                options={suggestions.clients}
                displayKey="client_name"
                placeholder="Ketik nama klien..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
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
          
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-visible mb-4">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium w-1/3">Nama Barang</th>
                  <th className="px-4 py-3 font-medium w-48">Link Gambar</th>
                  <th className="px-4 py-3 font-medium w-20">Qty</th>
                  <th className="px-4 py-3 font-medium w-24">Satuan</th>
                  <th className="px-4 py-3 font-medium w-36">Harga</th>
                  <th className="px-4 py-3 font-medium w-36">Subtotal</th>
                  <th className="px-4 py-3 font-medium w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-2 py-3 z-10">
                      <Autocomplete
                        value={item.item_name}
                        onChange={(v) => updateItem(index, 'item_name', v)}
                        options={suggestions.items}
                        displayKey="item_name"
                        placeholder="Cari..."
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="relative">
                        <ImageIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="url" className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                          value={item.image_url || ''} onChange={e => updateItem(index, 'image_url', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
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
                      <input type="number" min="0" placeholder="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-right"
                        value={item.unit_price || ''} onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-2 py-3 text-right font-medium text-slate-700">
                      {formatCurrency(item.quantity * (item.unit_price || 0))}
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

          {/* Mobile Card View */}
          <div className="block md:hidden space-y-4 mb-4">
            {formData.items.map((item, index) => (
              <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                <button type="button" onClick={() => removeItem(index)} disabled={formData.items.length === 1}
                  className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
                <div className="space-y-3">
                  <div className="pr-8 z-10">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nama Barang</label>
                    <Autocomplete
                      value={item.item_name}
                      onChange={(v) => updateItem(index, 'item_name', v)}
                      options={suggestions.items}
                      displayKey="item_name"
                      placeholder="Cari produk..."
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Link Gambar</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="url" className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-xs"
                        value={item.image_url || ''} onChange={e => updateItem(index, 'image_url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                      <input type="number" required min="1" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm text-center"
                        value={item.quantity} onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Satuan</label>
                      <input type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm text-center"
                        value={item.unit} onChange={e => updateItem(index, 'unit', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Harga</label>
                      <input type="number" min="0" placeholder="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500 text-sm text-right"
                        value={item.unit_price || ''} onChange={e => updateItem(index, 'unit_price', Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-600">Subtotal:</span>
                    <span className="font-bold text-slate-800">{formatCurrency(item.quantity * (item.unit_price || 0))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button type="button" onClick={addItem} className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors mb-4">
            <Plus size={18} /> <span>Tambah Barang</span>
          </button>

          {/* Kalkulasi Total */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex flex-col gap-3 md:max-w-sm ml-auto text-sm w-full">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">{formatCurrency(itemsTotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center">Diskon (Rp)</span>
                <input 
                  type="number" min="0" placeholder="0"
                  className="w-32 px-3 py-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-right"
                  value={formData.discount || ''} onChange={e => setFormData({...formData, discount: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center">PPN (%)</span>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" min="0" max="100" placeholder="0"
                    className="w-16 px-3 py-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-right"
                    value={formData.tax_rate || ''} onChange={e => setFormData({...formData, tax_rate: Number(e.target.value)})}
                  />
                  <span className="font-medium text-slate-700 w-24 text-right">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 flex items-center">Ongkos Kirim</span>
                <input 
                  type="number" min="0" placeholder="0"
                  className="w-32 px-3 py-1 border border-slate-300 rounded outline-none focus:border-amber-500 text-right"
                  value={formData.shipping_fee || ''} onChange={e => setFormData({...formData, shipping_fee: Number(e.target.value)})}
                />
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-center mt-1">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-xs">Grand Total</span>
                <span className="text-xl font-bold text-amber-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Pengaturan</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Masa Berlaku Penawaran (Hari)</label>
              <input 
                type="number" required min="1"
                className="w-full md:w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                value={formData.valid_days} onChange={e => setFormData({...formData, valid_days: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Catatan & Syarat</h2>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              rows={4}
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit" disabled={loading}
            className="flex items-center space-x-2 bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium text-lg disabled:opacity-70 shadow-lg shadow-amber-500/30 w-full md:w-auto justify-center"
          >
            <Save size={20} />
            <span>{loading ? 'Menyimpan...' : 'Simpan Quotation'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
