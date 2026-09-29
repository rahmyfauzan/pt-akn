import React from 'react';
import { MessageCircle, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';
import Counter from './Counter';

export default async function Hero() {
  const settings = await getSettings();
  const waPhone = settings.company_phone.replace(/[^0-9]/g, '');
  
  return (
    <section className="relative w-full pt-28 pb-10 min-h-[100dvh] flex flex-col justify-center gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
            <span className="block mb-2">{settings.hero_title}</span>
            <span className="block text-amber-500 text-2xl md:text-4xl lg:text-5xl mt-2">{settings.company_tagline}</span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-100 whitespace-pre-wrap">
            {settings.hero_subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
            <a
              href={`https://wa.me/${waPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all hover:shadow-lg hover:shadow-amber-500/30 w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              <span>Hubungi via WhatsApp</span>
            </a>
            
            <Link
              href="#services"
              className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all w-full sm:w-auto"
            >
              <span>Lihat Layanan</span>
              <ArrowDown size={20} />
            </Link>
          </div>
          
          <div className="mt-12 md:mt-16 pt-8 border-t border-slate-700/50 flex flex-wrap justify-center gap-6 md:gap-16 animate-fade-in-up animate-delay-300">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-1"><Counter target={500} suffix="+" /></p>
              <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Produk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-1"><Counter target={100} suffix="+" /></p>
              <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Klien</p>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-amber-500 mb-1"><Counter target={5} /></p>
              <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Kategori</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
