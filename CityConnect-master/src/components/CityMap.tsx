import React, { useState } from 'react';
import { MapPin, Navigation, Info, Table, Map, AlertCircle, Layers } from 'lucide-react';
import { Disruption, Resident } from '../types';
import { matchResidentsToDisruption } from '../services/matchingEngine';

interface CityMapProps {
  disruptions: Disruption[];
  residents: Resident[];
  selectedDisruptionId?: string;
  onSelectDisruption?: (id: string) => void;
}

export const CityMap: React.FC<CityMapProps> = ({
  disruptions,
  residents,
  selectedDisruptionId,
  onSelectDisruption,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [activeDisruptionId, setActiveDisruptionId] = useState<string>(
    selectedDisruptionId || disruptions[0]?.id || ''
  );
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);

  const activeDisruption = disruptions.find(d => d.id === activeDisruptionId) || disruptions[0];

  const matchData = activeDisruption
    ? matchResidentsToDisruption(activeDisruption, residents)
    : { matches: [], affectedResidents: [], unaffectedResidents: [] };

  const handleDisruptionChange = (id: string) => {
    setActiveDisruptionId(id);
    setSelectedResident(null);
    if (onSelectDisruption) onSelectDisruption(id);
  };

  // Map zone coordinate projections for SVG visualizer
  const zoneCoords: Record<string, { x: number; y: number }> = {
    'Anna Nagar': { x: 300, y: 150 },
    'Adyar': { x: 550, y: 480 },
    'T Nagar': { x: 450, y: 300 },
    'Velachery': { x: 420, y: 550 },
    'Tambaram': { x: 180, y: 650 },
    'Porur': { x: 180, y: 320 },
    'OMR': { x: 500, y: 620 },
    'Mylapore': { x: 560, y: 350 },
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      {/* Map Control Bar */}
      <div className="bg-slate-900 text-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-civic-400" />
            <h3 className="font-bold text-base">City Disruption & Resident Map Visualizer</h3>
          </div>
          <p className="text-xs text-slate-300">
            Interactive zone visualization displaying disruption radii, affected transit routes, and resident match status.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Disruption Dropdown */}
          <select
            value={activeDisruptionId}
            onChange={e => handleDisruptionChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-civic-400"
          >
            {disruptions.map(d => (
              <option key={d.id} value={d.id}>
                {d.title} ({d.affectedArea})
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="bg-slate-800 p-1 rounded-lg flex text-xs border border-slate-700">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center space-x-1 px-3 py-1 rounded font-bold transition-all ${
                viewMode === 'map' ? 'bg-civic-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1 px-3 py-1 rounded font-bold transition-all ${
                viewMode === 'table' ? 'bg-civic-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Accessible Table View"
            >
              <Table className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs flex flex-wrap items-center gap-4 text-slate-700">
        <span className="font-bold text-slate-900">Map Legend:</span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block border border-white shadow-sm"></span>
          Location Radius Match
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block border border-white shadow-sm"></span>
          Route Match
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block border border-white shadow-sm"></span>
          Location & Route Match
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-slate-500 inline-block border border-white shadow-sm"></span>
          Location Unknown (Fallback)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-white shadow-sm"></span>
          Unaffected
        </span>
      </div>

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-[520px] bg-slate-950 overflow-hidden select-none">
          {/* Interactive Canvas/SVG Grid Map */}
          <svg className="w-full h-full" viewBox="0 0 800 750">
            {/* Background Grid & Water/Land styling */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#0f172a" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated Coastline / Bay of Bengal */}
            <path
              d="M 680 0 Q 640 250 670 450 T 630 750 L 800 750 L 800 0 Z"
              fill="#0284c7"
              fillOpacity="0.2"
              stroke="#0369a1"
              strokeWidth="2"
            />
            <text x="710" y="380" fill="#38bdf8" fontSize="12" fontWeight="bold" opacity="0.6" transform="rotate(90 710 380)">
              BAY OF BENGAL
            </text>

            {/* City Zone Landmarks */}
            {Object.entries(zoneCoords).map(([zone, coords]) => (
              <g key={zone} transform={`translate(${coords.x}, ${coords.y})`}>
                <circle r="6" fill="#334155" stroke="#64748b" strokeWidth="1" />
                <text x="10" y="4" fill="#94a3b8" fontSize="11" fontWeight="bold">
                  {zone}
                </text>
              </g>
            ))}

            {/* Active Disruption Radius Circle */}
            {activeDisruption && (
              <g transform={`translate(${zoneCoords[activeDisruption.affectedArea]?.x || 400}, ${zoneCoords[activeDisruption.affectedArea]?.y || 350})`}>
                {/* Outer animated pulses */}
                <circle
                  r={activeDisruption.radius * 45}
                  fill="#ef4444"
                  fillOpacity="0.15"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
                <circle
                  r="12"
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
                <text x="0" y="-18" textAnchor="middle" fill="#fecdd3" fontSize="12" fontWeight="extrabold">
                  ⚠️ {activeDisruption.title}
                </text>
              </g>
            )}

            {/* Render Resident Pin Markers */}
            {matchData.matches.map((m, idx) => {
              const res = m.resident;
              const baseZone = zoneCoords[res.zone] || { x: 400, y: 350 };
              
              // Add slight deterministic jitter so residents in same zone don't overlap
              const offsetX = ((idx * 37) % 70) - 35;
              const offsetY = ((idx * 23) % 70) - 35;
              const px = (res.latitude && res.longitude) ? baseZone.x + offsetX : baseZone.x + 50;
              const py = (res.latitude && res.longitude) ? baseZone.y + offsetY : baseZone.y + 50;

              let fillColor = '#10b981'; // Unaffected (green)
              if (m.matchType === 'Both') fillColor = '#4f46e5'; // Both (indigo)
              else if (m.matchType === 'Location') fillColor = '#dc2626'; // Location (red)
              else if (m.matchType === 'Route') fillColor = '#f59e0b'; // Route (amber)
              else if (m.matchType === 'Location Unknown Fallback') fillColor = '#64748b'; // Gray

              const isSelected = selectedResident?.id === res.id;

              return (
                <g
                  key={res.id}
                  transform={`translate(${px}, ${py})`}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onClick={() => setSelectedResident(res)}
                >
                  <circle
                    r={isSelected ? 10 : 7}
                    fill={fillColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 3 : 1.5}
                    className="shadow-lg"
                  />
                  {isSelected && (
                    <circle r="16" fill="none" stroke={fillColor} strokeWidth="2" className="animate-ping" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Selected Resident Floating Detail Box */}
          {selectedResident && (
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 bg-slate-900/95 border border-slate-700 text-white rounded-xl p-4 shadow-2xl backdrop-blur-md animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-sm text-civic-300">{selectedResident.name}</span>
                <button
                  onClick={() => setSelectedResident(null)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs space-y-1.5 mt-2">
                <p><span className="text-slate-400">Zone:</span> <strong className="text-slate-200">{selectedResident.zone}</strong></p>
                <p><span className="text-slate-400">Assigned Transit Route:</span> <strong className="text-amber-400">{selectedResident.assignedRoute}</strong></p>
                <p><span className="text-slate-400">Preferred Language:</span> <strong className="text-slate-200">{selectedResident.preferredLanguage}</strong></p>
                <p><span className="text-slate-400">Accessibility Needs:</span> <strong className="text-slate-200">{selectedResident.accessibilityNeeds}</strong></p>
                
                {/* Match Status Badge */}
                {(() => {
                  const match = matchData.matches.find(m => m.resident.id === selectedResident.id);
                  if (!match || match.matchType === 'None') {
                    return (
                      <span className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-bold text-[10px] mt-1">
                        ✓ Unaffected Resident
                      </span>
                    );
                  }
                  return (
                    <span className="inline-block bg-rose-950 text-rose-300 border border-rose-700 px-2 py-0.5 rounded font-bold text-[10px] mt-1">
                      ⚠️ Affected ({match.matchType} Match)
                    </span>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Accessible Tabular View for WCAG compliance */
        <div className="p-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200">
                <th className="p-2.5 font-bold border-b border-slate-700">Resident Name</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Zone</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Route</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Coordinates</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Language</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Accessibility</th>
                <th className="p-2.5 font-bold border-b border-slate-700">Disruption Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {matchData.matches.map(m => (
                <tr key={m.resident.id} className="hover:bg-slate-50">
                  <td className="p-2.5 font-medium">{m.resident.name}</td>
                  <td className="p-2.5">{m.resident.zone}</td>
                  <td className="p-2.5 font-mono text-slate-600">{m.resident.assignedRoute}</td>
                  <td className="p-2.5 font-mono text-slate-500 text-[11px]">
                    {m.resident.latitude ? `${m.resident.latitude.toFixed(4)}, ${m.resident.longitude?.toFixed(4)}` : 'Null (Edge Case 1)'}
                  </td>
                  <td className="p-2.5">{m.resident.preferredLanguage}</td>
                  <td className="p-2.5">{m.resident.accessibilityNeeds}</td>
                  <td className="p-2.5 font-bold">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        m.matchType === 'None'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.matchType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
