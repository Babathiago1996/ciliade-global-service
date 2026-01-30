"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Award, Users, Scissors, Heart } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    description:
      "We pursue perfection in every stitch, every measurement, and every detail.",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Your satisfaction and confidence in our garments drive everything we do.",
  },
  {
    icon: Scissors,
    title: "Craftsmanship",
    description:
      "Traditional techniques meet modern innovation in every piece we create.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We love what we do, and it shows in the quality of our work.",
  },
];

export default function AboutPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084)",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6"
          >
            About Ciliade
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200"
          >
            Where tradition meets innovation in the art of bespoke tailoring
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-playfair font-bold mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded with a passion for exceptional craftsmanship, Ciliade
                  Tailoring Company has become synonymous with luxury bespoke
                  tailoring. Our journey began with a simple belief: every
                  individual deserves clothing that reflects their unique
                  personality and style.
                </p>
                <p>
                  Over the years, we have refined our craft, combining
                  traditional tailoring techniques passed down through
                  generations with modern innovations and premium fabrics from
                  the world's finest mills.
                </p>
                <p>
                  Today, Ciliade stands as a testament to the enduring appeal of
                  bespoke tailoring, serving distinguished clients who
                  appreciate quality, attention to detail, and timeless
                  elegance.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] bg-gray-100"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=2087)",
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section ref={ref} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do at Ciliade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-black text-white">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Craftsmanship Philosophy */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative aspect-[4/5] bg-gray-100"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('/manager.jpeg')",
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-playfair font-bold mb-6">
                Craftsmanship Philosophy
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  At Ciliade, we believe that true luxury lies in the details.
                  Every garment we create is a work of art, meticulously crafted
                  by master tailors who have honed their skills over decades.
                </p>
                <p>
                  We source only the finest fabrics from renowned mills in
                  Italy, the United Kingdom, and beyond. Each textile is
                  carefully selected for its quality, texture, and durability.
                </p>
                <p>
                  Our bespoke process ensures that every measurement is precise,
                  every stitch is perfect, and every detail reflects your
                  personal style and preferences.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Atelier Vision */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-playfair font-bold mb-6">
              Our Atelier Vision
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              We envision a world where every individual experiences the
              confidence and elegance that comes from wearing clothing made
              exclusively for them. Our atelier is more than a workspace—it's a
              creative sanctuary where artistry, precision, and passion come
              together to create timeless pieces that transcend trends.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
