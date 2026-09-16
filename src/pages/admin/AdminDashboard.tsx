import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Images,
  FileText,
  Mail,
  LogOut,
  ExternalLink,
  Shield,
  HardHat,
  Bell,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';
import { AdminStats } from '../../components/admin/AdminStats';
import { AdminProjectsManager } from '../../components/admin/AdminProjectsManager';
import { AdminEquipmentManager } from '../../components/admin/AdminEquipmentManager';
import { AdminGalleryManager } from '../../components/admin/AdminGalleryManager';
import { AdminRequestsManager } from '../../components/admin/AdminRequestsManager';
import { AdminMessagesManager } from '../../components/admin/AdminMessagesManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

type TabKey = 'stats' | 'projects' | 'equipment' | 'gallery' | 'requests' | 'messages';

export const AdminDashboard: React.FC = () => {
  const { admin, isAuthenticated, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabKey>('stats');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Authentication guard
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadStats();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner message="Verifying administrative session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      key: 'stats',
      label: 'Overview & Stats',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      key: 'requests',
      label: 'Service Requests',
      icon: <FileText className="w-4 h-4" />,
      badge: stats?.counts.pending_requests || undefined,
    },
    {
      key: 'messages',
      label: 'Enquiries / Messages',
      icon: <Mail className="w-4 h-4" />,
      badge: stats?.counts.unread_contacts || undefined,
    },
    {
      key: 'projects',
      label: 'Projects Portfolio',
      icon: <FolderKanban className="w-4 h-4" />,
    },
    {
      key: 'equipment',
      label: 'Machinery Fleet',
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      key: 'gallery',
      label: 'Field Gallery',
      icon: <Images className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-tight block">
                DAVCOM CONTROL PORTAL
              </span>
              <span className="text-[10px] text-amber-400 font-mono">
                Production Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* View Live Website link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 transition-colors bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin user info & Logout */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-white leading-none">
                  {admin?.name || 'Davcom Administrator'}
                </p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {admin?.email || 'admin@davcom.com'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-950/50 hover:bg-red-900 text-red-300 p-2 rounded-lg border border-red-800/60 transition-all text-xs flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === tab.key
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={loadStats}
            className="ml-auto p-2 text-slate-400 hover:text-white rounded bg-slate-900 border border-slate-800 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Views */}
        <div>
          {activeTab === 'stats' && (
            statsLoading ? (
              <LoadingSpinner message="Loading live operational metrics..." />
            ) : (
              <AdminStats stats={stats} />
            )
          )}

          {activeTab === 'requests' && <AdminRequestsManager />}

          {activeTab === 'messages' && <AdminMessagesManager />}

          {activeTab === 'projects' && <AdminProjectsManager />}

          {activeTab === 'equipment' && <AdminEquipmentManager />}

          {activeTab === 'gallery' && <AdminGalleryManager />}
        </div>
      </div>
    </div>
  );
};
