import React from 'react';
import { PatientData } from './PatientSelector';
import { ServiceData } from './ServiceSelector';
import { TimeSlot } from './TimeSlotPicker';
import { ProcedureData } from './ProcedureSelector';

interface BookingConfirmationProps {
    data: {
        patient: PatientData | null;
        service: ServiceData | null;
        procedure: ProcedureData | null;
        slot: TimeSlot | null;
        date: Date;
    };
    onConfirm: () => void;
    onBack?: () => void;
    loading?: boolean;
    observations?: string;
    onObservationsChange?: (value: string) => void;
    modality: 'presencial' | 'telemedicina';
    onModalityChange: (value: 'presencial' | 'telemedicina') => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
    data, onConfirm, loading, observations, onObservationsChange, modality, onModalityChange
}) => {
    const { patient, service, procedure, slot, date } = data;

    if (!patient || !service || !slot || !procedure) return null;

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-green-50/50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-green-700 text-xs font-bold">Confirme os detalhes do agendamento</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Patient Info Compact */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">person</span>
                        Paciente
                    </h4>
                    <p className="font-bold text-slate-900 text-sm">{patient.name}</p>
                    <p className="text-[10px] text-slate-500">CPF: {patient.cpf}</p>
                </div>

                {/* Service/Doc info Compact */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">medical_services</span>
                        Médico & Horário
                    </h4>
                    <p className="font-bold text-slate-900 text-sm">{service.doctor.name}</p>
                    <p className="text-[10px] text-slate-500">{date.toLocaleDateString('pt-BR')} às {slot.time}</p>
                </div>
            </div>

            {/* Procedure info Compact */}
            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 italic">
                <h4 className="text-[10px] font-bold text-blue-400 uppercase mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    Procedimento Selecionado
                </h4>
                <div className="flex justify-between items-center">
                    <p className="font-bold text-blue-900 text-sm">{procedure.name}</p>
                    <p className="font-bold text-blue-600 text-sm">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(procedure.base_price)}
                    </p>
                </div>
            </div>

            {/* NEW: Consultation Modality Selection */}
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 ml-1">
                    <span className="material-symbols-outlined text-sm">settings_remote</span>
                    Tipo de Atendimento
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => onModalityChange('presencial')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${modality === 'presencial'
                                ? 'bg-blue-50 border-blue-600 ring-4 ring-blue-50'
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-400'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${modality === 'presencial' ? 'text-blue-600' : ''}`}>person_pin_circle</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${modality === 'presencial' ? 'text-blue-600' : ''}`}>Presencial</span>
                    </button>
                    <button
                        onClick={() => onModalityChange('telemedicina')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${modality === 'telemedicina'
                                ? 'bg-indigo-50 border-indigo-600 ring-4 ring-indigo-50'
                                : 'bg-white border-slate-100 hover:border-slate-200 text-slate-400'
                            }`}
                    >
                        <span className={`material-symbols-outlined text-2xl ${modality === 'telemedicina' ? 'text-indigo-600' : ''}`}>video_chat</span>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${modality === 'telemedicina' ? 'text-indigo-600' : ''}`}>Telemedicina</span>
                    </button>
                </div>
                {modality === 'telemedicina' && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50/50 border border-indigo-100 rounded-xl animate-in zoom-in-95">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        <p className="text-[10px] text-indigo-600 font-bold italic">O paciente será automaticamente listado na Sala de Espera Virtual.</p>
                    </div>
                )}
            </div>

            {/* Observation Field - NEW */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">notes</span>
                    Observações da Atendente
                </label>
                <textarea
                    value={observations}
                    onChange={(e) => onObservationsChange?.(e.target.value)}
                    placeholder="Ex: Paciente com urgência, trazer exames anteriores..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                />
            </div>
        </div>
    );
};

export default BookingConfirmation;
