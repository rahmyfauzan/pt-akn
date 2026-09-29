import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PT AKN - One-Stop Procurement Solution | General Supplier Terpercaya",
  description:
    "PT AKN adalah perusahaan general supplier terpercaya yang menyediakan Office Supply, Alat Teknik, MEP, dan berbagai kebutuhan bisnis Anda. Solusi pengadaan satu pintu.",
  keywords: ["general supplier", "office supply", "ATK", "MEP", "alat teknik", "PT AKN", "procurement"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
