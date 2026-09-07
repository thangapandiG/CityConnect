import React, { useState, useEffect } from 'react';
import { PlusCircle, MapPin, AlertCircle, CheckCircle, ShieldCheck, RefreshCw } from 'lucide-react';
import { Department, DisruptionType, SeverityLevel, Resident } from '../types';
import { getDepartments, getResidents, createDisruption } from '../services/api';
import { matchResidentsToDisruption } from '../services/matchingEngine';
import { ActiveTab } from '../components/Navbar';

interface CreateDisruptionViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onDisruptionCreated?: (id: string) => void;
}

export const CreateDisruptionView: React.FC<CreateDisruptionViewProps> = ({
  onNavigate,
  onDisruptionCreated,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Roads & Transport');
  const [disruptionType, setDisruptionType] = useState<DisruptionType>('Road closure');
  const [description, setDescription] = useState('');
  const [affectedArea, setAffectedArea] = useState('Anna Nagar');
  const [routesInput, setRoutesInput] = useState('Route 27, Route 40');
  const [latitude, setLatitude] = useState<number>(13.0850);
  const [longitude, setLongitude] = useState<number>(80.2120);
  const [radius, setRadius] = useState<number>(1.5);
  const [startTime, setStartTime] = useState<string>(new Date().toISOString().substring(0, 16));
  const [endTime, setEndTime] = useState<string>(new Date(Date.now() + 6 * 3600 * 1000).toISOString().substring(0, 16));
  const [severity, setSeverity] = useState<SeverityLevel>('High');
  const [requiresApproval, setRequiresApproval] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getDepartments().then(setDepartments);
    getResidents().then(setResidents);
  }, []);

  const affectedRoutes = routesInput.split(',').map(r => r.trim()).filter(Boolean);

  // Live Match Calculation
  const tempDisruption = {
    id: 'temp',
    title,
    department,
    disruptionType,
    description,
    affectedArea,
    affectedRoutes,
    latitude: Number(latitude),
    longitude: Number(longitude),
    radius: Number(radius),
    startTime,
    endTime,
    severity,
    status: 'Active' as const,
  };

  const matchSummary = matchResidentsToDisruption(tempDisruption, residents);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !affectedArea) {
      setErrorMsg('Please enter a Title and Affected Area.');
      return;
    }

    if (radius <= 0) {
      setErrorMsg('Edge Case 6: Radius must be a positive number greater than 0.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const created = await createDisruption({
        title,
        department,
        disruptionType,
        description: description || `Public disruption in ${affectedArea}.`,
        affectedArea,
        affectedRoutes,
        latitude: Number(latitude),
        longitude: Number(longitude),
        radius: Number(radius),
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        severity,
        status: requiresApproval ? 'Pending Review' : 'Active',
        requiresApproval,
        approvedBy: requiresApproval ? null : 'Officer Duty Sign-off',
      });

      if (onDisruptionCreated) onDisruptionCreated(created.id);
      onNavigate('dashboard');
    } catch (e) {
      setErrorMsg('Failed to create disruption.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      <div>
        <div className="flex items-center space-x-2">
          <PlusCircle className="w-6 h-6 text-civic-600" />
          <h1 className="text-2xl font-bold text-slate-900">Create New City Service Disruption Permit</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Issue a new public disruption permit. The location matching engine will automatically calculate affected citizens and routes.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issuing Department</label>
              <select
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-civic-500"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Disruption Type</label>
              <select
                value={disruptionType}
                onChange={e => setDisruptionType(e.target.value as DisruptionType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-civic-500"
              >
                <option value="Road closure">Road closure</option>
                <option value="Road construction">Road construction</option>
                <option value="Water interruption">Water interruption</option>
                <option value="Electricity interruption">Electricity interruption</option>
                <option value="Public event">Public event</option>
                <option value="Permit-related closure">Permit-related closure</option>
                <option value="Utility work">Utility work</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Disruption Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Anna Nagar Main Road Culvert Repair"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-civic-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              placeholder="Provide context regarding the work..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-civic-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Zone / Area</label>
              <input
                type="text"
                required
                value={affectedArea}
                onChange={e => setAffectedArea(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-civic-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Affected Transit Routes (Comma separated)</label>
              <input
                type="text"
                value={routesInput}
                onChange={e => setRoutesInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-civic-500"
              />
            </div>
          </div>

          {/* Coordinates & Radius */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-civic-600" />
              Geographic Coordinates & Radius (Haversine Match)
            </h4>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={e => setLatitude(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={e => setLongitude(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Radius (km)</label>
                <input
                  type="number"
                  step="0.1"
                  value={radius}
                  onChange={e => setRadius(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Timing & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as SeverityLevel)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Section 26: Human Approval Workflow Toggle */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">Human Approval Required</span>
                <span className="text-[11px] text-amber-800">Require supervisor officer review before broadcast dispatch.</span>
              </div>
            </div>

            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={e => setRequiresApproval(e.target.checked)}
              className="w-4 h-4 text-civic-600 rounded focus:ring-civic-500"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-civic-600 hover:bg-civic-500 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow"
            >
              {isSubmitting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Issue & Broadcast Disruption</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Live Matching Impact Sidebar */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4 h-fit sticky top-20">
          <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
            <span>Live Impact Radius Calculator</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Citizens</span>
              <p className="text-2xl font-extrabold text-white">{matchSummary.totalResidents}</p>
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Affected Residents</span>
              <p className="text-2xl font-extrabold text-rose-400">{matchSummary.affectedCount} ({matchSummary.affectedPercentage}%)</p>
            </div>

            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Unaffected Residents</span>
              <p className="text-2xl font-extrabold text-emerald-400">{matchSummary.unaffectedCount}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 space-y-1">
            <p><strong>Haversine Formula:</strong> Active on ({latitude}, {longitude}) with radius {radius} km.</p>
            <p><strong>Transit Routes:</strong> {affectedRoutes.join(', ') || 'None'}</p>
          </div>
        </div>

      </div>

    </div>
  );
};
