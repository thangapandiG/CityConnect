import React from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Eye, 
  ShieldCheck, 
  BarChart3, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Users 
} from 'lucide-react';
import { ActiveTab } from '../components/Navbar';

interface OverviewViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onRunDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate, onRunDemo }) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-civic-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-8 shadow-xl overflow-hidden border border-civic-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-civic-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-civic-800/80 text-civic-200 px-3 py-1 rounded-full text-xs font-semibold border border-civic-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Product Discovery & Engineering Challenge Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            CityConnect – Location, Language & Accessibility-Aware Public Disruption Communication Service
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A civic communication platform that replaces generic broadcast messages with location-targeted, transit-route matched, multilingual, and accessibility-formatted notifications for city service disruptions.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onRunDemo}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Run Automated Demo Mode</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-civic-600 hover:bg-civic-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center space-x-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Department Dashboard</span>
            </button>

            <button
              onClick={() => onNavigate('resident-view')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all border border-slate-700 flex items-center space-x-2"
            >
              <Users className="w-4 h-4 text-civic-400" />
              <span>Resident Mobile View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Problem vs Solution Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem Card */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-700">
              <Layers className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-rose-950">1. The Problem Statement</h2>
          </div>
          <p className="text-xs text-rose-900 leading-relaxed mb-4">
            City permits issued by multiple departments send generic broadcast messages that fail to adapt to resident locations, transit routes, preferred languages, or accessibility needs.
          </p>
          <ul className="text-xs space-y-2 text-rose-900">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Unnecessary Panic:</strong> Residents living 15 km away receive irrelevant road closure notices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Language Barriers:</strong> English-only broadcasts leave non-English speakers uninformed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">✗</span>
              <span><strong>Accessibility Exclusions:</strong> Screen reader users and elderly citizens struggle with plain dense text.</span>
            </li>
          </ul>
        </div>

        {/* Solution Card */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-emerald-950">2. The CityConnect Solution</h2>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed mb-4">
            An end-to-end intelligent disruption communication service that dynamically matches affected citizens and delivers personalized, accessible messages.
          </p>
          <ul className="text-xs space-y-2 text-emerald-900">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Haversine & Transit Matching:</strong> Matches coordinates & bus routes (e.g. Route 27).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>5 Multilingual Engines:</strong> Tamil, English, Hindi, Telugu, Malayalam.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>6-Part Priority Structure:</strong> Clear What, Where, When, Who, Action & Contact.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Core Feature Matrix */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Core System Architecture Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-civic-50 rounded-lg flex items-center justify-center text-civic-600 mb-2">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Location-Aware Engine</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates Haversine distance and transit route intersections for 35+ seed residents in Chennai zones.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-civic-50 rounded-lg flex items-center justify-center text-civic-600 mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Multilingual Generator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Adapts messaging into Tamil, Hindi, Telugu, Malayalam & English with automatic language fallback.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-civic-50 rounded-lg flex items-center justify-center text-civic-600 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Accessibility Formats</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supports Standard, Large Text, High Contrast, Screen Reader, Easy-Read & Web Speech Audio-Ready 🔊.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-civic-50 rounded-lg flex items-center justify-center text-civic-600 mb-2">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Baseline vs Prototype</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Measures relevance (94% vs 58%), understandability, timeliness, coverage, and error taxonomy live.
            </p>
          </div>

        </div>
      </div>

      {/* Edge Cases Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>7 Verified Edge / Failure Cases Implemented</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Handles missing GPS location, unsupported resident language selection, missing accessibility profile, overlapping disruptions, expired events, invalid radius inputs, and API fallback gracefully.
            </p>
          </div>
          <button
            onClick={() => onNavigate('automated-tests')}
            className="bg-civic-600 hover:bg-civic-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-all shrink-0"
          >
            <span>Run Logic Test Suite</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
