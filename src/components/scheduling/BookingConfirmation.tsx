import React from 'react';
import { PatientData } from './PatientSelector';
import { ServiceData } from './ServiceSelector';
import { TimeSlot } from './TimeSlotPicker';

interface BookingConfirmationProps {
    data: {
        patient: PatientData | null;
        service: ServiceData | null;
        slot: TimeSlot | null;
        date: Date;
    };
    onConfirm: () => void;
    onBack?: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ data, onConfirm }) => {
    const { patient, service, slot, date } = data;

    if (!patient || !service || !slot) return null;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <h3 className="text-green-800 font-bold text-lg mb-1">Confirme os detalhes</h3>
                <p className="text-green-600 text-sm">Verifique se as informações abaixo estão corretas antes de finalizar.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Info */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        Paciente
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">{patient.name}</p>
                            <p className="text-xs text-slate-500">CPF: {patient.cpf}</p>
                        </div>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-[16px] text-slate-400">call</span>
                            {patient.phone}
                        </p>
                        {patient.email && (
                            <p className="flex items-center gap-2 text-slate-600">
                                <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
                                {patient.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Service Info */}
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">medical_services</span>
                        Serviço
                    </h4>
                    <div className="flex items-center gap-3 mb-3">
                        <img src={service.doctor.avatar} alt={service.doctor.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-bold text-slate-900">{service.doctor.name}</p>
                            <p className="text-xs text-slate-500">{service.specialty}</p>
                        </div>
                    </div>
                    <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                            {date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="flex items-center gap-2 text-slate-600">
                            <span className="material-symbols-outlined text-[16px] text-slate-400">schedule</span>
                            {slot.time}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg text-sm text-blue-800">
                    <span className="material-symbols-outlined text-[20px] mt-0.5">info</span>
                    <p>Ao confirmar, uma notificação será enviada automaticamente para o paciente via WhatsApp e E-mail.</p>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex justify-end">
                <button
                    onClick={onConfirm}
                    className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200 font-bold flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined">check_circle</span>
                    Confirmar Agendamento
                </button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
