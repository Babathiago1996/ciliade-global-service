'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1598808503746-f34c53b9323e?q=80&w=2070)',
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">
            Ready to Experience Bespoke Excellence?
          </h2>
          <p className="text-xl text-gray-200 mb-12">
            Schedule your consultation today and discover the art of custom tailoring.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/custom-tailoring">
              <Button size="xl" className="min-w-[200px]">
                Book Appointment
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="min-w-[200px] bg-white/10 text-white border-white hover:bg-white hover:text-black">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}