import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { financeService } from '../services/FinanceService';
import { eventBus, EVENTS } from '../utils/eventBus';
import InsuranceManagement from './InsuranceManagement';
import { cn } from '../lib/utils';
import {
    CheckCircle2,
    CreditCard,
    Search,
    UserSearch,
    ShieldCheck,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

interface QueueItem {
    id: string;
    patient_id: string;
    name: string;
    time: string;
    service: string;
    insurance: string;
    insuranceCard?: string;
    value: number;
    status: 'pending' | 'paid' | 'refund';
    billing_status?: 'pending' | 'auditing' | 'authorized' | 'denied';
    billing_type?: string;
    hasHealthPlan: boolean;
}

const FinanceView: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit');
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'refund' | 'insurances'>('pending');
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatientInfo, setSelectedPatientInfo] = useState<any>(null);

    // Insurance UI states
    const [token, setToken] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [eligibilityStatus, setEligibilityStatus] = useState<'idle' | 'checking' | 'active' | 'denied'>('idle');

    // Modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');

    useEffect(() => {
        if (activeTab !== 'insurances') {
            loadQueue();
        }

        // Subscribe to events
        const unsub = eventBus.subscribe(EVENTS.PAYMENT_COMPLETED, () => loadQueue());
        return () => unsub();
    }, [activeTab]);

    const loadQueue = async () => {
        setLoading(true);
        try {
            const data = await financeService.getTransactions(activeTab);
            const mapped: QueueItem[] = (data || []).map((item: any) => ({
                id: item.id,
                patient_id: item.patient_id,
                name: item.patients?.name || '---',
                time: new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                service: item.description,
                insurance: item.patients?.insurance_provider || 'Particular',
                insuranceCard: item.patients?.insurance_card_number,
                value: item.amount,
                status: activeTab as any,
                billing_status: item.billing_status || 'pending',
                billing_type: item.patients?.billing_type || 'Particular',
                hasHealthPlan: (item.patients?.billing_type || 'Particular') === 'Convênio'
            }));
            setQueueItems(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedPatientId) {
            fetchPatientDetail(selectedPatientId);
        } else {
            setSelectedPatientInfo(null);
        }
    }, [selectedPatientId]);

    const fetchPatientDetail = async (transactionId: string) => {
        const item = queueItems.find(q => q.id === transactionId);
        if (!item) return;

        const { data } = await supabase.from('patients').select('*').eq('id', item.patient_id).single();
        setSelectedPatientInfo(data);
    };

    const handleFinalizePayment = async () => {
        if (!selectedPatientId) return;
        setPaymentStep('processing');
        setShowPaymentModal(true);
        try {
            await financeService.processPayment(selectedPatientId, selectedPaymentMethod);
            setPaymentStep('success');
        } catch (error: any) {
            alert(error.message);
            setShowPaymentModal(false);
        }
    };

    const handleDeny = async () => {
        if (!selectedPatientId) return;
        if (!confirm('Glosar esta guia?')) return;
        try {
            await financeService.denyAuthorization(selectedPatientId);
            setSelectedPatientId(null);
            loadQueue();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const formatCurrency = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const selectedItem = queueItems.find(p => p.id === selectedPatientId);

    return (
        <div className="flex flex-col h-full gap-4 md:gap-6 overflow-hidden">
            {/* Header section with responsive layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 px-1">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-200">
                        <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">Gestão de Caixa</h1>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Caixa Winchester Aberto</span>
                        </div>
                    </div>
                </div>

                <div className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl w-full sm:w-auto h-11 border border-slate-200/50">
                    {(['pending', 'paid', 'insurances'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 sm:px-6 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                                activeTab === tab
                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                            )}
                        >
                            {tab === 'pending' && 'Aguardando'}
                            {tab === 'paid' && 'Pagos'}
                            {tab === 'insurances' && 'Convênios'}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'insurances' ? (
                <div className="flex-1 flex flex-col gap-6 overflow-hidden min-h-0">
                    <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit shrink-0">
                        <button
                            onClick={() => setToken('config')}
                            className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                token !== 'guias' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                        >Configuração</button>
                        <button
                            onClick={() => setToken('guias')}
                            className={cn("px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                                token === 'guias' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500")}
                        >Guias TISS</button>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar">
                        {token === 'guias' ? (
                            <div className="space-y-4 animate-in fade-in duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4 group hover:border-blue-500 transition-all">
                                            <div className="flex justify-between items-start">
                                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black">G</div>
                                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">Elegível</span>
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 uppercase text-sm">{i % 2 === 0 ? 'Ana Maria' : 'Carlos Lima'}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Guia: 2023-000{i} • TISS 4.01.00</p>
                                            </div>
                                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                                <span className="font-black text-blue-600">R$ 150,00</span>
                                                <button className="text-[10px] font-black text-slate-400 uppercase hover:text-blue-600 transition-colors">Ver XML</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <InsuranceManagement />
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
                    {/* Left Side: Queue List - Fully responsive width and cards */}
                    <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 h-[400px] lg:h-full">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Fila de Faturamento</h2>
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-full">{queueItems.length} itens</span>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                                {loading ? (
                                    <div className="flex flex-col gap-3 p-4">
                                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-xl animate-pulse"></div>)}
                                    </div>
                                ) : queueItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-2xl p-8">
                                        <AlertCircle className="w-10 h-10 opacity-20" />
                                        <p className="text-xs font-medium text-center">Nenhuma transação pendente no momento.</p>
                                    </div>
                                ) : queueItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedPatientId(item.id)}
                                        className={cn(
                                            "group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden active:scale-95",
                                            selectedPatientId === item.id
                                                ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-100 scale-[1.02]'
                                                : 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-md'
                                        )}
                                    >
                                        <div className={cn(
                                            "flex flex-col",
                                            selectedPatientId === item.id ? "text-white" : "text-slate-900"
                                        )}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-sm truncate pr-4">{item.name}</h3>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                    selectedPatientId === item.id ? "bg-white/20 text-white" : "bg-slate-50 text-slate-400"
                                                )}>{item.time}</span>
                                            </div>
                                            <p className={cn(
                                                "text-xs mb-4 truncate",
                                                selectedPatientId === item.id ? "text-white/80" : "text-slate-500"
                                            )}>{item.service}</p>

                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className={cn(
                                                        "text-[10px] font-bold uppercase",
                                                        selectedPatientId === item.id ? "text-white/60" : "text-slate-400"
                                                    )}>{item.insurance}</span>
                                                    <span className="font-black text-base">{formatCurrency(item.value)}</span>
                                                </div>
                                                <div className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                                                    selectedPatientId === item.id ? "bg-white text-blue-600" : "bg-blue-50 text-blue-600 border border-blue-100"
                                                )}>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Detail Panel - Responsive elements */}
                    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pb-10 custom-scrollbar pr-1">
                        {selectedPatientInfo ? (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Patient Summary Card */}
                                <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>

                                    <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                                        <div className="w-24 h-24 rounded-[28px] bg-gradient-to-tr from-blue-600 to-indigo-500 p-1 shadow-xl shadow-blue-100 shrink-0">
                                            <div className="w-full h-full bg-white rounded-[24px] flex items-center justify-center">
                                                <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-tr from-blue-600 to-indigo-600 uppercase">
                                                    {selectedPatientInfo.name.charAt(0)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{selectedPatientInfo.name}</h2>
                                                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
                                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                                        <AlertCircle className="w-4 h-4 text-blue-500" />
                                                        CPF: {selectedPatientInfo.cpf}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
                                                        <AlertCircle className="w-4 h-4 text-emerald-500" />
                                                        {selectedPatientInfo.phone}
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedItem?.billing_type === 'Convênio' && (
                                                <div className="mt-4 flex flex-col md:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/50">
                                                    <div className="flex-1 flex gap-6">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Convênio Ativo</p>
                                                            <p className="text-sm font-bold text-slate-700">{selectedPatientInfo.insurance_provider}</p>
                                                        </div>
                                                        <div className="w-px h-10 bg-slate-200"></div>
                                                        <div className="flex-1">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carteirinha</p>
                                                            <p className="text-sm font-mono font-black text-blue-600">{selectedPatientInfo.insurance_card_number || '---'}</p>
                                                        </div>
                                                    </div>
                                                    <button className="w-full md:w-auto px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all active:scale-95 shadow-sm">
                                                        Verificar Elegibilidade
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Billing Action Card */}
                                <div className="bg-white rounded-[32px] border border-slate-200 shadow-xl overflow-hidden">
                                    <div className="p-8 space-y-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                                <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                                                Resumo da Transação
                                            </h3>
                                            <div className="flex flex-col gap-4">
                                                <div className="flex justify-between items-center py-4 px-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                                    <span className="text-slate-500 font-bold text-sm tracking-tight">{selectedItem?.service}</span>
                                                    <span className="text-slate-900 font-black text-lg">{formatCurrency(selectedItem?.value || 0)}</span>
                                                </div>
                                                <div className="flex justify-between items-center px-6">
                                                    <span className="text-xl font-bold text-slate-900">Total a Receber</span>
                                                    <span className="text-3xl font-black text-blue-600">{formatCurrency(selectedItem?.value || 0)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedItem?.billing_type !== 'Convênio' && (
                                            <div>
                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Método de Liquidação</h3>
                                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                    {[
                                                        { id: 'credit', label: 'Cartão', icon: CreditCard },
                                                        { id: 'pix', label: 'PIX Cofrinho', icon: ShieldCheck },
                                                        { id: 'money', label: 'Espécie', icon: AlertCircle },
                                                        { id: 'debit', label: 'Débito', icon: CreditCard }
                                                    ].map(method => (
                                                        <button
                                                            key={method.id}
                                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all active:scale-95",
                                                                selectedPaymentMethod === method.id
                                                                    ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm"
                                                                    : "border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200"
                                                            )}
                                                        >
                                                            <method.icon className={cn("w-7 h-7", selectedPaymentMethod === method.id ? "text-blue-600" : "text-slate-300")} />
                                                            <span className="text-xs font-black uppercase tracking-wider">{method.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={handleDeny}
                                                className="flex-1 py-4 px-6 rounded-2xl border border-rose-100 text-rose-500 font-bold text-sm hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                            >
                                                Glosar / Cancelar
                                            </button>
                                            <button
                                                onClick={handleFinalizePayment}
                                                className="flex-[2] py-4 px-10 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 active:scale-95"
                                            >
                                                <CheckCircle2 className="w-5 h-5" />
                                                Finalizar Recebimento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-[32px] border-2 border-dashed border-slate-100 text-slate-300 p-12">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <UserSearch className="w-10 h-10 opacity-20" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-400">Pronto para processar</h4>
                                <p className="text-sm font-medium opacity-60 text-center max-w-xs mt-2">Escolha um item na fila à esquerda para iniciar o faturamento ou conferência de guias.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Payment Success Modal with responsive feel */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        {paymentStep === 'success' && (
                            <div className="p-10 md:p-14 text-center space-y-8">
                                <div className="relative inline-block">
                                    <div className="w-28 h-28 bg-emerald-100 rounded-[40px] flex items-center justify-center animate-bounce">
                                        <CheckCircle2 className="w-14 h-14 text-emerald-600" />
                                    </div>
                                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Recebimento Efetuado!</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed px-4">A transação foi registrada no banco de dados e o saldo da clínica atualizado em tempo real.</p>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentStep('method');
                                        setSelectedPatientId(null);
                                    }}
                                    className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-95"
                                >
                                    Concluir Faturamento
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FinanceView;
