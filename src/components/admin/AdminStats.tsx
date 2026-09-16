import React from 'react';
import {
  FolderKanban,
  Wrench,
  Images,
  Mail,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { DashboardStats } from '../../types';

interface AdminStatsProps {
  stats: DashboardStats | null;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Total Projects
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.counts.projects}
            </div>
            <span className="text-[11px] text-amber-400 mt-1 block">
              Active Case Studies
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Equipment */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Equipment Fleet
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.counts.equipment}
            </div>
            <span className="text-[11px] text-emerald-400 mt-1 block">
              Owned Heavy Machinery
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
        </div>

        {/* Service Requests */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Service Requests
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.counts.service_requests}
            </div>
            <span className="text-[11px] text-blue-400 mt-1 block">
              {stats.counts.pending_requests} pending review
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Messages */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Enquiries & Messages
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {stats.counts.contacts}
            </div>
            <span className="text-[11px] text-purple-400 mt-1 block">
              {stats.counts.unread_contacts} unread
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Service Requests */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Recent Service & Quote Requests</span>
            </h3>
            <span className="text-xs text-slate-400">Live Database Logs</span>
          </div>

          <div className="space-y-3">
            {stats.recent_requests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No service requests yet.</p>
            ) : (
              stats.recent_requests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{req.name} {req.company ? `(${req.company})` : ''}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                      {req.service} • {req.location || 'Location Not Specified'}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                      req.status === 'pending'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : req.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Recent General Inquiries</span>
            </h3>
            <span className="text-xs text-slate-400">Live Messages</span>
          </div>

          <div className="space-y-3">
            {stats.recent_contacts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No messages logged yet.</p>
            ) : (
              stats.recent_contacts.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{msg.name}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5 truncate">
                      {msg.subject || msg.message}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                      msg.status === 'unread'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
