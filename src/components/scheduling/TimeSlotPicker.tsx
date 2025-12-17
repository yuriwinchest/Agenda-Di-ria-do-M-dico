import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Doctor } from './ServiceSelector';

export interface TimeSlot {
    id: string;
    time: string;
    available: boolean;
}

interface TimeSlotPickerProps {
    doctor: Doctor;
    selectedDate: Date;
    onSelect: (slot: TimeSlot) => void;
    initialSlot?: TimeSlot | null;
}

// Generate mock slots for demo
const generateSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;

    for (let h = startHour; h < endHour; h++) {
        const time = `${h.toString().padStart(2, '0')}:00`;
        slots.push({ id: `slot-${h}-00`, time, available: Math.random() > 0.3 });

        const time30 = `${h.toString().padStart(2, '0')}:30`;
        slots.push({ id: `slot-${h}-30`, time: time30, available: Math.random() > 0.3 });
    }
    return slots;
};

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ doctor, onSelect, initialSlot, selectedDate }) => {
    // In a real app, we would fetch slots for the specific doctor and date
    // For now, we use a consistent mock based on doctor ID to simulate variety
    const [slots] = useState<TimeSlot[]>(generateSlots());

    const morningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 12);
    const afternoonSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 12);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full border border-white shadow-sm" />
                <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Agenda de</p>
                    <h3 className="text-base font-bold text-slate-900">{doctor.name}</h3>
                </div>
                <div className="ml-auto text-right">
                    <p className="text-xs text-slate-500">Data Selecionada</p>
                    <p className="font-semibold text-slate-900 capitalize">
                        {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                <div className="mb-6">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3">
                        <span className="material-symbols-outlined text-[18px]">wb_sunny</span>
                        Manhã
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {morningSlots.map(slot => (
                            <button
                                key={slot.id}
                                disabled={!slot.available}
                                onClick={() => onSelect(slot)}
                                className={cn(
                                    "py-2 rounded-lg text-sm font-medium transition-all shadow-sm border",
                                    !slot.available
                                        ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-60"
                                        : initialSlot?.id === slot.id
                                            ? "bg-green-600 text-white border-green-600 ring-2 ring-green-100"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50"
                                )}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-3">
                        <span className="material-symbols-outlined text-[18px]">wb_twilight</span>
                        Tarde
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {afternoonSlots.map(slot => (
                            <button
                                key={slot.id}
                                disabled={!slot.available}
                                onClick={() => onSelect(slot)}
                                className={cn(
                                    "py-2 rounded-lg text-sm font-medium transition-all shadow-sm border",
                                    !slot.available
                                        ? "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed opacity-60"
                                        : initialSlot?.id === slot.id
                                            ? "bg-green-600 text-white border-green-600 ring-2 ring-green-100"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50"
                                )}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 justify-center text-xs text-slate-500 mt-2">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-white border border-slate-200"></div>
                    <span>Disponível</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-600"></div>
                    <span>Selecionado</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-slate-100"></div>
                    <span>Ocupado</span>
                </div>
            </div>
        </div>
    );
};

export default TimeSlotPicker;
