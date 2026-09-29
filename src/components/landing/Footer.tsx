import React from 'react';
import { MapPin, Mail, Phone, Camera, Globe } from 'lucide-react';
import Link from 'next/link';
import { getSettings } from '@/lib/settings';

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer id="kontak" className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1 text-2xl font-bold tracking-tighter mb-6">
              <span className="text-white">{settings.company_name.replace('PT ', '')}</span>
              <span className="text-amber-500">PT</span>
            </div>
            <p className="mb-6 leading-relaxed text-slate-400">
              {settings.company_tagline}. Memenuhi segala kebutuhan bisnis Anda dengan semangat profesionalitas dan layanan terbaik.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Camera size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-amber-500 hover:text-white transition-colors">
                <Globe size={20} />
              </a>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Tautan Cepat</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="#" className="hover:text-amber-500 transition-colors">Beranda</Link></li>
              <li><Link href="#about" className="hover:text-amber-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#services" className="hover:text-amber-500 transition-colors">Layanan</Link></li>
              <li><Link href="#catalog" className="hover:text-amber-500 transition-colors">Katalog Produk</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Kategori</h3>
            <ul className="flex flex-col gap-3">
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Office Supply & ATK</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Peralatan Rumah Tangga</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Alat Teknik & Hardware</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">MEP</span></li>
              <li><span className="hover:text-amber-500 transition-colors cursor-pointer">Custom Sourcing</span></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Kontak Kami</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3">
                <MapPin size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                <span>{settings.company_address}</span>
              </li>
              <li className="flex gap-3">
                <Mail size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                <a href={`mailto:${settings.company_email}`} className="hover:text-amber-500 transition-colors">{settings.company_email}</a>
              </li>
              <li className="flex gap-3">
                <Phone size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                <a href={`https://wa.me/${settings.company_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors">+{settings.company_phone} (WA)</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>Copyright © {new Date().getFullYear()} {settings.company_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
