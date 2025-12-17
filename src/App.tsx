import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import PatientsView from './components/PatientsView';
import MedicalRecordsView from './components/MedicalRecordsView';
import CalendarView from './components/CalendarView';
import TeleconsultationView from './components/TeleconsultationView';
import FinanceView from './components/FinanceView';
import ReportsView from './components/ReportsView';
import { ViewType } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('teleconsultation');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'records':
        return <MedicalRecordsView />;
      case 'calendar':
        return <CalendarView />;
      case 'teleconsultation':
        return <TeleconsultationView />;
      case 'finance':
        return <FinanceView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse on mobile/tablet or when navigating (optional UX choice, implementing based on request)
  const handleNavigate = (view: ViewType) => {
    setCurrentView(view);
    setIsSidebarCollapsed(true); // "menu lateral se recolha quando uma aba seja aberta"
  };

  return (
    <div className="flex h-screen bg-[#f6f7f8] overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />

        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {renderView()}
            <div className="h-6 shrink-0"></div> {/* Bottom spacer */}
          </div>

          {/* Footer - Only show if content doesn't fill height, or stick to bottom */}
          {currentView === 'dashboard' && (
            <div className="max-w-6xl mx-auto mt-auto text-center pb-6 shrink-0">
              <p className="text-slate-400 text-xs">© 2023 Clínica Central - Sistema de Gestão Médica</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;