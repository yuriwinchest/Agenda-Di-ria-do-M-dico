import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Real types based on DB schema
interface QueueItem {
    id: string; // transaction id
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

interface ServiceItem {
    id: string;
    description: string;
    category: string;
    quantity: number;
    unitValue: number;
    tuss?: string;
}

const FinanceView: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null); // This will now be the Transaction ID for uniqueness
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit');
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'refund'>('pending');
    const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Health Plan specific states
    const [token, setToken] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [eligibilityStatus, setEligibilityStatus] = useState<'idle' | 'checking' | 'active' | 'denied'>('idle');

    // Modals
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isEditingPatient, setIsEditingPatient] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');

    // Patient Detail state
    const [selectedPatientInfo, setSelectedPatientInfo] = useState<any>(null);

    useEffect(() => {
        fetchQueue();
    }, [activeTab]);

    const fetchQueue = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                id,
                amount,
                status,
                billing_status,
                description,
                created_at,
                patient_id,
                patients (
                    name,
                    insurance_provider,
                    insurance_card_number,
                    billing_type,
                    cpf,
                    phone,
                    email
                )
            `)
            .eq('status', activeTab === 'refund' ? 'refunded' : activeTab);

        if (error) {
            console.error('Error fetching finance queue:', error);
        } else {
            const mapped: QueueItem[] = (data || []).map((item: any) => ({
                id: item.id,
                patient_id: item.patient_id,
                name: item.patients?.name || '---',
                time: new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                service: item.description,
                insurance: item.patients?.insurance_provider || 'Particular',
                insuranceCard: item.patients?.insurance_card_number,
                value: item.amount,
                status: activeTab,
                billing_status: item.billing_status || 'pending',
                billing_type: item.patients?.billing_type || 'Particular',
                hasHealthPlan: (item.patients?.billing_type || 'Particular') === 'Convênio'
            }));
            setQueueItems(mapped);
        }
        setLoading(false);
    };

    const fetchPatientDetail = async (transactionId: string) => {
        const item = queueItems.find(q => q.id === transactionId);
        if (!item) return;

        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', item.patient_id)
            .single();

        if (error) {
            console.error('Error fetching patient detail:', error);
        } else {
            setSelectedPatientInfo(data);
        }
    };

    useEffect(() => {
        if (selectedPatientId) {
            fetchPatientDetail(selectedPatientId);
        } else {
            setSelectedPatientInfo(null);
        }
    }, [selectedPatientId]);

    const selectedItem = queueItems.find(p => p.id === selectedPatientId);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleCheckEligibility = () => {
        setEligibilityStatus('checking');
        setTimeout(() => {
            setEligibilityStatus('active');
        }, 1500);
    };

    const handleFinalizePayment = async () => {
        if (!selectedPatientId) return;

        setPaymentStep('processing');
        setShowPaymentModal(true);

        const { error } = await supabase
            .from('transactions')
            .update({
                status: 'paid',
                billing_status: 'authorized',
                payment_method: selectedPaymentMethod,
                payment_date: new Date().toISOString()
            })
            .eq('id', selectedPatientId);

        if (error) {
            alert("Erro ao processar pagamento: " + error.message);
            setShowPaymentModal(false);
        } else {
            setPaymentStep('success');
            fetchQueue();
        }
    };

    const handleDenyAuthorization = async () => {
        if (!selectedPatientId) return;

        const confirmDeny = confirm('Deseja realmente marcar esta guia como GLOSADA/NEGADA?');
        if (!confirmDeny) return;

        const { error } = await supabase
            .from('transactions')
            .update({
                billing_status: 'denied',
                status: 'refund' // Move to refund/problem tab
            })
            .eq('id', selectedPatientId);

        if (error) {
            alert("Erro ao glosar guia: " + error.message);
        } else {
            alert("Guia marcada como glosada.");
            setSelectedPatientId(null);
            fetchQueue();
        }
    };

    return (
        <div className="flex flex-col h-full gap-6 overflow-y-auto pb-6">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900">Caixa e Faturamento</h1>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded">Caixa Aberto</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-0">
                {/* Left Panel - Queue */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 h-fit lg:sticky lg:top-0">
                    <h2 className="text-lg font-semibold text-slate-800">Fila de Atendimento</h2>

                    <div className="flex p-1 bg-slate-100 rounded-lg">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex-1 text-sm font-medium py-1.5 rounded transition-all ${activeTab === 'pending' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Aguardando
                        </button>
                        <button
                            onClick={() => setActiveTab('paid')}
                            className={`flex-1 text-sm font-medium py-1.5 rounded transition-all ${activeTab === 'paid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Pagos
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {loading ? (
                            <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div></div>
                        ) : queueItems.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm bg-white rounded-xl border border-dashed border-slate-200">
                                Nenhuma transação pendente.
                            </div>
                        ) : queueItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPatientId(item.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${selectedPatientId === item.id
                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                    : 'bg-white border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                {/* Billing Type Ribbon */}
                                <div className={`absolute -right-8 top-2 rotate-45 px-8 pt-0.5 pb-1 text-[8px] font-bold uppercase tracking-widest text-center w-32 ${item.billing_type === 'Convênio' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {item.billing_type}
                                </div>

                                <span className={`absolute top-4 left-4 w-2 h-2 rounded-full ${item.billing_status === 'authorized' ? 'bg-green-500' :
                                        item.billing_status === 'denied' ? 'bg-red-500' :
                                            item.billing_status === 'auditing' ? 'bg-blue-500' : 'bg-slate-300'
                                    }`}></span>

                                <div className="pl-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-900 truncate pr-16">{item.name}</h3>
                                        <span className="text-[10px] font-bold text-slate-400">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.service}</p>

                                    <div className="flex justify-between items-center mt-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${item.hasHealthPlan ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {item.insurance}
                                        </span>
                                        <span className={`font-bold text-sm ${item.billing_status === 'denied' ? 'text-red-600 line-through opacity-50' : 'text-slate-900'}`}>
                                            {item.value > 0 ? formatCurrency(item.value) : '---'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Detail */}
                <div className="flex-1 flex flex-col gap-6 h-fit">
                    {selectedPatientInfo ? (
                        <>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                {selectedItem?.billing_type === 'Convênio' && (
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${eligibilityStatus === 'active' ? 'bg-emerald-50 border-emerald-100' :
                                                eligibilityStatus === 'denied' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'
                                            }`}>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Elegibilidade</span>
                                            {eligibilityStatus === 'checking' ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${eligibilityStatus === 'active' ? 'bg-emerald-500' : eligibilityStatus === 'denied' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {eligibilityStatus === 'active' ? 'ATIVA' : eligibilityStatus === 'denied' ? 'INATIVA' : 'A VERIFICAR'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-2xl uppercase border-4 border-white shadow-sm">
                                        {selectedPatientInfo.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-2xl font-bold text-slate-900">{selectedPatientInfo.name}</h2>
                                                <p className="text-sm text-slate-500 mt-1">CPF: {selectedPatientInfo.cpf} • {selectedPatientInfo.phone}</p>

                                                {selectedItem?.billing_type === 'Convênio' && (
                                                    <div className="mt-4 flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Convênio</p>
                                                            <p className="text-sm font-bold text-slate-700">{selectedPatientInfo.insurance_provider}</p>
                                                        </div>
                                                        <div className="w-px h-8 bg-slate-200"></div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Carteirinha</p>
                                                            <p className="text-sm font-mono font-bold text-slate-700">{selectedPatientInfo.insurance_card_number || '---'}</p>
                                                        </div>
                                                        <button
                                                            onClick={handleCheckEligibility}
                                                            className="ml-auto bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-all uppercase"
                                                        >
                                                            Verificar Online
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Resumo Financeiro</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Serviço: {selectedItem?.service}</span>
                                        <span>{formatCurrency(selectedItem?.value || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                        <span className="text-lg font-bold text-slate-900">Total a Pagar</span>
                                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(selectedItem?.value || 0)}</span>
                                    </div>
                                </div>

                                {selectedItem?.billing_type === 'Convênio' ? (
                                    <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="material-symbols-outlined text-blue-600">verified</span>
                                            <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Autorização de Guia (TISS)</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-blue-700">Token de Autorização</label>
                                                <input
                                                    type="text"
                                                    placeholder="Digite o código enviado pelo convênio"
                                                    value={token}
                                                    onChange={(e) => setToken(e.target.value)}
                                                    className="px-4 py-2.5 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold text-blue-700">Número da Autorização</label>
                                                <input
                                                    type="text"
                                                    placeholder="Ex: GUID-98210"
                                                    value={authNumber}
                                                    onChange={(e) => setAuthNumber(e.target.value)}
                                                    className="px-4 py-2.5 bg-white border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8">
                                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Método de Pagamento</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { id: 'credit', label: 'Crédito', icon: 'credit_card' },
                                                { id: 'debit', label: 'Débito', icon: 'credit_score' },
                                                { id: 'pix', label: 'Pix', icon: 'qr_code_2' },
                                                { id: 'money', label: 'Dinheiro', icon: 'payments' }
                                            ].map(method => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === method.id
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                                                        } relative`}
                                                >
                                                    <span className="material-symbols-outlined text-[32px]">{method.icon}</span>
                                                    <span className="font-medium">{method.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <button
                                        onClick={handleDenyAuthorization}
                                        className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-lg">cancel</span>
                                        Glosar Atendimento
                                    </button>

                                    {activeTab === 'pending' && (
                                        <button
                                            onClick={handleFinalizePayment}
                                            className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-3"
                                        >
                                            <span className="material-symbols-outlined text-[24px]">
                                                {selectedItem?.billing_type === 'Convênio' ? 'task_alt' : 'payments'}
                                            </span>
                                            {selectedItem?.billing_type === 'Convênio' ? 'Confirmar Autorização' : 'Finalizar e Receber'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                            <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
                            Selecione um item na fila para ver detalhes
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        {paymentStep === 'processing' && (
                            <div className="p-12 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <span className="material-symbols-outlined text-4xl text-blue-600">sync</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Processando Pagamento</h3>
                                <p className="text-slate-500 text-sm">Aguarde enquanto confirmamos a transação...</p>
                            </div>
                        )}

                        {paymentStep === 'success' && (
                            <div className="p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-5xl">check_circle</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Pagamento Realizado!</h3>
                                <p className="text-slate-500 mb-8">A transação foi concluída com sucesso e o registro atualizado.</p>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setPaymentStep('method');
                                        setSelectedPatientId(null);
                                    }}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg"
                                >
                                    Concluir e Voltar
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
