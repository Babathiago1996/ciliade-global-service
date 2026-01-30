'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Calendar, User, Phone, Mail } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings');
      setBookings(data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-gray-600">
            {bookings.filter(b => b.status === 'pending').length} pending appointments
          </p>
        </div>

        {loading ? (
          <p className="text-center py-8 text-gray-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center py-8 text-gray-600">No bookings yet</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg capitalize mb-1">
                          {booking.serviceRequired?.replace('-', ' ') || 'Service'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Preferred Date: {booking.preferredDate ? formatDate(booking.preferredDate) : 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {booking.user && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>
                            {booking.user.firstName} {booking.user.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{booking.user.email}</span>
                        </div>
                        {booking.user.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{booking.user.phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Notes */}
                    {booking.notes && (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Additional Notes:</p>
                        <p className="text-sm text-gray-700">{booking.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col gap-3 lg:items-end">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <div className="w-full lg:w-48">
                      <Select
                        value={booking.status}
                        onValueChange={(value) => handleStatusChange(booking._id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <p className="text-xs text-gray-500">
                      Booked: {booking.createdAt ? formatDate(booking.createdAt) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}