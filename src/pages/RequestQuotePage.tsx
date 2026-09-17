import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  Shield,
  HelpCircle,
  Phone,
  HardHat,
  Mail,
} from 'lucide-react';
import { api } from '../services/api';
import { Service } from '../types';

export const RequestQuotePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Mining';
  const initialNotes = searchParams.get('notes') || '';

  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: initialService,
    location: '',
    description: initialNotes,
    preferred_contact_method: 'phone',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<number | null>(null);
  const [dispatchedRecipients, setDispatchedRecipients] = useState<string[]>([]);
  const [clientReceiptEmail, setClientReceiptEmail] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setServices(data);
      } catch (err) {
        console.error('Failed to fetch services for dropdown:', err);
      }
    };
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const clientEmail = formData.email;

    try {
      const res = await api.sendServiceRequest(formData);
      setSubmittedRequestId(res.request_id);
      setSuccessMessage(res.message);
      setClientReceiptEmail(clientEmail);
      setDispatchedRecipients(res.company_recipients || ['info@davcom.com.ng']);
      // Reset form
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: 'Mining',
        location: '',
        description: '',
        preferred_contact_method: 'phone',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit service request. Please verify fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Page Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <FileText className="w-3.5 h-3.5" />
            <span>Technical Quotation & Machinery Mobilization</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            REQUEST A TECHNICAL SERVICE QUOTE
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Submit your project parameters, location, and technical requirements. Our chief estimators and mining engineers evaluate geotechnical specifics and return formal proposals promptly.
          </p>
        </div>
      </section>

      {/* Main Form & Guidelines Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Container */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
            {submittedRequestId ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    Official Reference Code: DMR-{submittedRequestId}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">
                    Service Request Registered Successfully!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-2 leading-relaxed">
                    {successMessage ||
                      'Your technical quote request has been transmitted directly to DAVCOM company operations desk and registered in the database.'}
                  </p>
                </div>

                {/* Company Email Dispatch Feedback Card */}
                <div className="max-w-lg mx-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-left space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-amber-400">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Transmitted to Company Technical Desks:</span>
                  </div>
                  <div className="space-y-1.5 pl-6">
                    {(dispatchedRecipients.length > 0 ? dispatchedRecipients : ['info@davcom.com.ng']).map((email, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-mono">{email}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Dispatched
                        </span>
                      </div>
                    ))}
                  </div>

                  {clientReceiptEmail && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Acknowledgment sent to:</span>
                      <span className="text-slate-300 font-mono">{clientReceiptEmail}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => setSubmittedRequestId(null)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs transition-all"
                  >
                    Submit Another Inquiry
                  </button>
                  <Link
                    to="/projects"
                    className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-5 py-2.5 rounded-lg text-xs transition-all border border-slate-700"
                  >
                    Explore Past Projects
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="border-b border-slate-800 pb-6 mb-8">
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Project Parameters & Scope Submission
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    All fields marked with an asterisk (<span className="text-amber-400">*</span>) are required.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 flex items-start gap-3 text-xs sm:text-sm">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Error Logging Request</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Persons Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Full Name / Authorized Representative <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="quote-name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Arc. Oladipo Johnson"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-company" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Company / Government Agency
                      </label>
                      <input
                        type="text"
                        id="quote-company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Federal Ministry of Works / Greenfield Quarries"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Official Email <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="email"
                        id="quote-email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. o.johnson@organization.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="quote-phone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Direct Phone / WhatsApp Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="tel"
                        id="quote-phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +234 803 555 1234"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Service & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-service" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Required Service Discipline <span className="text-amber-400">*</span>
                      </label>
                      <select
                        id="quote-service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {services.length > 0 ? (
                          services.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Mining">Mining</option>
                            <option value="Rock Drilling & Blasting">Rock Drilling & Blasting</option>
                            <option value="Quarry Management and Installation">
                              Quarry Management and Installation
                            </option>
                            <option value="Borehole Drilling and Geophysical Survey">
                              Borehole Drilling and Geophysical Survey
                            </option>
                            <option value="Soil Testing (SPT & Geotechnical)">
                              Soil Testing (SPT & Geotechnical)
                            </option>
                            <option value="Building Construction">Building Construction</option>
                            <option value="Road Construction">Road Construction</option>
                            <option value="Civil Engineering Works">Civil Engineering Works</option>
                            <option value="Heavy Equipment Mobilization">
                              Heavy Equipment Mobilization
                            </option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quote-location" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Project Site Location (State / City)
                      </label>
                      <input
                        type="text"
                        id="quote-location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Abuja FCT, Nasarawa, Kogi, Kaduna, etc."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Project Description */}
                  <div>
                    <label htmlFor="quote-description" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Scope of Work & Project Specifications <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      id="quote-description"
                      name="description"
                      required
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Specify dimensions, volume (e.g. 50,000 metric tons of granite), depth of borehole, terrain type, timeline, or required machinery..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>

                  {/* Preferred Contact Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quote-preferred-method" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Preferred Response Method
                      </label>
                      <select
                        id="quote-preferred-method"
                        name="preferred_contact_method"
                        value={formData.preferred_contact_method}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="phone">Direct Phone Call</option>
                        <option value="email">Official Email Proposal</option>
                        <option value="whatsapp">WhatsApp Consultation</option>
                        <option value="site_meeting">In-Person Site / Office Meeting</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quote-message" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Special Logistics or Safety Notes
                      </label>
                      <input
                        type="text"
                        id="quote-message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="e.g. Site requires non-electric blast delays; target start Q2"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="quote-submit-btn"
                    disabled={loading}
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-4 rounded-lg text-sm transition-all shadow-xl flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {loading ? 'Transmitting to Technical Registry...' : 'Submit Request for Proposal (RFP)'}
                    </span>
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Guidance & Contact Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <HardHat className="w-5 h-5" />
                <span>Quotation Evaluation Protocol</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-3">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong>Geological Review:</strong> Our registered mining team examines terrain, rock hardness, and environmental proximity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong>Fleet Sizing:</strong> Machinery capacity and fuel burn rates are computed for optimal price efficiency.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <span><strong>Safety & Regulatory Approval:</strong> Blast notification permits and environmental compliance verified.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>Direct Hotline for Tenders</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                For urgent federal tenders or emergency quarry pit clearing, reach our operations desk directly:
              </p>
              <div className="pt-2 flex flex-col gap-1.5 font-bold text-white">
                <a href="tel:+2348036055723" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+234 803 605 5723</span>
                </a>
                <a href="tel:+2348028565000" className="hover:text-amber-400 transition-colors flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>+234 802 856 5000</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
