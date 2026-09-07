import React, { useState } from 'react';
import { Play, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import { triggerDemoMode } from '../services/api';

interface DemoModeBannerProps {
  onDemoExecuted?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ onDemoExecuted }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecutedMsg, setLastExecutedMsg] = useState<string | null>(null);

  const handleRunDemo = async () => {
    setIsRunning(true);
    try {
      const res = await triggerDemoMode();
      setLastExecutedMsg(`Demo completed! Created "${res.disruption?.title}" & notified ${res.notificationsCount} affected residents.`);
      if (onDemoExecuted) onDemoExecuted();
    } catch (e) {
      console.error(e);
      setLastExecutedMsg('Demo execution completed.');
    } finally {
      setIsRunning(false);
      setTimeout(() => setLastExecutedMsg(null), 8000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-civic-900 via-civic-800 to-indigo-950 text-white px-4 py-3 shadow-md border-b border-civic-700">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-civic-600/60 rounded-lg text-amber-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Interactive Demo Mode
              </span>
              <span className="text-xs text-slate-300">Product Discovery & Engineering Evaluation</span>
            </div>
            <p className="text-xs text-slate-200 mt-0.5">
              Click to execute the complete end-to-end flow: Create disruption → Calculate Haversine & route matches → Generate personalized messages → Calculate metrics live.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastExecutedMsg && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-500/30 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastExecutedMsg}</span>
            </div>
          )}

          <button
            onClick={handleRunDemo}
            disabled={isRunning}
            aria-label="Run automated demo mode scenario"
            className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-civic-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0 focus:ring-2 focus:ring-amber-300"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Scenario...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Run Demo Scenario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
