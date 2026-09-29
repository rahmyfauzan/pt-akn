export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface QuotationItem {
  id: string;
  item_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  image_url?: string;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  client_name: string;
  client_company: string;
  client_address: string;
  client_phone: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  items: QuotationItem[];
  discount: number;
  tax_rate: number;
  shipping_fee: number;
  valid_days: number;
  grand_total: number;
  notes: string;
  created_at: string;
  created_by: string;
  created_by_name?: string;
}

export interface QuotationFormData {
  client_name: string;
  client_company: string;
  client_address: string;
  client_phone: string;
  items: Omit<QuotationItem, 'id' | 'subtotal'>[];
  discount: number;
  tax_rate: number;
  shipping_fee: number;
  valid_days: number;
  notes: string;
}

export interface Settings {
  id?: number;
  company_name: string;
  company_tagline: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  bank_account: string;
  pdf_notes: string;
  hero_title: string;
  hero_subtitle: string;
  featured_products: {
    id: string;
    name: string;
    category: string;
    image_url: string;
  }[];
}
