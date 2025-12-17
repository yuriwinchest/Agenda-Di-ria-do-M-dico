import React from 'react';
import { ViewType } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, toggleCollapse }) => {
    const menuItems: { id: ViewType; icon: string; label: string }[] = [
        { id: 'calendar', icon: 'calendar_month', label: 'Agenda' },
        { id: 'patients', icon: 'person', label: 'Pacientes' },
        { id: 'doctors', icon: 'medical_services', label: 'Médicos' },
        { id: 'finance', icon: 'credit_card', label: 'Financeiro' },
        { id: 'settings', icon: 'settings', label: 'Configurações' },
    ];

    return (
        <aside
            className={cn(
                "bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-all duration-300 ease-in-out font-sans",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo Area */}
            <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center p-4" : "p-6")}>
                <div
                    onClick={toggleCollapse}
                    className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-200 shrink-0 cursor-pointer hover:bg-blue-700 transition-colors"
                >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: '24px' }}>
                        {isCollapsed ? 'menu' : 'add'}
                    </span>
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col overflow-hidden whitespace-nowrap">
                        <h1 className="text-slate-900 text-base font-bold leading-tight">Clínica Saúde</h1>
                        <p className="text-slate-400 text-xs font-normal">Painel da Recepção</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className={cn("flex flex-col gap-1 mt-2 flex-1", isCollapsed ? "px-2" : "px-4")}>
                {menuItems.map((item) => {
                    const active = currentView === item.id || (item.id === 'patients' && currentView === 'records');
                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "flex items-center gap-3 py-3 rounded-lg transition-all w-full group relative",
                                isCollapsed ? "justify-center px-0 hover:bg-slate-50" : "px-3 text-left",
                                active ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 font-medium"
                            )}
                            title={isCollapsed ? item.label : ''}
                        >
                            <span
                                className={cn("material-symbols-outlined transition-all", active ? 'fill-1' : '')}
                                style={{ fontSize: '22px' }}
                            >
                                {item.icon}
                            </span>

                            {!isCollapsed && (
                                <span className="text-sm overflow-hidden whitespace-nowrap">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Bottom Profile */}
            <div className="p-4 border-t border-slate-100 mt-auto">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full w-10 h-10 border border-slate-200 shrink-0"
                        style={{ backgroundImage: `url("https://randomuser.me/api/portraits/women/44.jpg")` }}
                    ></div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden whitespace-nowrap">
                            <h1 className="text-slate-900 text-sm font-bold leading-tight">Maria Silva</h1>
                            <p className="text-slate-400 text-xs font-normal">Recepção</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;