'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';

const categories = [
  {
    name: 'Traditional',
    image: 'https://images.unsplash.com/photo-1583518257225-f9a8081f6a84?q=80&w=2070',
  },
  {
    name: 'Corporate',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080',
  },
  {
    name: 'Occasion',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=2087',
  },
];

export default function LookbookPreview() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Explore Our Lookbook
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse through our gallery of completed works and find inspiration for your next bespoke piece.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-playfair font-bold text-white">{category.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/lookbook">
            <Button size="lg">View Full Lookbook</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}