import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface PatientRecord {
    id: string;
    name: string;
    cpf: string;
    insurance_provider: string;
}

const MedicalRecordsView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<PatientRecord[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [signatureSuccess, setSignatureSuccess] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 3) {
                searchPatients();
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const searchPatients = async () => {
        const { data } = await supabase
            .from('patients')
            .select('id, name, cpf, insurance_provider')
            .or(`name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
            .limit(5);
        if (data) setPatients(data);
    };

    const handleSignRecord = () => {
        setIsSigning(true);
        setTimeout(() => {
            setIsSigning(false);
            setSignatureSuccess(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Prontuário Eletrônico</h2>
                    <p className="mt-1 text-slate-500">Histórico clínico e faturamento integrado.</p>
                </div>
                {selectedPatient && (
                    <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                        Nova Evolução
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Search & Patient Info */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h4 className="font-bold text-slate-800 text-sm mb-4">Selecionar Paciente</h4>
                        <div className="relative mb-4">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-sm">search</span>
                            <input
                                type="text"
                                placeholder="Nome ou CPF..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            {patients.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => { setSelectedPatient(p); setPatients([]); setSearchTerm(''); }}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg border border-slate-100 hover:bg-blue-50 transition-colors",
                                        selectedPatient?.id === p.id ? "bg-blue-50 border-blue-200" : ""
                                    )}
                                >
                                    <p className="font-bold text-slate-800 text-xs">{p.name}</p>
                                    <p className="text-[10px] text-slate-500">CPF: {p.cpf}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedPatient && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h4 className="font-bold text-slate-800 text-sm mb-4">Dados do Atendimento</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Convênio</label>
                                    <p className="text-sm font-semibold text-slate-700">{selectedPatient.insurance_provider}</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>vpn_key</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-800 font-bold">Token Validado</p>
                                        <p className="text-[10px] text-slate-500">Pronto para atendimento</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    {!selectedPatient ? (
                        <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <span className="material-symbols-outlined text-6xl mb-4">person_search</span>
                            <p className="text-lg font-medium">Selecione um paciente para iniciar o prontuário</p>
                        </div>
                    ) : (
                        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800 text-sm">Registro Clínico</h3>
                                {signatureSuccess && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">verified</span>
                                        Assinado Digitalmente
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-6">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-blue-600 uppercase">Anamnese / Evolução</span>
                                            <span className="text-[10px] text-slate-400">Novo Registro</span>
                                        </div>
                                        <textarea
                                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm min-h-[150px] outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Descreva aqui os detalhes da consulta..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3">
                                <button
                                    onClick={handleSignRecord}
                                    disabled={isSigning || signatureSuccess}
                                    className={`flex items-center gap-2 px-6 h-10 font-bold text-xs rounded-lg transition-all ${signatureSuccess
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                                        }`}
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                        {isSigning ? 'sync' : signatureSuccess ? 'done_all' : 'draw'}
                                    </span>
                                    {isSigning ? 'Assinando...' : signatureSuccess ? 'Registro Assinado' : 'Finalizar e Assinar (ICP-Brasil)'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsView;
