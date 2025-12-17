import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
    const menuItems: { id: ViewType; icon: string; label: string }[] = [
        { id: 'calendar', icon: 'calendar_month', label: 'Agenda' },
        { id: 'patients', icon: 'person', label: 'Pacientes' },
        { id: 'doctors', icon: 'medical_services', label: 'Médicos' },
        { id: 'finance', icon: 'credit_card', label: 'Financeiro' },
        { id: 'settings', icon: 'settings', label: 'Configurações' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-all duration-300 font-sans">
            {/* Logo Area */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200 shrink-0">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>add</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 text-base font-bold leading-tight">Clínica Saúde</h1>
                    <p className="text-slate-400 text-xs font-normal">Painel da Recepção</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 px-4 mt-2 flex-1">
                {menuItems.map((item) => {
                    const active = currentView === item.id || (item.id === 'patients' && currentView === 'records'); // Keep patients selected for records sub-view if needed
                    return (
                        <button 
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all w-full text-left group ${
                                active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium'
                            }`}
                        >
                            <span 
                                className={`material-symbols-outlined ${active ? 'fill-1' : ''}`} 
                                style={{ fontSize: '22px' }}
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Profile */}
            <div className="p-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <div 
                        className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border border-slate-200"
                        style={{ backgroundImage: `url("https://randomuser.me/api/portraits/women/44.jpg")` }}
                    ></div>
                    <div className="flex flex-col">
                        <h1 className="text-slate-900 text-sm font-bold leading-tight">Maria Silva</h1>
                        <p className="text-slate-400 text-xs font-normal">Recepção</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;