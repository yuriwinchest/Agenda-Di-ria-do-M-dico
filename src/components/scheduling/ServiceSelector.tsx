import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    avatar: string;
}

export interface ServiceData {
    specialty: string;
    doctor: Doctor;
}

interface ServiceSelectorProps {
    onSelect: (data: ServiceData) => void;
    initialData?: ServiceData | null;
}

const SPECIALTIES = ['Cardiologia', 'Clínica Geral', 'Dermatologia', 'Pediatria', 'Ortopedia'];

const MOCK_DOCTORS: Doctor[] = [
    { id: '1', name: 'Dr. Roberto Mendes', specialty: 'Cardiologia', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '2', name: 'Dra. Ana Paula', specialty: 'Dermatologia', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '3', name: 'Dr. João Silva', specialty: 'Clínica Geral', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { id: '4', name: 'Dra. Carla Dias', specialty: 'Pediatria', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { id: '5', name: 'Dr. Lucas Santos', specialty: 'Ortopedia', avatar: 'https://randomuser.me/api/portraits/men/12.jpg' },
];

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ onSelect, initialData }) => {
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialData?.specialty || '');

    const filteredDoctors = selectedSpecialty
        ? MOCK_DOCTORS.filter(d => d.specialty === selectedSpecialty)
        : MOCK_DOCTORS;

    const handleDoctorClick = (doctor: Doctor) => {
        onSelect({
            specialty: doctor.specialty,
            doctor
        });
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Especialidade</h3>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedSpecialty('')}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            !selectedSpecialty
                                ? "bg-slate-800 text-white border-slate-800"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                    >
                        Todas
                    </button>
                    {SPECIALTIES.map(spec => (
                        <button
                            key={spec}
                            onClick={() => setSelectedSpecialty(spec)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                selectedSpecialty === spec
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                            )}
                        >
                            {spec}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Selecione o Profissional</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDoctors.map(doctor => (
                        <div
                            key={doctor.id}
                            onClick={() => handleDoctorClick(doctor)}
                            className={cn(
                                "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 hover:shadow-md",
                                initialData?.doctor.id === doctor.id
                                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-500"
                                    : "bg-white border-slate-200 hover:border-blue-300"
                            )}
                        >
                            <img src={doctor.avatar} alt={doctor.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                            <div>
                                <h4 className="font-bold text-slate-900">{doctor.name}</h4>
                                <p className="text-xs text-slate-500">{doctor.specialty}</p>
                            </div>
                            <span className={cn(
                                "ml-auto material-symbols-outlined",
                                initialData?.doctor.id === doctor.id ? "text-blue-600" : "text-slate-300"
                            )}>
                                check_circle
                            </span>
                        </div>
                    ))}

                    {filteredDoctors.length === 0 && (
                        <div className="col-span-full p-8 text-center text-slate-500">
                            Nenhum médico encontrado para esta especialidade.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceSelector;
