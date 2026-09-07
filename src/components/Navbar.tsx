import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Bell, 
  Smartphone, 
  BarChart3, 
  AlertTriangle, 
  MapPin, 
  FileText, 
  CheckSquare, 
  CheckCircle, 
  ShieldCheck, 
  HelpCircle,
  Menu, 
  X,
  Type,
  Sun,
  Moon,
  Layers,
  Scale
} from 'lucide-react';

export type ActiveTab = 
  | 'overview'
  | 'dashboard'
  | 'create-disruption'
  | 'disruptions'
  | 'residents'
  | 'notifications'
  | 'resident-view'
  | 'walkthrough'
  | 'city-map'
  | 'experiment'
  | 'error-analysis'
  | 'automated-tests'
  | 'trade-off'
  | 'ethics'
  | 'deployment'
  | 'final-review';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  highContrast,
  setHighContrast,
  fontSize,
  setFontSize,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'dashboard', label: 'Dept Dashboard', icon: Building2 },
    { id: 'create-disruption', label: 'Create Disruption', icon: PlusCircle },
    { id: 'disruptions', label: 'Disruptions', icon: Layers },
    { id: 'residents', label: 'Residents', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'resident-view', label: 'Resident View', icon: Smartphone },
    { id: 'walkthrough', label: 'Walkthrough', icon: HelpCircle },
    { id: 'city-map', label: 'City Map', icon: MapPin },
    { id: 'experiment', label: 'Experiment & Metrics', icon: BarChart3 },
    { id: 'error-analysis', label: 'Error Analysis', icon: AlertTriangle },
    { id: 'automated-tests', label: 'Logic Tests', icon: CheckSquare },
    { id: 'trade-off', label: 'Stakeholder Trade-off', icon: Scale },
    { id: 'ethics', label: 'Ethics', icon: ShieldCheck },
    { id: 'deployment', label: 'Deployment Checklist', icon: CheckCircle },
    { id: 'final-review', label: 'Final Review', icon: FileText },
  ];

  const handleNavClick = (id: ActiveTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-civic-500 to-civic-700 flex items-center justify-center text-white shadow-md font-bold text-xl">
              C
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-white tracking-tight">CityConnect</span>
                <span className="text-xs bg-civic-800 text-civic-300 px-2 py-0.5 rounded font-mono border border-civic-700">v1.0</span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Location, Language & Accessibility Disruption Service</p>
            </div>
          </div>

          {/* Quick Accessibility Toolbar & Mobile Toggle */}
          <div className="flex items-center space-x-3">
            {/* Font Size Scaling Controls */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 text-xs text-slate-300">
              <span className="px-2 font-medium flex items-center gap-1">
                <Type className="w-3.5 h-3.5" /> Text Size
              </span>
              <button 
                onClick={() => setFontSize(Math.max(90, fontSize - 5))}
                className="px-2 py-0.5 hover:bg-slate-700 rounded text-slate-200 font-bold"
                title="Decrease Text Size"
              >
                A-
              </button>
              <span className="px-1 text-slate-400 font-mono text-[10px]">{fontSize}%</span>
              <button 
                onClick={() => setFontSize(Math.min(130, fontSize + 5))}
                className="px-2 py-0.5 hover:bg-slate-700 rounded text-slate-200 font-bold"
                title="Increase Text Size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                highContrast
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle High Contrast WCAG Mode"
              aria-label="Toggle High Contrast Mode"
            >
              {highContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{highContrast ? 'High Contrast ON' : 'High Contrast'}</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Navigation Desktop Bar */}
      <nav className="hidden md:block bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 py-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-civic-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium ${
                  isActive
                    ? 'bg-civic-600 text-white font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
