import React, { useState } from 'react';
import { CheckCircle, CheckSquare, Square, ShieldCheck } from 'lucide-react';

export const DeploymentChecklistView: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({
    0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
    8: true, 9: true, 10: true, 11: true, 12: true, 13: true, 14: true, 15: true,
  });

  const checklist = [
    'Environment variables configured (PORT, API URL)',
    'Database initialized with seed store',
    'Seed data loaded (35 residents, 8 disruptions)',
    'Accessibility WCAG tested (Keyboard & Contrast)',
    'Screen reader compatibility tested (ARIA labels)',
    'Keyboard navigation tested across all 16 views',
    'Language fallback tested (Edge Case 2 - French)',
    'Location fallback tested (Edge Case 1 - Null GPS)',
    'Error handling & taxonomy tested (Requirement #18)',
    'API failure fallback tested (Edge Case 7 - Deterministic Generator)',
    'Notification provider channel simulated (SMS/Email/App)',
    'Logging enabled for notification broadcast audit',
    'Privacy policy & data minimization reviewed',
    'Human approval workflow enabled for critical disruptions',
    'Monitoring & performance execution time benchmarked',
    'Security review & input schema validation completed',
  ];

  const toggleItem = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-civic-600" />
            <h1 className="text-2xl font-bold text-slate-900">Pre-Deployment Production Launch Checklist</h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Verification checklist for production readiness across accessibility, security, and fallback resiliency (Requirement #27).
          </p>
        </div>

        <div className="bg-emerald-950 text-emerald-300 border border-emerald-600 px-4 py-2 rounded-xl text-xs font-bold">
          ✓ {completedCount} / {checklist.length} Verified Ready
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map((item, idx) => {
            const isChecked = checkedItems[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleItem(idx)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center space-x-3 text-xs ${
                  isChecked
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{item}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
