'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${params.id}`);
      setProduct(data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/ready-to-wear">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/ready-to-wear" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative aspect-[3/4] mb-4 bg-gray-100">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-playfair font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
              {!product.inStock && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div className="space-y-4 mb-8">
              {product.category && (
                <div>
                  <span className="font-semibold">Category:</span>{' '}
                  <span className="text-gray-600 capitalize">{product.category}</span>
                </div>
              )}

              {product.fabric && (
                <div>
                  <span className="font-semibold">Fabric:</span>{' '}
                  <span className="text-gray-600">{product.fabric}</span>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <span className="font-semibold mb-2 block">Available Sizes:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 border border-gray-300 rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold mb-4">Product Features</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Premium quality fabrics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Expert craftsmanship</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Attention to detail</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Timeless design</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Link href="/contact">
                <Button size="lg" className="w-full">
                  Inquire About This Item
                </Button>
              </Link>
              <Link href="/custom-tailoring">
                <Button size="lg" variant="outline" className="w-full">
                  Request Custom Version
                </Button>
              </Link>
            </div>

            <div className="mt-8 p-4 bg-champagne/20 border border-champagne rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> For alterations or custom sizing, please contact our atelier.
                All our garments can be tailored to your exact measurements.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}