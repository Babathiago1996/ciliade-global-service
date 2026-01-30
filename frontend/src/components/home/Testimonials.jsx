'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Chukwuemeka Okafor',
    role: 'Business Executive',
    content: 'Ciliade transformed my wardrobe. The attention to detail and perfect fit are unmatched. Every piece I own from them is a masterpiece.',
    rating: 5,
  },
  {
    name: 'Adebayo Williams',
    role: 'Fashion Entrepreneur',
    content: 'The bespoke service at Ciliade is exceptional. From consultation to delivery, the entire experience was seamless and professional.',
    rating: 5,
  },
  {
    name: 'Ibrahim Mohammed',
    role: 'Corporate Lawyer',
    content: 'I have been a client for three years. The quality, craftsmanship, and customer service continue to exceed my expectations.',
    rating: 5,
  },
];

export default function Testimonials() {
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
            Client Testimonials
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our distinguished clientele about their experience with Ciliade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 shadow-lg"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}