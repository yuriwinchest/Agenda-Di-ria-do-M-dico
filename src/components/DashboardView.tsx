import React from 'react';
import Stats from './Stats';
import AppointmentList from './AppointmentList';
import RightPanel from './RightPanel';

const DashboardView: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Heading Area */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agenda Diária</h2>
                    <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>schedule</span>
                        <span className="text-base font-normal">Terça-feira, 24 de Outubro, 2023</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                        Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Content Stats */}
            <div className="shrink-0">
                <Stats />
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6 mt-2 flex-1 min-h-0">
                <AppointmentList />
                <RightPanel />
            </div>
        </div>
    );
};

export default DashboardView;