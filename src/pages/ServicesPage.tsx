import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  HardHat,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { Service } from '../types';
import { renderServiceIcon } from '../utils/iconMap';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Handle hash scrolling if user clicked an anchor like /services#mining
  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [loading, location.hash]);

  const filteredServices = services.filter((svc) =>
    svc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    svc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Detailed engineering specifications for each domain
  const serviceDetails: Record<string, { equipment: string[]; safety: string; scope: string[] }> = {
    'mining': {
      equipment: ['Excavator 330D', 'Wheel Loaders', 'Dump Trucks', 'Survey Drones'],
      safety: 'Strict bench stability inspections, blast clearance zone enforcement, NMMA environmental mitigation.',
      scope: ['Mineral concession evaluation', 'Topsoil stripping & overburden removal', 'Pit bench design & drainage', 'Continuous ore extraction'],
    },
    'rock-drilling-blasting': {
      equipment: ['Wagon Drill Rigs', 'High-Pressure Air Compressors', 'Seismographs', 'Pneumatic Jackhammers'],
      safety: 'Certified blasting engineer supervision, non-electric detonator circuits, flyrock calculation, and perimeter siren warnings.',
      scope: ['Blast-hole pattern drilling', 'Explosive charging & timing delays', 'Secondary boulder splitting', 'Vibration & noise monitoring'],
    },
    'quarry-management-installation': {
      equipment: ['Primary Jaw Crusher', 'Secondary Cone Crusher', 'Vibrating Screens', 'Conveyor Belts'],
      safety: 'Belt conveyor safety cords, ear protection zones, dust suppression misting systems.',
      scope: ['Plant layout & foundation casting', 'Crusher mechanical installation', 'Graded granite aggregate production', 'Stockpile management'],
    },
    'borehole-drilling-geophysical-survey': {
      equipment: ['DTH Rotary Drill Rig', 'ABEM Terrameter Resistivity Meter', 'Mud Pumps', 'Submersible Pumps'],
      safety: 'Electrical safety protocols, pressurized hydraulic hose checks, deep casing anchoring.',
      scope: ['2D electrical resistivity imaging', 'Deep crystalline rock borehole drilling', 'PVC / stainless casing installation', 'Pumping test & solar reticulation'],
    },
    'soil-testing-geotechnical-investigations': {
      equipment: ['SPT Split Spoon Sampler', 'Motorized Core Rig', 'Dynamic Cone Penetrometer', 'Triaxial Shear Cell'],
      safety: 'Underground utility clearance scans before driving probes, eye protection during core drilling.',
      scope: ['Standard Penetration Testing (SPT)', 'Continuous core recovery to 30m+', 'Bearing capacity calculations', 'Foundation recommendation reports'],
    },
    'building-construction': {
      equipment: ['Concrete Mixers', 'Vibrators', 'Scaffolding Systems', 'Tower Cranes'],
      safety: 'Edge protection railings, mandatory hard-hat zones, structural formwork load verification.',
      scope: ['Reinforced concrete frame structures', 'Industrial warehouse framing', 'High-grade architectural finishing', 'Turnkey MEP installation'],
    },
    'road-construction': {
      equipment: ['Heavy Motor Graders', 'Vibratory Iron Rollers', 'Asphalt Pavers', 'Water Tankers'],
      safety: 'Traffic diversion barriers, high-visibility apparel, reverse alarm sensors on all heavy plant.',
      scope: ['Earthwork cut-and-fill profiling', 'Crushed stone aggregate sub-base compaction', 'Asphalt concrete wearing course', 'Box culvert & drain construction'],
    },
    'civil-engineering-works': {
      equipment: ['Hydraulic Breakers', 'Bulldozers', 'Total Stations', 'Excavators'],
      safety: 'Trench shoring and slope battering to prevent cave-ins, heavy machinery exclusion zones.',
      scope: ['Retaining walls & slope stabilization', 'Heavy foundation piling & pad footings', 'Industrial storm-water drainage networks', 'Bridge abutments'],
    },
    'mining-heavy-engineering-supplies': {
      equipment: ['Flatbed Cranes', 'Warehouse Forklifts', 'Heavy Rigging Gear', 'Inspection Calipers'],
      safety: 'Load weight verification, certified crane lifting slings, secure industrial packaging.',
      scope: ['Tungsten carbide drill bits & drill steel', 'High-tensile conveyor belts & screen mesh', 'Pneumatic spares & lubricants', 'Quarry wear liners & jaw plates'],
    },
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Page Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <HardHat className="w-3.5 h-3.5" />
            <span>9 Core Engineering Disciplines</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            OUR ENGINEERING & MINING SERVICES
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            From initial geophysical exploration and geotechnical soil investigations to turnkey quarry aggregate plants, rock blasting, and civil infrastructure across Nigeria.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-md relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search services by keyword (e.g. drilling, quarry, soil)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        {loading ? (
          <LoadingSpinner message="Fetching active services from DAVCOM database..." />
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 rounded-xl border border-slate-800">
            <p className="text-slate-400 text-sm">No services matched your search term.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredServices.map((svc, index) => {
              const details = serviceDetails[svc.slug] || {
                equipment: ['Excavators', 'Compressors', 'Specialized Plant'],
                safety: 'Full Nigerian mining and occupational safety protocol enforced.',
                scope: ['Initial feasibility & site survey', 'Mobilization of heavy plant', 'Execution to engineering code', 'Quality assurance & handover'],
              };

              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all scroll-mt-24 shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Image & Icon Banner */}
                    <div className="lg:col-span-4 relative min-h-[220px] lg:min-h-full bg-slate-950 overflow-hidden">
                      <img
                        src={svc.image || '/uploads/mining.jpg'}
                        alt={svc.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-800 flex items-center gap-2">
                        {renderServiceIcon(svc.icon, { className: 'w-5 h-5 text-amber-400' })}
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Service {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Right Information & Engineering Breakdown */}
                    <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {svc.name}
                          </h2>
                          <Link
                            to={`/request-quote?service=${encodeURIComponent(svc.name)}`}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded text-xs transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Request This Service</span>
                          </Link>
                        </div>

                        <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {svc.description}
                        </p>

                        {/* Engineering Scope Breakdown */}
                        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {details.scope.map((item, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Equipment Used & Safety Consideration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                        {/* Equipment */}
                        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1.5">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Machinery & Equipment Utilized:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {details.equipment.map((eq, i) => (
                              <span
                                key={i}
                                className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium"
                              >
                                {eq}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Safety Consideration */}
                        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1.5">
                            <Shield className="w-3.5 h-3.5" />
                            <span>HSE & Safety Standards:</span>
                          </div>
                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {details.safety}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Consultation CTA */}
      <section className="py-12 bg-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Need a Custom Mining or Engineering Solution?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Our technical directors evaluate complex drilling patterns, quarry plant setup, and structural testing requests swiftly.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/request-quote"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-md text-xs transition-all"
            >
              Submit Service Request Form
            </Link>
            <Link
              to="/contact"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-md text-xs transition-all border border-slate-700"
            >
              Contact Engineering Offices
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
