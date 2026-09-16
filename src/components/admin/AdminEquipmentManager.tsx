import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Loader2,
  X,
} from 'lucide-react';
import { api } from '../../services/api';
import { Equipment } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminEquipmentManager: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: '',
    type: 'Heavy Earthmoving',
    description: '',
    status: 'available' as 'available' | 'on-site' | 'maintenance',
    image: '/uploads/excavator.jpg',
  });

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const data = await api.getEquipment();
      setEquipmentList(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load equipment' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleStatusChange = async (
    eq: Equipment,
    newStatus: 'available' | 'on-site' | 'maintenance'
  ) => {
    try {
      await api.updateEquipment(eq.id, {
        name: eq.name,
        type: eq.type,
        description: eq.description,
        status: newStatus,
        image: eq.image,
      });
      setFeedback({
        type: 'success',
        message: `Status of "${eq.name}" updated to "${newStatus}"!`,
      });
      await loadEquipment();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update status' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: res.file_path }));
      setFeedback({ type: 'success', message: 'Machine photo uploaded!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createEquipment(formData);
      setFeedback({ type: 'success', message: 'Machinery added to fleet in database!' });
      setModalOpen(false);
      setFormData({
        name: '',
        type: 'Heavy Earthmoving',
        description: '',
        status: 'available',
        image: '/uploads/excavator.jpg',
      });
      await loadEquipment();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add equipment' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this equipment entry from the database?')) return;
    try {
      await api.deleteEquipment(id);
      setFeedback({ type: 'success', message: 'Equipment deleted successfully' });
      await loadEquipment();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-400" />
            <span>Heavy Machinery & Equipment Fleet</span>
          </h2>
          <p className="text-xs text-slate-400">
            Monitor availability status, dispatch to sites, or register new machinery.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Machinery</span>
        </button>
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
        <LoadingSpinner message="Fetching equipment from MySQL database..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <img
                    src={eq.image || '/uploads/excavator.jpg'}
                    alt={eq.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{eq.name}</h3>
                  <span className="text-[11px] text-amber-400 block">{eq.type}</span>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {eq.description}
                  </p>
                </div>
              </div>

              {/* Status Selector & Delete */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Status:</span>
                  <select
                    value={eq.status}
                    onChange={(e) =>
                      handleStatusChange(
                        eq,
                        e.target.value as 'available' | 'on-site' | 'maintenance'
                      )
                    }
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    <option value="available">Available</option>
                    <option value="on-site">On-Site</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <button
                  onClick={() => handleDelete(eq.id)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete machine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Equipment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Machinery to Fleet</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Machine Name & Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Caterpillar 330D Crawler Excavator"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Equipment Class
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'available' | 'on-site' | 'maintenance',
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="available">Available</option>
                    <option value="on-site">On-Site</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Specifications & Operating Capacity
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Engine power, bucket capacity, maximum operating depth, air discharge rate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Equipment Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                  <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadingImage && (
                  <p className="text-amber-400 text-[11px] mt-1">Uploading machinery photo...</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded text-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving to Database...' : 'Register Machine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
