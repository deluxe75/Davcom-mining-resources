import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  HardHat,
  Award,
  CheckCircle2,
  Phone,
  FileText,
  Clock,
  Compass,
  Building,
  Hammer,
  Eye,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Service, Project, Equipment, GalleryItem } from '../types';
import { renderServiceIcon } from '../utils/iconMap';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, projectsRes, equipmentRes, galleryRes] = await Promise.allSettled([
          api.getServices(),
          api.getProjects(),
          api.getEquipment(),
          api.getGallery(),
        ]);

        if (servicesRes.status === 'fulfilled') setServices(servicesRes.value.slice(0, 6));
        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.slice(0, 3));
        if (equipmentRes.status === 'fulfilled') setEquipment(equipmentRes.value.slice(0, 4));
        if (galleryRes.status === 'fulfilled') setGallery(galleryRes.value.slice(0, 6));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
              <Shield className="w-3.5 h-3.5" />
              <span>Incorporated 2016 • RC Registered • Mining & Engineering</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              PRECISION MINING,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500">
                ROCK DRILLING
              </span>{' '}
              & CIVIL INFRASTRUCTURE
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              DAVCOM MINING RESOURCES NIG LTD provides high-tonnage quarry development, controlled explosive blasting, deep aquifer borehole drilling, geotechnical soil testing, and turnkey civil construction across Nigeria.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/request-quote"
                id="hero-request-quote-btn"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3.5 rounded-md text-sm transition-all shadow-xl shadow-amber-950/50 flex items-center gap-2 active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>Request a Technical Quote</span>
              </Link>
              <Link
                to="/services"
                id="hero-services-btn"
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-md text-sm transition-all border border-slate-700 flex items-center gap-2"
              >
                <span>Our 9 Core Services</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-sm">
            <div className="border-r border-slate-800/80 pr-4 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">2016</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Incorporated & Licensed
              </p>
            </div>
            <div className="border-r border-slate-800/80 pr-4 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">9</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Industrial Disciplines
              </p>
            </div>
            <div className="border-r border-slate-800/80 pr-4 last:border-0">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">100%</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Zero-Harm HSE Standard
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">10+</div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                Heavy Machinery Fleet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Company Introduction Overview */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text details */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                About DAVCOM Mining Resources Nig Ltd
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                Delivering Geological Reliability & Heavy Construction Excellence Since 2016
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Incorporated in 2016 under the laws of the Federal Republic of Nigeria, DAVCOM MINING RESOURCES NIG LTD has grown into a powerhouse in extractive mining, quarry plant commissioning, controlled rock blasting, and civil infrastructure.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our dual headquarters in Mabushi and Garki, Abuja, coordinate technical operations across Nigeria. We combine geotechnical investigation (SPT, core drilling), geophysics for deep aquifer mapping, with high-tonnage earthmoving and heavy machinery mobilization.
              </p>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Licensed rock blasting & explosive logistics</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Turnkey quarry aggregate crushing plants</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Deep crystalline rock borehole water networks</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Heavy haulage road, drainage & civil works</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <span>Learn more about our corporate background & leadership</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Visual Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
              <div className="border-b border-slate-800 pb-5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <HardHat className="w-5 h-5 text-amber-500" />
                  <span>Corporate Operations Summary</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Verified credentials & engineering infrastructure
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Incorporation Date</span>
                  <span className="text-white font-semibold">2016 (Active)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Headquarters</span>
                  <span className="text-white font-semibold">Mabushi & Area 11 Garki, Abuja</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Core Industry</span>
                  <span className="text-white font-semibold">Solid Minerals & Civil Engineering</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Safety Rating</span>
                  <span className="text-emerald-400 font-semibold">Zero-Harm HSE Certified</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Fleet Status</span>
                  <span className="text-amber-400 font-semibold">Heavy Plant Ready for Mobilization</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/request-quote"
                  className="w-full text-center block bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-md text-xs transition-all"
                >
                  Initiate Technical Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Services Showcase (Dynamically Connected to PHP API) */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                Our Engineering Disciplines
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                Comprehensive Mining & Civil Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Real-time services queried directly from the DAVCOM backend database.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <span>View All 9 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Querying live services from DAVCOM MySQL database..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col justify-between"
                >
                  {/* Service Image */}
                  <div className="h-44 w-full overflow-hidden relative bg-slate-900">
                    <img
                      src={svc.image || '/uploads/mining.jpg'}
                      alt={svc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm p-2 rounded-lg border border-slate-800 text-amber-400">
                      {renderServiceIcon(svc.icon, { className: 'w-5 h-5 text-amber-400' })}
                    </div>
                  </div>

                  {/* Service Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-3">
                        {svc.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-4 border-t border-slate-900 flex items-center justify-between">
                      <Link
                        to={`/services#${svc.slug}`}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <span>Specifications</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/request-quote?service=${encodeURIComponent(svc.name)}`}
                        className="text-xs font-bold bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 px-3 py-1.5 rounded transition-all border border-slate-800"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Featured Projects (Dynamically Queried from PHP API) */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                Track Record & Case Studies
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                Featured Engineering & Quarry Projects
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Executed with adherence to geotechnical design, regulatory benchmarks, and rigorous safety controls.
              </p>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden relative bg-slate-950">
                  <img
                    src={proj.primary_image || '/uploads/proj1_1.jpg'}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow ${
                      proj.status === 'completed'
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-amber-500 text-slate-950 font-bold'
                    }`}
                  >
                    {proj.status}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-slate-950/80 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                    {proj.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium mt-1">
                      {proj.location}
                    </p>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {proj.completion_date ? `Completed: ${proj.completion_date}` : 'Status: Active Execution'}
                    </span>
                    <Link
                      to={`/projects?highlight=${proj.id}`}
                      className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Heavy Equipment Fleet Highlights */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                Heavy Machinery & Fleet
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                Owned High-Capacity Equipment Fleet
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Eliminating subcontracting bottlenecks with company-owned excavators, wagon drills, compressors, and diamond cutters.
              </p>
            </div>
            <Link
              to="/equipment"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <span>View Full Fleet (11 Units)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipment.map((eq) => (
              <div
                key={eq.id}
                className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div className="h-40 w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={eq.image || '/uploads/excavator.jpg'}
                    alt={eq.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 right-2.5 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {eq.status}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{eq.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {eq.description}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-900 flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">High Capacity</span>
                    <Link
                      to="/request-quote"
                      className="text-xs text-amber-400 font-semibold hover:text-amber-300"
                    >
                      Mobilize Fleet →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose DAVCOM */}
      <section className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
              Company Strengths
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              Why Corporate & Government Clients Trust DAVCOM
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Proven engineering management, licensed explosive capability, and direct equipment ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Geotechnical & Geological Precision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We eliminate costly construction failures through SPT, core drilling, soil classification, and 2D electrical resistivity geophysical mapping.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Controlled Blasting & Quarry Concessions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Licensed by Nigerian mining authorities for safe explosive handling, blast-hole bench drilling, and optimum aggregate fragmentation.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Turnkey Civil & Road Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                From sub-base rock ballast compaction to multi-span culverts and industrial pavements built for extreme axle loads.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Zero-Harm HSE Standards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rigorous Health, Safety, and Environmental compliance protecting our crews, equipment, host communities, and local ecosystems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Field Operations Gallery Preview */}
      <section className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
                Operational Visuals
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
                Field Operations & Site Gallery
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Active operations captured on site across quarrying, drilling, and infrastructure assignments.
              </p>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative h-40 rounded-lg overflow-hidden bg-slate-950 border border-slate-800"
              >
                <img
                  src={item.image_path}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    {item.category}
                  </span>
                  <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Call To Action Banner */}
      <section className="py-16 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-3 py-1 rounded">
              Ready To Mobilize?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3 tracking-tight">
              Request Technical Specifications or Quotation
            </h2>
            <p className="text-sm font-semibold text-slate-900 mt-1 max-w-xl">
              Connect directly with our engineering team in Abuja. We evaluate geological specifications, pit volumes, and project timelines swiftly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/request-quote"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold px-7 py-3.5 rounded-md text-sm transition-all shadow-xl active:scale-95"
            >
              Request a Technical Quote
            </Link>
            <Link
              to="/contact"
              className="bg-white/20 hover:bg-white/30 text-slate-950 font-bold px-6 py-3.5 rounded-md text-sm transition-all border border-slate-950/20"
            >
              Contact Offices
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
