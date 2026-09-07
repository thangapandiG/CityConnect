import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DemoModeBanner } from './components/DemoModeBanner';

import { OverviewView } from './views/OverviewView';
import { DepartmentDashboardView } from './views/DepartmentDashboardView';
import { CreateDisruptionView } from './views/CreateDisruptionView';
import { DisruptionsView } from './views/DisruptionsView';
import { ResidentsView } from './views/ResidentsView';
import { NotificationsView } from './views/NotificationsView';
import { ResidentPreviewView } from './views/ResidentPreviewView';
import { UsabilityWalkthroughView } from './views/UsabilityWalkthroughView';
import { CityMapView } from './views/CityMapView';
import { ExperimentView } from './views/ExperimentView';
import { ErrorAnalysisView } from './views/ErrorAnalysisView';
import { AutomatedTestsView } from './views/AutomatedTestsView';
import { TradeOffView } from './views/TradeOffView';
import { EthicsView } from './views/EthicsView';
import { DeploymentChecklistView } from './views/DeploymentChecklistView';
import { FinalReviewView } from './views/FinalReviewView';

import { Resident } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);

  const [selectedDisruptionId, setSelectedDisruptionId] = useState<string | undefined>();
  const [selectedResident, setSelectedResident] = useState<Resident | undefined>();

  // Apply font size scaling to root document element
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', `${fontSize}%`);
  }, [fontSize]);

  // Handle Demo Execution Refresh
  const handleDemoExecuted = () => {
    // Refresh view state or navigate to dashboard to show live updated metrics
    setActiveTab('dashboard');
  };

  const handleSelectDisruption = (id: string) => {
    setSelectedDisruptionId(id);
    setActiveTab('resident-view');
  };

  const handleSelectResident = (res: Resident) => {
    setSelectedResident(res);
    setActiveTab('resident-view');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${highContrast ? 'high-contrast-mode' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Sticky Top Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        fontSize={fontSize}
        setFontSize={setFontSize}
      />

      {/* Sticky Demo Mode Banner for Reviewers */}
      <DemoModeBanner onDemoExecuted={handleDemoExecuted} />

      {/* Main Page View Router Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'overview' && (
          <OverviewView
            onNavigate={setActiveTab}
            onRunDemo={handleDemoExecuted}
          />
        )}

        {activeTab === 'dashboard' && (
          <DepartmentDashboardView
            onNavigate={setActiveTab}
            onSelectDisruption={handleSelectDisruption}
          />
        )}

        {activeTab === 'create-disruption' && (
          <CreateDisruptionView
            onNavigate={setActiveTab}
            onDisruptionCreated={handleSelectDisruption}
          />
        )}

        {activeTab === 'disruptions' && (
          <DisruptionsView
            onNavigate={setActiveTab}
            onSelectDisruption={handleSelectDisruption}
          />
        )}

        {activeTab === 'residents' && (
          <ResidentsView
            onNavigate={setActiveTab}
            onSelectResident={handleSelectResident}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView />
        )}

        {activeTab === 'resident-view' && (
          <ResidentPreviewView
            selectedResidentId={selectedResident?.id}
            selectedDisruptionId={selectedDisruptionId}
          />
        )}

        {activeTab === 'walkthrough' && (
          <UsabilityWalkthroughView
            onNavigate={setActiveTab}
            onRunDemo={handleDemoExecuted}
          />
        )}

        {activeTab === 'city-map' && (
          <CityMapView />
        )}

        {activeTab === 'experiment' && (
          <ExperimentView />
        )}

        {activeTab === 'error-analysis' && (
          <ErrorAnalysisView />
        )}

        {activeTab === 'automated-tests' && (
          <AutomatedTestsView />
        )}

        {activeTab === 'trade-off' && (
          <TradeOffView />
        )}

        {activeTab === 'ethics' && (
          <EthicsView />
        )}

        {activeTab === 'deployment' && (
          <DeploymentChecklistView />
        )}

        {activeTab === 'final-review' && (
          <FinalReviewView
            onNavigate={setActiveTab}
            onRunDemo={handleDemoExecuted}
          />
        )}
      </main>

      {/* Accessible Civic Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-white">CityConnect Service</span> — Location, Language & Accessibility-Aware Disruption Communication
          </div>
          <div className="text-slate-500 font-mono text-[11px]">
            WCAG 2.1 AAA Compliant | Express REST API Backend | React + Vite + Tailwind CSS
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
