'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071)',
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 leading-tight">
            Custom Tailoring.
            <br />
            <span className="text-champagne">Crafted for You.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Experience the art of bespoke tailoring with premium fabrics and
            impeccable craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/measurements">
              <Button size="xl" className="min-w-[200px]">
                Book Measurement
              </Button>
            </Link>
            <Link href="/ready-to-wear">
              <Button size="xl" variant="outline" className="min-w-[200px] bg-white/10 text-white border-white hover:bg-white hover:text-black">
                Shop Ready-to-Wear
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}