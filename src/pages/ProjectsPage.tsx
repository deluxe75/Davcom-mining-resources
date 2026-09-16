import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FolderKanban,
  MapPin,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  X,
  ChevronRight,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.getProjects();
        setProjects(data);

        // If URL has highlight query param, auto open modal
        if (highlightId) {
          const match = data.find((p) => p.id === parseInt(highlightId, 10));
          if (match) setActiveProjectModal(match);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [highlightId]);

  const categories = [
    { label: 'All Projects', value: 'all' },
    { label: 'Quarry Management', value: 'Quarry Management' },
    { label: 'Rock Drilling & Blasting', value: 'Rock Drilling & Blasting' },
    { label: 'Borehole Drilling', value: 'Borehole Drilling' },
    { label: 'Road Construction', value: 'Road Construction' },
  ];

  const statuses = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Ongoing', value: 'ongoing' },
  ];

  const filteredProjects = projects.filter((proj) => {
    const matchCategory =
      selectedCategory === 'all' ||
      proj.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchStatus =
      selectedStatus === 'all' || proj.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchCategory && matchStatus;
  });

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Proven Engineering Track Record</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            PROJECT CATALOG & CASE STUDIES
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Review completed and ongoing heavy quarrying, controlled rock blasting, industrial borehole reticulation, and road construction assignments executed across Nigeria.
          </p>

          {/* Filter Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status tabs */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium mr-1">Status:</span>
              {statuses.map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSelectedStatus(st.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    selectedStatus === st.value
                      ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <LoadingSpinner message="Querying live projects from DAVCOM MySQL database..." />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No projects matched the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
              }}
              className="mt-4 text-xs font-bold text-amber-400 underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-lg group cursor-pointer"
                onClick={() => setActiveProjectModal(proj)}
              >
                {/* Project Image */}
                <div className="h-52 w-full overflow-hidden relative bg-slate-950">
                  <img
                    src={proj.primary_image || (proj.images && proj.images[0]?.image_path) || '/uploads/proj1_1.jpg'}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {proj.status}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-slate-950/85 backdrop-blur-sm text-slate-300 px-2.5 py-1 rounded border border-slate-800">
                    {proj.category}
                  </span>
                </div>

                {/* Project Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      {proj.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400/90 font-medium mt-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{proj.location}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>
                        {proj.completion_date ? proj.completion_date : 'Ongoing Project'}
                      </span>
                    </div>
                    <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      View Scope →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Detail Modal */}
      {activeProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/80 hover:bg-slate-950 text-slate-400 hover:text-white p-2 rounded-full border border-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="h-64 sm:h-80 w-full overflow-hidden relative bg-slate-950">
              <img
                src={activeProjectModal.primary_image || (activeProjectModal.images && activeProjectModal.images[0]?.image_path) || '/uploads/proj1_1.jpg'}
                alt={activeProjectModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span
                  className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded mb-2 ${
                    activeProjectModal.status === 'completed'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-amber-500 text-slate-950 font-bold'
                  }`}
                >
                  {activeProjectModal.status}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeProjectModal.title}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Meta pills */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-300 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span><strong>Location:</strong> {activeProjectModal.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span><strong>Category:</strong> {activeProjectModal.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>
                    <strong>Completion:</strong>{' '}
                    {activeProjectModal.completion_date || 'Currently Active'}
                  </span>
                </div>
              </div>

              {/* Scope of Works */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Scope of Engineering Works & Technical Methodology
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeProjectModal.description}
                </p>
              </div>

              {/* Additional Project Photos if any */}
              {activeProjectModal.images && activeProjectModal.images.length > 1 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Additional Site Photographs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {activeProjectModal.images.map((img) => (
                      <div key={img.id} className="h-28 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                        <img
                          src={img.image_path}
                          alt={img.caption || activeProjectModal.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Require similar engineering execution for your project?
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveProjectModal(null)}
                    className="px-4 py-2 rounded text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    to={`/request-quote?service=${encodeURIComponent(activeProjectModal.category)}`}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Request Quotation</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
