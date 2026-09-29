import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  
  try {
    // Ambil 500 quotation terakhir untuk deduplikasi klien
    const { data: quotes } = await supabase
      .from('quotations')
      .select('client_name, client_company, client_address, client_phone')
      .order('created_at', { ascending: false })
      .limit(500);

    // Ambil 1000 item terakhir untuk deduplikasi produk
    const { data: items } = await supabase
      .from('quotation_items')
      .select('item_name, unit, unit_price, image_url')
      .order('created_at', { ascending: false })
      .limit(1000);

    // Deduplikasi Clients
    const uniqueClients = new Map();
    quotes?.forEach(q => {
      if (q.client_name && !uniqueClients.has(q.client_name)) {
        uniqueClients.set(q.client_name, q);
      }
    });

    // Deduplikasi Items
    const uniqueItems = new Map();
    items?.forEach(item => {
      if (item.item_name && !uniqueItems.has(item.item_name)) {
        uniqueItems.set(item.item_name, item);
      }
    });

    return NextResponse.json({
      clients: Array.from(uniqueClients.values()),
      items: Array.from(uniqueItems.values())
    });

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan saat mengambil saran data' },
      { status: 500 }
    );
  }
}
