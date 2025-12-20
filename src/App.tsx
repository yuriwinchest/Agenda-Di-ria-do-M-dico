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
import ProceduresView from './components/ProceduresView';
import LoginPage from './components/LoginPage';
import InsuranceManagement from './components/InsuranceManagement';
import { ViewType } from './types';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [initialViewData, setInitialViewData] = useState<any>(null);

  const handleNavigateWithData = (view: ViewType, data?: any) => {
    setInitialViewData(data);
    setCurrentView(view);
    setIsSidebarCollapsed(true);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigateWithData} />;
      case 'patients':
        return <PatientsView onNavigate={handleNavigateWithData} />;
      case 'records':
        return <MedicalRecordsView initialPatient={initialViewData} />;
      case 'calendar':
        return <CalendarView initialPatient={initialViewData} />;
      case 'teleconsultation':
        return <TeleconsultationView />;
      case 'finance':
        return <FinanceView />;
      case 'procedures':
        return <ProceduresView />;
      case 'reports':
        return <ReportsView />;
      case 'insurances':
        return <InsuranceManagement />;
      default:
        return <DashboardView />;
    }
  };

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse on mobile/tablet or when navigating (optional UX choice, implementing based on request)
  const handleNavigate = (view: ViewType) => {
    setInitialViewData(null);
    setCurrentView(view);
    setIsSidebarCollapsed(true); // "menu lateral se recolha quando uma aba seja aberta"
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#f6f7f8] overflow-hidden">
      <Sidebar
        currentView={currentView}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => setIsAuthenticated(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />

        <div className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-all",
          currentView === 'teleconsultation' ? "p-0" : "p-4 lg:p-6"
        )}>
          <div className={cn(
            "h-full flex flex-col",
            currentView === 'teleconsultation' ? "max-w-none" : "max-w-7xl mx-auto"
          )}>
            {renderView()}
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