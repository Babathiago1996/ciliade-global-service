'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fabrics = [
  {
    name: 'Italian Wool',
    description: 'Luxurious Super 150s wool from renowned Italian mills, offering exceptional drape and comfort.',
  },
  {
    name: 'Egyptian Cotton',
    description: 'Premium long-staple cotton known for its softness, durability, and breathability.',
  },
  {
    name: 'British Tweed',
    description: 'Traditional woven fabric with timeless patterns, perfect for sophisticated style.',
  },
  {
    name: 'Silk Blends',
    description: 'Elegant silk-blend fabrics that add a refined sheen and superior comfort.',
  },
];

export default function FabricShowcase() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Premium Fabrics
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We source our fabrics from the world's finest mills, ensuring every garment
            embodies quality, comfort, and timeless elegance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {fabrics.map((fabric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="p-6 border border-gray-700 hover:border-champagne transition-colors"
            >
              <h3 className="text-xl font-semibold mb-3 text-champagne">{fabric.name}</h3>
              <p className="text-gray-300">{fabric.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}