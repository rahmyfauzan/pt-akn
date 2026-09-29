import React from 'react';
import { Package, MessageCircle } from 'lucide-react';

export default function Catalog() {
  const products = [
    { name: 'Kertas HVS A4 70gsm', category: 'Office Supply' },
    { name: 'Tinta Printer HP 680', category: 'Office Supply' },
    { name: 'Kabel NYM 3x2.5mm', category: 'MEP' },
    { name: 'Safety Helmet SNI', category: 'Alat Teknik' },
    { name: 'Pipa PVC 3/4 inch', category: 'MEP' },
    { name: 'Dispenser Hot & Cold', category: 'Rumah Tangga' },
  ];

  return (
    <section id="catalog" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Produk Populer</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600">Beberapa produk yang paling sering dipesan oleh klien kami</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-200 transition-colors">
                <Package size={48} strokeWidth={1} />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full mb-3">
                  {product.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{product.name}</h3>
                
                <a 
                  href={`https://wa.me/6281234567890?text=Halo%20PT%20AKN,%20saya%20ingin%20bertanya%20harga%20untuk%20${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg font-medium transition-colors"
                >
                  <MessageCircle size={18} />
                  <span>Minta Penawaran</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 hover:underline"
          >
            Tanya produk lainnya <MessageCircle size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
