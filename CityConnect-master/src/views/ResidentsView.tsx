import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, AlertTriangle, CheckCircle, Edit3, Globe, Eye } from 'lucide-react';
import { Resident } from '../types';
import { getResidents, updateResident } from '../services/api';
import { ActiveTab } from '../components/Navbar';

interface ResidentsViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onSelectResident: (resident: Resident) => void;
}

export const ResidentsView: React.FC<ResidentsViewProps> = ({
  onNavigate,
  onSelectResident,
}) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [accessibilityFilter, setAccessibilityFilter] = useState('All');
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

  const loadResidents = async () => {
    const list = await getResidents();
    setResidents(list);
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const handleSaveEdit = async () => {
    if (!editingResident) return;
    await updateResident(editingResident);
    setEditingResident(null);
    await loadResidents();
  };

  const filteredResidents = residents.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.zone.toLowerCase().includes(search.toLowerCase()) || r.assignedRoute.toLowerCase().includes(search.toLowerCase());
    const matchesLang = languageFilter === 'All' || r.preferredLanguage === languageFilter;
    const matchesAcc = accessibilityFilter === 'All' || r.accessibilityNeeds === accessibilityFilter;
    return matchesSearch && matchesLang && matchesAcc;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">Resident Profiles Directory (35 Seed Records)</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Synthetic civic resident registry configured with geographic locations, assigned transit routes, languages, and accessibility preferences.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, zone, or bus route..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-civic-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2"
          >
            <option value="All">All Languages</option>
            <option value="Tamil">Tamil</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Telugu">Telugu</option>
            <option value="Malayalam">Malayalam</option>
            <option value="French">French (Unsupported Edge Case)</option>
          </select>

          <select
            value={accessibilityFilter}
            onChange={e => setAccessibilityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2"
          >
            <option value="All">All Accessibility Needs</option>
            <option value="Standard">Standard</option>
            <option value="Large text">Large text</option>
            <option value="Screen reader friendly">Screen reader friendly</option>
            <option value="High contrast">High contrast</option>
            <option value="Easy-read">Easy-read</option>
            <option value="Audio-ready">Audio-ready</option>
            <option value="Unknown">Unknown (Missing Profile Edge Case)</option>
          </select>
        </div>
      </div>

      {/* Residents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200">
                <th className="p-3 font-bold border-b border-slate-700">Resident Name</th>
                <th className="p-3 font-bold border-b border-slate-700">Location & Zone</th>
                <th className="p-3 font-bold border-b border-slate-700">Coordinates</th>
                <th className="p-3 font-bold border-b border-slate-700">Route</th>
                <th className="p-3 font-bold border-b border-slate-700">Language</th>
                <th className="p-3 font-bold border-b border-slate-700">Accessibility</th>
                <th className="p-3 font-bold border-b border-slate-700">Edge Case Tag</th>
                <th className="p-3 font-bold border-b border-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredResidents.map(r => {
                const isMissingLoc = r.latitude === null;
                const isUnsupportedLang = r.preferredLanguage === 'French';
                const isUnknownAcc = r.accessibilityNeeds === 'Unknown';

                return (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{r.name}</td>
                    <td className="p-3">
                      <div>{r.location}</div>
                      <span className="text-[10px] font-semibold text-civic-700">{r.zone}</span>
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {r.latitude !== null ? `${r.latitude}, ${r.longitude}` : (
                        <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Null (Missing GPS)
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700">{r.assignedRoute}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold ${isUnsupportedLang ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-800'}`}>
                        {r.preferredLanguage}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold ${isUnknownAcc ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-100 text-slate-800'}`}>
                        {r.accessibilityNeeds}
                      </span>
                    </td>
                    <td className="p-3 text-[10px]">
                      {isMissingLoc && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Edge Case 1</span>}
                      {isUnsupportedLang && <span className="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Edge Case 2</span>}
                      {isUnknownAcc && <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">Edge Case 3</span>}
                      {!isMissingLoc && !isUnsupportedLang && !isUnknownAcc && <span className="text-slate-400 font-medium">Standard</span>}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          onSelectResident(r);
                          onNavigate('resident-view');
                        }}
                        className="bg-civic-600 hover:bg-civic-500 text-white font-bold px-2.5 py-1 rounded text-[11px] flex items-center gap-1 inline-flex"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Preview Phone</span>
                      </button>

                      <button
                        onClick={() => setEditingResident(r)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 rounded text-[11px] border"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Resident Modal */}
      {editingResident && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Edit Resident Profile: {editingResident.name}</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Language</label>
                <select
                  value={editingResident.preferredLanguage}
                  onChange={e => setEditingResident({ ...editingResident, preferredLanguage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2"
                >
                  <option value="Tamil">Tamil</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="French">French (Edge Case 2 Test)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accessibility Preference</label>
                <select
                  value={editingResident.accessibilityNeeds}
                  onChange={e => setEditingResident({ ...editingResident, accessibilityNeeds: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2"
                >
                  <option value="Standard">Standard</option>
                  <option value="Large text">Large text</option>
                  <option value="Screen reader friendly">Screen reader friendly</option>
                  <option value="High contrast">High contrast</option>
                  <option value="Easy-read">Easy-read</option>
                  <option value="Audio-ready">Audio-ready</option>
                  <option value="Unknown">Unknown (Edge Case 3 Test)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Bus Transit Route</label>
                <input
                  type="text"
                  value={editingResident.assignedRoute}
                  onChange={e => setEditingResident({ ...editingResident, assignedRoute: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t">
              <button
                onClick={() => setEditingResident(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-civic-600 hover:bg-civic-500 text-white font-bold rounded text-xs"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
