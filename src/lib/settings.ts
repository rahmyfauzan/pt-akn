import { createServerClient } from './supabase';
import { Settings } from '@/types';

const defaultSettings: Settings = {
  company_name: 'PT AKN',
  company_tagline: 'One-Stop Procurement Solution',
  company_address: 'Alamat belum diatur',
  company_phone: '6281234567890',
  company_email: 'info@ptakn.co.id',
  bank_account: 'Rekening BCA: 123456789 a/n PT AKN',
  pdf_notes: 'Harga sewaktu-waktu dapat berubah.',
  hero_title: 'Solusi Pengadaan Satu Pintu',
  hero_subtitle: 'PT AKN hadir sebagai mitra strategis Anda dalam pengadaan barang.',
  featured_products: []
};

export async function getSettings(): Promise<Settings> {
  try {
    const supabase = createServerClient();
    const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (data) return data as Settings;
    return defaultSettings;
  } catch (error) {
    return defaultSettings;
  }
}
