'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Mail, MailOpen, Trash2, Eye } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/messages');
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);
    setDialogOpen(true);

    if (!message.isRead) {
      try {
        await api.put(`/messages/${message._id}`, { isRead: true });
        fetchMessages();
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleToggleRead = async (message) => {
    try {
      await api.put(`/messages/${message._id}`, { isRead: !message.isRead });
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <p className="text-gray-600">
              {messages.filter(m => !m.isRead).length} unread messages
            </p>
          </div>

          {loading ? (
            <p className="text-center py-8 text-gray-600">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center py-8 text-gray-600">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`p-4 border rounded-lg ${
                    message.isRead ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {message.isRead ? (
                          <MailOpen className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Mail className="w-4 h-4 text-blue-600" />
                        )}
                        <h3 className="font-semibold truncate">{message.name}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{message.email}</p>
                      {message.phone && (
                        <p className="text-sm text-gray-600 mb-2">{message.phone}</p>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatDate(message.createdAt)}</span>
                        {message.acknowledgeEmailSent && (
                          <span className="text-green-600">✓ Acknowledgment sent</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleRead(message)}
                        title={message.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {message.isRead ? (
                          <Mail className="w-4 h-4" />
                        ) : (
                          <MailOpen className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message._id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-semibold">{selectedMessage.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{selectedMessage.email}</p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{formatDate(selectedMessage.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              {selectedMessage.acknowledgeEmailSent && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Acknowledgment email was sent to this customer
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}