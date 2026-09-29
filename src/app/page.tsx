import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Catalog from "@/components/landing/Catalog";
import Footer from "@/components/landing/Footer";
import { getSettings } from "@/lib/settings";

export default async function Home() {
  const settings = await getSettings();

  return (
    <main>
      <Navbar settings={settings} />
      <Hero />
      <About />
      <Services />
      <Catalog />
      <Footer />
    </main>
  );
}
