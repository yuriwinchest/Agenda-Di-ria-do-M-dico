import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import PatientSelector, { PatientData } from './PatientSelector';
import ServiceSelector, { ServiceData } from './ServiceSelector';
import TimeSlotPicker, { TimeSlot } from './TimeSlotPicker';
import BookingConfirmation from './BookingConfirmation';

interface SchedulerModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
    initialTime?: string;
}

type Step = 1 | 2 | 3 | 4;

const SchedulerModal: React.FC<SchedulerModalProps> = ({ isOpen, onClose, initialDate }) => {
    const [currentStep, setCurrentStep] = useState<Step>(1);

    // Booking Data State
    const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    // Reset flow when closing
    const handleClose = () => {
        // Optional: Reset state here if desired
        onClose();
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4) as Step);
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1) as Step);

    const handlePatientSelect = (patient: PatientData) => {
        setSelectedPatient(patient);
        nextStep();
    };

    const handleServiceSelect = (service: ServiceData) => {
        setSelectedService(service);
        nextStep();
    };

    const handleSlotSelect = (slot: TimeSlot) => {
        setSelectedSlot(slot);
        nextStep();
    };

    const handleConfirm = () => {
        // Logic to save appointment would go here
        alert('Agendamento Confirmado com Sucesso!');
        handleClose();
        setCurrentStep(1);
        setSelectedPatient(null);
        setSelectedService(null);
        setSelectedSlot(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-3xl h-[90vh] md:h-auto md:max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Novo Agendamento</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Preencha os dados para agendar</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Steps Indicator */}
                <div className="bg-white px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center justify-between max-w-lg mx-auto relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>

                        {[1, 2, 3, 4].map((step) => {
                            const isActive = step === currentStep;
                            const isCompleted = step < currentStep;

                            return (
                                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border-2",
                                        isActive ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" :
                                            isCompleted ? "border-green-500 bg-green-500 text-white" :
                                                "border-slate-200 bg-white text-slate-400"
                                    )}>
                                        {isCompleted ? <span className="material-symbols-outlined text-sm">check</span> : step}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-semibold uppercase tracking-wider",
                                        isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-slate-400"
                                    )}>
                                        {step === 1 && "Paciente"}
                                        {step === 2 && "Serviço"}
                                        {step === 3 && "Horário"}
                                        {step === 4 && "Confirmação"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {currentStep === 1 && (
                        <PatientSelector
                            onSelect={handlePatientSelect}
                            initialData={selectedPatient}
                        />
                    )}

                    {currentStep === 2 && (
                        <ServiceSelector
                            onSelect={handleServiceSelect}
                            initialData={selectedService}
                        />
                    )}

                    {currentStep === 3 && selectedService && (
                        <TimeSlotPicker
                            doctor={selectedService.doctor}
                            selectedDate={selectedDate}
                            onSelect={handleSlotSelect}
                            initialSlot={selectedSlot}
                        />
                    )}

                    {currentStep === 4 && selectedPatient && selectedService && selectedSlot && (
                        <BookingConfirmation
                            data={{
                                patient: selectedPatient,
                                service: selectedService,
                                slot: selectedSlot,
                                date: selectedDate
                            }}
                            onConfirm={handleConfirm}
                        />
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Voltar
                        </button>
                    )}

                    {currentStep < 4 && (
                        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
                            <span>Próximo passo</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchedulerModal;
