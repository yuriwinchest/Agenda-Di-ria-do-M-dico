import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import PatientSelector, { PatientData } from './PatientSelector';
import ServiceSelector, { ServiceData } from './ServiceSelector';
import ProcedureSelector, { ProcedureData } from './ProcedureSelector';
import TimeSlotPicker, { TimeSlot } from './TimeSlotPicker';
import BookingConfirmation from './BookingConfirmation';

interface SchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
    initialTime?: string;
}

type Step = 1 | 2 | 3 | 4 | 5;

const SchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose, initialDate }) => {
    const [currentStep, setCurrentStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    // Booking Data State
    const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [selectedProcedure, setSelectedProcedure] = useState<ProcedureData | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [observations, setObservations] = useState('');
    const [billingType, setBillingType] = useState('Particular');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isBlock, setIsBlock] = useState(false);
    const [blockReason, setBlockReason] = useState('');

    useEffect(() => {
        if (isOpen && initialDate) {
            setSelectedDate(initialDate);
        }
    }, [isOpen, initialDate]);

    const handleClose = () => {
        onClose();
        setCurrentStep(1);
        setSelectedPatient(null);
        setSelectedService(null);
        setSelectedProcedure(null);
        setSelectedSlot(null);
        setObservations('');
        setBillingType('Particular');
        setPaymentMethod('');
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5) as Step);
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as Step);

    const handlePatientSelect = (patient: PatientData) => {
        setSelectedPatient(patient);
        setBillingType(patient.billing_type || 'Particular');
        setPaymentMethod(patient.preferred_payment_method || '');
        nextStep();
    };

    const handleServiceSelect = (service: ServiceData) => {
        setSelectedService(service);
        nextStep();
    };

    const handleProcedureSelect = (procedure: ProcedureData) => {
        setSelectedProcedure(procedure);
        nextStep();
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot);
        nextStep();
    };

    const isUUID = (str: string) => {
        if (str === 'BLOCK') return true;
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        // More lenient check for Postgres UUIDs (any version)
        const lenientRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return lenientRegex.test(str);
    };

    const handleConfirm = async () => {
        if (!selectedPatient || !selectedService || !selectedSlot || !selectedProcedure) {
            console.error('Missing data:', { selectedPatient, selectedService, selectedSlot, selectedProcedure });
            return;
        }

        // Validation against mock data leftover or invalid states
        if (!isUUID(selectedPatient.id)) {
            alert(`Erro: ID do paciente inválido (${selectedPatient.id}). Por favor, selecione o paciente novamente na busca.`);
            return;
        }
        if (!isUUID(selectedService.doctor.id)) {
            alert(`Erro: ID do médico inválido (${selectedService.doctor.id}). Por favor, tente selecionar o médico novamente.`);
            return;
        }

        setLoading(true);
        try {
            // Check if blocking
            const isBlocking = selectedPatient.id === 'BLOCK';

            // Helper to format date without timezone issues
            const formatDateLocal = (date: Date): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            // 1. Create Appointment
            const { data: appointment, error: appError } = await supabase
                .from('appointments')
                .insert([{
                    patient_id: isBlocking ? null : selectedPatient.id,
                    doctor_id: selectedService.doctor.id,
                    appointment_date: formatDateLocal(selectedDate),
                    start_time: selectedSlot.time,
                    status: 'confirmed',
                    type: isBlocking ? 'blocked' : selectedProcedure.name,
                    observations: isBlocking ? selectedPatient.name : observations,
                    billing_type: billingType,
                    payment_method: paymentMethod,
                    authorization_number: isBlocking ? null : ('AUTO-' + Math.random().toString(36).substring(7).toUpperCase())
                }])
                .select()
                .single();

            if (appError) throw appError;

            // 2. Create Transaction (ONLY IF NOT BLOCKING)
            if (!isBlocking) {
                const { error: transError } = await supabase
                    .from('transactions')
                    .insert([{
                        appointment_id: appointment.id,
                        patient_id: selectedPatient.id,
                        description: `${selectedProcedure.name} - ${selectedService.doctor.name}`,
                        amount: selectedProcedure.base_price,
                        tuss_code: selectedProcedure.code,
                        status: 'pending',
                        billing_status: billingType === 'Convênio' ? 'auditing' : 'pending',
                        category: 'consultation'
                    }]);

                if (transError) throw transError;
            }

            alert(isBlocking ? 'Bloqueio de agenda realizado com sucesso!' : 'Agendamento e faturamento registrados com sucesso!');
            handleClose();
        } catch (error: any) {
            console.error('Submit error:', error);
            alert('Erro ao processar agendamento: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 p-4 md:p-6">
            <div className="bg-white w-full max-w-4xl h-full max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200" onClick={(e) => e.stopPropagation()}>

                {/* Header Compact - Fixed */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-colors", isBlock ? "bg-rose-500 shadow-rose-100" : "bg-blue-600 shadow-blue-100")}>
                            <span className="material-symbols-outlined text-white text-2xl">{isBlock ? 'block' : 'event_available'}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-lg font-bold text-slate-900 leading-none">{isBlock ? 'Novo Bloqueio' : 'Novo Agendamento'}</h2>
                                <div className="flex bg-slate-100 p-0.5 rounded-lg ml-2">
                                    <button onClick={() => setIsBlock(false)} className={cn("px-2 py-0.5 rounded-md text-xs font-bold transition-all", !isBlock ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Consulta</button>
                                    <button onClick={() => setIsBlock(true)} className={cn("px-2 py-0.5 rounded-md text-xs font-bold transition-all", isBlock ? "bg-white text-rose-600 shadow-sm" : "text-slate-400 hover:text-slate-600")}>Bloqueio</button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{isBlock ? 'Bloquear horário na agenda' : 'Gestão de Agenda v1.1'}</p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

                {/* Steps Indicator - Fixed & Premium */}
                <div className="bg-slate-50/30 px-6 py-5 border-b border-slate-100 shrink-0">
                    <div className="flex items-center justify-between max-w-2xl mx-auto relative">
                        <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-200 -z-0"></div>
                        {[1, 2, 3, 4, 5].map((step) => {
                            const isActive = step === currentStep;
                            const isCompleted = step < currentStep;

                            return (
                                <div key={step} className="flex flex-col items-center gap-2 z-10">
                                    <div className={cn(
                                        "w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all border-2",
                                        isActive ? "border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-100 scale-110" :
                                            isCompleted ? "border-emerald-500 bg-emerald-500 text-white" :
                                                "border-slate-200 bg-white text-slate-400"
                                    )}>
                                        {isCompleted ? <span className="material-symbols-outlined text-xl">check</span> : step}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest",
                                        isActive ? "text-blue-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
                                    )}>
                                        {step === 1 && "Paciente"}
                                        {step === 2 && "Especialidade"}
                                        {step === 3 && "TUSS"}
                                        {step === 4 && "Horário"}
                                        {step === 5 && "Check-out"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area - Only this part scrolls */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white custom-scrollbar">
                    <div className="max-w-3xl mx-auto">
                        {currentStep === 1 && (
                            isBlock ? (
                                <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-300">
                                    <div className="w-full max-w-md space-y-6">
                                        <div className="text-center space-y-2">
                                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <span className="material-symbols-outlined text-rose-600 text-3xl">block</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">Bloqueio de Agenda</h3>
                                            <p className="text-slate-500 text-sm">Informe o motivo para bloquear horários (ex: Almoço, Reunião).</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Motivo do Bloqueio</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all"
                                                    placeholder="Digite o motivo..."
                                                    value={blockReason}
                                                    onChange={(e) => setBlockReason(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (!blockReason.trim()) return alert('Por favor, informe um motivo.');
                                                    handlePatientSelect({ id: 'BLOCK', name: 'Bloqueio: ' + blockReason } as any);
                                                }}
                                                className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>Continuar para Seleção de Médico</span>
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </button>

                                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 text-xs text-rose-800 flex items-start gap-2">
                                                <span className="material-symbols-outlined text-sm pt-0.5">info</span>
                                                <p>Este bloqueio impedirá novos agendamentos no horário selecionado. É útil para pausas, férias ou manutenções.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <PatientSelector
                                    onSelect={handlePatientSelect}
                                    initialData={selectedPatient}
                                />
                            )
                        )}

                        {currentStep === 2 && (
                            <ServiceSelector
                                onSelect={handleServiceSelect}
                                initialData={selectedService}
                            />
                        )}

                        {currentStep === 3 && (
                            <ProcedureSelector
                                onSelect={handleProcedureSelect}
                                initialData={selectedProcedure}
                            />
                        )}

                        {currentStep === 4 && selectedService && (
                            <TimeSlotPicker
                                doctor={selectedService.doctor}
                                selectedDate={selectedDate}
                                onSelect={handleSlotSelect}
                                initialSlot={selectedSlot}
                            />
                        )}

                        {currentStep === 5 && selectedPatient && selectedService && selectedSlot && selectedProcedure && (
                            <BookingConfirmation
                                loading={loading}
                                observations={observations}
                                onObservationsChange={setObservations}
                                data={{
                                    patient: selectedPatient,
                                    service: selectedService,
                                    procedure: selectedProcedure,
                                    slot: selectedSlot,
                                    date: selectedDate
                                }}
                                onConfirm={handleConfirm}
                            />
                        )}
                    </div>
                </div>

                {/* Navigation Footer - Fixed at bottom */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                    <div className="min-w-[120px]">
                        {currentStep > 1 && !loading && (
                            <button
                                onClick={prevStep}
                                className="px-5 py-2.5 text-slate-600 font-bold hover:bg-white rounded-xl transition-all flex items-center gap-2 border border-slate-200 shadow-sm active:scale-95"
                            >
                                <span className="material-symbols-outlined text-xl">arrow_back</span>
                                Voltar
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Progresso</span>
                            <span className="text-sm font-bold text-slate-900">{Math.round((currentStep / 4) * 100)}% concluído</span>
                        </div>

                        {currentStep === 5 ? (
                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="bg-slate-900 text-white px-10 py-3 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 font-bold flex items-center gap-3 disabled:opacity-50 active:scale-95"
                            >
                                <span className="material-symbols-outlined">{loading ? 'sync' : 'verified'}</span>
                                {loading ? 'Agendando...' : 'Confirmar Tudo'}
                            </button>
                        ) : (
                            <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
                                <span className="text-[10px] font-bold text-blue-600 uppercase">Aguardando Escolha</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchedulerModal;
