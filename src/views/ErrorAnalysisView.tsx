import React, { useState, useEffect } from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { ErrorCategorySummary } from '../types';
import { getMetrics } from '../services/api';

export const ErrorAnalysisView: React.FC = () => {
  const [errorSummaries, setErrorSummaries] = useState<ErrorCategorySummary[]>([]);

  useEffect(() => {
    getMetrics().then(res => setErrorSummaries(res.errorSummaries));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <h1 className="text-2xl font-bold text-slate-900">System Error Categorization & Failure Taxonomy Analysis</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Detailed error breakdown analyzing edge case fallbacks, data gaps, and system recommendations (Requirement #18).
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm">Categorized Error Taxonomy Table</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-200">
                <th className="p-3 font-bold border-b border-slate-700">Error Category</th>
                <th className="p-3 font-bold border-b border-slate-700">Count / %</th>
                <th className="p-3 font-bold border-b border-slate-700">Real Example</th>
                <th className="p-3 font-bold border-b border-slate-700">Root Cause</th>
                <th className="p-3 font-bold border-b border-slate-700">Recommended Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
              {errorSummaries.map((err, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">{err.category}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-slate-800">
                      {err.count} ({err.percentage}%)
                    </span>
                  </td>
                  <td className="p-3 font-mono text-civic-700 text-[11px]">{err.example}</td>
                  <td className="p-3 text-slate-600 max-w-xs">{err.cause}</td>
                  <td className="p-3 text-emerald-800 font-semibold max-w-xs">{err.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
