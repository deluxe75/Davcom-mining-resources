import React, { useState, useEffect } from 'react';
import {
  Images,
  Plus,
  Trash2,
  Upload,
  Loader2,
  X,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api';
import { GalleryItem } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminGalleryManager: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: '',
    category: 'quarry',
    caption: '',
    image_path: '/uploads/gal_quarry_1.jpg',
  });

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getGallery();
      setItems(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load gallery' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_path: res.file_path }));
      setFeedback({ type: 'success', message: 'Image uploaded to server successfully!' });
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
      await api.createGalleryItem(formData);
      setFeedback({ type: 'success', message: 'Photo registered in gallery database!' });
      setModalOpen(false);
      setFormData({
        title: '',
        category: 'quarry',
        caption: '',
        image_path: '/uploads/gal_quarry_1.jpg',
      });
      await loadGallery();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to add photo' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this photo from the gallery?')) return;
    try {
      await api.deleteGalleryItem(id);
      setFeedback({ type: 'success', message: 'Photo deleted successfully' });
      await loadGallery();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete photo' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Images className="w-5 h-5 text-amber-400" />
            <span>Field Operations Gallery Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload and organize site documentation and machinery photos.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Photo</span>
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
        <LoadingSpinner message="Fetching gallery from database..." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group shadow-md"
            >
              <div className="h-36 w-full bg-slate-950 relative overflow-hidden">
                <img
                  src={item.image_path}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <span className="absolute top-2 left-2 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-amber-400 border border-slate-800">
                  {item.category}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  {item.caption && (
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {item.caption}
                    </p>
                  )}
                </div>
                <div className="pt-2 mt-2 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-slate-500 hover:text-red-400 text-xs p-1"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Upload New Operational Photo</h3>
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
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Bench Blast at Mpape Quarry"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="quarry">Quarrying</option>
                  <option value="drilling">Drilling & Blasting</option>
                  <option value="borehole">Borehole & Water</option>
                  <option value="earthworks">Earthworks & Heavy Plant</option>
                  <option value="geotechnical">Geotechnical & Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData((prev) => ({ ...prev, caption: e.target.value }))}
                  placeholder="e.g. Drilling 89mm blast-holes with high-pressure compressor."
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Image File / Path
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.image_path}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, image_path: e.target.value }))
                    }
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
                  <p className="text-amber-400 text-[11px] mt-1">Uploading image...</p>
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
                  {submitting ? 'Adding...' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
