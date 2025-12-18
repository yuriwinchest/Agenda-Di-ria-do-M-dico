import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

interface AppointmentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointmentId: string;
    onUpdate?: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ isOpen, onClose, appointmentId, onUpdate }) => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [appointment, setAppointment] = useState<any>(null);
    const [patient, setPatient] = useState<any>(null);
    const [doctor, setDoctor] = useState<any>(null);
    const [allDoctors, setAllDoctors] = useState<any[]>([]);

    // Editable fields
    const [status, setStatus] = useState('');
    const [observations, setObservations] = useState('');
    const [startTime, setStartTime] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');

    useEffect(() => {
        if (isOpen && appointmentId) {
            loadAppointmentDetails();
        }
    }, [isOpen, appointmentId]);

    const loadAppointmentDetails = async () => {
        setLoading(true);
        try {
            // Load all doctors for dropdown
            const { data: docs } = await supabase
                .from('doctors')
                .select('*')
                .order('name');
            if (docs) setAllDoctors(docs);

            // Load appointment
            const { data: appt } = await supabase
                .from('appointments')
                .select('*')
                .eq('id', appointmentId)
                .single();

            if (appt) {
                setAppointment(appt);
                setStatus(appt.status || 'scheduled');
                setObservations(appt.observations || '');
                setStartTime(appt.start_time || '');
                setSelectedDoctorId(appt.doctor_id || '');

                // Load patient
                if (appt.patient_id) {
                    const { data: pat } = await supabase
                        .from('patients')
                        .select('*')
                        .eq('id', appt.patient_id)
                        .single();
                    setPatient(pat);
                }

                // Load doctor
                if (appt.doctor_id) {
                    const { data: doc } = await supabase
                        .from('doctors')
                        .select('*')
                        .eq('id', appt.doctor_id)
                        .single();
                    setDoctor(doc);
                }
            }
        } catch (error) {
            console.error('Error loading appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('appointments')
                .update({
                    status,
                    observations,
                    start_time: startTime,
                    doctor_id: selectedDoctorId
                })
                .eq('id', appointmentId);

            if (error) throw error;

            alert('Agendamento atualizado com sucesso!');
            onUpdate?.();
            onClose();
        } catch (error: any) {
            alert('Erro ao atualizar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja cancelar este agendamento?')) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointmentId);

            if (error) throw error;

            alert('Agendamento cancelado!');
            onUpdate?.();
            onClose();
        } catch (error: any) {
            alert('Erro ao cancelar: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">event</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Detalhes do Agendamento</h2>
                            <p className="text-xs text-slate-500">Visualizar e editar informações</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Paciente
                                </h3>
                                <p className="font-bold text-slate-900">{patient?.name || 'Não informado'}</p>
                                <p className="text-sm text-slate-600">CPF: {patient?.cpf || 'N/A'}</p>
                                <p className="text-sm text-slate-600">Telefone: {patient?.phone || 'N/A'}</p>
                            </div>

                            {/* Doctor Info - Editable */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">medical_services</span>
                                    Médico (Editável)
                                </h3>
                                <select
                                    value={selectedDoctorId}
                                    onChange={(e) => setSelectedDoctorId(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Selecione um médico</option>
                                    {allDoctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.name} - {doc.specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Appointment Details */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <h3 className="text-xs font-bold text-blue-600 uppercase mb-3">Informações do Agendamento</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Data</label>
                                        <p className="font-semibold text-slate-900">
                                            {appointment?.appointment_date ? new Date(appointment.appointment_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Horário</label>
                                        <input
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full px-2 py-1 rounded border border-slate-200 font-semibold text-slate-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Tipo</label>
                                        <p className="font-semibold text-slate-900">{appointment?.type || 'Consulta'}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-500 font-medium">Status</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full px-2 py-1 rounded border border-slate-200 font-semibold text-slate-900"
                                        >
                                            <option value="scheduled">Agendado</option>
                                            <option value="confirmed">Confirmado</option>
                                            <option value="completed">Concluído</option>
                                            <option value="cancelled">Cancelado</option>
                                            <option value="no_show">Não compareceu</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Observations */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">notes</span>
                                    Observações
                                </label>
                                <textarea
                                    value={observations}
                                    onChange={(e) => setObservations(e.target.value)}
                                    placeholder="Adicione observações sobre o agendamento..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                        Cancelar Agendamento
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-2 text-slate-600 hover:bg-white rounded-lg font-medium transition-colors border border-slate-200 disabled:opacity-50"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[20px]">{saving ? 'sync' : 'save'}</span>
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetailsModal;
