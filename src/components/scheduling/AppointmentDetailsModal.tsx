import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils'; // Assuming cn exists, if not I'll just use template literals or check CalendarView imports

interface AppointmentDetailsModalProps {
    appointment: any;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export const AppointmentDetailsModal = ({ appointment, isOpen, onClose, onUpdate }: AppointmentDetailsModalProps) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen || !appointment) return null;

    const handleStatusChange = async (newStatus: string) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: newStatus })
                .eq('id', appointment.id);

            if (error) throw error;
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status: ' + (error as any).message);
        } finally {
            setLoading(false);
        }
    };

    const isArrived = appointment.status === 'arrived';
    const isCompleted = appointment.status === 'completed';
    const isBlocked = appointment.type === 'blocked' || appointment.status === 'blocked';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div>
                        <h3 className="font-bold text-xl text-slate-800">Detalhes do Agendamento</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">ID: {appointment.id.slice(0, 8)}...</p>
                    </div>

                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="flex justify-center">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-sm border ${appointment.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            appointment.status === 'arrived' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                isBlocked ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                            {appointment.status === 'arrived' ? 'Na Recepção' :
                                isBlocked ? 'Bloqueio de Agenda' :
                                    appointment.status === 'confirmed' ? 'Confirmado' : appointment.status}
                        </span>
                    </div>

                    {/* Info Blocks */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                                    <span className="material-symbols-outlined text-lg">person</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Paciente</p>
                            </div>
                            <p className="font-bold text-slate-700 text-sm leading-tight line-clamp-2">{appointment.patient?.name || (isBlocked ? 'N/A' : 'Sem nome')}</p>
                        </div>
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                                    <span className="material-symbols-outlined text-lg">schedule</span>
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Horário</p>
                            </div>
                            <p className="font-bold text-slate-700 text-sm">{appointment.start_time?.slice(0, 5)} - {appointment.end_time?.slice(0, 5)}</p>
                        </div>
                    </div>

                    {/* Procedure/Type */}
                    {!isBlocked && (
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                                    <span className="material-symbols-outlined text-lg">medical_services</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Procedimento</p>
                                    <p className="font-bold text-slate-700 text-sm">{appointment.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Médico</p>
                                <p className="font-bold text-slate-700 text-sm">{appointment.doctor?.name}</p>
                            </div>
                        </div>
                    )}

                    {/* Observations or Block Reason */}
                    {(appointment.observations || isBlocked) && (
                        <div className={`p-4 rounded-2xl border ${isBlocked ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                            <p className={`text-xs font-bold mb-1 flex items-center gap-1 uppercase tracking-wider ${isBlocked ? 'text-rose-600' : 'text-amber-600'}`}>
                                <span className="material-symbols-outlined text-[16px]">{isBlocked ? 'block' : 'sticky_note_2'}</span>
                                {isBlocked ? 'Motivo do Bloqueio' : 'Observações'}
                            </p>
                            <p className={`text-sm italic ${isBlocked ? 'text-rose-800 font-medium' : 'text-amber-900'}`}>{appointment.observations || appointment.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-col gap-3">
                        {!isArrived && !isCompleted && !isBlocked && (
                            <button
                                onClick={() => handleStatusChange('arrived')}
                                disabled={loading}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                <div className="bg-white/20 p-1 rounded-full group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-xl">check</span>
                                </div>
                                <span>Marcar Paciente na Recepção</span>
                            </button>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            {/* Only showing Cancel for now as Edit is complex */}
                            <button
                                onClick={() => {
                                    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
                                        handleStatusChange('cancelled');
                                    }
                                }}
                                className="col-span-2 py-3 bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">cancel</span>
                                Cancelar Agendamento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
