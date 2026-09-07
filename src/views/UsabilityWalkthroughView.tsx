import React, { useState } from 'react';
import { HelpCircle, ArrowRight, CheckCircle2, Building2, MapPin, Users, Globe, Smartphone, BarChart3, Play } from 'lucide-react';
import { ActiveTab } from '../components/Navbar';
import { MobilePreview } from '../components/MobilePreview';
import { INITIAL_RESIDENTS, INITIAL_DISRUPTIONS } from '../data/mockData';

interface UsabilityWalkthroughViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onRunDemo: () => void;
}

export const UsabilityWalkthroughView: React.FC<UsabilityWalkthroughViewProps> = ({
  onNavigate,
  onRunDemo,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const dis = INITIAL_DISRUPTIONS[0]; // Anna Nagar Main Road Closure
  const resA = INITIAL_RESIDENTS[0]; // Arun Kumar: Tamil + Screen reader
  const resB = INITIAL_RESIDENTS[1]; // Priya Sharma: English + Large text
  const resC = INITIAL_RESIDENTS[2]; // Rajesh Patel: Hindi + Standard text

  const steps = [
    { number: 1, title: 'Officer Disruption Creation', desc: 'Department officer selects Anna Nagar Main Road Closure permit.' },
    { number: 2, title: 'Define Area, Routes & Timing', desc: 'Officer specifies 1.5km radius, Route 27/40/42, High Severity.' },
    { number: 3, title: 'Calculate Affected Residents', desc: 'System calculates Haversine distance and transit route overlaps.' },
    { number: 4, title: 'Personalize Communication', desc: 'Applies 6-part priority structure, 5 languages & WCAG formats.' },
    { number: 5, title: 'Compare Resident Examples', desc: 'Inspect 3 diverse citizens (Tamil/Screen Reader, English/Large, Hindi).' },
    { number: 6, title: 'Resident Receives Alert', desc: 'Delivered via SMS/App notification with audio playback.' },
    { number: 7, title: 'Collect Citizen Feedback', desc: 'Resident marks message as understandable and relevant.' },
    { number: 8, title: 'Dashboard Metrics Update', desc: 'Relevance, understandability, and timeliness metrics update live.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">End-to-End Usability Walkthrough Scenario</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            An 8-step visual walkthrough demonstrating the complete journey from city department officer permit entry to resident mobile receipt and feedback analytics.
          </p>
        </div>

        <button
          onClick={onRunDemo}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute Live Demo Scenario</span>
        </button>
      </div>

      {/* Step Navigation Indicator Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px]">
          {steps.map(s => {
            const isActive = activeStep === s.number;
            const isCompleted = activeStep > s.number;
            return (
              <button
                key={s.number}
                onClick={() => setActiveStep(s.number)}
                className="flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-civic-600 text-white ring-4 ring-civic-100 scale-110'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {isCompleted ? '✓' : s.number}
                </div>
                <span className={`text-[10px] mt-1.5 font-semibold text-center max-w-[80px] ${isActive ? 'text-civic-700 font-extrabold' : 'text-slate-500'}`}>
                  Step {s.number}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Showcase Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs font-bold text-civic-600 uppercase tracking-wider">
              Step {activeStep} of 8: {steps[activeStep - 1].title}
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">{steps[activeStep - 1].desc}</h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              className="px-3 py-1.5 bg-slate-100 disabled:opacity-40 text-slate-700 font-semibold rounded text-xs"
            >
              Previous
            </button>
            <button
              disabled={activeStep === 8}
              onClick={() => setActiveStep(Math.min(8, activeStep + 1))}
              className="px-4 py-1.5 bg-civic-600 hover:bg-civic-500 text-white font-bold rounded text-xs flex items-center gap-1"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step 5 Special Display: 3 Resident Examples */}
        {activeStep === 5 ? (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Step 5 Resident Examples Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Resident A */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{resA.name} (Resident A)</h4>
                  <span className="bg-civic-100 text-civic-800 text-[10px] font-bold px-2 py-0.5 rounded">Tamil + Screen Reader</span>
                </div>
                <MobilePreview resident={resA} disruption={dis} />
              </div>

              {/* Resident B */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{resB.name} (Resident B)</h4>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">English + Large Text</span>
                </div>
                <MobilePreview resident={resB} disruption={dis} />
              </div>

              {/* Resident C */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{resC.name} (Resident C)</h4>
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Hindi + Standard</span>
                </div>
                <MobilePreview resident={resC} disruption={dis} />
              </div>

            </div>
          </div>
        ) : (
          /* General Step Illustration */
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-xs space-y-3">
            <p className="text-slate-700 leading-relaxed text-sm">
              {activeStep === 1 && 'The Roads & Transport Officer initiates a new permit entry titled "Anna Nagar Main Road Closure".'}
              {activeStep === 2 && 'Officer specifies affected zone: Anna Nagar, routes: Route 27, 40, 42, radius: 1.5 km, time: 10:00 AM–4:00 PM.'}
              {activeStep === 3 && 'The matching engine computes Haversine distance for 35 seed citizens and matches 5 affected residents.'}
              {activeStep === 4 && 'Messages are structured into 6 priority blocks and translated into native Tamil, English, and Hindi.'}
              {activeStep === 6 && 'Alerts are dispatched over SMS/App notification with optional Web Speech audio playback.'}
              {activeStep === 7 && 'Citizens click "Yes" on understandability and relevance feedback buttons.'}
              {activeStep === 8 && 'Dashboard updates metric scores live: Relevance: 94%, Understandability: 92%, Timeliness: 96%.'}
            </p>

            <div className="pt-3">
              <button
                onClick={() => onNavigate(activeStep === 8 ? 'dashboard' : 'resident-view')}
                className="bg-civic-600 text-white font-bold px-4 py-2 rounded text-xs"
              >
                Go to Live View for Step {activeStep}
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
