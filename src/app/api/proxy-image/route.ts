import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url');
  
  if (!rawUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Menggunakan wsrv.nl proxy untuk memaksa konversi ke JPG
    // Ini sangat penting karena jsPDF sering gagal membaca gambar WebP/PNG transparan
    const optimizedUrl = `https://wsrv.nl/?url=${encodeURIComponent(rawUrl)}&output=jpg&w=400&q=80`;
    
    const response = await fetch(optimizedUrl);
    if (!response.ok) throw new Error('Failed to fetch image via proxy');
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    
    const dataUri = `data:image/jpeg;base64,${base64}`;
    
    return NextResponse.json({ dataUri });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
