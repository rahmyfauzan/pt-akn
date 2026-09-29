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
  notes: string;
}
