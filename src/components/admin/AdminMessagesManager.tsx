import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  Clock,
  Phone,
  Building,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { ContactMessage } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminMessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await api.getContactMessages();
      setMessages(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load messages' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    // If status is new or unread, update to 'read'
    if (msg.status.toLowerCase() === 'new' || msg.status.toLowerCase() === 'unread') {
      try {
        await api.updateContactMessage(msg.id, 'read');
        // Update local state
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.updateContactMessage(id, newStatus);
      setFeedback({ type: 'success', message: `Message status updated to ${newStatus}` });
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      await loadMessages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update status' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this message permanently from database?')) return;
    try {
      await api.deleteContactMessage(id);
      setFeedback({ type: 'success', message: 'Message deleted successfully' });
      if (selectedMessage?.id === id) setSelectedMessage(null);
      await loadMessages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete message' });
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (statusFilter === 'all') return true;
    return m.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Enquiries & Messages Inbox</span>
          </h2>
          <p className="text-xs text-slate-400">
            Messages and inquiries submitted by visitors via the Contact page.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {['all', 'new', 'read', 'responded'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : 'bg-red-950/40 border-red-800/60 text-red-300'
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Querying messages from MySQL..." />
      ) : filteredMessages.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
          No messages found for this filter.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Sender</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      msg.status.toLowerCase() === 'new' ? 'bg-amber-500/5 font-semibold' : ''
                    }`}
                    onClick={() => openMessage(msg)}
                  >
                    <td className="py-3 px-4">
                      <strong className="text-white block">{msg.name}</strong>
                      <span className="text-[11px] text-slate-400">{msg.company || 'Private'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white truncate block max-w-xs">{msg.subject}</span>
                      <span className="text-slate-400 text-[11px] truncate block max-w-xs">
                        {msg.message}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-slate-300">{msg.email}</span>
                        <span className="text-slate-500">{msg.phone || 'No phone'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {msg.created_at ? msg.created_at.split(' ')[0] : 'Today'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          msg.status.toLowerCase() === 'new'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : msg.status.toLowerCase() === 'responded'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openMessage(msg)}
                          className="p-1 rounded text-slate-400 hover:text-amber-400"
                          title="View Message"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  Message Details
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <strong className="text-white">
                  {selectedMessage.name} {selectedMessage.company ? `(${selectedMessage.company})` : ''}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-amber-400 hover:underline">
                  {selectedMessage.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="text-white">{selectedMessage.phone || 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-2">
                Message Body:
              </span>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Status:</span>
                <select
                  value={selectedMessage.status.toLowerCase()}
                  onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs transition-all"
                >
                  Reply via Email
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
