'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { Settings } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    company_name: 'PT AKN',
    company_tagline: 'One-Stop Procurement Solution',
    company_address: '',
    company_phone: '',
    company_email: '',
    bank_account: '',
    pdf_notes: '',
    hero_title: 'Solusi Pengadaan Satu Pintu',
    hero_subtitle: 'PT AKN hadir sebagai mitra strategis Anda dalam pengadaan barang.',
    featured_products: []
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error('Gagal menyimpan pengaturan');
      setMessage({ text: 'Pengaturan berhasil disimpan!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const addProduct = () => {
    setSettings(prev => ({
      ...prev,
      featured_products: [
        ...prev.featured_products,
        { id: Math.random().toString(36).substr(2, 9), name: '', category: '', image_url: '' }
      ]
    }));
  };

  const updateProduct = (index: number, field: string, value: string) => {
    const newProducts = [...settings.featured_products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setSettings({ ...settings, featured_products: newProducts });
  };

  const removeProduct = (index: number) => {
    const newProducts = [...settings.featured_products];
    newProducts.splice(index, 1);
    setSettings({ ...settings, featured_products: newProducts });
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Memuat pengaturan...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengaturan Website & Sistem</h1>
        <p className="text-slate-500 mt-1">Kelola identitas perusahaan dan konten beranda dari satu tempat.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Identitas Perusahaan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Identitas Perusahaan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Perusahaan</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                value={settings.company_name} onChange={e => setSettings({...settings, company_name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                value={settings.company_tagline} onChange={e => setSettings({...settings, company_tagline: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                value={settings.company_email} onChange={e => setSettings({...settings, company_email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. WhatsApp / Telepon</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                value={settings.company_phone} onChange={e => setSettings({...settings, company_phone: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Lengkap</label>
              <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500" rows={2}
                value={settings.company_address} onChange={e => setSettings({...settings, company_address: e.target.value})} />
            </div>
          </div>
        </div>

        {/* Pengaturan PDF */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Format PDF Penawaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Informasi Rekening (Tampil di Catatan)</label>
              <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500" rows={3}
                value={settings.bank_account} onChange={e => setSettings({...settings, bank_account: e.target.value})} 
                placeholder="Contoh: BCA 123456789 a/n PT AKN" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Catatan Default Penawaran</label>
              <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500" rows={3}
                value={settings.pdf_notes} onChange={e => setSettings({...settings, pdf_notes: e.target.value})}
                placeholder="Contoh: Harga dapat berubah sewaktu-waktu..." />
            </div>
          </div>
        </div>

        {/* Tampilan Beranda */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Konten Halaman Depan (Landing Page)</h2>
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul Utama (Hero Title)</label>
              <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500"
                value={settings.hero_title} onChange={e => setSettings({...settings, hero_title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sub-judul (Hero Subtitle)</label>
              <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-amber-500" rows={2}
                value={settings.hero_subtitle} onChange={e => setSettings({...settings, hero_subtitle: e.target.value})} />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-slate-700">Produk Unggulan (Katalog)</h3>
              <button type="button" onClick={addProduct} className="flex items-center space-x-1 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-100">
                <Plus size={16} /> <span>Tambah Produk</span>
              </button>
            </div>
            
            {settings.featured_products.length === 0 ? (
              <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 text-sm">
                Belum ada produk unggulan yang ditampilkan di halaman depan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.featured_products.map((product, idx) => (
                  <div key={product.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                    <button type="button" onClick={() => removeProduct(idx)} className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-600 bg-white rounded shadow-sm">
                      <Trash2 size={14} />
                    </button>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Nama Produk</label>
                        <input type="text" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded outline-none focus:border-amber-500"
                          value={product.name} onChange={e => updateProduct(idx, 'name', e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Kategori</label>
                          <input type="text" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded outline-none focus:border-amber-500"
                            value={product.category} onChange={e => updateProduct(idx, 'category', e.target.value)} placeholder="Misal: ATK" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">Link Gambar</label>
                          <input type="url" className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded outline-none focus:border-amber-500"
                            value={product.image_url} onChange={e => updateProduct(idx, 'image_url', e.target.value)} placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pb-12">
          <button type="submit" disabled={saving} className="flex items-center space-x-2 bg-amber-500 text-white px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors font-medium text-lg disabled:opacity-70 shadow-lg shadow-amber-500/30">
            <Save size={20} />
            <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
