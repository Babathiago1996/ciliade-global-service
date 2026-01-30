'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { User, Mail, Phone, Calendar, Eye, Ruler } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerMeasurement, setCustomerMeasurement] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    fetchMeasurements();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/stats/customers');
      setCustomers(data.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeasurements = async () => {
    try {
      const { data } = await api.get('/measurements/all');
      setMeasurements(data.data);
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    const measurement = measurements.find(m => m.user._id === customer._id);
    setCustomerMeasurement(measurement || null);
    setDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Customer Management</h2>
            <p className="text-gray-600">{customers.length} total customers</p>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-600">Loading customers...</p>
          ) : customers.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No customers yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Measurements
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((customer) => {
                    const hasMeasurements = measurements.some(m => m.user._id === customer._id);
                    
                    return (
                      <tr key={customer._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.firstName} {customer.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {hasMeasurements ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Saved
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              None
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{selectedCustomer.email}</p>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{selectedCustomer.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p>{formatDate(selectedCustomer.createdAt)}</p>
                </div>
              </div>

              {/* Measurements */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Ruler className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Measurements</h3>
                </div>
                
                {customerMeasurement ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Height</p>
                      <p className="font-semibold">{customerMeasurement.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Weight</p>
                      <p className="font-semibold">{customerMeasurement.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Chest</p>
                      <p className="font-semibold">{customerMeasurement.chest} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Waist</p>
                      <p className="font-semibold">{customerMeasurement.waist} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hips</p>
                      <p className="font-semibold">{customerMeasurement.hips} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Shoulder</p>
                      <p className="font-semibold">{customerMeasurement.shoulderWidth} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sleeve</p>
                      <p className="font-semibold">{customerMeasurement.sleeveLength} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Inseam</p>
                      <p className="font-semibold">{customerMeasurement.inseam} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Neck</p>
                      <p className="font-semibold">{customerMeasurement.neckCircumference} cm</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No measurements saved yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}