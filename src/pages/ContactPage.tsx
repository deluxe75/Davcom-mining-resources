import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building2,
  Shield,
} from 'lucide-react';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await api.sendContact(formData);
      setSuccessMessage(
        response.message || 'Your inquiry has been successfully sent to our engineering team.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Operations & Corporate Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            CONTACT DAVCOM MINING RESOURCES
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            Reach out to our engineering, quarrying, and geotechnical operations desks in Abuja. Every inquiry is reviewed by certified mining engineers and technical managers.
          </p>
        </div>
      </section>

      {/* Main Grid: Form + Office Details */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Send an Official Message
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-8">
              Fill out the form below. Submitted messages are saved directly into the company database.
            </p>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-start gap-3 text-xs sm:text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Transmission Successful!</p>
                  <p className="mt-0.5">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 flex items-start gap-3 text-xs sm:text-sm">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Submission Error</p>
                  <p className="mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Engr. Babatunde Lawal"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. b.lawal@organization.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +234 803 123 4567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Company / Organization */}
                <div>
                  <label htmlFor="company" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Apex Construction Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Subject / Inquiry Type <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Quarry aggregate supply contract or blast-hole drilling quotation"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Message <span className="text-amber-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your project requirements, site location, estimated quantities, or technical specifications..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-lg text-sm transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting to Database...' : 'Send Official Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Corporate Offices & Direct Lines */}
          <div className="lg:col-span-5 space-y-8">
            {/* Head Office */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Head Office (Abuja)</h3>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">Executive & Technical Operations</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Suite 305, The Capital Hub, Plot 272, Mabushi, Abuja, Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Monday - Saturday: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Branch Office */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Branch Office (Garki)</h3>
                  <p className="text-[10px] text-amber-400 font-semibold uppercase">Administrative Desk</p>
                </div>
              </div>
              <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Suite B20, Shakir Plaza, Michika Street, Area 11, Garki, Abuja</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Numbers & Emails */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Direct Telephony & Email Desks</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Telephone Hotlines:</span>
                  <div className="flex flex-col gap-1 text-slate-200 font-medium">
                    <a href="tel:+2348036055723" className="hover:text-amber-400 transition-colors">
                      +234 803 605 5723 (Operations Desk)
                    </a>
                    <a href="tel:+2348028565000" className="hover:text-amber-400 transition-colors">
                      +234 802 856 5000 (Commercial & Tenders)
                    </a>
                    <a href="tel:+2348099500999" className="hover:text-amber-400 transition-colors">
                      +234 809 950 0999 (Technical Management)
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-1">Official Emails:</span>
                  <div className="flex flex-col gap-1 text-slate-200 font-medium">
                    <a href="mailto:info@davcom.com.ng" className="hover:text-amber-400 transition-colors">
                      info@davcom.com.ng
                    </a>
                    <a href="mailto:contact@davcom.com.ng" className="hover:text-amber-400 transition-colors">
                      contact@davcom.com.ng
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
