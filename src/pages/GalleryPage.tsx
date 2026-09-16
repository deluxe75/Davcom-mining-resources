import React, { useEffect, useState } from 'react';
import {
  Images,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { GalleryItem } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.getGallery();
        setItems(data);
      } catch (err) {
        console.error('Failed to fetch gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { label: 'All Photos', value: 'all' },
    { label: 'Quarrying', value: 'quarry' },
    { label: 'Drilling & Blasting', value: 'drilling' },
    { label: 'Borehole & Water', value: 'borehole' },
    { label: 'Earthworks & Heavy Plant', value: 'earthworks' },
    { label: 'Geotechnical & Soil', value: 'geotechnical' },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handlePrev = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex(
      activeLightboxIndex === 0 ? filteredItems.length - 1 : activeLightboxIndex - 1
    );
  };

  const handleNext = () => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex(
      activeLightboxIndex === filteredItems.length - 1 ? 0 : activeLightboxIndex + 1
    );
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Images className="w-3.5 h-3.5" />
            <span>Operational Field Visuals</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            FIELD OPERATIONS PHOTO GALLERY
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            High-resolution photographic documentation of active quarry pits, bench drilling arrays, deep water aquifer commissioning, and heavy earthworks executed by DAVCOM teams nationwide.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setActiveLightboxIndex(null);
                }}
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
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <LoadingSpinner message="Loading high-resolution field photos from database..." />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No photos found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveLightboxIndex(index)}
                className="group relative h-64 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer shadow-lg hover:border-amber-500/50 transition-all"
              >
                <img
                  src={item.image_path}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top Badge */}
                <span className="absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-amber-400 border border-slate-800">
                  {item.category}
                </span>

                <div className="absolute top-3 right-3 bg-slate-950/80 p-1.5 rounded-full text-slate-400 group-hover:text-white transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Caption & Title */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-5 right-5 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-full border border-slate-800 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-full border border-slate-800 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-900/80 hover:bg-slate-900 text-white p-3 rounded-full border border-slate-800 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Modal Container */}
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={filteredItems[activeLightboxIndex].image_path}
                alt={filteredItems[activeLightboxIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-6 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {filteredItems[activeLightboxIndex].category}
                </span>
                <h2 className="text-lg font-bold text-white mt-1.5">
                  {filteredItems[activeLightboxIndex].title}
                </h2>
                {filteredItems[activeLightboxIndex].caption && (
                  <p className="text-xs text-slate-400 mt-1">
                    {filteredItems[activeLightboxIndex].caption}
                  </p>
                )}
              </div>
              <div className="text-xs text-slate-400 shrink-0">
                Photo {activeLightboxIndex + 1} of {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
