'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const steps = [
  {
    number: '01',
    title: 'Consultation',
    description: 'Meet with our expert tailors to discuss your style preferences, occasion, and design vision.',
  },
  {
    number: '02',
    title: 'Measurement',
    description: 'Over 30 precise measurements are taken to ensure a perfect fit for your unique body shape.',
  },
  {
    number: '03',
    title: 'Fittings',
    description: 'Multiple fitting sessions ensure every detail is refined to perfection before final delivery.',
  },
  {
    number: '04',
    title: 'Delivery',
    description: 'Your bespoke garment is delivered in premium packaging, ready to make a lasting impression.',
  },
];

export default function TailoringProcess() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Our Tailoring Process
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From initial consultation to final delivery, every step is executed with precision and care.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              <div className="text-6xl font-playfair font-bold text-champagne mb-4">
                {step.number}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-0.5 bg-champagne" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}