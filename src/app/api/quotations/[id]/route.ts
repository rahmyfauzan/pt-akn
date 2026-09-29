import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerClient();

  const { data: quotation, error } = await supabase
    .from('quotations')
    .select('*, users!quotations_created_by_fkey(name)')
    .eq('id', id)
    .single();

  if (error || !quotation) {
    return NextResponse.json({ error: 'Quotation tidak ditemukan' }, { status: 404 });
  }

  const { data: items } = await supabase
    .from('quotation_items')
    .select('*')
    .eq('quotation_id', id)
    .order('created_at', { ascending: true });

  return NextResponse.json({
    quotation: {
      ...quotation,
      items: items || [],
      created_by_name: (quotation.users as Record<string, unknown>)?.name || 'Unknown',
      users: undefined,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await request.json();

  if (!['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase
    .from('quotations')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
    const body = await request.json();
    const { client_name, client_company, client_address, client_phone, items, notes, discount = 0, tax_rate = 0, shipping_fee = 0, valid_days = 7 } = body;

    const supabase = createServerClient();
    
    const itemsTotal = items.reduce((sum: number, item: any) => sum + item.quantity * (item.unit_price || 0), 0);
    const amountAfterDiscount = itemsTotal - Number(discount);
    const taxAmount = amountAfterDiscount * (Number(tax_rate) / 100);
    const grandTotal = amountAfterDiscount + taxAmount + Number(shipping_fee);

    // Update quote
    const { error: updateError } = await supabase.from('quotations').update({
      client_name, client_company: client_company || '', client_address: client_address || '', 
      client_phone: client_phone || '', discount: Number(discount), tax_rate: Number(tax_rate), 
      shipping_fee: Number(shipping_fee), valid_days: Number(valid_days), grand_total: grandTotal, notes: notes || ''
    }).eq('id', id);
    if (updateError) throw updateError;

    // Delete old items & insert new ones (simpler than syncing)
    await supabase.from('quotation_items').delete().eq('quotation_id', id);
    
    const { v4: uuidv4 } = require('uuid');
    const quotationItems = items.map((item: any) => ({
      id: uuidv4(),
      quotation_id: id,
      item_name: item.item_name,
      quantity: item.quantity,
      unit: item.unit || 'pcs',
      unit_price: item.unit_price || 0,
      subtotal: item.quantity * (item.unit_price || 0),
      image_url: item.image_url || '',
    }));
    await supabase.from('quotation_items').insert(quotationItems);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createServerClient();

  // Delete items first (cascade)
  await supabase.from('quotation_items').delete().eq('quotation_id', id);
  const { error } = await supabase.from('quotations').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
