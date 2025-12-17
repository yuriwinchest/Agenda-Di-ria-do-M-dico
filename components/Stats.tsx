import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, bgClass }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-28 hover:border-${colorClass} hover:ring-1 hover:ring-${colorClass}/20 transition-all cursor-default`}>
        <div className="flex justify-between items-start">
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <span className={`${bgClass} ${colorClass} p-1.5 rounded-lg material-symbols-outlined`} style={{ fontSize: '20px' }}>
                {icon}
            </span>
        </div>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
);

const Stats: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard 
                title="Total de Pacientes" 
                value="14" 
                icon="groups" 
                colorClass="text-blue-600" 
                bgClass="bg-blue-50" 
            />
            <StatCard 
                title="Aguardando" 
                value="3" 
                icon="hourglass_top" 
                colorClass="text-amber-600" 
                bgClass="bg-amber-50" 
            />
            <StatCard 
                title="Em Atendimento" 
                value="1" 
                icon="stethoscope" 
                colorClass="text-emerald-600" 
                bgClass="bg-emerald-50" 
            />
            <StatCard 
                title="Concluídos" 
                value="5" 
                icon="check_circle" 
                colorClass="text-indigo-600" 
                bgClass="bg-indigo-50" 
            />
        </div>
    );
};

export default Stats;