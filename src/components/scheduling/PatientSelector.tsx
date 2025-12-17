import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface PatientData {
    id?: string;
    name: string;
    cpf: string;
    phone: string;
    email?: string;
    isNew?: boolean;
}

interface PatientSelectorProps {
    onSelect: (patient: PatientData) => void;
    initialData?: PatientData | null;
}

const MOCK_PATIENTS: PatientData[] = [
    { id: '1', name: 'Ana Silva', cpf: '123.456.789-00', phone: '(11) 99887-7665', email: 'ana@email.com' },
    { id: '2', name: 'Carlos Souza', cpf: '987.654.321-99', phone: '(11) 98765-4321', email: 'carlos@email.com' },
    { id: '3', name: 'Mariana Costa', cpf: '456.789.123-44', phone: '(21) 99999-8888', email: 'mariana@email.com' },
];

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect, initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [newPatient, setNewPatient] = useState<PatientData>({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        isNew: true
    });

    const filteredPatients = MOCK_PATIENTS.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf.includes(searchTerm)
    );

    const handleNewPatientChange = (field: keyof PatientData, value: string) => {
        setNewPatient(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateSelect = () => {
        if (newPatient.name && newPatient.phone) {
            onSelect({ ...newPatient, id: Math.random().toString() }); // Mock ID
        }
    };

    if (isCreatingNew) {
        return (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">Novo Paciente</h3>
                    <button
                        onClick={() => setIsCreatingNew(false)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Voltar para busca
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Nome Completo *</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={newPatient.name}
                            onChange={(e) => handleNewPatientChange('name', e.target.value)}
                            placeholder="Ex: João da Silva"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">CPF</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={newPatient.cpf}
                            onChange={(e) => handleNewPatientChange('cpf', e.target.value)}
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Telefone *</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={newPatient.phone}
                            onChange={(e) => handleNewPatientChange('phone', e.target.value)}
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">E-mail</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={newPatient.email}
                            onChange={(e) => handleNewPatientChange('email', e.target.value)}
                            placeholder="email@exemplo.com"
                        />
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        disabled={!newPatient.name || !newPatient.phone}
                        onClick={handleCreateSelect}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirmar e Selecionar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800">Buscar Paciente</h3>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input
                    type="text"
                    placeholder="Buscar por nome ou CPF..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto border border-slate-100 rounded-lg">
                {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                        <div
                            key={patient.id}
                            onClick={() => onSelect(patient)}
                            className={cn(
                                "p-3 border-b border-slate-50 last:border-0 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center group",
                                initialData?.id === patient.id ? "bg-blue-50 border-blue-200" : ""
                            )}
                        >
                            <div>
                                <p className="font-medium text-slate-800">{patient.name}</p>
                                <p className="text-xs text-slate-500">{patient.cpf} • {patient.phone}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500">chevron_right</span>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">person_off</span>
                        <p>Nenhum paciente encontrado.</p>
                    </div>
                )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-center">
                <button
                    onClick={() => setIsCreatingNew(true)}
                    className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Cadastrar Novo Paciente
                </button>
            </div>
        </div>
    );
};

export default PatientSelector;
