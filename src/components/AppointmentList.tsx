import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { supabase } from '../lib/supabase';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'completed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Concluído
                </span>
            );
        case 'confirmed':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Confirmado
                </span>
            );
        case 'scheduled':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Agendado
                </span>
            );
        default:
            return null;
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
                    avatarUrl: '' // No avatar in DB yet
                }
            }));
            setAppointments(mapped);
        }
        setLoading(false);
    };

    return (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[600px]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Pacientes Agendados</h3>
                <button onClick={fetchAppointments} className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    Atualizar
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                        Nenhum agendamento para hoje.
                    </div>
                ) : appointments.map((appointment) => {
                    const isSpecial = appointment.status === 'in_progress';

                    return (
                        <div
                            key={appointment.id}
                            className={`flex border-b border-slate-100 ${isSpecial ? 'bg-blue-50/40 relative' : 'hover:bg-slate-50 transition-colors group'}`}
                        >
                            {isSpecial && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}

                            <div className={`w-20 p-4 flex flex-col items-center justify-center border-r border-slate-100 ${isSpecial ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                <span className={isSpecial ? 'text-base' : 'text-sm font-medium'}>{appointment.time}</span>
                            </div>

                            <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                            {appointment.patient?.name.charAt(0)}
                                        </div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isSpecial ? 'bg-emerald-500 animate-pulse' : appointment.status === 'completed' ? 'bg-green-500' : appointment.status === 'confirmed' ? 'bg-amber-500' : 'bg-slate-300'} rounded-full border-2 border-white`}></div>
                                    </div>
                                    <div className={isSpecial ? 'flex flex-col justify-center h-12' : ''}>
                                        <h4 className={`text-slate-900 ${isSpecial ? 'font-bold text-base' : 'font-semibold text-sm'}`}>{appointment.patient?.name}</h4>
                                        <p className="text-slate-500 text-xs">{appointment.patient?.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <StatusBadge status={appointment.status} />
                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppointmentList;
