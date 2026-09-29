'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { Quotation } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<Quotation['status']>('DRAFT');

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await fetch(`/api/quotations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setQuotation(data.quotation);
          setStatus(data.quotation.status);
        }
      } catch (error) {
        console.error('Failed to fetch', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
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

  const generatePDF = () => {
    if (!quotation) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PT AKN', 14, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('One-Stop Procurement Solution', 14, 28);
    
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
    
    doc.text('Kepada Yth:', 140, 60);
    doc.setFont('helvetica', 'bold');
    doc.text(quotation.client_name, 140, 66);
    doc.setFont('helvetica', 'normal');
    if (quotation.client_company) doc.text(quotation.client_company, 140, 72);
    if (quotation.client_address) {
      const splitAddress = doc.splitTextToSize(quotation.client_address, 60);
      doc.text(splitAddress, 140, 78);
    }
    
    // Table
    const tableData = quotation.items.map((item, index) => [
      index + 1,
      item.item_name,
      item.quantity,
      item.unit,
      formatCurrency(item.unit_price),
      formatCurrency(item.subtotal)
    ]);
    
    autoTable(doc, {
      startY: 95,
      head: [['No', 'Nama Barang', 'Qty', 'Satuan', 'Harga Satuan', 'Subtotal']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }, // Slate 900
      styles: { fontSize: 9 },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'right', fontStyle: 'bold' }
      }
    });
    
    // @ts-ignore
    const finalY = (doc as any).lastAutoTable?.finalY || 100;
    
    // Grand Total
    doc.setFont('helvetica', 'bold');
    doc.text('Grand Total:', 140, finalY + 10);
    doc.text(formatCurrency(quotation.grand_total), 196, finalY + 10, { align: 'right' });
    
    // Notes
    doc.setFont('helvetica', 'bold');
    doc.text('Catatan & Syarat:', 14, finalY + 25);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(quotation.notes || '-', 180);
    doc.text(splitNotes, 14, finalY + 31);
    
    // Footer
    const footerY = finalY + Math.max(40, splitNotes.length * 5 + 10);
    doc.text('Hormat kami,', 14, footerY);
    doc.setFont('helvetica', 'bold');
    doc.text('PT AKN', 14, footerY + 20);
    
    doc.save(`${quotation.quotation_number}.pdf`);
  };

  if (loading) return <div>Memuat detail...</div>;
  if (!quotation) return <div>Quotation tidak ditemukan.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
          className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors font-medium text-sm"
        >
          <Download size={18} />
          <span>Download PDF</span>
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
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mt-6">Dibuat Oleh</p>
              <p className="text-slate-800">{quotation.created_by_name}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Detail Barang</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">No</th>
                    <th className="px-6 py-3 font-medium">Nama Barang</th>
                    <th className="px-6 py-3 font-medium text-center">Qty</th>
                    <th className="px-6 py-3 font-medium text-center">Satuan</th>
                    <th className="px-6 py-3 font-medium text-right">Harga Satuan</th>
                    <th className="px-6 py-3 font-medium text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotation.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-500">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.item_name}</td>
                      <td className="px-6 py-4 text-center text-slate-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-center text-slate-700">{item.unit}</td>
                      <td className="px-6 py-4 text-right text-slate-700">{formatCurrency(item.unit_price)}</td>
                      <td className="px-6 py-4 text-right font-medium text-slate-800">{formatCurrency(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 p-6 flex justify-between items-center border-t border-slate-200">
              <span className="font-semibold text-slate-700 uppercase tracking-wide">Grand Total</span>
              <span className="text-2xl font-bold text-slate-900">{formatCurrency(quotation.grand_total)}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Catatan & Syarat</h2>
            <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-slate-700 font-medium">
              {quotation.notes || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
