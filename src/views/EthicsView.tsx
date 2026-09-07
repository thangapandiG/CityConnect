import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Eye, Users, AlertTriangle } from 'lucide-react';

export const EthicsView: React.FC = () => {
  const items = [
    { title: 'Privacy & Data Minimization', desc: 'Only collect location coordinates necessary for disruption relevance. Do not store sensitive personal history.' },
    { title: 'Accessibility Compliance', desc: 'Accessibility is a core civil right. Never treat screen reader or large text support as optional.' },
    { title: 'Language Fairness', desc: 'Avoid disadvantaging non-English speaking citizens by providing native Tamil, Hindi, Telugu & Malayalam support.' },
    { title: 'AI Transparency & Attribution', desc: 'Disruption alerts generated or assisted by AI models are clearly labeled with human review status.' },
    { title: 'Human-in-the-Loop Oversight', desc: 'Critical city disruption notifications require explicit supervisor officer approval before broadcast.' },
    { title: 'Algorithmic Bias Testing', desc: 'Regular auditing to ensure language fallback rates remain balanced across demographic groups.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-civic-600" />
          <h1 className="text-2xl font-bold text-slate-900">Ethics, Privacy & AI Transparency Principles</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Ethical guidelines and governance protocols implemented in CityConnect (Requirement #25).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center space-x-2 text-civic-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
