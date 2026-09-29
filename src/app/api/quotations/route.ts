import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';
import { generateQuotationNumber } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data: quotations, error } = await supabase
    .from('quotations')
    .select('*, users!quotations_created_by_fkey(name)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = quotations?.map((q: Record<string, unknown>) => ({
    ...q,
    created_by_name: (q.users as Record<string, unknown>)?.name || 'Unknown',
    users: undefined,
  }));

  return NextResponse.json({ quotations: formatted });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { client_name, client_company, client_address, client_phone, items, notes, discount = 0, tax_rate = 0, valid_days = 7 } = body;

    if (!client_name || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Nama klien dan minimal 1 item wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const quotationId = uuidv4();
    
    // Hitung subtotal barang
    const itemsTotal = items.reduce(
      (sum: number, item: { quantity: number; unit_price: number }) =>
        sum + item.quantity * item.unit_price,
      0
    );

    // Hitung PPN (setelah dipotong diskon)
    const amountAfterDiscount = itemsTotal - Number(discount);
    const taxAmount = amountAfterDiscount * (Number(tax_rate) / 100);
    const grandTotal = amountAfterDiscount + taxAmount;

    // Insert quotation
    const { error: quotationError } = await supabase.from('quotations').insert({
      id: quotationId,
      quotation_number: generateQuotationNumber(),
      client_name,
      client_company: client_company || '',
      client_address: client_address || '',
      client_phone: client_phone || '',
      status: 'DRAFT',
      discount: Number(discount),
      tax_rate: Number(tax_rate),
      valid_days: Number(valid_days),
      grand_total: grandTotal,
      notes: notes || '',
      created_by: session.id,
    });

    if (quotationError) {
      return NextResponse.json({ error: quotationError.message }, { status: 500 });
    }

    // Insert items
    const quotationItems = items.map(
      (item: { item_name: string; quantity: number; unit: string; unit_price: number; image_url?: string }) => ({
        id: uuidv4(),
        quotation_id: quotationId,
        item_name: item.item_name,
        quantity: item.quantity,
        unit: item.unit || 'pcs',
        unit_price: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        image_url: item.image_url || '',
      })
    );

    const { error: itemsError } = await supabase
      .from('quotation_items')
      .insert(quotationItems);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: quotationId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
