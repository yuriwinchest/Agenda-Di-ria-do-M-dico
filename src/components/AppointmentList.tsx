import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { supabase } from '../lib/supabase';
import {
    Clock,
    CheckCircle2,
    AlertCircle,
    CalendarCheck,
    User,
    MoreHorizontal,
    RefreshCw,
    Search,
    ChevronRight,
    Play
} from 'lucide-react';
import { cn } from '../lib/utils';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'completed':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100 shadow-sm animate-in zoom-in-95">
                    <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Finalizado</span>
                </div>
            );
        case 'confirmed':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shadow-sm animate-in zoom-in-95">
                    <CalendarCheck className="w-3.5 h-3.5" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Confirmado</span>
                </div>
            );
        case 'in_progress':
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 shadow-sm animate-pulse">
                    <Play className="w-3.5 h-3.5 fill-current" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Em Atendimento</span>
                </div>
            );
        default:
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-100 shadow-sm animate-in zoom-in-95">
                    <Clock className="w-3.5 h-3.5" strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Agendado</span>
                </div>
            );
    }
};

const AppointmentList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                status,
                type,
                patients (
                    id,
                    name,
                    insurance_provider
                )
            `)
            .order('start_time', { ascending: true });

        if (error) {
            console.error('Error fetching appointments:', error);
        } else {
            const mapped: Appointment[] = (data || []).map((item: any) => ({
                id: item.id,
                time: item.start_time.substring(0, 5),
                status: item.status,
                patient: {
                    id: item.patients?.id,
                    name: item.patients?.name || '---',
                    type: `${item.type} • ${item.patients?.insurance_provider || 'Particular'}`,
                    insurance: item.patients?.insurance_provider || 'Particular',
                    avatarUrl: ''
                }
            }));
            setAppointments(mapped);
        }
        setLoading(false);
    };

    return (
        <div className="flex-1 bg-white rounded-[32px] shadow-sm border border-slate-100 flex flex-col overflow-hidden min-h-[600px] hover:shadow-xl hover:shadow-slate-100 transition-all duration-700">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                    <h3 className="font-black text-slate-800 tracking-tight text-lg">Próximos Atendimentos</h3>
                </div>
                <button
                    onClick={fetchAppointments}
                    className="p-2.5 text-slate-400 hover:text-blue-600 rounded-2xl hover:bg-slate-50 transition-all active:rotate-180 duration-500 group"
                >
                    <RefreshCw className="w-5 h-5 group-active:scale-95" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-80 gap-4">
                        <div className="relative">
                            <RefreshCw className="w-10 h-10 text-blue-100 animate-spin" strokeWidth={1.5} />
                            <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Sincronizando...</p>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-80 text-slate-400">
                        <div className="w-20 h-20 bg-slate-50 rounded-[40px] flex items-center justify-center mb-4">
                            <AlertCircle className="w-10 h-10 text-slate-200" strokeWidth={1} />
                        </div>
                        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Sem agendamentos para hoje</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {appointments.map((appointment) => {
                            const isSpecial = appointment.status === 'in_progress';

                            return (
                                <div
                                    key={appointment.id}
                                    className={cn(
                                        "flex group transition-all duration-500 cursor-pointer relative",
                                        isSpecial ? "bg-emerald-50/20" : "hover:bg-slate-50/50"
                                    )}
                                >
                                    {/* Time Block */}
                                    <div className={cn(
                                        "w-24 px-4 py-8 flex flex-col items-center justify-center border-r border-slate-50 transition-all duration-500",
                                        isSpecial ? "bg-emerald-500 text-white" : "text-slate-400 group-hover:bg-white"
                                    )}>
                                        <Clock className={cn("w-4 h-4 mb-1.5", isSpecial ? "text-white" : "text-slate-300")} />
                                        <span className="text-sm font-black tracking-tighter leading-none">{appointment.time}</span>
                                    </div>

                                    {/* Patient Info */}
                                    <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="relative shrink-0">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-lg shadow-sm transition-all duration-500 group-hover:scale-105",
                                                    isSpecial ? "bg-white text-emerald-600 shadow-emerald-200/50" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600"
                                                )}>
                                                    {appointment.patient?.name.charAt(0)}
                                                </div>
                                                <div className={cn(
                                                    "absolute -bottom-1 -right-1 w-5 h-5 rounded-lg border-4 border-white shadow-sm flex items-center justify-center",
                                                    isSpecial ? "bg-emerald-500 animate-pulse" :
                                                        appointment.status === 'completed' ? "bg-indigo-500" :
                                                            appointment.status === 'confirmed' ? "bg-amber-500" : "bg-slate-300"
                                                )}>
                                                    {isSpecial && <Play className="w-2.5 h-2.5 text-white fill-current" />}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={cn(
                                                    "text-slate-800 truncate transition-all duration-300",
                                                    isSpecial ? "font-black text-lg tracking-tight" : "font-bold text-base tracking-tight"
                                                )}>
                                                    {appointment.patient?.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{appointment.patient?.type}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={appointment.status} />
                                            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50/50 text-slate-300 hover:bg-slate-900 hover:text-white transition-all duration-300 group/btn">
                                                <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Active Indicator Line */}
                                    {isSpecial && <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* List Footer */}
            <div className="p-4 bg-slate-50/30 border-t border-slate-50 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Total de {appointments.length} Atendimentos</p>
            </div>
        </div>
    );
};

export default AppointmentList;
