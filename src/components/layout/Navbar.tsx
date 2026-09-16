import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Clock,
  Shield,
  Menu,
  X,
  Lock,
  ChevronRight,
  HardHat,
  FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Equipment Fleet', path: '/equipment' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full bg-slate-950 text-white sticky top-0 z-50 shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>RC: Incorporated 2016</span>
            </span>
            <a
              href="tel:+2348036055723"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>+234 803 605 5723</span>
            </a>
            <a
              href="mailto:info@davcom.com.ng"
              className="hidden md:flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-500" />
              <span>info@davcom.com.ng</span>
            </a>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              id="admin-portal-link"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-slate-950 transition-all text-xs font-semibold text-slate-200 border border-slate-700"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-950/40 text-slate-950 font-black">
            <HardHat className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                DAVCOM
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold tracking-wider border border-amber-500/30 uppercase">
                Mining
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
              Resources Nig Ltd
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 text-sm font-medium rounded-md transition-all ${
                  active
                    ? 'text-amber-400 bg-slate-900 border-b-2 border-amber-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/request-quote"
            id="nav-quote-btn"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-md text-sm transition-all shadow-md shadow-amber-500/20 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>Request Quote</span>
          </Link>
        </div>

        {/* Mobile menu hamburger button */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            to="/request-quote"
            className="text-xs bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded"
          >
            Quote
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            className="p-2 rounded-md bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  active
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <Link
              to="/request-quote"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-md text-sm transition-all"
            >
              Request a Technical Quote
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 rounded-md text-xs border border-slate-700"
            >
              Admin Management Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
