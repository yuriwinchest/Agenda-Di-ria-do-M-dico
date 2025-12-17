import React, { useState } from 'react';

// Mock types for this view
interface QueueItem {
    id: string;
    name: string;
    time: string;
    service: string;
    insurance: string;
    value: number;
    status: 'pending' | 'paid' | 'refund';
}

interface ServiceItem {
    id: string;
    description: string;
    category: string;
    quantity: number;
    unitValue: number;
}

const FinanceView: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<string>('1');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('credit');

    const queueItems: QueueItem[] = [
        { id: '1', name: 'Ana Silva', time: '14:30', service: 'Consulta Rotina - Dr. Mendes', insurance: 'Particular', value: 350.00, status: 'pending' },
        { id: '2', name: 'Carlos Souza', time: '15:00', service: 'Exame Cardiológico', insurance: 'Unimed', value: 0.00, status: 'pending' },
        { id: '3', name: 'Mariana Costa', time: '15:15', service: 'Retorno', insurance: 'Particular', value: 150.00, status: 'pending' },
        { id: '4', name: 'Roberto Lima', time: '15:45', service: 'Raio-X Torax', insurance: 'SulAmérica', value: 45.00, status: 'pending' },
    ];

    const serviceItems: ServiceItem[] = [
        { id: '1', description: 'Consulta Rotina - Dr. Mendes', category: 'Clínica Geral', quantity: 1, unitValue: 350.00 }
    ];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">Caixa - Recepção</h1>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded">Caixa Aberto</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* Left Panel - Queue */}
                <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
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
                        <button className="flex-1 bg-white text-slate-900 text-sm font-medium py-1.5 rounded shadow-sm">Aguardando</button>
                        <button className="flex-1 text-slate-500 text-sm font-medium py-1.5 hover:text-slate-700">Pagos</button>
                        <button className="flex-1 text-slate-500 text-sm font-medium py-1.5 hover:text-slate-700">Reembolso</button>
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
                        {queueItems.map(item => (
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
                                    <span className="text-xs font-medium text-slate-500">{item.insurance}</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(item.value)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel - Detail */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
                    {/* Patient Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Ana Silva" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">Ana Silva</h2>
                                    <p className="text-sm text-slate-500 mt-1">CPF: 123.456.789-00 • Nasc: 12/05/1985 (39 anos)</p>
                                </div>
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">Particular</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 mt-4">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-[18px]">call</span>
                                    (11) 99887-7665
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <span className="material-symbols-outlined text-[18px]">mail</span>
                                    ana.silva@email.com
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 col-span-2">
                                    <span className="material-symbols-outlined text-[18px]">history</span>
                                    Última visita: 15/01/2023
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Detalhamento do Serviço</h3>

                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 font-semibold">Descrição</th>
                                        <th className="py-3 font-semibold text-center">Qtde</th>
                                        <th className="py-3 font-semibold text-right">Valor Unit.</th>
                                        <th className="py-3 font-semibold text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {serviceItems.map(item => (
                                        <tr key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                            <td className="py-4">
                                                <div className="font-medium text-slate-900">{item.description}</div>
                                                <div className="text-slate-400 text-xs mt-0.5">{item.category}</div>
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
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Adicionar item
                        </button>
                    </div>

                    {/* Payment Section */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Forma de Pagamento</h3>
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
                        <div className="flex flex-col md:flex-row gap-8 items-end">
                            <div className="flex-1 w-full">
                                <h3 className="font-bold text-slate-900 mb-4 text-lg">Resumo do Pagamento</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Subtotal</span>
                                        <span>R$ 350,00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm pb-3 border-b border-slate-100">
                                        <span>Desconto</span>
                                        <span>R$ 0,00</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <span className="text-lg font-bold text-slate-900">Total a Pagar</span>
                                        <span className="text-2xl font-bold text-blue-600">R$ 350,00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                                <button className="px-6 py-3 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                    Emitir Recibo
                                </button>
                                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined text-[20px]">check</span>
                                    Finalizar Pagamento
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer History */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                        <span className="font-semibold text-slate-600">Histórico de Transações Recentes</span>
                        <span className="material-symbols-outlined text-slate-400">expand_more</span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FinanceView;
