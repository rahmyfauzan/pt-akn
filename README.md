# PT AKN — Web & Admin Portal

**One-Stop Procurement Solution** | General Supplier Terpercaya

---

## 🚀 Fitur

### Landing Page (Publik)
- Hero Section dengan CTA WhatsApp
- Profil Perusahaan (About Us)
- Kategori Layanan (Office Supply, MEP, Alat Teknik, dll)
- Katalog Produk B2C
- Footer dengan informasi kontak

### Admin Panel (/admin)
- Multi-admin authentication (login/logout)
- Dashboard dengan statistik quotation
- CRUD Quotation (Create, Read, Update Status, Delete)
- Input barang secara free-text (konsep Palugada)
- Tracking status (Draft → Sent → Accepted/Rejected)
- Generate & Download PDF Quotation (dengan kop surat PT AKN)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jose) + bcrypt |
| PDF | jsPDF + jspdf-autotable |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📦 Cara Setup (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat project baru di [https://supabase.com](https://supabase.com)
2. Buka **SQL Editor** di dashboard Supabase
3. Copy-paste isi file `supabase-schema.sql` dan jalankan
4. Buka **Settings → API** untuk mendapatkan:
   - Project URL
   - anon/public key
   - service_role key

### 3. Konfigurasi Environment
Edit file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...
JWT_SECRET=ganti-dengan-string-random-yang-panjang
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) untuk Landing Page.

### 5. Login Admin
- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Email: `admin@ptakn.co.id`
- Password: `admin123`

> ⚠️ **PENTING:** Ganti password default setelah pertama kali login!

---

## 📁 Struktur Folder

```
src/
├── app/
│   ├── page.tsx                    # Landing Page
│   ├── layout.tsx                  # Root Layout
│   ├── globals.css                 # Global Styles
│   ├── admin/
│   │   ├── layout.tsx              # Admin Layout (auth check)
│   │   ├── login/page.tsx          # Login Page
│   │   ├── dashboard/page.tsx      # Dashboard
│   │   └── quotations/
│   │       ├── page.tsx            # Quotation List
│   │       ├── create/page.tsx     # Create Quotation
│   │       └── [id]/page.tsx       # Quotation Detail + PDF
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       └── quotations/
│           ├── route.ts            # GET all, POST new
│           └── [id]/route.ts       # GET one, PATCH, DELETE
├── components/
│   ├── landing/                    # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Catalog.tsx
│   │   └── Footer.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       └── StatusBadge.tsx
├── lib/
│   ├── supabase.ts                 # Supabase client
│   ├── auth.ts                     # JWT auth helpers
│   └── utils.ts                    # Utility functions
└── types/
    └── index.ts                    # TypeScript interfaces
```

---

## 🚀 Deployment ke Vercel

1. Push project ke GitHub
2. Buka [https://vercel.com](https://vercel.com)
3. Import repository
4. Tambahkan Environment Variables (sama seperti `.env.local`)
5. Deploy!
