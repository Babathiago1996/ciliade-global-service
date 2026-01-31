'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { User, Ruler, Calendar, MessageSquare } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [measurement, setMeasurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [mounted, setMounted] = useState(false);

  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
  });
useEffect(() => {
  setMounted(true);
}, []);
if (!mounted) {
  return null; // or a spinner
}


  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    } else if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        fetchDashboardData();
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        });
      }
    }
  }, [isAuthenticated, authLoading, user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, measurementRes] = await Promise.all([
        api.get('/bookings/my-bookings'),
        api.get('/measurements').catch(() => ({ data: { data: null } })),
      ]);
      
      setBookings(bookingsRes.data.data);
      setMeasurement(measurementRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put('/auth/profile', profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-bold mb-2">
              Welcome, {user.firstName}
            </h1>
            <p className="text-gray-600">Manage your account and track your orders</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="measurements" className="gap-2">
                <Ruler className="w-4 h-4" />
                Measurements
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="w-4 h-4" />
                Bookings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleProfileChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        type="email"
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-sm text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <Button type="submit" disabled={updating}>
                      {updating ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Measurements Tab */}
            <TabsContent value="measurements">
              <Card>
                <CardHeader>
                  <CardTitle>Your Measurements</CardTitle>
                  <CardDescription>
                    View and update your saved measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {measurement ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Height</p>
                          <p className="font-semibold">{measurement.height} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Weight</p>
                          <p className="font-semibold">{measurement.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Chest</p>
                          <p className="font-semibold">{measurement.chest} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Waist</p>
                          <p className="font-semibold">{measurement.waist} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Hips</p>
                          <p className="font-semibold">{measurement.hips} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Shoulder Width</p>
                          <p className="font-semibold">{measurement.shoulderWidth} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sleeve Length</p>
                          <p className="font-semibold">{measurement.sleeveLength} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Inseam</p>
                          <p className="font-semibold">{measurement.inseam} cm</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Neck</p>
                          <p className="font-semibold">{measurement.neckCircumference} cm</p>
                        </div>
                      </div>
                      
                      <Button onClick={() => router.push('/measurements')}>
                        Update Measurements
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Ruler className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">No measurements saved yet</p>
                      <Button onClick={() => router.push('/measurements')}>
                        Add Measurements
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Your Bookings</CardTitle>
                  <CardDescription>
                    View your appointment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold capitalize">
                                {booking.serviceRequired.replace('-', ' ')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.preferredDate)}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : booking.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : booking.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-4">No bookings yet</p>
                      <Button onClick={() => router.push('/custom-tailoring')}>
                        Book Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}