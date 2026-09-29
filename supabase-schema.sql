-- ================================================
-- SQL Schema untuk Supabase: PT AKN
-- Jalankan script ini di Supabase SQL Editor
-- ================================================

-- 1. Tabel Users (Admin)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Quotations (Header Penawaran)
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_company VARCHAR(255) DEFAULT '',
  client_address TEXT DEFAULT '',
  client_phone VARCHAR(50) DEFAULT '',
  status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED')),
  grand_total DECIMAL(15, 2) DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Tabel Quotation Items (Detail Barang)
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES quotations(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit VARCHAR(50) DEFAULT 'pcs',
  unit_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_quotations_created_by ON quotations(created_by);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created_at ON quotations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Allow service role full access
CREATE POLICY "Service role full access on users"
  ON users FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on quotations"
  ON quotations FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on quotation_items"
  ON quotation_items FOR ALL
  USING (true)
  WITH CHECK (true);

-- ================================================
-- SEED DATA: Admin User Default
-- Password: admin123 (hashed with bcrypt)
-- GANTI PASSWORD INI SETELAH PERTAMA KALI LOGIN!
-- ================================================
INSERT INTO users (email, password_hash, name)
VALUES (
  'admin@ptakn.co.id',
  '$2b$10$tBnVXp57gq/k8XZfy4xcue49jHtNDX4E73fZVXetylW7qK/M5Okuy', -- password: admin123
  'Admin AKN'
) ON CONFLICT (email) DO NOTHING;
