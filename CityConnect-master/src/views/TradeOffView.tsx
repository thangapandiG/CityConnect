import React from 'react';
import { Scale, Building2, Users, CheckCircle2 } from 'lucide-react';

export const TradeOffView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div>
        <div className="flex items-center space-x-2">
          <Scale className="w-6 h-6 text-civic-600" />
          <h1 className="text-2xl font-bold text-slate-900">Conflicting Stakeholder Trade-Off Analysis</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Detailed analysis of conflicting goals between city departments and residents (Requirement #6).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Stakeholder 1 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-3 border-b pb-3">
            <div className="p-2 bg-civic-50 text-civic-600 rounded-lg">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Stakeholder 1: City Departments</h2>
              <span className="text-xs text-slate-500">Roads, Water, Electricity, Public Works, Permits</span>
            </div>
          </div>

          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Primary Objectives</h3>
          <ul className="text-xs space-y-2 text-slate-600">
            <li className="flex items-center gap-2">✓ Standardized permit & disruption formats</li>
            <li className="flex items-center gap-2">✓ Fast, low-effort dispatch during emergency repairs</li>
            <li className="flex items-center gap-2">✓ Legal compliance & auditable communication log</li>
            <li className="flex items-center gap-2">✓ Minimal manual translation workload for department officers</li>
          </ul>
        </div>

        {/* Stakeholder 2 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-3 border-b pb-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Stakeholder 2: City Residents</h2>
              <span className="text-xs text-slate-500">Commuters, Families, Elderly, Persons with Disabilities</span>
            </div>
          </div>

          <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Primary Objectives</h3>
          <ul className="text-xs space-y-2 text-slate-600">
            <li className="flex items-center gap-2">✓ Highly relevant, location-specific warnings</li>
            <li className="flex items-center gap-2">✓ Transit route match awareness (e.g. Route 27 affected)</li>
            <li className="flex items-center gap-2">✓ Native language messages (Tamil, English, Hindi, etc.)</li>
            <li className="flex items-center gap-2">✓ WCAG accessibility formats (Large text, Screen Reader, Audio)</li>
          </ul>
        </div>

      </div>

      {/* Resolution Card */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-800 space-y-3">
        <h3 className="font-bold text-base text-amber-300">The Trade-off Resolution: Standardization + Personalization Architecture</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          CityConnect bridges this conflict by enforcing a standardized 6-part priority schema at the officer level (What, Where, When, Who/What Affected, Action, Contact). The intelligent backend then automatically transforms this standardized draft into personalized, multilingual, accessibility-ready messages tailored to each citizen's profile.
        </p>
      </div>

    </div>
  );
};
