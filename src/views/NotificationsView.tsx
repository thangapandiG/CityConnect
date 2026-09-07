import React, { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { NotificationRecord, Resident, Disruption } from '../types';
import { getNotifications, getResidents, getDisruptions } from '../services/api';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    const [nList, rList, dList] = await Promise.all([
      getNotifications(),
      getResidents(),
      getDisruptions(),
    ]);
    setNotifications(nList);
    setResidents(rList);
    setDisruptions(dList);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getResidentName = (id: string) => residents.find(r => r.id === id)?.name || id;
  const getDisruptionTitle = (id: string) => disruptions.find(d => d.id === id)?.title || id;

  const filtered = notifications.filter(n => {
    const rName = getResidentName(n.residentId).toLowerCase();
    const dTitle = getDisruptionTitle(n.disruptionId).toLowerCase();
    return rName.includes(search.toLowerCase()) || dTitle.includes(search.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">Notification Broadcast History & Dispatch Logs</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Audit log recording sent baseline and prototype personalized messages, fallback statuses, and resident feedback.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border flex items-center gap-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search log by resident name or disruption title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-civic-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200">
                <th className="p-3 font-bold border-b border-slate-700">Sent Time</th>
                <th className="p-3 font-bold border-b border-slate-700">Resident</th>
                <th className="p-3 font-bold border-b border-slate-700">Disruption Permit</th>
                <th className="p-3 font-bold border-b border-slate-700">Language</th>
                <th className="p-3 font-bold border-b border-slate-700">Format</th>
                <th className="p-3 font-bold border-b border-slate-700">Fallback Badges</th>
                <th className="p-3 font-bold border-b border-slate-700">Resident Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filtered.map(n => (
                <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 text-[11px] text-slate-500 font-mono">
                    {new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3 font-bold text-slate-900">{getResidentName(n.residentId)}</td>
                  <td className="p-3 font-medium text-slate-700 max-w-xs">{getDisruptionTitle(n.disruptionId)}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-800">
                      {n.language}
                    </span>
                  </td>
                  <td className="p-3">{n.accessibilityFormat}</td>
                  <td className="p-3 text-[10px] space-x-1">
                    {n.isLanguageFallback && <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">Lang Fallback</span>}
                    {n.isLocationUnknown && <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">Loc Unknown</span>}
                    {n.isAccessibilityDefault && <span className="bg-blue-100 text-blue-900 font-bold px-1.5 py-0.5 rounded">Acc Default</span>}
                    {!n.isLanguageFallback && !n.isLocationUnknown && !n.isAccessibilityDefault && (
                      <span className="text-emerald-700 font-bold">✓ Standard Direct</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Understood: {n.understandability || 'Yes'}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        Relevant: {n.relevance || 'Yes'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
