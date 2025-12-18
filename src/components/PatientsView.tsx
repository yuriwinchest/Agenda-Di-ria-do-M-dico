import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import PatientRegistration from './PatientRegistration';
import { supabase } from '../lib/supabase';

const PatientsView: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching patients:', error);
        } else {
            setPatients(data || []);
        }
        setLoading(false);
    };

    const filteredPatients = patients.filter(p => {
        const searchLower = searchTerm.toLowerCase();
        const cleanSearch = searchTerm.replace(/\D/g, '');
        const cleanPatientCpf = p.cpf?.replace(/\D/g, '') || '';

        return (
            p.name.toLowerCase().includes(searchLower) ||
            p.email?.toLowerCase().includes(searchLower) ||
            (cleanSearch && cleanPatientCpf.includes(cleanSearch)) ||
            p.cpf?.includes(searchTerm)
        );
    });

    if (isRegistering) {
        return <PatientRegistration onBack={() => {
            setIsRegistering(false);
            fetchPatients();
        }} />;
    }

    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pacientes</h2>
                    <p className="mt-1 text-slate-500">Gerencie todos os registros de pacientes da clínica.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                        Exportar
                    </button>
                    <button
                        onClick={() => setIsRegistering(true)}
                        className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                        Novo Paciente
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-0">
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '20px' }}>search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome, email ou CPF..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none">
                            <option>Todos os Convênios</option>
                            <option>Particular</option>
                            <option>Unimed</option>
                        </select>
                        <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none">
                            <option>Status: Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                    <th className="px-6 py-4">Paciente</th>
                                    <th className="px-6 py-4">Contato</th>
                                    <th className="px-6 py-4">Convênio</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <span className="material-symbols-outlined">person</span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-sm">{patient.name}</div>
                                                    <div className="text-xs text-slate-500">{patient.birth_date} • {patient.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-700">{patient.email}</div>
                                            <div className="text-xs text-slate-500">{patient.phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.insurance_provider === 'Particular' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                                                {patient.insurance_provider}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500`}></span>
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Nenhum paciente encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
                {/* Footer Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <p className="text-xs text-slate-500">Mostrando <span className="font-medium text-slate-900">{filteredPatients.length}</span> pacientes</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientsView;
