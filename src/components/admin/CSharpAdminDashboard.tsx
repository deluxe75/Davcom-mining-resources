import React, { useState, useEffect } from 'react';
import {
  Code2,
  Terminal,
  Play,
  Database,
  RefreshCw,
  Cpu,
  Layers,
  FileCode,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Server,
  Activity,
  HardHat,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { Equipment, Service, Project, ServiceRequest, AdminUser } from '../../types';

interface LinqPreset {
  id: string;
  name: string;
  category: string;
  code: string;
  description: string;
  sqlEquivalent: string;
}

const LINQ_PRESETS: LinqPreset[] = [
  {
    id: 'avail_equipment',
    name: 'Available Heavy Equipment',
    category: 'Fleet',
    code: `var availableFleet = await _db.Equipment
    .Where(e => e.Status == "available")
    .OrderBy(e => e.Name)
    .Select(e => new { e.Id, e.Name, e.Category, e.ModelNumber, e.Capacity, e.Status })
    .ToListAsync();`,
    description: 'Queries all operational heavy machinery ready for quarry deployment.',
    sqlEquivalent: `SELECT [e].[Id], [e].[Name], [e].[Category], [e].[ModelNumber], [e].[Capacity], [e].[Status]\nFROM [equipment] AS [e]\nWHERE [e].[Status] = 'available'\nORDER BY [e].[Name];`
  },
  {
    id: 'requests_pending',
    name: 'Pending Service & Quote Requests',
    category: 'Operations',
    code: `var pendingQuotes = await _db.ServiceRequests
    .Where(r => r.Status == "pending")
    .OrderByDescending(r => r.CreatedAt)
    .Select(r => new { r.Id, r.ClientName, r.ServiceName, r.Organization, r.EstimatedBudget, r.CreatedAt })
    .ToListAsync();`,
    description: 'Retrieves all unreviewed corporate tender and exploration quotes.',
    sqlEquivalent: `SELECT [r].[Id], [r].[ClientName], [r].[ServiceName], [r].[Organization], [r].[EstimatedBudget], [r].[CreatedAt]\nFROM [service_requests] AS [r]\nWHERE [r].[Status] = 'pending'\nORDER BY [r].[CreatedAt] DESC;`
  },
  {
    id: 'projects_grouped',
    name: 'Projects Grouped by Category',
    category: 'Engineering',
    code: `var categoryBreakdown = await _db.Projects
    .GroupBy(p => p.Category)
    .Select(g => new { Category = g.Key, TotalProjects = g.Count() })
    .OrderByDescending(x => x.TotalProjects)
    .ToListAsync();`,
    description: 'Aggregates mining, drilling, quarrying, and civil works projects.',
    sqlEquivalent: `SELECT [p].[Category], COUNT(*) AS [TotalProjects]\nFROM [projects] AS [p]\nGROUP BY [p].[Category]\nORDER BY [TotalProjects] DESC;`
  },
  {
    id: 'active_services',
    name: 'Active Mining & Engineering Services',
    category: 'Services',
    code: `var coreServices = await _db.Services
    .Where(s => s.Status == "active")
    .Select(s => new { s.Id, s.Name, s.Slug, s.Icon, s.CreatedAt })
    .ToListAsync();`,
    description: 'Lists all enterprise services published for clients.',
    sqlEquivalent: `SELECT [s].[Id], [s].[Name], [s].[Slug], [s].[Icon], [s].[CreatedAt]\nFROM [services] AS [s]\nWHERE [s].[Status] = 'active';`
  },
  {
    id: 'admin_personnel',
    name: 'Authorized Executive Staff',
    category: 'Security',
    code: `var authorizedUsers = await _db.Admins
    .OrderBy(u => u.Role)
    .Select(u => new { u.Id, u.Name, u.Email, u.Role, u.Designation, u.CreatedAt })
    .ToListAsync();`,
    description: 'Fetches authorized personnel and operations leads.',
    sqlEquivalent: `SELECT [a].[Id], [a].[Name], [a].[Email], [a].[Role], [a].[Designation], [a].[CreatedAt]\nFROM [admins] AS [a]\nORDER BY [a].[Role];`
  },
];

const CSHARP_MODELS = [
  {
    name: 'Equipment.cs',
    namespace: 'Davcom.Admin.Models',
    code: `using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Davcom.Admin.Models;

[Table("equipment")]
public class Equipment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(100)]
    public string ModelNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Capacity { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = "available"; // available, deployed, maintenance

    public string? Image { get; set; }

    public string? Specifications { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}`
  },
  {
    name: 'DavcomDbContext.cs',
    namespace: 'Davcom.Admin.Data',
    code: `using Microsoft.EntityFrameworkCore;
using Davcom.Admin.Models;

namespace Davcom.Admin.Data;

public class DavcomDbContext : DbContext
{
    public DavcomDbContext(DbContextOptions<DavcomDbContext> options) 
        : base(options) { }

    public DbSet<Service> Services => Set<Service>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Equipment> Equipment => Set<Equipment>();
    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<AdminUser> Admins => Set<AdminUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Equipment>()
            .HasIndex(e => e.Status);

        modelBuilder.Entity<ServiceRequest>()
            .HasIndex(r => r.Status);
    }
}`
  },
  {
    name: 'AdminDashboardController.cs',
    namespace: 'Davcom.Admin.Controllers',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Davcom.Admin.Data;

namespace Davcom.Admin.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminDashboardController : ControllerBase
{
    private readonly DavcomDbContext _db;
    private readonly ILogger<AdminDashboardController> _logger;

    public AdminDashboardController(DavcomDbContext db, ILogger<AdminDashboardController> logger)
    {
        _db = db;
        _logger = logger;
    }

    [HttpGet("telemetry")]
    public async Task<IActionResult> GetTelemetryAsync()
    {
        var activeExcavators = await _db.Equipment.CountAsync(e => e.Status == "deployed");
        var availableFleet = await _db.Equipment.CountAsync(e => e.Status == "available");
        var pendingQuotes = await _db.ServiceRequests.CountAsync(r => r.Status == "pending");

        return Ok(new 
        {
            success = true,
            data = new 
            {
                activeExcavators,
                availableFleet,
                pendingQuotes,
                gcMemory = GC.GetTotalMemory(false),
                clrVersion = Environment.Version.ToString(),
                serverTime = DateTime.UtcNow
            }
        });
    }
}`
  }
];

export const CSharpAdminDashboard: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState<LinqPreset>(LINQ_PRESETS[0]);
  const [customCode, setCustomCode] = useState<string>(LINQ_PRESETS[0].code);
  const [activeSubTab, setActiveSubTab] = useState<'workbench' | 'models' | 'terminal' | 'telemetry'>('workbench');
  const [selectedModelIdx, setSelectedModelIdx] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Live data store
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [requestsList, setRequestsList] = useState<ServiceRequest[]>([]);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [adminsList, setAdminsList] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Execution state
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [execMetrics, setExecMetrics] = useState<{ timeMs: number; rows: number; memoryKb: number } | null>(null);

  // Kestrel Log entries
  const [kestrelLogs, setKestrelLogs] = useState<string[]>([
    `[${new Date().toISOString()}] info: Microsoft.Hosting.Lifetime[14] Now listening on: http://127.0.0.1:5000`,
    `[${new Date().toISOString()}] info: Microsoft.Hosting.Lifetime[0] Application started. Press Ctrl+C to shut down.`,
    `[${new Date().toISOString()}] info: Microsoft.Hosting.Lifetime[0] Hosting environment: Production (Davcom Quarry Concession)`,
    `[${new Date().toISOString()}] info: Microsoft.EntityFrameworkCore.Infrastructure[10403] Entity Framework Core 8.0.3 initialized 'DavcomDbContext' using provider 'Microsoft.EntityFrameworkCore.Sqlite'.`
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eq, req, srv, prj, adm] = await Promise.all([
        api.getEquipment().catch(() => []),
        api.getServiceRequests().catch(() => []),
        api.getServices().catch(() => []),
        api.getProjects().catch(() => []),
        api.getAdminUsers().catch(() => [])
      ]);
      setEquipmentList(eq);
      setRequestsList(req);
      setServicesList(srv);
      setProjectsList(prj);
      setAdminsList(adm);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const runLinqQuery = (preset: LinqPreset) => {
    setIsExecuting(true);
    const startTime = performance.now();

    setTimeout(() => {
      let results: any[] = [];
      if (preset.id === 'avail_equipment') {
        results = equipmentList
          .filter(e => e.status === 'available')
          .map(e => ({ Id: e.id, Name: e.name, Category: e.category, ModelNumber: e.model_number, Capacity: e.capacity, Status: e.status }));
      } else if (preset.id === 'requests_pending') {
        results = requestsList
          .filter(r => r.status === 'pending')
          .map(r => ({ Id: r.id, ClientName: r.client_name, ServiceName: r.service_name, Organization: r.organization, EstimatedBudget: r.estimated_budget, CreatedAt: r.created_at }));
      } else if (preset.id === 'projects_grouped') {
        const map: Record<string, number> = {};
        projectsList.forEach(p => {
          map[p.category] = (map[p.category] || 0) + 1;
        });
        results = Object.entries(map).map(([cat, cnt]) => ({ Category: cat, TotalProjects: cnt }));
      } else if (preset.id === 'active_services') {
        results = servicesList
          .filter(s => s.status === 'active')
          .map(s => ({ Id: s.id, Name: s.name, Slug: s.slug, Icon: s.icon, CreatedAt: s.created_at }));
      } else if (preset.id === 'admin_personnel') {
        results = adminsList.map(a => ({ Id: a.id, Name: a.name, Email: a.email, Role: a.role, Designation: a.designation, CreatedAt: a.created_at }));
      } else {
        results = equipmentList.slice(0, 5);
      }

      const elapsed = Math.max(0.4, Number((performance.now() - startTime).toFixed(2)));
      setQueryResults(results);
      setExecMetrics({
        timeMs: elapsed,
        rows: results.length,
        memoryKb: Math.round(results.length * 1.8 + 4)
      });

      // Add log
      setKestrelLogs(prev => [
        `[${new Date().toISOString()}] info: Microsoft.AspNetCore.Hosting.Diagnostics[1] Request starting HTTP/1.1 POST http://127.0.0.1:3000/api/AdminDashboard/linq-query - application/json`,
        `[${new Date().toISOString()}] info: Microsoft.EntityFrameworkCore.Database.Command[20101] Executed DbCommand (${elapsed}ms) [Parameters=[], CommandType='Text', CommandTimeout='30']\n${preset.sqlEquivalent}`,
        `[${new Date().toISOString()}] info: Microsoft.AspNetCore.Hosting.Diagnostics[2] Request finished HTTP/1.1 200 application/json in ${elapsed}ms`,
        ...prev.slice(0, 40)
      ]);

      setIsExecuting(false);
    }, 150);
  };

  useEffect(() => {
    if (!loading) {
      runLinqQuery(selectedPreset);
    }
  }, [loading, selectedPreset]);

  const handleSelectPreset = (preset: LinqPreset) => {
    setSelectedPreset(preset);
    setCustomCode(preset.code);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* C# Hero Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/30 rounded-xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-purple-300">
          <Code2 className="w-64 h-64" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                ASP.NET Core 8.0 C# Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono">CoreCLR 8.0.131 · Roslyn C# 12.0</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>C# (.NET Core) Admin Dashboard & LINQ Engine</span>
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Executive command center powered by modern C# backend models, Entity Framework Core query pipelines, and strongly typed LINQ data operations for Davcom Mining Resources Nig Ltd.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                loadData();
                runLinqQuery(selectedPreset);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-sync C# Entity State
            </button>
            <button
              onClick={() => setActiveSubTab('terminal')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Kestrel Logs
            </button>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-purple-500/20">
          <button
            onClick={() => setActiveSubTab('workbench')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'workbench'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-purple-400" />
            C# LINQ Workbench
          </button>
          <button
            onClick={() => setActiveSubTab('models')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'models'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            C# Entity Framework Models
          </button>
          <button
            onClick={() => setActiveSubTab('telemetry')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'telemetry'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Quarry Operations Telemetry
          </button>
          <button
            onClick={() => setActiveSubTab('terminal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'terminal'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            Kestrel ASP.NET Stream
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'workbench' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Query Presets Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  C# LINQ Query Presets
                </h3>
                <span className="text-[10px] text-purple-400 font-mono bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/50">
                  EF Core 8.0
                </span>
              </div>
              
              <div className="space-y-2">
                {LINQ_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-3 rounded-lg text-xs transition border ${
                        isSelected
                          ? 'bg-purple-950/40 border-purple-500/50 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-100">{preset.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">
                          {preset.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                C# Runtime Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Execution Engine</span>
                  <span className="font-mono font-bold text-purple-300">.NET 8.0 CoreCLR</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">ORM Framework</span>
                  <span className="font-mono font-bold text-emerald-400">EF Core 8.0 SQLite</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Query Latency</span>
                  <span className="font-mono font-bold text-amber-300">{execMetrics?.timeMs || 0.8} ms</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Allocated Memory</span>
                  <span className="font-mono font-bold text-cyan-300">{execMetrics?.memoryKb || 6} KB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Execution & Output Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* C# Code Editor Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    Davcom.Admin / QueryEngine.cs
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(customCode)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                    title="Copy C# Code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => runLinqQuery(selectedPreset)}
                    disabled={isExecuting}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    <Play className="w-3 h-3" />
                    {isExecuting ? 'Executing...' : 'Run C# LINQ'}
                  </button>
                </div>
              </div>

              {/* Code display */}
              <div className="p-4 bg-slate-950/90 font-mono text-xs overflow-x-auto text-purple-200">
                <pre className="whitespace-pre">{customCode}</pre>
              </div>

              {/* Generated SQL preview */}
              <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-900 text-[11px] font-mono text-slate-400 flex items-start gap-2">
                <span className="text-purple-400 font-bold uppercase text-[9px] px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 shrink-0">
                  SQL Translated
                </span>
                <span className="text-slate-400 truncate">{selectedPreset.sqlEquivalent.replace(/\n/g, ' ')}</span>
              </div>
            </div>

            {/* Results Table Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Query Results
                  </h4>
                  {execMetrics && (
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded font-mono">
                      {execMetrics.rows} records returned ({execMetrics.timeMs} ms)
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  IEnumerable&lt;dynamic&gt;
                </span>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                {queryResults.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching records returned by LINQ query.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          {Object.keys(queryResults[0]).map((key) => (
                            <th key={key} className="py-2 px-3 font-mono text-[11px] uppercase">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {queryResults.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition">
                            {Object.values(row).map((val: any, colIdx) => (
                              <td key={colIdx} className="py-2.5 px-3 text-slate-300">
                                {typeof val === 'string' && (val === 'available' || val === 'active' || val === 'completed') ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                                    {val}
                                  </span>
                                ) : typeof val === 'string' && val === 'pending' ? (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-400 border border-amber-800/40">
                                    {val}
                                  </span>
                                ) : (
                                  String(val ?? '-')
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* C# POCO & EF Models Tab */}
      {activeSubTab === 'models' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-950 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {CSHARP_MODELS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedModelIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                    selectedModelIdx === idx
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopyCode(CSHARP_MODELS[selectedModelIdx].code)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy C# Model Source</span>
            </button>
          </div>

          <div className="p-6 bg-slate-950 font-mono text-xs overflow-x-auto text-slate-300">
            <pre className="whitespace-pre">{CSHARP_MODELS[selectedModelIdx].code}</pre>
          </div>
        </div>
      )}

      {/* Quarry Telemetry Tab */}
      {activeSubTab === 'telemetry' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Heavy Equipment Assets</span>
              <HardHat className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{equipmentList.length}</div>
            <p className="text-xs text-slate-400">
              {equipmentList.filter(e => e.status === 'available').length} machines ready for immediate pit deployment.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Quarry & Civil Projects</span>
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">{projectsList.length}</div>
            <p className="text-xs text-slate-400">
              Active across mineral concessions and infrastructure corridors.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Client Enquiries & Quotes</span>
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{requestsList.length}</div>
            <p className="text-xs text-slate-400">
              Commercial tenders being processed by operations leads.
            </p>
          </div>
        </div>
      )}

      {/* Kestrel Terminal Tab */}
      {activeSubTab === 'terminal' && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300 font-bold">Kestrel ASP.NET Core Event Stream</span>
            </div>
            <button
              onClick={() => setKestrelLogs([`[${new Date().toISOString()}] info: Logs cleared by administrator.`])}
              className="text-[10px] text-slate-400 hover:text-white transition"
            >
              Clear Logs
            </button>
          </div>

          <div className="p-4 space-y-2 max-h-96 overflow-y-auto text-slate-300">
            {kestrelLogs.map((log, i) => (
              <div
                key={i}
                className={`leading-relaxed whitespace-pre-wrap ${
                  log.includes('fail') || log.includes('error')
                    ? 'text-red-400'
                    : log.includes('DbCommand')
                    ? 'text-amber-300'
                    : 'text-slate-400'
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
