'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { Ruler, Save, CheckCircle } from 'lucide-react';

const measurementFields = [
  { name: 'height', label: 'Height (cm)', min: 100, max: 250, help: 'Stand straight against a wall' },
  { name: 'weight', label: 'Weight (kg)', min: 30, max: 300, help: 'Your current weight' },
  { name: 'chest', label: 'Chest (cm)', min: 60, max: 200, help: 'Around the fullest part of your chest' },
  { name: 'waist', label: 'Waist (cm)', min: 50, max: 200, help: 'Around your natural waistline' },
  { name: 'hips', label: 'Hips (cm)', min: 60, max: 200, help: 'Around the fullest part of your hips' },
  { name: 'shoulderWidth', label: 'Shoulder Width (cm)', min: 30, max: 100, help: 'From shoulder point to shoulder point' },
  { name: 'sleeveLength', label: 'Sleeve Length (cm)', min: 50, max: 100, help: 'From shoulder to wrist' },
  { name: 'inseam', label: 'Inseam (cm)', min: 60, max: 120, help: 'Inside leg from crotch to ankle' },
  { name: 'neckCircumference', label: 'Neck Circumference (cm)', min: 30, max: 60, help: 'Around the base of your neck' },
];

export default function MeasurementsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    shoulderWidth: '',
    sleeveLength: '',
    inseam: '',
    neckCircumference: '',
    notes: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/measurements');
    } else if (isAuthenticated) {
      fetchMeasurements();
    }
  }, [isAuthenticated, authLoading, router]);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/measurements');
      if (data.data) {
        setFormData({
          height: data.data.height || '',
          weight: data.data.weight || '',
          chest: data.data.chest || '',
          waist: data.data.waist || '',
          hips: data.data.hips || '',
          shoulderWidth: data.data.shoulderWidth || '',
          sleeveLength: data.data.sleeveLength || '',
          inseam: data.data.inseam || '',
          neckCircumference: data.data.neckCircumference || '',
          notes: data.data.notes || '',
        });
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/measurements', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save measurements');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-black text-white">
              <Ruler className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
              Your Measurements
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Save your measurements for a perfect fit every time. All measurements should be taken
              while wearing light clothing.
            </p>
          </div>

          {/* Measurement Guide */}
          <div className="bg-champagne/20 border border-champagne p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold mb-3">Measurement Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Use a flexible measuring tape</li>
              <li>• Stand in a relaxed, natural position</li>
              <li>• Don't pull the tape too tight or too loose</li>
              <li>• For best results, have someone assist you</li>
            </ul>
          </div>

          {/* Measurement Form */}
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Measurements saved successfully!</span>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {measurementFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label} *
                  </Label>
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    min={field.min}
                    max={field.max}
                    step="0.1"
                    required
                    placeholder={field.label}
                  />
                  <p className="text-sm text-gray-500">{field.help}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information about your fit preferences..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={saving}
            >
              <Save className="w-5 h-5 mr-2" />
              {saving ? 'Saving...' : 'Save Measurements'}
            </Button>
          </form>

          {/* Professional Assistance */}
          <div className="mt-8 bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="text-2xl font-playfair font-bold mb-4">
              Need Professional Assistance?
            </h3>
            <p className="text-gray-300 mb-6">
              For the most accurate fit, we recommend a professional measurement session at our atelier.
              Our expert tailors will ensure every measurement is precise.
            </p>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border-white hover:bg-white hover:text-black"
              onClick={() => router.push('/custom-tailoring')}
            >
              Book Measurement Session
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}