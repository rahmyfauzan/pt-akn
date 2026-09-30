import React from 'react';
import { Package, MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/settings';

export default async function Catalog() {
  const settings = await getSettings();
  const products = settings.featured_products || [];

  if (products.length === 0) {
    return null;
  }

  const waPhone = settings.company_phone.replace(/[^0-9]/g, '');

  return (
    <section id="catalog" className="py-20 md:py-32 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Produk Unggulan</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600">Beberapa produk yang paling sering dipesan oleh klien kami</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="h-56 bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden relative group-hover:bg-slate-200 transition-colors">
                {product.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image_url} alt={product.name} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Package size={48} strokeWidth={1} />
                )}
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full mb-3">
                  {product.category || 'Umum'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-4">{product.name}</h3>
                
                <a 
                  href={`https://wa.me/${waPhone}?text=Hai%20kak%2C%20produk%20${encodeURIComponent(product.name)}%20apa%20masih%20ada%20ya%3F`}
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
            href={`https://wa.me/${waPhone}?text=Hai%20kak%2C%20saya%20mau%20tanya%20produk%20lainnya%20dong`}
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
