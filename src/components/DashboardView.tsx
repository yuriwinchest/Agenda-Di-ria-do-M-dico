import React from 'react';
import Stats from './Stats';
import AppointmentList from './AppointmentList';
import RightPanel from './RightPanel';
import {
    CalendarDays,
    Filter,
    Plus,
    Sparkles,
    RefreshCcw,
    LayoutDashboard,
    Video
} from 'lucide-react';
import { cn } from '../lib/utils';
// @ts-ignore
import { ViewType } from '../types';

interface DashboardViewProps {
    onNavigate?: (view: any) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in duration-1000">
            {/* Heading Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 shrink-0 pt-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <LayoutDashboard className="w-5 h-5 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tighter">Visão Geral</h2>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                            <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-xs font-bold text-slate-600">Quinta-feira, 18 de Dezembro, 2024</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-wider">Unidade Central</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onNavigate?.('teleconsultation')}
                        className="flex items-center gap-2.5 px-6 h-11 bg-purple-600 text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95 group"
                    >
                        <Video className="w-4 h-4 group-hover:scale-110 transition-transform" strokeWidth={3} />
                        Telemedicina
                    </button>
                    <button className="flex items-center gap-2.5 px-5 h-11 bg-white border border-slate-200 text-slate-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <Filter className="w-4 h-4 text-slate-400" />
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2.5 px-6 h-11 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.1em] rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 group">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
                        Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Content Stats */}
            <div className="shrink-0">
                <Stats />
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
                <div className="flex-1 min-w-0">
                    <AppointmentList />
                </div>
                <div className="w-full lg:w-[400px] shrink-0">
                    <RightPanel />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;