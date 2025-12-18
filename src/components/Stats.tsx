import React, { useState, useEffect } from 'react';
import { StatCardProps } from '../types';
import { supabase } from '../lib/supabase';

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass, bgClass }) => (
    <div className={`bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between h-28 transition-all hover:shadow-md cursor-default`}>
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
    const [stats, setStats] = useState({
        totalPatients: 0,
        waiting: 0,
        inProgress: 0,
        completed: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const { count: patientsCount } = await supabase.from('patients').select('*', { count: 'exact', head: true });
        const { count: waitingCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'confirmed');
        const { count: inProgressCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'in_progress');
        const { count: completedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed');

        setStats({
            totalPatients: patientsCount || 0,
            waiting: waitingCount || 0,
            inProgress: inProgressCount || 0,
            completed: completedCount || 0
        });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
                title="Total de Pacientes"
                value={stats.totalPatients.toString()}
                icon="groups"
                colorClass="text-blue-600"
                bgClass="bg-blue-50"
            />
            <StatCard
                title="Aguardando"
                value={stats.waiting.toString()}
                icon="hourglass_top"
                colorClass="text-amber-600"
                bgClass="bg-amber-50"
            />
            <StatCard
                title="Em Atendimento"
                value={stats.inProgress.toString()}
                icon="stethoscope"
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50"
            />
            <StatCard
                title="Concluídos"
                value={stats.completed.toString()}
                icon="check_circle"
                colorClass="text-indigo-600"
                bgClass="bg-indigo-50"
            />
        </div>
    );
};

export default Stats;