import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

export interface PatientData {
    id: string;
    name: string;
    cpf: string;
    phone: string;
    email?: string;
    billing_type?: string;
    preferred_payment_method?: string;
    insurance_provider?: string;
    insurance_card_number?: string;
    isNew?: boolean;
}

interface PatientSelectorProps {
    onSelect: (patient: PatientData) => void;
    initialData?: PatientData | null;
}

const PatientSelector: React.FC<PatientSelectorProps> = ({ onSelect, initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [patients, setPatients] = useState<PatientData[]>([]);
    const [loading, setLoading] = useState(false);
    const [newPatient, setNewPatient] = useState<Partial<PatientData>>({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        billing_type: 'Particular',
        preferred_payment_method: 'Cartão de Crédito',
        insurance_provider: '',
        insurance_card_number: '',
        isNew: true
    });

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 1) {
                searchPatients();
            } else {
                setPatients([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchPatients = async () => {
        setLoading(true);
        const cleanCpf = searchTerm.replace(/\D/g, '');

        let query = supabase
            .from('patients')
            .select('id, name, cpf, phone, email, billing_type, preferred_payment_method, insurance_provider, insurance_card_number');

        if (cleanCpf && cleanCpf.length > 0) {
            query = query.or(`name.ilike.*${searchTerm}*,cpf.ilike.*${cleanCpf}*`);
        } else {
            query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query.limit(10);

        if (!error && data) {
            setPatients(data as PatientData[]);
        }
        setLoading(false);
    };

    const handleNewPatientChange = (field: keyof PatientData, value: string) => {
        setNewPatient(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateSelect = async () => {
        if (newPatient.name && newPatient.phone) {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .insert([{
                    name: newPatient.name,
                    cpf: newPatient.cpf,
                    phone: newPatient.phone,
                    email: newPatient.email,
                    billing_type: newPatient.billing_type,
                    preferred_payment_method: newPatient.preferred_payment_method,
                    insurance_provider: newPatient.insurance_provider,
                    insurance_card_number: newPatient.insurance_card_number
                }])
                .select()
                .single();

            if (!error && data) {
                onSelect(data as PatientData);
            } else {
                alert("Erro ao cadastrar: " + (error?.message || "Erro desconhecido"));
            }
            setLoading(false);
        }
    };

    if (isCreatingNew) {
        return (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">Novo Paciente Rápido</h3>
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

                    {/* Payment Info Section */}
                    <div className="md:col-span-2 pt-2 border-t border-slate-100 flex flex-col gap-3">
                        <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Informações de Pagamento</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500">Tipo de Atendimento</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['Particular', 'Convênio'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => handleNewPatientChange('billing_type', type)}
                                            className={cn(
                                                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-all",
                                                newPatient.billing_type === type
                                                    ? "bg-white text-blue-600 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700"
                                            )}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {newPatient.billing_type === 'Convênio' ? (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-slate-500">Convênio</label>
                                        <select
                                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            value={newPatient.insurance_provider || ''}
                                            onChange={(e) => handleNewPatientChange('insurance_provider', e.target.value)}
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Unimed">Unimed</option>
                                            <option value="Bradesco">Bradesco Saúde</option>
                                            <option value="Sulamérica">Sulamérica</option>
                                            <option value="Amil">Amil</option>
                                            <option value="Cassi">Cassi</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs font-medium text-slate-500">Número da Carteirinha</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                            value={newPatient.insurance_card_number || ''}
                                            onChange={(e) => handleNewPatientChange('insurance_card_number', e.target.value)}
                                            placeholder="Número da carteirinha"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-medium text-slate-500">Forma de Pagamento</label>
                                    <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                                        {['Cartão de Crédito', 'Dinheiro', 'PIX'].map(method => (
                                            <button
                                                key={method}
                                                onClick={() => handleNewPatientChange('preferred_payment_method', method)}
                                                className={cn(
                                                    "flex-1 py-1.5 text-[10px] font-semibold rounded-md transition-all whitespace-nowrap",
                                                    newPatient.preferred_payment_method === method
                                                        ? "bg-white text-blue-600 shadow-sm"
                                                        : "text-slate-500 hover:text-slate-700"
                                                )}
                                            >
                                                {method}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        disabled={!newPatient.name || !newPatient.phone || loading}
                        onClick={handleCreateSelect}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {loading ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : null}
                        {loading ? 'Cadastrando...' : 'Confirmar e Selecionar'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800">Buscar Paciente Cadastrado</h3>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">
                    {loading ? 'sync' : 'search'}
                </span>
                <input
                    type="text"
                    placeholder="Digite pelo menos 3 caracteres do Nome ou CPF..."
                    className={cn(
                        "w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all",
                        loading ? "border-blue-200" : ""
                    )}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto border border-slate-100 rounded-lg bg-white">
                {patients.length > 0 ? (
                    patients.map(patient => (
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
                ) : searchTerm.length >= 3 && !loading ? (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                        <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">person_off</span>
                        <p>Nenhum paciente encontrado para "{searchTerm}".</p>
                    </div>
                ) : (
                    <div className="p-8 text-center text-slate-400">
                        <p className="text-sm">Inicie a busca para selecionar um paciente.</p>
                    </div>
                )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-center">
                <button
                    onClick={() => setIsCreatingNew(true)}
                    className="text-blue-600 font-medium hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Paciente não cadastrado? Clique aqui
                </button>
            </div>
        </div>
    );
};

export default PatientSelector;
