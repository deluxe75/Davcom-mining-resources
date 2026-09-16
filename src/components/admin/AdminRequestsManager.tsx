import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  Edit,
  Trash2,
  X,
  Send,
  User,
} from 'lucide-react';
import { api } from '../../services/api';
import { ServiceRequest } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminRequestsManager: React.FC = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // Edit fields for the selected request
  const [updateStatus, setUpdateStatus] = useState<string>('pending');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [savingUpdate, setSavingUpdate] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getServiceRequests();
      setRequests(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load service requests' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const openDetail = (req: ServiceRequest) => {
    setSelectedRequest(req);
    setUpdateStatus(req.status);
    setAdminNotes(req.admin_notes || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setSavingUpdate(true);
    try {
      await api.updateServiceRequest(selectedRequest.id, {
        status: updateStatus,
        admin_notes: adminNotes,
      });
      setFeedback({
        type: 'success',
        message: `Service request #${selectedRequest.id} updated successfully!`,
      });
      setSelectedRequest(null);
      await loadRequests();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update request' });
    } finally {
      setSavingUpdate(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete request #${id} permanently from database?`)) return;
    try {
      await api.deleteServiceRequest(id);
      setFeedback({ type: 'success', message: 'Request deleted successfully' });
      if (selectedRequest?.id === id) setSelectedRequest(null);
      await loadRequests();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Service & Quotation Requests</span>
          </h2>
          <p className="text-xs text-slate-400">
            Client tenders, RFPs, and machinery mobilization inquiries submitted online.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {['all', 'pending', 'in_review', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
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
        <LoadingSpinner message="Querying requests from MySQL..." />
      ) : filteredRequests.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
          No service requests found for this filter.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Client / Company</th>
                  <th className="py-3 px-4">Service Required</th>
                  <th className="py-3 px-4">Site Location</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      DMR-{req.id}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{req.name}</strong>
                      <span className="text-[11px] text-slate-400">{req.company || 'Private Client'}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">{req.service}</td>
                    <td className="py-3 px-4">{req.location || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col text-[11px]">
                        <span className="text-white">{req.phone}</span>
                        <span className="text-slate-400">{req.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          req.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : req.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : req.status === 'in_review'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {req.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetail(req)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors font-semibold text-[11px]"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Review / Status Update Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase font-bold">
                  Reference: DMR-{selectedRequest.id}
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Service Request Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Request Summary Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block font-medium uppercase text-[10px]">Client / Representative:</span>
                <p className="text-white font-bold mt-0.5">{selectedRequest.name}</p>
                <p className="text-slate-400">{selectedRequest.company || 'No Company Listed'}</p>
              </div>

              <div>
                <span className="text-slate-500 block font-medium uppercase text-[10px]">Direct Contact:</span>
                <p className="text-white font-bold mt-0.5">{selectedRequest.phone}</p>
                <p className="text-slate-400">{selectedRequest.email}</p>
              </div>

              <div>
                <span className="text-slate-500 block font-medium uppercase text-[10px]">Discipline Required:</span>
                <p className="text-amber-400 font-bold mt-0.5">{selectedRequest.service}</p>
              </div>

              <div>
                <span className="text-slate-500 block font-medium uppercase text-[10px]">Project Site Location:</span>
                <p className="text-white font-medium mt-0.5">{selectedRequest.location || 'Unspecified'}</p>
              </div>
            </div>

            {/* Scope description */}
            <div className="space-y-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[11px]">
                Detailed Project Description & Parameters:
              </span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 leading-relaxed whitespace-pre-line">
                {selectedRequest.description}
              </div>
            </div>

            {selectedRequest.message && (
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[11px]">
                  Additional Client Notes:
                </span>
                <p className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-300">
                  {selectedRequest.message}
                </p>
              </div>
            )}

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-4 border-t border-slate-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5">
                    Update Request Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="approved">Approved / Scheduled</option>
                    <option value="rejected">Rejected / Unviable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1.5">
                    Preferred Client Method
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedRequest.preferred_contact_method || 'phone'}
                    className="w-full bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-2 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1.5">
                  Internal Engineering & Admin Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record mobilization estimates, team assignment, site inspection dates, or follow-up communications..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequest(null)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs transition-all disabled:opacity-50"
                >
                  {savingUpdate ? 'Updating in MySQL...' : 'Save Status & Notes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
