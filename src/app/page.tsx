import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TechnologiesSection } from '@/components/sections/TechnologiesSection';
import { IndustriesSection } from '@/components/sections/IndustriesSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { WhyUsSection } from '@/components/sections/WhyUsSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TechnologiesSection />
        <IndustriesSection />
        <ProcessSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
