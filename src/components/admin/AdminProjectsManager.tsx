import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FolderKanban,
  Check,
  X,
  Upload,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminProjectsManager: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Quarry Management',
    location: '',
    description: '',
    status: 'completed' as 'ongoing' | 'completed',
    completion_date: '',
    primary_image: '',
  });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load projects' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Quarry Management',
      location: '',
      description: '',
      status: 'completed',
      completion_date: '',
      primary_image: '/uploads/proj1_1.jpg',
    });
    setModalOpen(true);
  };

  const openEditModal = (proj: Project) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      slug: proj.slug,
      category: proj.category,
      location: proj.location,
      description: proj.description,
      status: proj.status,
      completion_date: proj.completion_date || '',
      primary_image: proj.primary_image || '',
    });
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, primary_image: res.file_path }));
      setFeedback({ type: 'success', message: 'Project image uploaded successfully!' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Image upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, formData);
        setFeedback({ type: 'success', message: 'Project updated in MySQL successfully!' });
      } else {
        await api.createProject(formData);
        setFeedback({ type: 'success', message: 'New project created in MySQL successfully!' });
      }
      setModalOpen(false);
      await loadProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving project' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project from the database?')) {
      return;
    }
    try {
      await api.deleteProject(id);
      setFeedback({ type: 'success', message: 'Project deleted successfully' });
      await loadProjects();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete project' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-400" />
            <span>Projects & Case Studies Management</span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time MySQL records for DAVCOM portfolio and track records.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Feedback Alert */}
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

      {/* Projects Table */}
      {loading ? (
        <LoadingSpinner message="Querying projects from database..." />
      ) : projects.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
          No projects registered in the database yet. Click "Add New Project" to create one.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Title & Slug</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-10 rounded overflow-hidden bg-slate-950 border border-slate-800">
                        <img
                          src={proj.primary_image || '/uploads/proj1_1.jpg'}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-white block">{proj.title}</strong>
                      <span className="text-[11px] text-slate-400 font-mono">{proj.slug}</span>
                    </td>
                    <td className="py-3 px-4">{proj.category}</td>
                    <td className="py-3 px-4">{proj.location}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          proj.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(proj)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(proj.id)}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Project"
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

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-bold text-white">
                {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setFormData((prev) => ({
                      ...prev,
                      title,
                      slug: editingProject ? prev.slug : slug,
                    }));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Slug (URL Key) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Quarry Management">Quarry Management</option>
                    <option value="Rock Drilling & Blasting">Rock Drilling & Blasting</option>
                    <option value="Borehole Drilling">Borehole Drilling</option>
                    <option value="Road Construction">Road Construction</option>
                    <option value="Geotechnical Soil Testing">Geotechnical Soil Testing</option>
                    <option value="Civil Engineering Works">Civil Engineering Works</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g. Mpape District, Abuja FCT"
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as 'ongoing' | 'completed',
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Completion Date / Timeline
                </label>
                <input
                  type="text"
                  value={formData.completion_date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, completion_date: e.target.value }))
                  }
                  placeholder="e.g. October 2025 or Ongoing"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Detailed Scope & Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Image upload / URL */}
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Primary Project Image
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.primary_image}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, primary_image: e.target.value }))
                    }
                    placeholder="/uploads/proj1_1.jpg"
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
                  <p className="text-amber-400 text-[11px] mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Uploading image file to server...</span>
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded text-xs transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving to MySQL...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
