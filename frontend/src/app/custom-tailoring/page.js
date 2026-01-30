'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { Calendar, MessageSquare, Ruler, Package } from 'lucide-react';

const processSteps = [
  {
    icon: MessageSquare,
    title: 'Consultation',
    description: 'Discuss your style preferences, occasion requirements, and design vision with our expert tailors.',
  },
  {
    icon: Ruler,
    title: 'Measurement',
    description: 'Over 30 precise measurements ensure your garment fits perfectly to your unique body shape.',
  },
  {
    icon: Calendar,
    title: 'Fittings',
    description: 'Multiple fitting sessions allow us to refine every detail to absolute perfection.',
  },
  {
    icon: Package,
    title: 'Delivery',
    description: 'Your bespoke masterpiece is delivered in premium packaging, ready to impress.',
  },
];

export default function CustomTailoringPage() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    serviceRequired: '',
    preferredDate: '',
    notes: '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      router.push('/login?redirect=/custom-tailoring');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/bookings', formData);
      setSuccess(true);
      setFormData({
        serviceRequired: '',
        preferredDate: '',
        notes: '',
      });
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6">
              Bespoke Service
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Immerse yourself in the world of bespoke. Where every detail is curated to your taste,
              and every measurement is taken with precision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={ref} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
              The Process
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From your first consultation to the final delivery, every step is meticulously executed
              to create a garment that's truly yours.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-black text-white">
                  <step.icon className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lookbook Inspiration */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-playfair font-bold mb-6">
                Find Your Inspiration
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Browse our lookbook for inspiration and ideas. From traditional attire to contemporary
                corporate wear, discover the possibilities of bespoke tailoring.
              </p>
              <Link href="/lookbook">
                <Button size="lg">View Lookbook</Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="aspect-[3/4] bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=2087)' }} />
              <div className="aspect-[3/4] bg-cover bg-center mt-8" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583518257225-f9a8081f6a84?q=80&w=2070)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair font-bold mb-6">
              Book Your Appointment
            </h2>
            <p className="text-lg text-gray-600">
              Ready to begin your bespoke journey? Schedule a consultation with our expert tailors.
            </p>
          </motion.div>

          {!isAuthenticated && (
            <div className="bg-champagne/20 border border-champagne p-6 rounded-lg mb-8">
              <p className="text-center">
                Please{' '}
                <Link href="/login?redirect=/custom-tailoring" className="font-semibold underline">
                  login
                </Link>{' '}
                or{' '}
                <Link href="/register?redirect=/custom-tailoring" className="font-semibold underline">
                  register
                </Link>{' '}
                to book an appointment.
              </p>
            </div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                Appointment booked successfully! We will contact you shortly to confirm.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="serviceRequired">Service Required *</Label>
              <Select
                value={formData.serviceRequired}
                onValueChange={(value) => handleChange('serviceRequired', value)}
                required
                disabled={!isAuthenticated}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Initial Consultation</SelectItem>
                  <SelectItem value="measurement">Measurement Session</SelectItem>
                  <SelectItem value="fitting">Fitting Appointment</SelectItem>
                  <SelectItem value="custom-tailoring">Full Custom Tailoring</SelectItem>
                  <SelectItem value="alteration">Alterations</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date *</Label>
              <Input
                type="date"
                id="preferredDate"
                value={formData.preferredDate}
                onChange={(e) => handleChange('preferredDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                disabled={!isAuthenticated}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Tell us about your style preferences, occasion, or any specific requirements..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={5}
                disabled={!isAuthenticated}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !isAuthenticated}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </motion.form>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Need Assistance?</h3>
            <p className="text-gray-600 mb-4">
              For the most accurate fit, we recommend a professional measurement session at our atelier.
              Our experts are available to guide you through the entire process.
            </p>
            <Link href="/contact">
              <Button variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}