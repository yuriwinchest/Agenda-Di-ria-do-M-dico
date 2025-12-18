import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface PatientRegistrationProps {
    onBack: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birth_date: '',
        gender: '',
        billing_type: 'Particular', // Particular or Convênio
        insurance_provider: '',
        insurance_card_number: '',
        preferred_payment_method: 'Cartão de Crédito', // Cartão, PIX, Dinheiro
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!formData.name || !formData.cpf) {
            alert('Por favor, preencha o nome e o CPF do paciente.');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('patients')
                .insert([formData]);

            if (error) throw error;

            alert('Paciente cadastrado com sucesso!');
            onBack();
        } catch (error: any) {
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Novo Cadastro</h2>
                    <p className="mt-1 text-slate-500 font-medium text-sm">Informações pessoais e configuração de faturamento.</p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-bold text-sm border border-slate-200"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                    Voltar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Data */}
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <span className="material-symbols-outlined text-xl">person</span>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Dados Pessoais</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Nome Completo</label>
                                <input
                                    type="text"
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                    placeholder="Ex: João da Silva"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">CPF</label>
                                <input
                                    type="text"
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">WhatsApp / Telefone</label>
                                <input
                                    type="text"
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                    placeholder="(61) 99999-9999"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 ml-1">Data de Nascimento</label>
                                <input
                                    type="date"
                                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                    value={formData.birth_date}
                                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6 text-slate-400">
                            <span className="material-symbols-outlined text-xl">location_on</span>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Endereço</h3>
                        </div>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                            placeholder="Rua, Número, Bairro, Cidade..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                </div>

                {/* Right Column: Billing Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 space-y-6">
                        <div className="flex items-center gap-2 text-blue-600">
                            <span className="material-symbols-outlined text-xl">payments</span>
                            <h3 className="text-xs font-bold uppercase tracking-widest">Faturamento</h3>
                        </div>

                        {/* Billing Type Toggle */}
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Tipo de Recebimento</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                                {['Particular', 'Convênio'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, billing_type: type })}
                                        className={`py-2.5 rounded-xl font-bold text-sm transition-all ${formData.billing_type === type
                                                ? 'bg-white text-blue-600 shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Fields */}
                        {formData.billing_type === 'Convênio' ? (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Plano de Saúde</label>
                                    <select
                                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium appearance-none"
                                        value={formData.insurance_provider}
                                        onChange={(e) => setFormData({ ...formData, insurance_provider: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Unimed">Unimed</option>
                                        <option value="Bradesco">Bradesco Saúde</option>
                                        <option value="Sulamérica">Sulamérica</option>
                                        <option value="Amil">Amil</option>
                                        <option value="Cassi">Cassi</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-slate-700 ml-1">Matrícula / Carteirinha</label>
                                    <input
                                        type="text"
                                        className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                        placeholder="Número da carteirinha"
                                        value={formData.insurance_card_number}
                                        onChange={(e) => setFormData({ ...formData, insurance_card_number: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Forma de Pagto.</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {['Cartão de Crédito', 'Dinheiro', 'PIX'].map(method => (
                                        <button
                                            key={method}
                                            onClick={() => setFormData({ ...formData, preferred_payment_method: method })}
                                            className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-between transition-all ${formData.preferred_payment_method === method
                                                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                    : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100'
                                                }`}
                                        >
                                            {method}
                                            {formData.preferred_payment_method === method && <span className="material-symbols-outlined text-sm">check_circle</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                        >
                            <span className="material-symbols-outlined">{loading ? 'sync' : 'how_to_reg'}</span>
                            {loading ? 'Salvando...' : 'Salvar Cadastro'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;