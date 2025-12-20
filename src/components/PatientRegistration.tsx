import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface PatientRegistrationProps {
    onBack: () => void;
    initialData?: any;
}

// ... (previous content is matched by line number context in tool, but I can't skip lines in replacement content) ...
// Wait, I should use separate calls or encompass the whole block.
// I'll do two replaces. One for interface, one for title.

// Interface:
interface PatientRegistrationProps {
    onBack: () => void;
    onSaveSuccess?: (patient: any) => void;
    initialData?: any;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onBack, onSaveSuccess, initialData }) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'billing'>('personal');
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        cpf: initialData?.cpf || '',
        birth_date: initialData?.birth_date || '',
        gender: initialData?.gender || '',
        billing_type: initialData?.billing_type || 'Particular',
        insurance_provider: initialData?.insurance_provider || '',
        insurance_card_number: initialData?.insurance_card_number || '',
        preferred_payment_method: initialData?.preferred_payment_method || 'Cartão de Crédito',
        address: initialData?.address || ''
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!formData.name || !formData.cpf) {
            alert('Por favor, preencha o nome e o CPF do paciente.');
            return;
        }

        setLoading(true);
        try {
            let savedPatient = null;
            if (initialData?.id) {
                // Update
                const { data, error } = await supabase
                    .from('patients')
                    .update(formData)
                    .eq('id', initialData.id)
                    .select()
                    .single();
                if (error) throw error;
                savedPatient = data;
                alert('Cadastro atualizado com sucesso!');
            } else {
                // Insert
                const { data, error } = await supabase
                    .from('patients')
                    .insert([formData])
                    .select()
                    .single();
                if (error) throw error;
                savedPatient = data;
                alert('Paciente cadastrado com sucesso!');
            }

            if (onSaveSuccess && savedPatient) {
                onSaveSuccess(savedPatient);
            } else {
                onBack();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 animate-in fade-in duration-500 min-h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{initialData ? 'Editar Cadastro' : 'Novo Cadastro'}</h2>
                    <p className="mt-1 text-slate-500 font-medium text-sm">Preencha as informações para registro no sistema.</p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-bold text-sm border border-slate-200"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Voltar
                </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'personal'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-xl">person</span>
                    Dados Pessoais
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'billing'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-xl">payments</span>
                    Faturamento
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-8 flex-1">
                    {activeTab === 'personal' ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="flex items-center gap-2 text-slate-400">
                                <span className="material-symbols-outlined text-xl">person</span>
                                <h3 className="text-xs font-bold uppercase tracking-widest">Informações Cadastrais</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Nome Completo</label>
                                    <input
                                        type="text"
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        placeholder="Ex: João da Silva"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">CPF</label>
                                    <input
                                        type="text"
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        placeholder="email@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">WhatsApp / Telefone</label>
                                    <input
                                        type="text"
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        placeholder="(61) 99999-9999"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Data de Nascimento</label>
                                    <input
                                        type="date"
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        value={formData.birth_date}
                                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Sexo</label>
                                    <select
                                        className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="Outro">Outro</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Endereço Residencial</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">location_on</span>
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                            placeholder="Rua, Número, Bairro, Cidade..."
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <span className="material-symbols-outlined text-xl">payments</span>
                                    <h3 className="text-xs font-bold uppercase tracking-widest">Configuração de Cobrança</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">Tipo de Recebimento</label>
                                        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                                            {['Particular', 'Convênio'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFormData({ ...formData, billing_type: type })}
                                                    className={`py-3 rounded-xl font-bold text-sm transition-all ${formData.billing_type === type
                                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                                        : 'text-slate-500 hover:text-slate-700'
                                                        }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {formData.billing_type === 'Convênio' ? (
                                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Plano de Saúde</label>
                                                <select
                                                    className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                                    value={formData.insurance_provider}
                                                    onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                                                >
                                                    <option value="">Selecione o plano...</option>
                                                    <option value="Unimed">Unimed</option>
                                                    <option value="Bradesco">Bradesco Saúde</option>
                                                    <option value="Sulamérica">Sulamérica</option>
                                                    <option value="Amil">Amil</option>
                                                    <option value="Cassi">Cassi</option>
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Matrícula / Carteirinha</label>
                                                <input
                                                    type="text"
                                                    className="px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                                    placeholder="Número da carteirinha"
                                                    value={formData.insurance_card_number}
                                                    onChange={(e) => setFormData({ ...formData, insurance_card_number: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                            <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wider">Forma de Pagamento Preferencial</label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {['Cartão', 'Dinheiro', 'PIX'].map(method => (
                                                    <button
                                                        key={method}
                                                        onClick={() => setFormData({ ...formData, preferred_payment_method: method })}
                                                        className={`p-4 rounded-xl border-2 font-bold text-sm flex items-center justify-between transition-all ${formData.preferred_payment_method === method
                                                            ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                            : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="material-symbols-outlined">
                                                                {method === 'Cartão' ? 'credit_card' : method === 'Dinheiro' ? 'payments' : 'qr_code_2'}
                                                            </span>
                                                            {method}
                                                        </div>
                                                        {formData.preferred_payment_method === method && <span className="material-symbols-outlined text-blue-600">check_circle</span>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl flex flex-col justify-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                                        <span className="material-symbols-outlined text-2xl">info</span>
                                    </div>
                                    <h4 className="font-bold text-blue-900">Configuração de Atendimento</h4>
                                    <p className="text-sm text-blue-700 leading-relaxed">
                                        As configurações de faturamento definidas aqui serão aplicadas automaticamente nos próximos agendamentos deste paciente.
                                    </p>
                                    <div className="pt-4 border-t border-blue-200 mt-2">
                                        <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                                            <span className="material-symbols-outlined text-sm">event_available</span>
                                            Atividade Recente
                                        </div>
                                        <p className="text-xs text-blue-600 mt-1 italic">Nenhum atendimento registrado anteriormente.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                    <p className="text-xs text-slate-500 font-medium">
                        * Campos obrigatórios: Nome Completo e CPF.
                    </p>
                    <div className="flex items-center gap-3">
                        {activeTab === 'personal' ? (
                            <button
                                onClick={() => setActiveTab('billing')}
                                className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2"
                            >
                                Próximo: Faturamento
                                <span className="material-symbols-outlined text-lg">chevron_right</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setActiveTab('personal')}
                                className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all border border-slate-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">chevron_left</span>
                                Voltar para Dados
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 min-w-[180px]"
                        >
                            <span className="material-symbols-outlined text-lg">{loading ? 'sync' : 'save'}</span>
                            {loading ? 'Salvando...' : 'Salvar e Agendar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;