'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'occasion', label: 'Occasion' },
  { value: 'bridal', label: 'Bridal' },
];

export default function LookbookPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLookbookProducts();
  }, [selectedCategory]);

  const fetchLookbookProducts = async () => {
    setLoading(true);
    try {
      const params = {
        collection: 'lookbook',
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const { data } = await api.get('/products', { params });
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching lookbook:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=2087)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4"
          >
            Lookbook
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200"
          >
            Discover our completed works and find your inspiration
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-200 bg-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading lookbook...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No items in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {product.name}
                        </h3>
                        {product.category && (
                          <p className="text-gray-200 capitalize">{product.category}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Inspired by What You See?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let us create something unique for you. Book a consultation with our expert tailors.
          </p>
          <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white hover:text-black">
            Book Consultation
          </Button>
        </div>
      </section>
    </div>
  );
}