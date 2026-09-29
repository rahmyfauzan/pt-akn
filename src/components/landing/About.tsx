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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-6">Cerita Kami</h3>
            <div className="prose prose-lg text-slate-600">
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

          <div className="flex flex-col gap-6">
            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Badan Hukum Resmi</h4>
                <p className="text-slate-600">Sebagai perseroan terbatas (PT), kami menjamin legalitas dan profesionalitas dalam setiap transaksi bisnis B2B Anda.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Network size={24} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Jaringan Distributor Luas</h4>
                <p className="text-slate-600">Kemitraan langsung dengan pabrik dan distributor utama memastikan Anda mendapatkan harga terbaik untuk produk berkualitas.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <Search size={24} />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-slate-900 mb-2">Custom Sourcing</h4>
                <p className="text-slate-600">Butuh barang spesifik yang langka? Tim sourcing kami siap mencari dan mendatangkannya khusus untuk Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
