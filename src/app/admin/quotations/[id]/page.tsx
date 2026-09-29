'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, RefreshCw, Image as ImageIcon, Edit } from 'lucide-react';
import { Quotation } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<Quotation['status']>('DRAFT');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resQuo, resSet] = await Promise.all([
          fetch(`/api/quotations/${id}`),
          fetch('/api/settings')
        ]);
        if (resQuo.ok) {
          const data = await resQuo.json();
          setQuotation(data.quotation);
          setStatus(data.quotation.status);
        }
        if (resSet.ok) {
          const data = await resSet.json();
          setSettings(data.settings);
        }
      } catch (error) {
        console.error('Failed to fetch', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok && quotation) {
        setQuotation({ ...quotation, status });
        alert('Status berhasil diupdate');
      }
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setUpdating(false);
    }
  };

  const generatePDF = async () => {
    if (!quotation) return;
    setGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      
      const companyName = settings?.company_name || 'PT AKN';
      const companyTagline = settings?.company_tagline || 'One-Stop Procurement Solution';
      
      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text(companyName, 14, 22);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(companyTagline, 14, 28);
      
      // Title
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.setFont('helvetica', 'bold');
      doc.text('SURAT PENAWARAN HARGA', 105, 45, { align: 'center' });
      
      // Info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`No. Quotation : ${quotation.quotation_number}`, 14, 60);
      doc.text(`Tanggal : ${formatDate(quotation.created_at)}`, 14, 66);
      
      const validUntil = new Date(quotation.created_at);
      validUntil.setDate(validUntil.getDate() + (quotation.valid_days || 7));
      doc.text(`Berlaku Hingga : ${formatDate(validUntil.toISOString())}`, 14, 72);
      
      doc.text('Kepada Yth:', 140, 60);
      doc.setFont('helvetica', 'bold');
      doc.text(quotation.client_name, 140, 66);
      doc.setFont('helvetica', 'normal');
      if (quotation.client_company) doc.text(quotation.client_company, 140, 72);
      if (quotation.client_address) {
        const splitAddress = doc.splitTextToSize(quotation.client_address, 60);
        doc.text(splitAddress, 140, 78);
      }

      // Fetch images for PDF (convert to base64 via browser + wsrv.nl proxy)
      const tableData: any[][] = [];
      for (let i = 0; i < quotation.items.length; i++) {
        const item = quotation.items[i];
        let base64Img = null;
        
        if (item.image_url) {
          try {
            // Kita fetch langsung dari browser via proxy wsrv.nl agar tidak terkena limit serverless Vercel
            const optimizedUrl = `https://wsrv.nl/?url=${encodeURIComponent(item.image_url)}&output=jpg&w=400&q=80`;
            const res = await fetch(optimizedUrl);
            if (res.ok) {
              const blob = await res.blob();
              base64Img = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            } else {
              console.warn('Gagal memuat gambar dari:', optimizedUrl, res.status);
            }
          } catch (e) {
            console.error('Failed to load image for PDF', e);
          }
        }

        tableData.push([
          i + 1,
          base64Img, // Will be drawn in didDrawCell
          item.item_name,
          item.quantity,
          item.unit,
          formatCurrency(item.unit_price || 0),
          formatCurrency((item.quantity * (item.unit_price || 0)))
        ]);
      }
      
      autoTable(doc, {
        startY: 95,
        head: [['No', 'Gambar', 'Nama Barang', 'Qty', 'Satuan', 'Harga Satuan', 'Subtotal']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42] },
        styles: { fontSize: 9, cellPadding: 3, valign: 'middle' },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { halign: 'center', cellWidth: 20, minCellHeight: 20 },
          3: { halign: 'center', cellWidth: 12 },
          4: { halign: 'center', cellWidth: 18 },
          5: { halign: 'right' },
          6: { halign: 'right', fontStyle: 'bold' }
        },
        didDrawCell: function(data) {
          if (data.column.index === 1 && data.cell.section === 'body') {
            const base64Img = tableData[data.row.index][1];
            if (base64Img && typeof base64Img === 'string') {
              try {
                // Selalu asumsikan JPEG karena wsrv.nl sudah memaksa output=jpg
                const dim = 14; 
                doc.addImage(base64Img, 'JPEG', data.cell.x + 3, data.cell.y + 3, dim, dim);
              } catch(e) {
                console.error("Failed drawing image in PDF", e);
              }
            }
          }
        },
        willDrawCell: function(data) {
          if (data.column.index === 1 && data.cell.section === 'body') {
            data.cell.text = []; 
          }
        }
      });
      
      // @ts-ignore
      const finalY = (doc as any).lastAutoTable?.finalY || 100;
      
      // Calculation Breakdown
      const subtotal = quotation.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
      let currentY = finalY + 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Subtotal:', 140, currentY);
      doc.text(formatCurrency(subtotal), 196, currentY, { align: 'right' });
      currentY += 6;

      if (quotation.discount > 0) {
        doc.text('Diskon:', 140, currentY);
        doc.text(`-${formatCurrency(quotation.discount)}`, 196, currentY, { align: 'right' });
        currentY += 6;
      }

      if (quotation.tax_rate > 0) {
        const taxAmount = (subtotal - quotation.discount) * (quotation.tax_rate / 100);
        doc.text(`PPN (${quotation.tax_rate}%):`, 140, currentY);
        doc.text(formatCurrency(taxAmount), 196, currentY, { align: 'right' });
        currentY += 6;
      }

      if (quotation.shipping_fee > 0) {
        doc.text('Ongkos Kirim:', 140, currentY);
        doc.text(formatCurrency(quotation.shipping_fee), 196, currentY, { align: 'right' });
        currentY += 6;
      }

      // Grand Total
      currentY += 2;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Grand Total:', 140, currentY);
      doc.text(formatCurrency(quotation.grand_total), 196, currentY, { align: 'right' });
      
      // Notes
      doc.setFontSize(10);
      doc.text('Catatan & Informasi Pembayaran:', 14, currentY + 15);
      doc.setFont('helvetica', 'normal');
      const splitNotes = doc.splitTextToSize(quotation.notes || '-', 180);
      doc.text(splitNotes, 14, currentY + 22);
      
      // Footer
      const footerY = currentY + 22 + Math.max(20, splitNotes.length * 5);
      doc.text('Hormat kami,', 14, footerY);
      doc.setFont('helvetica', 'bold');
      doc.text(companyName, 14, footerY + 20);
      
      doc.save(`${quotation.quotation_number}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Gagal menghasilkan PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Memuat detail...</div>;
  if (!quotation) return <div className="p-8 text-center">Quotation tidak ditemukan.</div>;

  const subtotal = quotation.items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
  const taxAmount = (subtotal - quotation.discount) * (quotation.tax_rate / 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/quotations" className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {quotation.quotation_number}
              <StatusBadge status={quotation.status} />
            </h1>
            <p className="text-slate-500 mt-1">Dibuat pada {formatDate(quotation.created_at)}</p>
          </div>
        </div>
        <Link 
          href={`/admin/quotations/${quotation.id}/edit`}
          className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm w-fit"
        >
          <Edit size={16} />
          <span>Edit Penawaran</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-slate-700">Ubah Status:</label>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as Quotation['status'])}
            className="border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-amber-500 text-sm"
          >
            <option value="DRAFT">Draft</option>
            <option value="SENT">Terkirim</option>
            <option value="ACCEPTED">Diterima</option>
            <option value="REJECTED">Ditolak</option>
          </select>
          <button 
            onClick={handleUpdateStatus} disabled={updating || status === quotation.status}
            className="flex items-center space-x-1 bg-slate-800 text-white px-3 py-1.5 rounded-lg hover:bg-slate-700 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={updating ? "animate-spin" : ""} />
            <span>Update</span>
          </button>
        </div>
        
        <button 
          onClick={generatePDF}
          disabled={generatingPDF}
          className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm disabled:opacity-50"
        >
          {generatingPDF ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{generatingPDF ? 'Memproses PDF...' : 'Download PDF'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">Informasi Klien</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Nama Klien</p>
              <p className="font-medium text-slate-800">{quotation.client_name}</p>
            </div>
            {quotation.client_company && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Perusahaan</p>
                <p className="text-slate-800">{quotation.client_company}</p>
              </div>
            )}
            {quotation.client_phone && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Telepon</p>
                <p className="text-slate-800">{quotation.client_phone}</p>
              </div>
            )}
            {quotation.client_address && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Alamat</p>
                <p className="text-slate-800 text-sm">{quotation.client_address}</p>
              </div>
            )}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-semibold">Masa Berlaku</p>
              <p className="text-slate-800">{quotation.valid_days} Hari</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">Dibuat Oleh</p>
              <p className="text-slate-800">{quotation.created_by_name}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Detail Barang</h2>
            </div>
            
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">No</th>
                    <th className="px-4 py-3 font-medium text-center">Gambar</th>
                    <th className="px-4 py-3 font-medium">Nama Barang</th>
                    <th className="px-4 py-3 font-medium text-center">Qty</th>
                    <th className="px-4 py-3 font-medium text-center">Satuan</th>
                    <th className="px-4 py-3 font-medium text-right">Harga Satuan</th>
                    <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotation.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-2 text-center">
                        {item.image_url ? (
                          <div className="w-12 h-12 rounded overflow-hidden mx-auto bg-slate-100 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image_url} alt={item.item_name} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded mx-auto bg-slate-100 flex items-center justify-center text-slate-300">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-800">{item.item_name}</td>
                      <td className="px-4 py-4 text-center text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-4 text-center text-slate-700">{item.unit}</td>
                      <td className="px-4 py-4 text-right text-slate-700">{formatCurrency(item.unit_price || 0)}</td>
                      <td className="px-4 py-4 text-right font-medium text-slate-800">{formatCurrency(item.quantity * (item.unit_price || 0))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile List Detail */}
            <div className="block md:hidden divide-y divide-slate-100">
              {quotation.items.map((item, idx) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-16 h-16 shrink-0 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.image_url} alt={item.item_name} className="object-cover w-full h-full" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-800 text-sm">{item.item_name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.quantity} {item.unit} x {formatCurrency(item.unit_price || 0)}</p>
                    <p className="font-bold text-slate-800 mt-2 text-sm">{formatCurrency(item.quantity * (item.unit_price || 0))}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-6 flex flex-col items-end gap-2 border-t border-slate-200 text-sm">
              <div className="flex justify-between w-full sm:w-64">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-700">{formatCurrency(subtotal)}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between w-full sm:w-64 text-red-500">
                  <span>Diskon</span>
                  <span>-{formatCurrency(quotation.discount)}</span>
                </div>
              )}
              {quotation.tax_rate > 0 && (
                <div className="flex justify-between w-full sm:w-64">
                  <span className="text-slate-500">PPN ({quotation.tax_rate}%)</span>
                  <span className="font-medium text-slate-700">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              {quotation.shipping_fee > 0 && (
                <div className="flex justify-between w-full sm:w-64">
                  <span className="text-slate-500">Ongkos Kirim</span>
                  <span className="font-medium text-slate-700">{formatCurrency(quotation.shipping_fee)}</span>
                </div>
              )}
              <div className="flex justify-between w-full sm:w-64 pt-2 border-t border-slate-200 mt-1">
                <span className="font-bold text-slate-700 uppercase tracking-wide">Grand Total</span>
                <span className="text-xl font-bold text-amber-600">{formatCurrency(quotation.grand_total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Catatan & Informasi Pembayaran</h2>
            <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-slate-700 font-medium">
              {quotation.notes || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
