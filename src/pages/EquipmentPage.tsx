import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Shield,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { api } from '../services/api';
import { Equipment } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const EquipmentPage: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await api.getEquipment();
        setEquipmentList(data);
      } catch (err) {
        console.error('Failed to fetch equipment:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const filteredEquipment = equipmentList.filter((eq) => {
    if (statusFilter === 'all') return true;
    return eq.status === statusFilter;
  });

  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Available for Mobilization</span>
          </span>
        );
      case 'on-site':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            <span>Active On-Site</span>
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>Scheduled Maintenance</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Wrench className="w-3.5 h-3.5" />
            <span>Heavy Machinery & Specialized Plant</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            EQUIPMENT FLEET & MACHINERY INVENTORY
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            DAVCOM maintains an owned, high-performance fleet of earthmoving crawler excavators, wagon drill rigs, industrial air compressors, diamond rock saws, and borehole rigs engineered for extreme field duty across Nigeria.
          </p>

          {/* Status filter tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-400 font-medium mr-2">Filter by Status:</span>
            {[
              { label: 'All Machinery', value: 'all' },
              { label: 'Available for Mobilization', value: 'available' },
              { label: 'Active On-Site', value: 'on-site' },
              { label: 'Under Maintenance', value: 'maintenance' },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === st.value
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Cards Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <LoadingSpinner message="Querying active heavy equipment fleet from DAVCOM database..." />
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No machinery matched your filter selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-xl group"
              >
                {/* Equipment Image */}
                <div className="h-52 w-full overflow-hidden relative bg-slate-950">
                  <img
                    src={eq.image || '/uploads/excavator.jpg'}
                    alt={eq.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(eq.status)}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {eq.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      {eq.description}
                    </p>
                  </div>

                  {/* Specifications & Mobilization CTA */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Gauge className="w-3.5 h-3.5 text-amber-500" />
                      <span>Certified Heavy Plant</span>
                    </div>
                    <Link
                      to={`/request-quote?service=Equipment+Mobilization&notes=${encodeURIComponent(
                        `Inquiry for mobilizing machinery: ${eq.name}`
                      )}`}
                      className="bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 font-bold px-3 py-1.5 rounded text-xs transition-all border border-slate-700 active:scale-95"
                    >
                      Mobilize Unit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Heavy Machinery Assurance */}
      <section className="py-14 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-3">
            <Shield className="w-6 h-6 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Full In-House Fleet Ownership</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We own and directly operate our entire heavy equipment pool, avoiding high rental surcharges and third-party delays.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-3">
            <Wrench className="w-6 h-6 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Certified Mobile Mechanics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our mobile mechanical response units are stationed on site with genuine spare parts, minimizing breakdown downtime to near zero.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-3">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Operator Safety Certification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every machinery operator is licensed, medically cleared, and trained in defensive plant operation and quarry bench safety.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
