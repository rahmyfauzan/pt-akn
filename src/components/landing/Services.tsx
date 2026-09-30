import React from 'react';
import { Paperclip, Home, Wrench, Zap, PackageSearch } from 'lucide-react';

export default function Services() {
  const services = [
    {
      title: 'Office Supply & ATK',
      icon: <Paperclip size={28} />,
      description: 'Kertas, alat tulis, tinta printer, dan perlengkapan administrasi kantor lainnya.',
    },
    {
      title: 'Peralatan Rumah Tangga',
      icon: <Home size={28} />,
      description: 'Peralatan kebersihan, perlengkapan pantry, dan elektronik rumah tangga.',
    },
    {
      title: 'Alat Teknik & Hardware',
      icon: <Wrench size={28} />,
      description: 'Perkakas tangan, power tools, dan perlengkapan keselamatan kerja (APD).',
    },
    {
      title: 'MEP (Mechanical, Electrical, Plumbing)',
      icon: <Zap size={28} />,
      description: 'Kabel, pipa, fitting, lampu, pompa air, dan komponen instalasi.',
    },
    {
      title: 'Custom Sourcing (Palugada)',
      icon: <PackageSearch size={28} />,
      description: 'Tidak menemukan barang yang dicari? Kami carikan untuk Anda!',
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Kategori Layanan Kami</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600">Solusi lengkap untuk setiap kebutuhan pengadaan bisnis Anda</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
