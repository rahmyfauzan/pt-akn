import React from 'react';
import { Shield, Network, Search } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Tentang PT AKN</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto mb-16 text-center">
          <div className="prose prose-lg text-slate-600 mx-auto">
            <p className="mb-4">
              Berawal dari mengamati inefisiensi dalam proses pengadaan barang di berbagai perusahaan, PT AKN lahir dari semangat "Palugada" — <em>Apa lu mau, gua ada</em>. Kami melihat banyak bisnis kesulitan menemukan supplier yang bisa diandalkan untuk berbagai macam kebutuhan sekaligus.
            </p>
            <p className="mb-4">
              Dari melayani permintaan kecil-kecilan, dedikasi kami terhadap kecepatan, kualitas, dan kepercayaan klien mendorong kami untuk berevolusi menjadi badan hukum resmi. Kini, PT AKN berdiri sebagai General Supplier profesional yang melayani B2B maupun B2C.
            </p>
            <p>
              Misi kami sederhana: menjadi satu-satunya titik kontak (One-Stop Solution) untuk semua kebutuhan pengadaan Anda, sehingga Anda bisa fokus pada bisnis inti sementara kami mengurus sisanya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Badan Hukum Resmi</h4>
            <p className="text-sm text-slate-600">Menjamin legalitas dan profesionalitas dalam setiap transaksi bisnis B2B Anda.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Network size={24} />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Jaringan Luas</h4>
            <p className="text-sm text-slate-600">Kemitraan pabrik memastikan Anda mendapat harga terbaik untuk produk berkualitas.</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <h4 className="text-lg font-semibold text-slate-900 mb-2">Custom Sourcing</h4>
            <p className="text-sm text-slate-600">Butuh barang langka? Tim kami siap mencari dan mendatangkannya khusus untuk Anda.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
