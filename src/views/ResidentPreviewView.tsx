import React, { useState, useEffect } from 'react';
import { Smartphone, Users, Layers, Info } from 'lucide-react';
import { Resident, Disruption } from '../types';
import { getResidents, getDisruptions } from '../services/api';
import { MobilePreview } from '../components/MobilePreview';

interface ResidentPreviewViewProps {
  selectedResidentId?: string;
  selectedDisruptionId?: string;
}

export const ResidentPreviewView: React.FC<ResidentPreviewViewProps> = ({
  selectedResidentId,
  selectedDisruptionId,
}) => {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [disruptions, setDisruptions] = useState<Disruption[]>([]);
  const [activeResidentId, setActiveResidentId] = useState<string>(selectedResidentId || '');
  const [activeDisruptionId, setActiveDisruptionId] = useState<string>(selectedDisruptionId || '');

  useEffect(() => {
    Promise.all([getResidents(), getDisruptions()]).then(([rList, dList]) => {
      setResidents(rList);
      setDisruptions(dList);
      if (!activeResidentId && rList.length > 0) setActiveResidentId(rList[0].id);
      if (!activeDisruptionId && dList.length > 0) setActiveDisruptionId(dList[0].id);
    });
  }, []);

  const activeResident = residents.find(r => r.id === activeResidentId) || residents[0];
  const activeDisruption = disruptions.find(d => d.id === activeDisruptionId) || disruptions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">Resident Smartphone Message Preview Simulator</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Test and observe what individual citizens see on their mobile devices based on their location, transit route, language, and WCAG accessibility preferences.
          </p>
        </div>

        {/* Resident & Disruption Switcher Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Select Resident Profile</label>
            <select
              value={activeResidentId}
              onChange={e => setActiveResidentId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-civic-500"
            >
              {residents.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.preferredLanguage} / {r.accessibilityNeeds})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Select Disruption Permit</label>
            <select
              value={activeDisruptionId}
              onChange={e => setActiveDisruptionId(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-civic-500"
            >
              {disruptions.map(d => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.affectedArea})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeResident && activeDisruption ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Smartphone Simulator */}
          <div className="lg:col-span-1 flex justify-center">
            <MobilePreview resident={activeResident} disruption={activeDisruption} />
          </div>

          {/* Profile Context & Analysis Card */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Quick Profile Overview */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 border-b pb-2">
                Active Profile Context: {activeResident.name}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Zone / Location</span>
                  <strong className="text-slate-900">{activeResident.location} ({activeResident.zone})</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Assigned Bus Route</span>
                  <strong className="text-civic-700 font-mono">{activeResident.assignedRoute}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Preferred Language</span>
                  <strong className="text-slate-900">{activeResident.preferredLanguage}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Accessibility Requirement</span>
                  <strong className="text-slate-900">{activeResident.accessibilityNeeds}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">Notification Channel</span>
                  <strong className="text-slate-900">{activeResident.notificationChannel}</strong>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-bold">GPS Coordinates</span>
                  <strong className="font-mono text-slate-700">
                    {activeResident.latitude !== null ? `${activeResident.latitude}, ${activeResident.longitude}` : 'Null (Missing Location Edge Case 1)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Why This Person Received This Message Explanation */}
            <div className="bg-civic-50 border border-civic-200 p-5 rounded-xl text-xs space-y-2 text-civic-950">
              <h4 className="font-bold text-sm text-civic-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-civic-600" />
                Intelligent Personalization Rationale
              </h4>
              <p className="leading-relaxed">
                CityConnect matched <strong>{activeResident.name}</strong> to <strong>"{activeDisruption.title}"</strong> because:
              </p>
              <ul className="list-disc pl-5 space-y-1 font-medium text-civic-900">
                <li>
                  {activeResident.latitude !== null ? (
                    `Geographic Haversine distance from disruption center (${activeDisruption.latitude}, ${activeDisruption.longitude}) is within ${activeDisruption.radius} km radius.`
                  ) : (
                    `Missing GPS coordinates triggered Edge Case 1 fallback: Resident's assigned route (${activeResident.assignedRoute}) matches affected permit route list.`
                  )}
                </li>
                <li>
                  Native language generator translated the priority alert into <strong>{activeResident.preferredLanguage}</strong>.
                </li>
                <li>
                  Applied <strong>{activeResident.accessibilityNeeds}</strong> formatting with ARIA landmarks and speech synthesis compatibility.
                </li>
              </ul>
            </div>

          </div>

        </div>
      ) : null}

    </div>
  );
};
