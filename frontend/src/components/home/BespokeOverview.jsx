'use client';

import { Scissors, Ruler, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    icon: Scissors,
    title: 'Master Craftsmanship',
    description: 'Every garment is meticulously crafted by our experienced tailors with decades of expertise.',
  },
  {
    icon: Ruler,
    title: 'Perfect Fit Guaranteed',
    description: 'Over 30 precise measurements ensure your garment fits like it was made for you—because it was.',
  },
  {
    icon: Sparkles,
    title: 'Premium Fabrics',
    description: 'Sourced from the finest mills worldwide, our fabrics represent the pinnacle of textile excellence.',
  },
  {
    icon: Award,
    title: 'Timeless Elegance',
    description: 'Classic designs meet contemporary style, creating pieces that transcend seasonal trends.',
  },
];

export default function BespokeOverview() {
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
            The Art of Bespoke Tailoring
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Ciliade, we believe every gentleman deserves clothing that reflects his unique style
            and personality. Our bespoke service delivers unparalleled quality and fit.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-black text-white">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}