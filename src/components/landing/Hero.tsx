import React from 'react';
import { MessageCircle, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export default async function Hero() {
  const settings = await getSettings();
  
  return (
    <section className="relative w-full pt-36 pb-20 lg:min-h-[100dvh] lg:flex lg:items-center lg:pt-20 lg:pb-0 gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
            <span className="block mb-2">{settings.hero_title}</span>
            <span className="block text-amber-500 text-3xl md:text-5xl mt-4">{settings.company_tagline}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100 whitespace-pre-wrap">
            {settings.hero_subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-lg hover:shadow-amber-500/30 w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              <span>Hubungi via WhatsApp</span>
            </a>
            
            <Link
              href="#services"
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg transition-all w-full sm:w-auto"
            >
              <span>Lihat Layanan</span>
              <ArrowDown size={20} />
            </Link>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-700/50 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in-up animate-delay-300">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Produk</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">100+</p>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Klien</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-500 mb-1">5</p>
              <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Kategori</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
    </section>
  );
}
