import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, HardHat, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('davcom_admin_email') || '');
  const [password, setPassword] = useState('');
  const [rememberEmail, setRememberEmail] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (rememberEmail) {
        localStorage.setItem('davcom_admin_email', email);
      } else {
        localStorage.removeItem('davcom_admin_email');
      }

      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      {/* Back to website link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to DAVCOM Website</span>
        </Link>
        <span className="text-[11px] text-slate-500 font-mono">Enterprise Portal</span>
      </div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            DAVCOM Management Portal
          </h1>
          <p className="text-xs text-slate-400">
            Authorized administrative access for operations, quotes, and corporate records.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Authorized Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@davcom.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
              <input
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span>Remember email</span>
            </label>

            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-[11px] text-amber-400/80 hover:text-amber-400 transition-colors"
            >
              Access Help
            </button>
          </div>

          {showHelp && (
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="text-amber-400 font-semibold block">System Access Protocol:</span>
              <p>Primary Director Sign-in: <strong className="text-white">admin@davcom.com</strong> (or operational account registered in Super Admin Console).</p>
              <p className="text-[10px] text-slate-500">Initial Master Key: <span className="font-mono text-slate-300">admin123456</span></p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-lg text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 mt-4"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Secure Session...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-[11px] text-slate-600">
        DAVCOM MINING RESOURCES NIG LTD • Certified Production System
      </div>
    </div>
  );
};
