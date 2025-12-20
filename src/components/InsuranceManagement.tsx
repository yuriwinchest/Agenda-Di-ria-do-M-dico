import React, { useState, useEffect } from 'react';
import { insuranceService } from '../services/InsuranceService';
import { cn } from '../lib/utils';
import {
    Plus,
    Search,
    ShieldCheck,
    ChevronRight,
    Building2,
    Stethoscope,
    Save,
    X,
    Trash2,
    CheckCircle2,
    Settings2,
    CreditCard,
    Users,
    Activity,
    Lock,
    Globe
} from 'lucide-react';

const InsuranceManagement: React.FC = () => {
    const [insurances, setInsurances] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
    const [activeEditTab, setActiveEditTab] = useState<'geral' | 'planos' | 'carteirinha' | 'clinico'>('geral');

    // Sub-form states for plans and clinical body
    const [newPlan, setNewPlan] = useState({ name: '', code: '' });
    const [newProfessional, setNewProfessional] = useState({ name: '', crm: '', role: 'Executante' });

    // Form states
    const [formData, setFormData] = useState<any>({
        name: '',
        registration_number: '',
        grace_period: 30,
        billing_executor: 'clinic',
        operator_code: '',
        version: '4.01.00',
        next_batch: '1',
        next_guide: '1',
        sadt_team: false,
        plans: [],
        professionals: [],
        card_validation: {
            mask: '0000 0000 0000 0000',
            digits: 16,
            requires_token: true,
            validate_online: true
        }
    });

    useEffect(() => {
        loadInsurances();
        loadProcedures();
    }, []);

    const loadProcedures = async () => {
        try {
            const data = await insuranceService.getProcedures();
            setTussProcedures(data);
        } catch (e) {
            console.error('Error loading procedures:', e);
        }
    };

    const loadInsurances = async () => {
        setLoading(true);
        try {
            const data = await insuranceService.getInsurances();
            setInsurances(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) return alert('O nome da operadora é obrigatório');
        setLoading(true);
        try {
            await insuranceService.saveInsurance(formData);
            resetForm();
            loadInsurances();
            alert('Convênio e Tabelas TISS salvos com sucesso!');
        } catch (error: any) {
            alert('Erro ao salvar no banco. Sincronização em cache.');
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            registration_number: '',
            grace_period: 30,
            billing_executor: 'clinic',
            operator_code: '',
            version: '4.01.00',
            next_batch: '1',
            next_guide: '1',
            sadt_team: false,
            plans: [],
            professionals: [],
            card_validation: {
                mask: '0000 0000 0000 0000',
                digits: 16,
                requires_token: true,
                validate_online: true
            }
        });
        setSelectedInsurance(null);
        setIsAddingNew(false);
        setActiveEditTab('geral');
    };

    const addPlan = () => {
        if (!newPlan.name) return;
        setFormData({
            ...formData,
            plans: [...(formData.plans || []), { ...newPlan, id: Date.now().toString() }]
        });
        setNewPlan({ name: '', code: '', coverage: [] });
    };

    const toggleProcedureInPlan = (planId: string, procedure: any) => {
        const updatedPlans = formData.plans.map((p: any) => {
            if (p.id === planId) {
                const hasProc = p.coverage?.find((c: any) => c.code === procedure.code);
                const newCoverage = hasProc
                    ? p.coverage.filter((c: any) => c.code !== procedure.code)
                    : [...(p.coverage || []), procedure];
                return { ...p, coverage: newCoverage };
            }
            return p;
        });
        setFormData({ ...formData, plans: updatedPlans });
    };

    const addProfessional = () => {
        if (!newProfessional.name) return;
        setFormData({
            ...formData,
            professionals: [...(formData.professionals || []), { ...newProfessional, id: Date.now().toString() }]
        });
        setNewProfessional({ name: '', crm: '', role: 'Executante' });
    };

    const filtered = insurances.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isAddingNew || selectedInsurance) {
        return (
            <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
                {/* Master Registration Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <Lock className="w-40 h-40 text-blue-600" />
                    </div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-200">
                            <ShieldCheck className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
                                {selectedInsurance ? 'Configuração Avançada' : 'Nova Integração TISS'}
                            </h2>
                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Módulo Winchester Hospitalar v4.01
                            </p>
                        </div>
                    </div>

                    <button onClick={resetForm} className="p-4 hover:bg-slate-100 rounded-[24px] text-slate-300 transition-all active:scale-95 group">
                        <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
                    </button>
                </div>

                {/* Internal Navigation Tabs */}
                <div className="flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-xl border border-slate-100 rounded-[28px] w-fit overflow-x-auto no-scrollbar">
                    {[
                        { id: 'geral', label: 'Dados Gerais', icon: Building2 },
                        { id: 'planos', label: 'Planos & Cobertura', icon: ClipboardText },
                        { id: 'carteirinha', label: 'Validação Card', icon: CreditCard },
                        { id: 'clinico', label: 'Corpo Clínico', icon: Stethoscope }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveEditTab(tab.id as any)}
                            className={cn(
                                "flex items-center gap-3 px-6 py-3.5 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all",
                                activeEditTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Forms Panel */}
                    <div className="lg:col-span-3 space-y-8">

                        {activeEditTab === 'geral' && (
                            <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-12 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Protocolo Operadora</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razão Comercial</label>
                                            <input
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all"
                                                placeholder="Unimed Winchester..."
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registro ANS</label>
                                            <input
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all"
                                                placeholder="000000-0"
                                                value={formData.registration_number}
                                                onChange={e => setFormData({ ...formData, registration_number: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-slate-50">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código Operadora</label>
                                        <input
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all"
                                            value={formData.operator_code}
                                            onChange={e => setFormData({ ...formData, operator_code: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocolo TISS</label>
                                        <select
                                            className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all"
                                            value={formData.version}
                                            onChange={e => setFormData({ ...formData, version: e.target.value })}
                                        >
                                            <option>4.01.00</option>
                                            <option>3.05.00</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executante Guia</label>
                                        <div className="flex p-1.5 bg-slate-100 rounded-[20px] border border-slate-200/50 h-16">
                                            <button
                                                onClick={() => setFormData({ ...formData, billing_executor: 'clinic' })}
                                                className={cn("flex-1 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all",
                                                    formData.billing_executor === 'clinic' ? "bg-white text-blue-600 shadow-xl" : "text-slate-400")}
                                            >Clínica</button>
                                            <button
                                                onClick={() => setFormData({ ...formData, billing_executor: 'professional' })}
                                                className={cn("flex-1 px-4 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all",
                                                    formData.billing_executor === 'professional' ? "bg-white text-blue-600 shadow-xl" : "text-slate-400")}
                                            >Médico</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeEditTab === 'planos' && (
                            <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-10 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Planos de Saúde</h3>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            placeholder="Nome do Plano"
                                            className="h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none"
                                            value={newPlan.name}
                                            onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                                        />
                                        <button
                                            onClick={addPlan}
                                            className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-95 transition-all"
                                        >
                                            <Plus className="w-6 h-6" strokeWidth={3} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.plans?.map((plan: any) => (
                                        <div key={plan.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[28px] flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm font-black text-xs">P</div>
                                                <p className="font-bold text-slate-700">{plan.name}</p>
                                            </div>
                                            <button
                                                onClick={() => setFormData({ ...formData, plans: formData.plans.filter((p: any) => p.id !== plan.id) })}
                                                className="p-3 text-slate-300 hover:text-rose-500 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                    {(formData.plans?.length === 0) && (
                                        <div className="col-span-full py-16 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nenhum plano cadastrado</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeEditTab === 'carteirinha' && (
                            <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-12 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div>
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Validação de Identidade</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Máscara do Número</label>
                                            <input
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-mono font-bold text-slate-700 tracking-widest"
                                                value={formData.card_validation?.mask}
                                                onChange={e => setFormData({ ...formData, card_validation: { ...formData.card_validation, mask: e.target.value } })}
                                                placeholder="0000 0000 0000 0000"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Qtd. Dígitos</label>
                                            <input
                                                type="number"
                                                className="w-full h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700"
                                                value={formData.card_validation?.digits}
                                                onChange={e => setFormData({ ...formData, card_validation: { ...formData.card_validation, digits: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10 border-t border-slate-50">
                                    {[
                                        { key: 'requires_token', label: 'Exigir Token na Recepção', icon: Lock },
                                        { key: 'validate_online', label: 'Validação Online via WebService', icon: Globe }
                                    ].map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => setFormData({
                                                ...formData,
                                                card_validation: {
                                                    ...formData.card_validation,
                                                    [opt.key]: !formData.card_validation[opt.key as any]
                                                }
                                            })}
                                            className={cn(
                                                "p-6 rounded-[32px] border flex items-center justify-between transition-all group",
                                                formData.card_validation[opt.key as any]
                                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                    : "bg-slate-50 border-slate-200 text-slate-400"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors",
                                                    formData.card_validation[opt.key as any] ? "bg-white text-emerald-600" : "bg-white text-slate-300")}>
                                                    <opt.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                                            </div>
                                            <div className={cn("w-10 h-6 rounded-full relative transition-colors p-1",
                                                formData.card_validation[opt.key as any] ? "bg-emerald-500" : "bg-slate-300")}>
                                                <div className={cn("w-4 h-4 bg-white rounded-full transition-all",
                                                    formData.card_validation[opt.key as any] ? "translate-x-4" : "translate-x-0")} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeEditTab === 'clinico' && (
                            <div className="bg-white p-10 rounded-[44px] border border-slate-100 shadow-sm space-y-10 animate-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em]">Médicos Vinculados</h3>
                                    </div>
                                    <button
                                        onClick={addProfessional}
                                        className="h-14 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
                                    >Adicionar Médico</button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        className="h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold"
                                        placeholder="Nome do Médico"
                                        value={newProfessional.name}
                                        onChange={e => setNewProfessional({ ...newProfessional, name: e.target.value })}
                                    />
                                    <input
                                        className="h-16 px-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-bold"
                                        placeholder="CRM"
                                        value={newProfessional.crm}
                                        onChange={e => setNewProfessional({ ...newProfessional, crm: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 pt-10">
                                    {formData.professionals?.map((prof: any) => (
                                        <div key={prof.id} className="p-8 bg-white border border-slate-100 rounded-[40px] flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600">
                                                    <Stethoscope className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase text-sm tracking-tight">{prof.name}</p>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CRM: {prof.crm} • Winchester Partner</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">Credenciado</span>
                                                <button
                                                    onClick={() => setFormData({ ...formData, professionals: formData.professionals.filter((p: any) => p.id !== prof.id) })}
                                                    className="p-4 text-slate-200 hover:text-rose-500 transition-all"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Action Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-slate-900 p-10 rounded-[44px] text-white shadow-2xl shadow-blue-200/20 relative overflow-hidden group border border-white/5">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-blue-500/20 transition-all duration-700"></div>

                            <div className="space-y-2 mb-12">
                                <h4 className="text-2xl font-black tracking-tight leading-none">Publicar Configurações</h4>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sincronização Hospitalar</p>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 rounded-[32px] border border-white/10 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Planos Ativos</span>
                                        <span className="font-black text-blue-400">{formData.plans?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Acesso Clínico</span>
                                        <span className="font-black text-blue-400">{formData.professionals?.length || 0}</span>
                                    </div>
                                    <div className="h-px bg-white/10 w-full"></div>
                                    <div className="flex justify-between items-center text-xs font-black">
                                        <span className="text-slate-400 uppercase tracking-widest">Status Web Service</span>
                                        <span className="text-emerald-400 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                            PRONTO
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="w-full mt-10 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-blue-600/40 transition-all transform active:scale-95 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-4"
                            >
                                <Save className="w-6 h-6" />
                                {loading ? 'GERANDO TISS...' : 'SALVAR NA NUVEM'}
                            </button>
                        </div>

                        {/* Status Card */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                <Search className="w-6 h-6" />
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dica Winchester</h5>
                                <p className="text-[11px] font-bold text-slate-600 mt-1 leading-relaxed">Configure a máscara da carteirinha para auto-formatar o número na recepção.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-8 animate-in fade-in duration-500">
            {/* Responsive List Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-1">
                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">Painel de Convênios</h2>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-3">
                        <span className="w-2 h-4 bg-blue-600 rounded-full"></span>
                        Gestão de Operadoras e Tabelas TISS
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            placeholder="Localizar Convênio..."
                            className="h-14 pl-12 pr-6 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 text-xs font-bold w-64 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <Plus className="w-5 h-5" strokeWidth={3} />
                        Cadastrar Operadora
                    </button>
                </div>
            </div>

            {/* List and Filters - Grid Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filtered.map(ins => (
                    <div
                        key={ins.id}
                        onClick={() => { setSelectedInsurance(ins); setFormData(ins); }}
                        className="group p-8 bg-white rounded-[44px] border border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98] flex flex-col justify-between h-[320px]"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
                            <Settings2 className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>
                            <div className="w-16 h-16 bg-blue-50 rounded-[28px] flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                <ShieldCheck className="w-8 h-8" />
                            </div>

                            <h3 className="font-black text-slate-900 text-xl mb-1 tracking-tight truncate">{ins.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                Registro: {ins.operator_code}
                            </p>

                            <div className="flex gap-2">
                                <span className="px-3 py-1.5 bg-slate-50 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-100">
                                    {ins.plans?.length || 0} PLANOS
                                </span>
                                <span className="px-3 py-1.5 bg-blue-50 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest border border-blue-100">
                                    TISS {ins.version}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Integração</span>
                                <span className="text-xs font-black text-emerald-500 uppercase">WebService Ativo</span>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all duration-300">
                                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-white" />
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex flex-col items-center justify-center p-12 bg-white rounded-[44px] border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 transition-all text-slate-300 hover:text-blue-600 group active:scale-95 h-[320px]"
                >
                    <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-xl transition-all mb-4">
                        <Plus className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em]">Nova Operadora</span>
                </button>
            </div>
        </div>
    );
};

interface ClipboardTextProps extends React.SVGProps<SVGSVGElement> { }
const ClipboardText: React.FC<ClipboardTextProps> = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14h6" />
        <path d="M9 18h6" />
        <path d="M9 10h6" />
    </svg>
);

export default InsuranceManagement;
