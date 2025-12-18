import React, { useState } from 'react';

// Mock types for this view
interface QueueItem {
    id: string;
    name: string;
    time: string;
    service: string;
    insurance: string;
    insuranceCard?: string;
    value: number;
    status: 'pending' | 'paid' | 'refund';
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
    const [selectedPatientId, setSelectedPatientId] = useState<string>('1');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit');
    const [activeTab, setActiveTab] = useState<'pending' | 'paid' | 'refund'>('pending');

    // Health Plan specific states
    const [token, setToken] = useState<string>('');
    const [authNumber, setAuthNumber] = useState<string>('');
    const [eligibilityStatus, setEligibilityStatus] = useState<'idle' | 'checking' | 'active' | 'denied'>('idle');

    const queueItems: QueueItem[] = [
        { id: '1', name: 'Ana Silva', time: '14:30', service: 'Consulta Rotina - Dr. Mendes', insurance: 'Particular', value: 350.00, status: 'pending', hasHealthPlan: false },
        { id: '2', name: 'Carlos Souza', time: '15:00', service: 'Exame Cardiológico', insurance: 'Unimed', insuranceCard: '1234.5678.9012.3456', value: 0.00, status: 'pending', hasHealthPlan: true },
        { id: '3', name: 'Mariana Costa', time: '15:15', service: 'Retorno', insurance: 'Particular', value: 0.00, status: 'pending', hasHealthPlan: false },
        { id: '4', name: 'Roberto Lima', time: '15:45', service: 'Raio-X Torax', insurance: 'SulAmérica', insuranceCard: '9876.5432.1098.7654', value: 0.00, status: 'pending', hasHealthPlan: true },
        { id: '5', name: 'Fernanda Oliveira', time: '10:00', service: 'Dermatologia', insurance: 'Particular', value: 200.00, status: 'paid', hasHealthPlan: false },
        { id: '6', name: 'Lucas Pereira', time: '11:30', service: 'Ortopedia', insurance: 'Bradesco', value: 0.00, status: 'paid', hasHealthPlan: true },
        { id: '7', name: 'Juliana Santos', time: '09:00', service: 'Consulta Cancelada', insurance: 'Particular', value: 350.00, status: 'refund', hasHealthPlan: false },
    ];

    const selectedPatient = queueItems.find(p => p.id === selectedPatientId);

    const serviceItems: ServiceItem[] = [
        { id: '1', description: 'Consulta Rotina - Dr. Mendes', category: 'Clínica Geral', quantity: 1, unitValue: 350.00, tuss: '40101010' }
    ];

    const filteredQueue = queueItems.filter(item => item.status === activeTab);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleCheckEligibility = () => {
        setEligibilityStatus('checking');
        setTimeout(() => {
            setEligibilityStatus('active');
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full gap-6 overflow-y-auto pb-6">
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold text-slate-900">Caixa e Faturamento</h1>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded">Caixa Aberto</span>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all">
                        <span className="material-symbols-outlined text-[20px]">file_download</span>
                        Exportar TISS (XML)
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm shadow-blue-500/30">
                        <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
                        Lotes de Faturamento
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-auto min-h-0">
                {/* Left Panel - Queue */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0 h-fit lg:sticky lg:top-0">
                    <h2 className="text-lg font-semibold text-slate-800">Fila de Atendimento</h2>

                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar paciente ou CPF..."
                            className="w-full bg-slate-100 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
                        />
                    </div>

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
                        <button
                            onClick={() => setActiveTab('refund')}
                            className={`flex-1 text-sm font-medium py-1.5 rounded transition-all ${activeTab === 'refund' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Glosados
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {filteredQueue.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedPatientId(item.id)}
                                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${selectedPatientId === item.id
                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                    : 'bg-white border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                <span className={`absolute top-4 right-4 text-xs font-semibold px-1.5 py-0.5 rounded ${selectedPatientId === item.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                                    {item.time}
                                </span>
                                <h3 className="font-bold text-slate-900">{item.name}</h3>
                                <p className="text-sm text-slate-500 mt-0.5">{item.service}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${item.hasHealthPlan ? 'text-blue-600' : 'text-slate-400'}`}>
                                            {item.insurance}
                                        </span>
                                    </div>
                                    <span className="font-bold text-slate-900">{item.value > 0 ? formatCurrency(item.value) : 'Convênio'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Detail */}
                <div className="flex-1 flex flex-col gap-6 h-fit">
                    {/* Patient Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <img src={`https://randomuser.me/api/portraits/${selectedPatient?.id === '1' ? 'women/44' : 'men/32'}.jpg`} alt={selectedPatient?.name} className="w-full h-full rounded-full object-cover" />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900">{selectedPatient?.name}</h2>
                                        <p className="text-sm text-slate-500 mt-1">CPF: 123.456.789-00 • Nasc: 12/05/1985 (39 anos)</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full border text-xs font-bold ${selectedPatient?.hasHealthPlan ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                                            {selectedPatient?.insurance}
                                        </span>
                                        {selectedPatient?.hasHealthPlan && (
                                            <button
                                                onClick={handleCheckEligibility}
                                                disabled={eligibilityStatus === 'checking'}
                                                className={`text-[10px] flex items-center gap-1 font-bold uppercase transition-all ${eligibilityStatus === 'active' ? 'text-emerald-600' : 'text-blue-600 hover:underline'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-[14px]">
                                                    {eligibilityStatus === 'active' ? 'check_circle' : 'verified'}
                                                </span>
                                                {eligibilityStatus === 'checking' ? 'Consultando...' : eligibilityStatus === 'active' ? 'Elegível' : 'Verificar Elegibilidade'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {selectedPatient?.hasHealthPlan && (
                                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Carteirinha</label>
                                            <p className="text-sm font-medium text-slate-700">{selectedPatient.insuranceCard || '---'}</p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Número da Guia</label>
                                            <input
                                                type="text"
                                                value={authNumber}
                                                onChange={(e) => setAuthNumber(e.target.value)}
                                                placeholder="00000000"
                                                className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm py-0.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase">Token de Validação</label>
                                            <input
                                                type="text"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                placeholder="---"
                                                className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none text-sm py-0.5"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Detalhamento para Faturamento</h3>
                            <span className="text-xs text-slate-400 font-medium">Tabela TUSS 4.01.01</span>
                        </div>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 font-semibold">Cód. TUSS</th>
                                        <th className="py-3 font-semibold">Descrição</th>
                                        <th className="py-3 font-semibold text-center">Qtde</th>
                                        <th className="py-3 font-semibold text-right">Valor Unit.</th>
                                        <th className="py-3 font-semibold text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceItems.map(item => (
                                        <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                            <td className="py-4 font-mono text-xs text-blue-600 font-bold">{item.tuss}</td>
                                            <td className="py-4">
                                                <div className="font-medium text-slate-900">{item.description}</div>
                                                <div className="text-slate-400 text-[10px] mt-0.5 uppercase">{item.category}</div>
                                            </td>
                                            <td className="py-4 text-center">{item.quantity}</td>
                                            <td className="py-4 text-right">{formatCurrency(item.unitValue)}</td>
                                            <td className="py-4 text-right font-medium text-slate-900">{formatCurrency(item.unitValue * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button className="mt-4 text-blue-600 text-sm font-semibold flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors w-fit">
                            <span className="material-symbols-outlined text-[20px]">add_circle</span>
                            Adicionar Procedimento
                        </button>
                    </div>

                    {/* Payment Section */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
                            {selectedPatient?.hasHealthPlan ? 'Pagamentos Adicionais / Co-participação' : 'Forma de Pagamento'}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { id: 'credit', label: 'Crédito', icon: 'credit_card' },
                                { id: 'debit', label: 'Débito', icon: 'credit_score' },
                                { id: 'pix', label: 'Pix', icon: 'qr_code_2' },
                                { id: 'health_plan', label: 'Fat. Convênio', icon: 'clinical_notes' }
                            ].map(method => (
                                <button
                                    key={method.id}
                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${selectedPaymentMethod === method.id
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-200'
                                        } relative`}
                                >
                                    {selectedPaymentMethod === method.id && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                        </div>
                                    )}
                                    <span className="material-symbols-outlined text-[32px]">{method.icon}</span>
                                    <span className="font-medium">{method.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex flex-col xl:flex-row gap-8 items-end">
                            <div className="flex-1 w-full">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Resumo Financeiro</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Valor Total dos Procedimentos</span>
                                        <span>{formatCurrency(350)}</span>
                                    </div>
                                    {selectedPatient?.hasHealthPlan && (
                                        <div className="flex justify-between text-blue-600 text-sm font-semibold">
                                            <span>Cobertura Convênio ({selectedPatient.insurance})</span>
                                            <span>-{formatCurrency(350)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                        <span className="text-lg font-bold text-slate-900">Total a Pagar (Paciente)</span>
                                        <span className="text-2xl font-bold text-blue-600">{formatCurrency(selectedPatient?.hasHealthPlan ? 0 : 350)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto shrink-0">
                                <button className="px-6 py-3 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 flex-1 xl:flex-none">
                                    <span className="material-symbols-outlined text-[20px]">print</span>
                                    Gerar Guia TISS
                                </button>
                                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 flex-1 xl:flex-none">
                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                    {selectedPatient?.hasHealthPlan ? 'Finalizar e Enviar Lote' : 'Finalizar Pagamento'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceView;
