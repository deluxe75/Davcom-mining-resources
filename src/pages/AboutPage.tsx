import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Award,
  CheckCircle2,
  Users,
  Target,
  Eye,
  HeartHandshake,
  HardHat,
  Leaf,
  Briefcase,
  Compass,
  Building,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Corporate Identity & Track Record</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ABOUT DAVCOM MINING RESOURCES NIG LTD
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Incorporated in 2016, DAVCOM MINING RESOURCES NIG LTD has established itself as an authoritative Nigerian engineering enterprise specializing in mineral extraction, rock drilling, controlled blasting, geotechnical borehole development, and heavy civil construction.
          </p>
        </div>
      </section>

      {/* Corporate History */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
              Our Journey Since 2016
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              A Decade of Engineering Precision & Solid Foundations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              DAVCOM MINING RESOURCES NIG LTD was incorporated in 2016 to bridge the critical gap in indigenous heavy engineering, geotechnical precision, and quarry management in Nigeria. Starting from specialized rock fragmentation and blast-hole drilling operations in Abuja and the North Central geopolitical zone, we have systematically expanded our fleet and engineering capabilities.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Today, DAVCOM operates across 9 core industrial disciplines. Our owned fleet of crawler excavators, wagon drill rigs, heavy compressors, and geophysical testing instruments empowers us to mobilize swiftly and execute complex civil contracts without third-party dependency.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-amber-400">2016</div>
                <p className="text-xs text-slate-400 mt-1 font-semibold uppercase">Official Incorporation</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-2xl font-black text-amber-400">RC: Reg</div>
                <p className="text-xs text-slate-400 mt-1 font-semibold uppercase">CAC Certified Enterprise</p>
              </div>
            </div>
          </div>

          {/* Key Pillars Card */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Core Operational Pillars</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Regulatory Compliance & Explosive Safety</h4>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    Full licensing by the Ministry of Mines and Steel Development for blast-hole operations, storage, and magazine transport.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Empirical Geotechnical Verification</h4>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    Every foundation, quarry bench, or borehole is informed by Standard Penetration Tests (SPT), electrical resistivity, and core sampling.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">High-Capacity Equipment Fleets</h4>
                  <p className="text-slate-400 mt-0.5 leading-relaxed">
                    We maintain proprietary heavy earthmovers and specialized rock cutting machinery to deliver cost-effective and on-schedule execution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Values */}
      <section className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Vision</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To be the most dependable and technically proficient indigenous Nigerian mining, rock fragmentation, and geotechnical engineering powerhouse, setting the standard for sustainable extractive practices and resilient infrastructure.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Our Mission</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To engineer superior geological exploration, quarry management, borehole water extraction, and civil works through uncompromising safety protocols, advanced heavy machinery, and local Nigerian talent.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-xl space-y-4">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Core Values</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Integrity:</strong> Transparent commercial dealings.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Excellence:</strong> Strict engineering compliance.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Safety First:</strong> Zero-Harm HSE policy.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Community:</strong> Respect for host settlements.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <strong>Sustainability:</strong> Environmental remediation.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Community Relations */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8 border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <HardHat className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Health, Safety & Environment (HSE)</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              At DAVCOM, safety is an operational prerequisite. Our blast engineers calculate burden, spacing, and ground vibration thresholds with precision to protect personnel, neighboring communities, and environmental structures. Mandatory PPE, pre-ignition perimeter cordoning, and continuous atmospheric monitoring are enforced across all quarry sites.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full compliance with the Nigerian Minerals and Mining Act (NMMA)</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Host Community Relations & CSR</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We cultivate symbiotic relationships with traditional rulers and local leaders in our areas of operation. DAVCOM signs and fulfills Community Development Agreements (CDA), prioritizes local employment, and provides clean industrial water supply to neighboring villages through complimentary deep borehole reticulation.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Active Community Development Agreements & Youth Skills Transfer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team Structure */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded">
            Engineering Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Technical Leadership & Operations Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Spearheaded by registered mining engineers, COREN-certified civil engineers, and certified hydrogeologists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-black text-xl">
              DM
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Managing Director / CEO</h3>
              <p className="text-xs text-amber-400 font-medium">Executive Strategy & Operations</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seasoned mining industrialist with over 18 years of extractive mining, concession licensing, and strategic infrastructure delivery across Nigeria.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-black text-xl">
              CO
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Chief Technical Officer</h3>
              <p className="text-xs text-amber-400 font-medium">Mining & Blasting Operations</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified Mining Engineer overseeing precision bench blasting, explosive logistics, drilling patterns, and aggregate processing plants.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 border-2 border-amber-500 flex items-center justify-center text-amber-400 font-black text-xl">
              GE
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Lead Geotechnical Specialist</h3>
              <p className="text-xs text-amber-400 font-medium">Soil Investigations & Hydrogeology</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Directs Standard Penetration Testing (SPT), crystalline core extraction, 2D electrical resistivity surveys, and industrial borehole networks.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/request-quote"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-7 py-3 rounded-md text-sm transition-all"
          >
            <span>Partner With Our Technical Team</span>
          </Link>
        </div>
      </section>
    </div>
  );
};
