import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import {
    Plus,
    Search,
    ShieldCheck,
    ChevronRight,
    Building2,
    User2,
    Stethoscope,
    Save,
    X,
    Trash2,
    CheckCircle2
} from 'lucide-react';

interface InsurancePlan {
    id: string;
    name: string;
}

interface Insurance {
    id: string;
    name: string;
    registration_number: string;
    grace_period: number;
    billing_executor: 'clinic' | 'professional';
    operator_code: string;
    version: string;
    next_batch: string;
    next_guide: string;
    sadt_team: boolean;
    plans: InsurancePlan[];
    professionals: string[]; // doctor IDs
}

const InsuranceManagement: React.FC = () => {
    const [insurances, setInsurances] = useState<Insurance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
    const [doctors, setDoctors] = useState<any[]>([]);

    // Form states
    const [formData, setFormData] = useState<Partial<Insurance>>({
        name: '',
        registration_number: '',
        grace_period: 30,
        billing_executor: 'clinic',
        operator_code: '',
        version: '3.05.00',
        next_batch: '1',
        next_guide: '1',
        sadt_team: false,
        plans: [],
        professionals: []
    });

    const [newPlanName, setNewPlanName] = useState('');

    useEffect(() => {
        fetchInsurances();
        fetchDoctors();
    }, []);

    const fetchInsurances = async () => {
        setLoading(true);
        // Using mock data for now as table might not exist yet
        const mockInsurances: Insurance[] = [
            {
                id: '1',
                name: 'Unimed Central',
                registration_number: '12345678',
                grace_period: 30,
                billing_executor: 'clinic',
                operator_code: 'UNI-999',
                version: '3.05.00',
                next_batch: '45',
                next_guide: '128',
                sadt_team: true,
                plans: [{ id: 'p1', name: 'Unifácil' }, { id: 'p2', name: 'Unimax' }],
                professionals: []
            },
            {
                id: '2',
                name: 'Bradesco Saúde',
                registration_number: '87654321',
                grace_period: 30,
                billing_executor: 'professional',
                operator_code: 'BRD-123',
                version: '3.04.01',
                next_batch: '12',
                next_guide: '540',
                sadt_team: false,
                plans: [{ id: 'p3', name: 'Top Nacional' }],
                professionals: []
            }
        ];

        // Try to fetch from supabase if table exists
        try {
            const { data, error } = await supabase.from('insurances').select('*');
            if (!error && data && data.length > 0) {
                setInsurances(data);
            } else {
                setInsurances(mockInsurances);
            }
        } catch (e) {
            setInsurances(mockInsurances);
        }
        setLoading(false);
    };

    const fetchDoctors = async () => {
        const { data } = await supabase.from('doctors').select('id, name');
        if (data) setDoctors(data);
    };

    const handleSave = async () => {
        if (!formData.name) return alert('O nome é obrigatório');

        setLoading(true);
        // Simulate save
        const newInsurance = {
            ...formData,
            id: selectedInsurance?.id || Math.random().toString(36).substr(2, 9),
        } as Insurance;

        if (selectedInsurance) {
            setInsurances(insurances.map(i => i.id === selectedInsurance.id ? newInsurance : i));
        } else {
            setInsurances([...insurances, newInsurance]);
        }

        setIsAddingNew(false);
        setSelectedInsurance(null);
        setLoading(false);
        alert('Configurações de convênio salvas!');
    };

    const addPlan = () => {
        if (!newPlanName) return;
        const newPlan = { id: Math.random().toString(36).substr(2, 9), name: newPlanName };
        setFormData({
            ...formData,
            plans: [...(formData.plans || []), newPlan]
        });
        setNewPlanName('');
    };

    const removePlan = (id: string) => {
        setFormData({
            ...formData,
            plans: (formData.plans || []).filter(p => p.id !== id)
        });
    };

    const toggleProfessional = (id: string) => {
        const current = formData.professionals || [];
        if (current.includes(id)) {
            setFormData({ ...formData, professionals: current.filter(p => p !== id) });
        } else {
            setFormData({ ...formData, professionals: [...current, id] });
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            registration_number: '',
            grace_period: 30,
            billing_executor: 'clinic',
            operator_code: '',
            version: '3.05.00',
            next_batch: '1',
            next_guide: '1',
            sadt_team: false,
            plans: [],
            professionals: []
        });
        setSelectedInsurance(null);
        setIsAddingNew(false);
    };

    const filteredInsurances = insurances.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isAddingNew || selectedInsurance) {
        return (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                {selectedInsurance ? 'Editar Convênio' : 'Adicionar Convênio'}
                            </h2>
                            <p className="text-sm text-slate-500">Alterando as configurações da clínica: <span className="font-bold text-slate-700">Clínica Dim Winchester</span></p>
                        </div>
                    </div>
                    <button
                        onClick={resetForm}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Settings */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Nome do Convênio *</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Unimed Central"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Número de Registro</label>
                                    <input
                                        type="text"
                                        placeholder="Código ANS ou Registro"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        value={formData.registration_number}
                                        onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Período de Carência (Dias)</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            className="w-24 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            value={formData.grace_period}
                                            onChange={(e) => setFormData({ ...formData, grace_period: parseInt(e.target.value) })}
                                        />
                                        <span className="text-sm font-medium text-slate-400">dias</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-6 text-blue-600">
                                    <Building2 className="w-5 h-5" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest">Faturamento e TISS</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Executante</label>
                                        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
                                            <button
                                                onClick={() => setFormData({ ...formData, billing_executor: 'clinic' })}
                                                className={cn(
                                                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                                    formData.billing_executor === 'clinic' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                                                )}
                                            >
                                                Clínica
                                            </button>
                                            <button
                                                onClick={() => setFormData({ ...formData, billing_executor: 'professional' })}
                                                className={cn(
                                                    "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                                                    formData.billing_executor === 'professional' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
                                                )}
                                            >
                                                Profissional
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Código na Operadora</label>
                                        <input
                                            type="text"
                                            placeholder="Ex: 00982-1"
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            value={formData.operator_code}
                                            onChange={(e) => setFormData({ ...formData, operator_code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Versão TISS</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                            value={formData.version}
                                            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                                        >
                                            <option>3.02.00</option>
                                            <option>3.03.03</option>
                                            <option>3.04.01</option>
                                            <option>3.05.00</option>
                                            <option>4.01.00</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Próximo Lote</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                value={formData.next_batch}
                                                onChange={(e) => setFormData({ ...formData, next_batch: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Próxima Guia</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                value={formData.next_guide}
                                                onChange={(e) => setFormData({ ...formData, next_guide: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 py-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, sadt_team: !formData.sadt_team })}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                formData.sadt_team ? "bg-blue-600" : "bg-slate-300"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                                formData.sadt_team ? "left-7" : "left-1"
                                            )}></div>
                                        </button>
                                        <label className="text-sm font-bold text-slate-600">Equipe SADT?</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Plans Section */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                            <div className="flex items-center gap-2 text-slate-900 border-b border-slate-100 pb-4">
                                <Plus className="w-5 h-5" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Planos do Convênio</h3>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nome do plano (Ex: Básico, Executivo...)"
                                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                    value={newPlanName}
                                    onChange={(e) => setNewPlanName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && addPlan()}
                                />
                                <button
                                    onClick={addPlan}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                                >
                                    Adicionar
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {formData.plans?.map(plan => (
                                    <div key={plan.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                                        <span className="font-bold text-slate-700 text-sm">{plan.name}</span>
                                        <button
                                            onClick={() => removePlan(plan.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {(!formData.plans || formData.plans.length === 0) && (
                                    <div className="col-span-2 py-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                                        Nenhum plano cadastrado.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Professionals */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-2 mb-6 text-slate-900 border-b border-slate-100 pb-4">
                                <Stethoscope className="w-5 h-5" />
                                <h3 className="text-sm font-bold uppercase tracking-widest">Profissionais Ativos</h3>
                            </div>
                            <p className="text-xs text-slate-500 mb-4 font-medium italic">
                                Marque os profissionais que atendem por este convênio na clínica.
                            </p>

                            <div className="space-y-2">
                                {doctors.map(doc => (
                                    <button
                                        key={doc.id}
                                        onClick={() => toggleProfessional(doc.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all",
                                            formData.professionals?.includes(doc.id)
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                                                formData.professionals?.includes(doc.id) ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500 text-xs"
                                            )}>
                                                {doc.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-sm text-left truncate">{doc.name}</span>
                                        </div>
                                        {formData.professionals?.includes(doc.id) && <CheckCircle2 className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Summary Action */}
                        <div className="bg-slate-900 p-8 rounded-3xl shadow-2xl text-white space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-white font-bold text-lg">Pronto para salvar?</h4>
                                <p className="text-slate-400 text-sm">Todas as alterações entrarão em vigor imediatamente na recepção.</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500">Próxima Guia</span>
                                    <span className="font-mono font-bold">{formData.next_guide}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500">
            {/* List Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Gestão de Convênios</h2>
                    <p className="mt-1 text-slate-500">Configuração de faturamento, guias TISS e planos de saúde.</p>
                </div>
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center gap-2 px-6 h-12 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                    <Plus className="w-5 h-5" />
                    Novo Convênio
                </button>
            </div>

            {/* List and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-0">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar convênio..."
                            className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {loading && insurances.length === 0 ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredInsurances.map(ins => (
                                <div
                                    key={ins.id}
                                    onClick={() => {
                                        setSelectedInsurance(ins);
                                        setFormData(ins);
                                    }}
                                    className="group p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{ins.name}</h3>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{ins.operator_code || 'Sem Código'}</p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 uppercase">
                                            {ins.plans.length} Planos
                                        </span>
                                        <span className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-500 uppercase">
                                            Versão {ins.version}
                                        </span>
                                    </div>

                                    {/* Subtle details */}
                                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400">
                                        <span>PRÓXIMO LOTE: {ins.next_batch}</span>
                                        <span>GUIA: {ins.next_guide}</span>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-slate-400 hover:text-blue-600"
                            >
                                <Plus className="w-8 h-8 mb-2" />
                                <span className="font-bold text-xs uppercase tracking-widest">Adicionar Convênio</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InsuranceManagement;
