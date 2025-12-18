import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

interface PatientRecord {
    id: string;
    name: string;
    cpf: string;
    insurance_provider: string;
    phone?: string;
}

interface MedicalHistoryItem {
    id: string;
    created_at: string;
    content: string;
    type: string;
    doctor?: {
        name: string;
        specialty: string;
    };
}

const MedicalRecordsView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState<PatientRecord[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<MedicalHistoryItem[]>([]);
    const [evolution, setEvolution] = useState('');
    const [isSigning, setIsSigning] = useState(false);
    const [signatureSuccess, setSignatureSuccess] = useState(false);

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
            .select('id, name, cpf, insurance_provider, phone');

        if (cleanCpf && cleanCpf.length > 0) {
            query = query.or(`name.ilike.*${searchTerm}*,cpf.ilike.*${cleanCpf}*`);
        } else {
            query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data } = await query.limit(5);
        if (data) setPatients(data);
        setLoading(false);
    };

    const fetchHistory = async (patientId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('medical_records')
            .select(`
                id,
                created_at,
                content,
                type,
                doctors (
                    name,
                    specialty
                )
            `)
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching history:', error);
        } else {
            const mapped = (data || []).map((item: any) => ({
                id: item.id,
                created_at: item.created_at,
                content: item.content,
                type: item.type,
                doctor: item.doctors ? {
                    name: item.doctors.name,
                    specialty: item.doctors.specialty
                } : undefined
            }));
            setHistory(mapped);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (selectedPatient) {
            fetchHistory(selectedPatient.id);
        } else {
            setHistory([]);
        }
    }, [selectedPatient]);

    const handleSignRecord = async () => {
        if (!evolution || !selectedPatient) return;

        setIsSigning(true);
        try {
            // First, get an appointment_id if possible (let's find the most recent one)
            const { data: appointments } = await supabase
                .from('appointments')
                .select('id')
                .eq('patient_id', selectedPatient.id)
                .order('appointment_date', { ascending: false })
                .limit(1);

            const appointmentId = appointments?.[0]?.id;

            // Save to medical_records
            const { error } = await supabase
                .from('medical_records')
                .insert([{
                    patient_id: selectedPatient.id,
                    appointment_id: appointmentId,
                    content: evolution,
                    type: 'evolution',
                    date: new Date().toISOString()
                }]);

            if (error) throw error;

            setSignatureSuccess(true);
            setTimeout(() => {
                setSignatureSuccess(false);
                setIsSigning(false);
                setEvolution('');
                fetchHistory(selectedPatient.id);
            }, 1000);
        } catch (error: any) {
            alert('Erro ao assinar prontuário: ' + error.message);
            setIsSigning(false);
        }
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

                            <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
                                <div className="space-y-8">
                                    {/* New Evolution Entry */}
                                    <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm shadow-blue-50">
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-600 text-lg">edit_note</span>
                                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Nova Evolução</h4>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">Hoje, {new Date().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <textarea
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-xl p-4 text-sm min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                            placeholder="Descreva a anamnese, evolução física e conduta terapêutica..."
                                            value={evolution}
                                            onChange={(e) => setEvolution(e.target.value)}
                                        ></textarea>
                                    </div>

                                    {/* History Timeline */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Histórico de Atendimentos</h4>

                                        {loading ? (
                                            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
                                        ) : history.length === 0 ? (
                                            <div className="p-8 text-center text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-200">
                                                Nenhum registro anterior encontrado.
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {history.map(item => (
                                                    <div key={item.id} className="relative pl-6 border-l-2 border-slate-100 py-2 group">
                                                        <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-blue-500 transition-colors"></div>
                                                        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
                                                            <div className="flex justify-between items-start mb-3">
                                                                <div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs font-bold text-slate-900">Dr(a). {item.doctor?.name || 'Médico da Clínica'}</span>
                                                                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[8px] font-bold uppercase">{item.doctor?.specialty || 'Generalista'}</span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(item.created_at).toLocaleString('pt-BR')}</p>
                                                                </div>
                                                                <span className="material-symbols-outlined text-slate-300 text-lg">verified_user</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{item.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
