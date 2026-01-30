'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/context/AuthContext';
import api from '@/lib/api';
import { 
  Users, 
  Package, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminMessages from '@/components/admin/AdminMessages';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminCustomers from '@/components/admin/AdminCustomers';

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    } else if (!authLoading && isAuthenticated && !isAdmin) {
      router.push('/dashboard');
    } else if (isAuthenticated && isAdmin) {
      fetchStats();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stats');
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-bold mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your tailoring business</p>
          </div>

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalCustomers}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalProducts}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalMessages}
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.overview.unreadMessages} unread
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bookings
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.overview.totalBookings}
                  </div>
                  <p className="text-xs text-gray-600">
                    {stats.overview.pendingBookings} pending
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Management Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest appointment requests</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentActivity?.bookings?.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentActivity.bookings.map((booking) => (
                          <div
                            key={booking._id}
                            className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-0"
                          >
                            <div>
                              <p className="font-medium">
                                {booking.user?.firstName} {booking.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-600 capitalize">
                                {booking.serviceRequired.replace('-', ' ')}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(booking.preferredDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                booking.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent bookings</p>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest customer inquiries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats?.recentActivity?.messages?.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentActivity.messages.map((message) => (
                          <div
                            key={message._id}
                            className="border-b border-gray-100 pb-3 last:border-0"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-medium">{message.name}</p>
                              {!message.isRead && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {message.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent messages</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <AdminProducts />
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <AdminBookings />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <AdminMessages />
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers">
              <AdminCustomers />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}