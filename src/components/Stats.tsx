import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
    Users,
    Hourglass,
    Stethoscope,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
    title: string;
    value: string;
    icon: any;
    color: string;
    trend?: { value: string; positive: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer relative overflow-hidden h-40">
        {/* Background Accent */}
        <div className={cn("absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] transition-all duration-500 group-hover:scale-150", color.replace('text-', 'bg-'))} />

        <div className="flex justify-between items-start relative z-10">
            <div className={cn("p-3 rounded-2xl shadow-sm transition-all duration-500 group-hover:scale-110", color.replace('text-', 'bg-').replace('600', '50'))}>
                <Icon className={cn("w-6 h-6", color)} strokeWidth={2.5} />
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase transition-all duration-300",
                    trend.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                    {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {trend.value}
                </div>
            )}
        </div>

        <div className="relative z-10 mt-4">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.15em] mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-slate-800 tracking-tighter">{value}</p>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="text-[10px] font-bold text-slate-300 tracking-tight">Ativo agora</span>
            </div>
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <StatCard
                title="Pacientes Ativos"
                value={stats.totalPatients.toLocaleString()}
                icon={Users}
                color="text-blue-600"
                trend={{ value: "+12.5%", positive: true }}
            />
            <StatCard
                title="Lista de Espera"
                value={stats.waiting.toString()}
                icon={Hourglass}
                color="text-amber-600"
                trend={{ value: "-2.4%", positive: false }}
            />
            <StatCard
                title="Em Consulta"
                value={stats.inProgress.toString()}
                icon={Stethoscope}
                color="text-emerald-600"
            />
            <StatCard
                title="Finalizados Hoje"
                value={stats.completed.toString()}
                icon={CheckCircle2}
                color="text-indigo-600"
                trend={{ value: "+4.2%", positive: true }}
            />
        </div>
    );
};

export default Stats;