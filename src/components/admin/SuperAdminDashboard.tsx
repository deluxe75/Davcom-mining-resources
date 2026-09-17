import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  Server,
  Database,
  PlusCircle,
  Briefcase,
  Wrench,
  Hammer,
  Clock,
  RefreshCw,
  Cpu,
  KeyRound,
  FileCheck,
  Send,
  Eye,
  EyeOff,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';
import { AdminUser, CompanySettings, SystemDiagnostics, EmailLog } from '../../types';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const SuperAdminDashboard: React.FC = () => {
  // Navigation sub-tabs inside Super Admin
  const [activeSection, setActiveSection] = useState<'users' | 'settings' | 'email' | 'quick-add' | 'diagnostics'>('users');
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  // State: Admin Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    designation: 'Operations Field Manager',
  });
  const [userSubmitting, setUserSubmitting] = useState(false);
  const [userMessage, setUserMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State: Company Settings
  const [settings, setSettings] = useState<CompanySettings>({
    company_name: 'DAVCOM MINING RESOURCES NIG LTD',
    registration_rc: 'RC-1384291',
    hotline_1: '+234 803 605 5723',
    hotline_2: '+234 802 856 5000',
    hotline_3: '+234 809 950 0999',
    official_email: 'info@davcom.com.ng',
    head_office: 'Suite 305, The Capital Hub, Plot 272, Mabushi, Abuja FCT, Nigeria',
    operating_hours: 'Mon - Sat: 7:00 AM - 6:00 PM (Emergency Quorum: 24/7)',
    mining_license_status: 'Active & Fully Certified (Federal Ministry of Mines & Steel)',
    quarry_location: 'Mabushi & Keffi Road Haul Axis, Abuja & Nasarawa Operations'
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [settingsSubmitting, setSettingsSubmitting] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State: System Diagnostics
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState(true);

  // State: Quick Add Form (Service, Project, Equipment)
  const [quickType, setQuickType] = useState<'service' | 'project' | 'equipment'>('service');
  const [quickForm, setQuickForm] = useState({
    titleOrName: '',
    slug: '',
    categoryOrType: '',
    location: 'FCT-Abuja, Nigeria',
    description: '',
    icon: 'Hammer',
    image: '/uploads/mining.jpg',
    status: 'active',
  });
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickMessage, setQuickMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State: Email Routing & Audit Logs
  const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
  const [loadingEmailLogs, setLoadingEmailLogs] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState('info@davcom.com.ng');
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load Data
  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const data = await api.getCompanySettings();
      if (data && Object.keys(data).length > 0) {
        setSettings(data);
        if (data.official_email) {
          setTestEmailTarget(data.quote_notification_email || data.official_email);
        }
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const loadEmailLogs = async () => {
    setLoadingEmailLogs(true);
    try {
      const data = await api.getEmailLogs(40);
      setEmailLogs(data);
    } catch (err: any) {
      console.error('Failed to load email logs:', err);
    } finally {
      setLoadingEmailLogs(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingTestEmail(true);
    setTestEmailFeedback(null);
    try {
      const res = await api.sendTestEmail(testEmailTarget);
      setTestEmailFeedback({
        type: 'success',
        text: res.message || `Test quotation notification dispatched to ${testEmailTarget}`,
      });
      await loadEmailLogs();
    } catch (err: any) {
      setTestEmailFeedback({
        type: 'error',
        text: err.message || 'Failed to dispatch test transmission.',
      });
    } finally {
      setSendingTestEmail(false);
    }
  };

  const loadDiagnostics = async () => {
    setLoadingDiagnostics(true);
    try {
      const data = await api.getSystemDiagnostics();
      setDiagnostics(data);
    } catch (err: any) {
      console.error('Failed to load diagnostics:', err);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadSettings();
    loadDiagnostics();
    loadEmailLogs();
  }, []);

  // Handle Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMessage(null);
    setUserSubmitting(true);

    try {
      const res = await api.createAdminUser(userForm);
      setUserMessage({
        type: 'success',
        text: res.message || `Administrator ${userForm.name} provisioned successfully.`
      });
      setUserForm({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        designation: 'Operations Field Manager',
      });
      await loadUsers();
      loadDiagnostics();
    } catch (err: any) {
      setUserMessage({
        type: 'error',
        text: err.message || 'Failed to create administrative account.'
      });
    } finally {
      setUserSubmitting(false);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to revoke administrative access for "${name}"?`)) {
      return;
    }
    try {
      await api.deleteAdminUser(id);
      setUserMessage({ type: 'success', text: `Access revoked for ${name}.` });
      await loadUsers();
      loadDiagnostics();
    } catch (err: any) {
      setUserMessage({ type: 'error', text: err.message || 'Failed to revoke access.' });
    }
  };

  // Handle Update Settings
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMessage(null);
    setSettingsSubmitting(true);

    try {
      const res = await api.updateCompanySettings(settings);
      setSettings(res.settings);
      setSettingsMessage({
        type: 'success',
        text: 'Corporate profile & operational configuration updated in database.'
      });
    } catch (err: any) {
      setSettingsMessage({
        type: 'error',
        text: err.message || 'Failed to update company settings.'
      });
    } finally {
      setSettingsSubmitting(false);
    }
  };

  // Auto slug generation helper
  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setQuickForm(prev => ({ ...prev, titleOrName: val, slug }));
  };

  // Handle Quick Add
  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickMessage(null);
    setQuickSubmitting(true);

    try {
      if (quickType === 'service') {
        await api.createService({
          name: quickForm.titleOrName,
          slug: quickForm.slug || quickForm.titleOrName.toLowerCase().replace(/\s+/g, '-'),
          description: quickForm.description,
          icon: quickForm.icon || 'Hammer',
          image: quickForm.image || '/uploads/mining.jpg',
          status: quickForm.status,
        });
        setQuickMessage({ type: 'success', text: `Service "${quickForm.titleOrName}" created and live.` });
      } else if (quickType === 'project') {
        await api.createProject({
          title: quickForm.titleOrName,
          slug: quickForm.slug || quickForm.titleOrName.toLowerCase().replace(/\s+/g, '-'),
          category: quickForm.categoryOrType || 'Mining',
          location: quickForm.location || 'FCT-Abuja, Nigeria',
          description: quickForm.description,
          status: quickForm.status === 'active' ? 'completed' : quickForm.status,
          completion_date: new Date().toISOString().split('T')[0],
        });
        setQuickMessage({ type: 'success', text: `Project "${quickForm.titleOrName}" registered and published.` });
      } else if (quickType === 'equipment') {
        await api.createEquipment({
          name: quickForm.titleOrName,
          type: quickForm.categoryOrType || 'Heavy Excavation',
          description: quickForm.description,
          image: quickForm.image || '/uploads/excavator.jpg',
          status: quickForm.status === 'active' ? 'available' : quickForm.status,
        });
        setQuickMessage({ type: 'success', text: `Machinery asset "${quickForm.titleOrName}" cataloged.` });
      }

      setQuickForm({
        titleOrName: '',
        slug: '',
        categoryOrType: '',
        location: 'FCT-Abuja, Nigeria',
        description: '',
        icon: 'Hammer',
        image: '/uploads/mining.jpg',
        status: 'active',
      });
      loadDiagnostics();
    } catch (err: any) {
      setQuickMessage({ type: 'error', text: err.message || 'Failed to create resource.' });
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Super Admin Executive Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-amber-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Elevated Root Authority
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Super Admin Executive Dashboard
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Master control interface for DAVCOM MINING RESOURCES NIG LTD. Manage root operator permissions, configure enterprise company metadata, add verified assets, and monitor the persistent database engine.
            </p>
          </div>

          {/* Quick Engine Indicator */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Backend Engine</span>
                <span className="text-xs font-bold text-white font-mono">
                  {diagnostics?.driver || 'SQLITE'} • {diagnostics?.php_version ? `PHP ${diagnostics.php_version}` : 'Active'}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                loadUsers();
                loadSettings();
                loadDiagnostics();
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs font-bold transition-all"
              title="Refresh System Data"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync All</span>
            </button>
          </div>
        </div>

        {/* Section Tabs Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Admin Users & Operators ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('settings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Corporate Settings Form</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('email');
              loadEmailLogs();
            }}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'email'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Corporate Email & Quote Routing ({emailLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('quick-add')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'quick-add'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Master Resource Add Tool</span>
          </button>

          <button
            onClick={() => setActiveSection('diagnostics')}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSection === 'diagnostics'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Database & System Monitor</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ADMIN USERS PROVISIONING FORM & DIRECTORY */}
      {activeSection === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form: Provision New Admin */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Provision Administrator</h2>
                <p className="text-xs text-slate-400">Create new authorized personnel or operator</p>
              </div>
            </div>

            {userMessage && (
              <div
                className={`mb-6 p-4 rounded-xl text-xs flex items-start gap-3 border ${
                  userMessage.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/40 border-red-800/60 text-red-300'
                }`}
              >
                {userMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{userMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name & Title <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Musa Bello"
                  value={userForm.name}
                  onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Email Address <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. m.bello@davcom.com.ng"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Initial Password <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Authorization Role <span className="text-amber-400">*</span>
                  </label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="super_admin">Super Administrator</option>
                    <option value="admin">Operations Admin</option>
                    <option value="operations_lead">Operations Lead</option>
                    <option value="fleet_manager">Fleet & Equipment Manager</option>
                    <option value="site_engineer">Site Geotechnical Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Blasting Operations"
                    value={userForm.designation}
                    onChange={e => setUserForm({ ...userForm, designation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={userSubmitting}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {userSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Provisioning Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Authorize Administrator</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Table: Existing Authorized Users */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Authorized Control Personnel</h2>
                <p className="text-xs text-slate-400">All registered system administrators and site managers</p>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 font-mono">
                {users.length} Active
              </span>
            </div>

            {loadingUsers ? (
              <div className="py-12">
                <LoadingSpinner message="Loading personnel directory..." />
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {users.map(u => (
                  <div key={u.id} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-white truncate">{u.name}</p>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                              u.role === 'super_admin'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {u.role === 'super_admin' ? 'Super Admin' : u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{u.email}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.designation || 'Administrator'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg border border-transparent hover:border-red-900 transition-colors"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: CORPORATE SETTINGS FORM */}
      {activeSection === 'settings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Corporate Profile & Operations Form</h2>
                <p className="text-xs text-slate-400">Update company legal credentials, hotlines, and headquarters address</p>
              </div>
            </div>
          </div>

          {settingsMessage && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                settingsMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800/60 text-red-300'
              }`}
            >
              {settingsMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{settingsMessage.text}</span>
            </div>
          )}

          {loadingSettings ? (
            <div className="py-12">
              <LoadingSpinner message="Fetching corporate records..." />
            </div>
          ) : (
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Official Corporate Entity Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.company_name || ''}
                    onChange={e => setSettings({ ...settings, company_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Corporate Affairs Commission (CAC) RC Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.registration_rc || ''}
                    onChange={e => setSettings({ ...settings, registration_rc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Primary Operations Line
                  </label>
                  <input
                    type="text"
                    value={settings.hotline_1 || ''}
                    onChange={e => setSettings({ ...settings, hotline_1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Executive / Quarry Line
                  </label>
                  <input
                    type="text"
                    value={settings.hotline_2 || ''}
                    onChange={e => setSettings({ ...settings, hotline_2: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Technical / Drilling Line
                  </label>
                  <input
                    type="text"
                    value={settings.hotline_3 || ''}
                    onChange={e => setSettings({ ...settings, hotline_3: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Official Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.official_email || ''}
                    onChange={e => setSettings({ ...settings, official_email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Mining License & Federal Permits Status
                  </label>
                  <input
                    type="text"
                    value={settings.mining_license_status || ''}
                    onChange={e => setSettings({ ...settings, mining_license_status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Corporate Headquarters Address
                </label>
                <textarea
                  rows={2}
                  value={settings.head_office || ''}
                  onChange={e => setSettings({ ...settings, head_office: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Quarry / Haulage Axis
                  </label>
                  <input
                    type="text"
                    value={settings.quarry_location || ''}
                    onChange={e => setSettings({ ...settings, quarry_location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Operational Hours & Quorum
                  </label>
                  <input
                    type="text"
                    value={settings.operating_hours || ''}
                    onChange={e => setSettings({ ...settings, operating_hours: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Company Quote Notification Routing */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Automated Quote Email Dispatch Configuration
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Primary Quotation Notification Email
                    </label>
                    <input
                      type="email"
                      placeholder="info@davcom.com.ng"
                      value={settings.quote_notification_email || settings.official_email || ''}
                      onChange={e => setSettings({ ...settings, quote_notification_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Every quotation submitted on the site is transmitted to this corporate inbox.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Secondary Quotation Recipient / CC
                    </label>
                    <input
                      type="email"
                      placeholder="destinykalu45@gmail.com"
                      value={settings.secondary_quote_email || ''}
                      onChange={e => setSettings({ ...settings, secondary_quote_email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      Optional secondary director or manager receiving simultaneous notification.
                    </span>
                  </div>
                </div>

                {/* Live SMTP Outbound Delivery Controls */}
                <div className="mt-6 pt-6 border-t border-slate-800/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Live Outbound Mail Delivery (SMTP & Cloud)</span>
                        {settings.smtp_enabled === '1' && (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
                            LIVE TRANSMISSION ACTIVE
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Configure authenticated SMTP or Cloud API to transmit real quote emails directly into recipient mailboxes.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                      <input
                        type="checkbox"
                        checked={settings.smtp_enabled === '1'}
                        onChange={e => setSettings({ ...settings, smtp_enabled: e.target.checked ? '1' : '0' })}
                        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-slate-200">Enable Live Delivery</span>
                    </label>
                  </div>

                  {/* Provider Quick Presets */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mr-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Presets:
                    </span>
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        smtp_host: 'smtp.gmail.com',
                        smtp_port: '587',
                        smtp_secure: 'tls',
                        smtp_from_email: settings.official_email || 'info@davcom.com.ng',
                        smtp_from_name: 'DAVCOM MINING RESOURCES NIG LTD',
                        smtp_enabled: '1'
                      })}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Google Workspace / Gmail
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        smtp_host: 'mail.davcom.com.ng',
                        smtp_port: '465',
                        smtp_secure: 'ssl',
                        smtp_from_email: 'info@davcom.com.ng',
                        smtp_from_name: 'DAVCOM MINING RESOURCES NIG LTD',
                        smtp_enabled: '1'
                      })}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      cPanel / DAVCOM Webmail
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        smtp_host: 'smtp.office365.com',
                        smtp_port: '587',
                        smtp_secure: 'tls',
                        smtp_from_name: 'DAVCOM MINING RESOURCES NIG LTD',
                        smtp_enabled: '1'
                      })}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Microsoft 365
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        smtp_host: 'smtp-relay.brevo.com',
                        smtp_port: '587',
                        smtp_secure: 'tls',
                        smtp_from_name: 'DAVCOM MINING RESOURCES NIG LTD',
                        smtp_enabled: '1'
                      })}
                      className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded-md transition-colors"
                    >
                      Brevo / SendGrid Relay
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        SMTP Host Server
                      </label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com or mail.davcom.com.ng"
                        value={settings.smtp_host || ''}
                        onChange={e => setSettings({ ...settings, smtp_host: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Port
                      </label>
                      <input
                        type="text"
                        placeholder="587 / 465 / 25"
                        value={settings.smtp_port || ''}
                        onChange={e => setSettings({ ...settings, smtp_port: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Encryption Protocol
                      </label>
                      <select
                        value={settings.smtp_secure || 'tls'}
                        onChange={e => setSettings({ ...settings, smtp_secure: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      >
                        <option value="tls">STARTTLS (Port 587)</option>
                        <option value="ssl">SSL / SMTPS (Port 465)</option>
                        <option value="none">Plain Text (Port 25)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        SMTP Username / Account Email
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. info@davcom.com.ng or admin account"
                        value={settings.smtp_user || ''}
                        onChange={e => setSettings({ ...settings, smtp_user: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                        <span>SMTP Password / App Password</span>
                        <button
                          type="button"
                          onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-normal"
                        >
                          {showSmtpPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showSmtpPassword ? 'Hide' : 'Reveal'}</span>
                        </button>
                      </label>
                      <input
                        type={showSmtpPassword ? 'text' : 'password'}
                        placeholder="••••••••••••••••"
                        value={settings.smtp_pass || ''}
                        onChange={e => setSettings({ ...settings, smtp_pass: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Sender From Name
                      </label>
                      <input
                        type="text"
                        placeholder="DAVCOM MINING RESOURCES NIG LTD"
                        value={settings.smtp_from_name || ''}
                        onChange={e => setSettings({ ...settings, smtp_from_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Sender From Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="info@davcom.com.ng"
                        value={settings.smtp_from_email || ''}
                        onChange={e => setSettings({ ...settings, smtp_from_email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cloud Mail API Key (Optional Resend / SendGrid HTTPS fallback)
                    </label>
                    <input
                      type="password"
                      placeholder="re_xxxxxxxxxxxx (Optional - bypasses all SMTP port blocks)"
                      value={settings.resend_api_key || ''}
                      onChange={e => setSettings({ ...settings, resend_api_key: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      If configured, quotation emails can be transmitted securely via HTTPS without depending on SMTP sockets.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="submit"
                  disabled={settingsSubmitting}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {settingsSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Corporate Configuration...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Corporate Configuration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECTION: CORPORATE EMAIL & QUOTE ROUTING */}
      {activeSection === 'email' && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Corporate Email & Quotation Dispatch</h2>
                  <p className="text-xs text-slate-400">
                    Real-time routing of client quote requests to company operations desk
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadEmailLogs}
                  disabled={loadingEmailLogs}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingEmailLogs ? 'animate-spin' : ''}`} />
                  <span>Refresh Ledger</span>
                </button>
              </div>
            </div>

            {/* Active Routing Summary Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">
                  Primary Company Recipient
                </span>
                <p className="text-xs font-bold text-amber-400 font-mono">
                  {settings.quote_notification_email || settings.official_email || 'info@davcom.com.ng'}
                </p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Designated Quote Desk
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">
                  Secondary / Direct CC
                </span>
                <p className="text-xs font-bold text-white font-mono">
                  {settings.secondary_quote_email || 'destinykalu45@gmail.com'}
                </p>
                <span className="text-[10px] text-slate-400">Simultaneous notification</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">
                  Client Confirmation
                </span>
                <p className="text-xs font-bold text-white">Auto-Acknowledgment</p>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Instant Receipt Emailed
                </span>
              </div>
            </div>

            {/* Test Email Dispatch Card */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Live Email Dispatch Verification
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Trigger a live quotation transmission to test connectivity and review how the email appears in your inbox.
              </p>

              {testEmailFeedback && (
                <div
                  className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2.5 border ${
                    testEmailFeedback.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                      : 'bg-red-950/40 border-red-800/60 text-red-300'
                  }`}
                >
                  {testEmailFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{testEmailFeedback.text}</span>
                </div>
              )}

              <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Target test recipient (e.g. info@davcom.com.ng)..."
                  value={testEmailTarget}
                  onChange={e => setTestEmailTarget(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  type="submit"
                  disabled={sendingTestEmail}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 shrink-0"
                >
                  {sendingTestEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Quotation Dispatch</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Email Audit Ledger Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white">Outbound Email Audit Ledger</h3>
                <p className="text-xs text-slate-400">History of all quotation notifications and system communications</p>
              </div>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                {emailLogs.length} Total Logs
              </span>
            </div>

            {loadingEmailLogs ? (
              <div className="py-8">
                <LoadingSpinner message="Querying outbound email ledger..." />
              </div>
            ) : emailLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-950 rounded-xl border border-slate-800">
                No outbound email logs registered yet. Submit a quote or send a test dispatch above!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Recipient</th>
                      <th className="py-3 px-3">Subject</th>
                      <th className="py-3 px-3">Delivery Status</th>
                      <th className="py-3 px-3 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {emailLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                              log.email_type.includes('company')
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : log.email_type.includes('client')
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            }`}
                          >
                            {log.email_type.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-white text-[11px]">
                          {log.recipient}
                        </td>
                        <td className="py-3 px-3 max-w-[280px] truncate text-slate-300">
                          {log.subject}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                              log.status === 'sent' || log.status === 'logged'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/15 text-red-400 border border-red-500/20'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {log.status === 'logged' ? 'Dispatched / Logged' : log.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400 font-mono text-[10px]">
                          {log.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: MASTER RESOURCE ADD TOOL */}
      {activeSection === 'quick-add' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Direct Resource Master Form</h2>
                <p className="text-xs text-slate-400">Create new mining capabilities, infrastructure projects, or machinery assets</p>
              </div>
            </div>

            {/* Type selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setQuickType('service')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  quickType === 'service' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Service
              </button>
              <button
                type="button"
                onClick={() => setQuickType('project')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  quickType === 'project' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Project
              </button>
              <button
                type="button"
                onClick={() => setQuickType('equipment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  quickType === 'equipment' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Equipment
              </button>
            </div>
          </div>

          {quickMessage && (
            <div
              className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
                quickMessage.type === 'success'
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/40 border-red-800/60 text-red-300'
              }`}
            >
              {quickMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{quickMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleQuickAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {quickType === 'service' ? 'Service Name' : quickType === 'project' ? 'Project Title' : 'Equipment Name'} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    quickType === 'service'
                      ? 'e.g. Underground Tunneling'
                      : quickType === 'project'
                      ? 'e.g. Asokoro Rock Cutting'
                      : 'e.g. 50-Ton Crawler Crane'
                  }
                  value={quickForm.titleOrName}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {quickType === 'equipment' ? 'Equipment Category / Type' : 'URL Slug Identifier'}
                </label>
                <input
                  type="text"
                  placeholder={quickType === 'equipment' ? 'e.g. Heavy Earthmoving' : 'auto-generated-slug'}
                  value={quickType === 'equipment' ? quickForm.categoryOrType : quickForm.slug}
                  onChange={e =>
                    quickType === 'equipment'
                      ? setQuickForm({ ...quickForm, categoryOrType: e.target.value })
                      : setQuickForm({ ...quickForm, slug: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {quickType === 'project' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Engineering Category
                  </label>
                  <select
                    value={quickForm.categoryOrType || 'Mining'}
                    onChange={e => setQuickForm({ ...quickForm, categoryOrType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Mining">Mining</option>
                    <option value="Rock Drilling & Blasting">Rock Drilling & Blasting</option>
                    <option value="Quarry Management and Installation">Quarry Management and Installation</option>
                    <option value="Borehole Drilling">Borehole Drilling</option>
                    <option value="Road Construction">Road Construction</option>
                    <option value="Civil Works">Civil Works</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Location / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FCT-Abuja, Nigeria"
                    value={quickForm.location}
                    onChange={e => setQuickForm({ ...quickForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Technical Description <span className="text-amber-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Comprehensive technical specifications and scope..."
                value={quickForm.description}
                onChange={e => setQuickForm({ ...quickForm, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asset Image Path / URL
                </label>
                <input
                  type="text"
                  placeholder="/uploads/mining.jpg"
                  value={quickForm.image}
                  onChange={e => setQuickForm({ ...quickForm, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Status
                </label>
                <select
                  value={quickForm.status}
                  onChange={e => setQuickForm({ ...quickForm, status: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="active">Active / Available</option>
                  <option value="completed">Completed (Project)</option>
                  <option value="ongoing">Ongoing (Project)</option>
                  <option value="maintenance">Maintenance (Equipment)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={quickSubmitting}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {quickSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Publishing Resource...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish {quickType.toUpperCase()} Record</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 4: SYSTEM & DATABASE DIAGNOSTICS */}
      {activeSection === 'diagnostics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-400 font-semibold">Engine Driver</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">{diagnostics?.driver || 'SQLITE'}</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">{diagnostics?.database_name || 'davcom.sqlite'}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Server className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-slate-400 font-semibold">Server Runtime</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">PHP {diagnostics?.php_version || '8.2'}</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-1">Status: {diagnostics?.uptime_status || 'Operational'}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <FileCheck className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-slate-400 font-semibold">Total DB Records</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">{diagnostics?.total_database_records ?? 33}</p>
              <p className="text-[10px] text-slate-500 mt-1">Across 7 synced tables</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-slate-400 font-semibold">Memory Allocated</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">{diagnostics?.memory_usage_mb ?? 2} MB</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Optimized Fast Caching</p>
            </div>
          </div>

          {/* Database Tables Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-sm font-bold text-white mb-4">Table Record Distribution</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {diagnostics?.table_counts &&
                Object.entries(diagnostics.table_counts).map(([tbl, count]) => (
                  <div key={tbl} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
                      {tbl.replace('_', ' ')}
                    </span>
                    <span className="text-lg font-black text-amber-400 font-mono mt-1 block">
                      {count} items
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
