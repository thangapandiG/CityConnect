import React, { useState, useEffect } from 'react';
import { Layers, Search, Filter, CheckCircle2, Clock, AlertTriangle, Eye, Send } from 'lucide-react';
import { Disruption } from '../types';
import { getDisruptions, updateDisruptionStatus, broadcastNotifications } from '../services/api';
import { ActiveTab } from '../components/Navbar';

interface DisruptionsViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectDisruption: (id: string) => void;
}

export const DisruptionsView: React.FC<DisruptionsViewProps> = ({
  onNavigate,
  onSelectDisruption,
}) => {
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');

  const loadData = async () => {
    const list = await getDisruptions();
    setDisruptions(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: Disruption['status']) => {
    await updateDisruptionStatus(id, status, 'Officer Action');
    await loadData();
  };

  const handleBroadcast = async (id: string) => {
    await broadcastNotifications(id);
    await loadData();
  };

  const filteredDisruptions = disruptions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.affectedArea.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    const matchesSeverity = severityFilter === 'All' || d.severity === severityFilter;
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">City Disruption Permits Directory</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Complete list of active, pending, and expired public service disruption permits across city departments.
          </p>
        </div>

        <button
          onClick={() => onNavigate('create-disruption')}
          className="bg-civic-600 hover:bg-civic-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow shrink-0"
        >
          <span>+ Create Disruption</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by title or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-civic-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDisruptions.map(d => (
          <div key={d.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-civic-600 tracking-wider block">
                  {d.department}
                </span>
                <h3 className="font-bold text-base text-slate-900">{d.title}</h3>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  d.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-800'
                    : d.status === 'Expired'
                    ? 'bg-slate-200 text-slate-600'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {d.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">{d.description}</p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-700">
              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Affected Area</span>
                <strong className="text-slate-900">{d.affectedArea}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Affected Routes</span>
                <strong className="font-mono text-civic-700">{d.affectedRoutes.join(', ')}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Radius</span>
                <strong>{d.radius} km</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-medium block">Severity</span>
                <strong className={d.severity === 'Critical' ? 'text-rose-600' : 'text-slate-900'}>{d.severity}</strong>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(d.startTime).toLocaleDateString()}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onSelectDisruption(d.id);
                    onNavigate('city-map');
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>

                {d.status === 'Active' && (
                  <button
                    onClick={() => handleBroadcast(d.id)}
                    className="bg-civic-600 hover:bg-civic-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast</span>
                  </button>
                )}

                {d.status === 'Active' && (
                  <button
                    onClick={() => handleStatusChange(d.id, 'Expired')}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                    title="Mark Expired (Edge Case 5)"
                  >
                    Expire
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
