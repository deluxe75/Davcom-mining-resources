import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  ArrowRight,
  HardHat,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Top CTA Band */}
      <div className="bg-amber-500 text-slate-950 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest bg-slate-950 text-amber-400 px-2.5 py-1 rounded">
              Get In Touch With Engineering Experts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
              Ready to Mobilize Heavy Machinery & Mining Teams?
            </h2>
            <p className="text-slate-900 font-medium text-sm mt-1 max-w-2xl">
              From controlled blast-hole drilling to deep aquifer water systems and highway civil works across Nigeria.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/request-quote"
              className="bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold px-6 py-3 rounded-md text-sm transition-all shadow-lg active:scale-95"
            >
              Request a Technical Quote
            </Link>
            <a
              href="tel:+2348036055723"
              className="bg-white/20 hover:bg-white/30 text-slate-950 font-bold px-5 py-3 rounded-md text-sm transition-all flex items-center gap-2 border border-slate-950/20"
            >
              <Phone className="w-4 h-4" />
              <span>Call Operations</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: About & Credentials */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <HardHat className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">
                  DAVCOM
                </span>
                <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Mining Resources Nig Ltd
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Incorporated in 2016, DAVCOM Mining Resources Nig Ltd is a leading Nigerian indigenous mining, rock drilling, geotechnical investigation, and civil engineering enterprise delivering precision infrastructure nationwide.
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Incorporated in 2016 (RC Registered)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Harm Health, Safety & Environment (HSE)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Core Services
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/services#mining" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Mining Exploration & Quarrying</span>
                </Link>
              </li>
              <li>
                <Link to="/services#rock-drilling-blasting" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Rock Drilling & Precision Blasting</span>
                </Link>
              </li>
              <li>
                <Link to="/services#quarry-management-installation" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Quarry Management & Crushing Plant</span>
                </Link>
              </li>
              <li>
                <Link to="/services#borehole-drilling-geophysical-survey" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Borehole Drilling & Geophysics</span>
                </Link>
              </li>
              <li>
                <Link to="/services#soil-testing-geotechnical-investigations" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Soil Testing & SPT Core Drilling</span>
                </Link>
              </li>
              <li>
                <Link to="/services#road-construction" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" />
                  <span>Road & Civil Infrastructure</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About Our Company & History
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-amber-400 transition-colors">
                  Projects & Case Studies
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-amber-400 transition-colors">
                  Equipment Fleet & Specifications
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors">
                  Field Operations Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/request-quote" className="hover:text-amber-400 transition-colors">
                  Request Quotation / RFQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Office Locations & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Offices */}
          <div className="space-y-3">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              Corporate Offices
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Head Office:</strong>
                  <span>Suite 305, The Capital Hub, Plot 272, Mabushi, Abuja, Nigeria</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Branch Office:</strong>
                  <span>Suite B20, Shakir Plaza, Michika Street, Area 11, Garki, Abuja</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Phone Lines:</strong>
                  <div className="flex flex-col gap-0.5 text-slate-300">
                    <a href="tel:+2348036055723" className="hover:text-amber-400">+234 803 605 5723</a>
                    <a href="tel:+2348028565000" className="hover:text-amber-400">+234 802 856 5000</a>
                    <a href="tel:+2348099500999" className="hover:text-amber-400">+234 809 950 0999</a>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200 block">Email:</strong>
                  <a href="mailto:info@davcom.com.ng" className="text-slate-300 hover:text-amber-400">
                    info@davcom.com.ng
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 DAVCOM MINING RESOURCES NIG LTD. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">RC Registered • Incorporated 2016</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
