import React from 'react';
import { ViewType } from '../types';
import { cn } from '../lib/utils';
import {
    Calendar,
    Users,
    Stethoscope,
    CreditCard,
    ClipboardList,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
    LayoutDashboard,
    Bell,
    HelpCircle,
    Search,
    Menu,
    PlusCircle
} from 'lucide-react';
import logoImg from '../assets/logo_integraclinic.png';

interface SidebarProps {
    currentView: ViewType;
    onNavigate: (view: ViewType) => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isCollapsed, toggleCollapse }) => {
    const menuItems = [
        { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard', color: 'text-blue-500', bg: 'bg-blue-50' },
        { id: 'calendar' as ViewType, icon: Calendar, label: 'Agenda', color: 'text-indigo-500', bg: 'bg-indigo-50' },
        { id: 'patients' as ViewType, icon: Users, label: 'Pacientes', color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { id: 'records' as ViewType, icon: ClipboardList, label: 'Prontuário', color: 'text-amber-500', bg: 'bg-amber-50' },
        { id: 'doctors' as ViewType, icon: Stethoscope, label: 'Médicos', color: 'text-rose-500', bg: 'bg-rose-50' },
        { id: 'finance' as ViewType, icon: CreditCard, label: 'Financeiro', color: 'text-violet-500', bg: 'bg-violet-50' },
        { id: 'procedures' as ViewType, icon: Search, label: 'Procedimentos', color: 'text-cyan-500', bg: 'bg-cyan-50' },
        { id: 'reports' as ViewType, icon: BarChart3, label: 'Relatórios', color: 'text-orange-500', bg: 'bg-orange-50' },
        { id: 'settings' as ViewType, icon: Settings, label: 'Ajustes', color: 'text-slate-500', bg: 'bg-slate-50' },
    ];

    return (
        <aside
            className={cn(
                "bg-white border-r border-slate-200 flex flex-col h-full shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 relative shadow-sm",
                isCollapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Toggle Button - Floating style */}
            <button
                onClick={toggleCollapse}
                className="absolute -right-3 top-10 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:bg-slate-50 transition-all z-40 group"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                )}
            </button>

            {/* Logo Area */}
            <div className={cn(
                "flex items-center gap-3 transition-all duration-500 h-20 shrink-0 border-b border-slate-50",
                isCollapsed ? "justify-center p-4" : "px-6"
            )}>
                <div className="relative group cursor-pointer overflow-hidden rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                </div>
                {!isCollapsed && (
                    <div className="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
                        <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
                            Integra<span className="text-blue-600">Clinic</span>
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Health Platform</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Navigation */}
            <nav className={cn(
                "flex flex-col gap-1.5 mt-6 flex-1 px-3 overflow-y-auto no-scrollbar",
                isCollapsed ? "items-center" : ""
            )}>
                {!isCollapsed && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 px-3">
                        Menu Principal
                    </p>
                )}

                {menuItems.map((item) => {
                    const active = currentView === item.id || (item.id === 'patients' && currentView === 'records') || (item.id === 'calendar' && currentView === 'calendar');
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={cn(
                                "flex items-center gap-3 py-2.5 rounded-xl transition-all duration-300 w-full group relative mb-0.5",
                                isCollapsed ? "justify-center px-2 w-12 h-12" : "px-4 text-left",
                                active
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                                    : "text-slate-500 hover:bg-slate-50"
                            )}
                            title={isCollapsed ? item.label : ''}
                        >
                            <div className={cn(
                                "transition-all duration-300",
                                active ? "scale-110" : "group-hover:scale-110"
                            )}>
                                <Icon className={cn(
                                    "w-[20px] h-[20px]",
                                    active ? "text-white" : cn(item.color, "opacity-70 group-hover:opacity-100")
                                )} strokeWidth={2.5} />
                            </div>

                            {!isCollapsed && (
                                <span className={cn(
                                    "text-sm font-bold tracking-tight transition-all duration-300",
                                    active ? "translate-x-0.5" : "group-hover:translate-x-0.5"
                                )}>
                                    {item.label}
                                </span>
                            )}

                            {active && !isCollapsed && (
                                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile Area */}
            <div className="p-4 bg-slate-50/50 mt-auto border-t border-slate-100">
                <div className={cn(
                    "flex items-center gap-3 p-2 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group",
                    isCollapsed ? "justify-center p-1 px-2 h-12" : "px-3"
                )}>
                    <div className="relative shrink-0">
                        <img
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="User"
                            className="w-8 h-8 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all group-hover:ring-blue-100"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                            <h1 className="text-slate-900 text-xs font-black tracking-tight leading-none truncate">Maria Silva</h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Recepção</p>
                        </div>
                    )}

                    {!isCollapsed && (
                        <Settings className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;