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
