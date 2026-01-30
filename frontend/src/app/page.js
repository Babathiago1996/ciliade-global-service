import Hero from '@/components/home/Hero';
import BespokeOverview from '@/components/home/BespokeOverview';
import TailoringProcess from '@/components/home/TailoringProcess';
import FeaturedCollections from '@/components/home/FeaturedCollections';
import FabricShowcase from '@/components/home/FabricShowcase';
import Testimonials from '@/components/home/Testimonials';
import LookbookPreview from '@/components/home/LookbookPreview';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <BespokeOverview />
      <TailoringProcess />
      <FeaturedCollections />
      <FabricShowcase />
      <Testimonials />
      <LookbookPreview />
      <CTASection />
    </>
  );
}