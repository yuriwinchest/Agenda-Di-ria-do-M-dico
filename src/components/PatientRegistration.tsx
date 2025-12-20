import React, { useState } from 'react';
import { patientService } from '../services/PatientService';
import { cn } from '../lib/utils';
import {
    User,
    CreditCard,
    Calendar,
    ClipboardList,
    ChevronRight,
    Search,
    ShieldCheck,
    CheckCircle2,
    Plus
} from 'lucide-react';

interface PatientRegistrationProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState<'info' | 'billing' | 'schedule'>('info');
    const [loading, setLoading] = useState(false);
    const [registeredPatient, setRegisteredPatient] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        phone: '',
        email: '',
        billing_type: 'Particular' as 'Particular' | 'Convênio',
        insurance_provider: '',
        insurance_card_number: '',
        service: 'Consulta de Rotina',
        value: 150
    });

    const handleNext = () => {
        if (activeStep === 'info') setActiveStep('billing');
        else if (activeStep === 'billing') handleFinalRegister();
    };

    const handleFinalRegister = async () => {
        setLoading(true);
        try {
            // OO Approach: Service handles the logic and events
            const patient = await patientService.registerPatient({
                name: formData.name,
                cpf: formData.cpf,
                phone: formData.phone,
                email: formData.email,
                billing_type: formData.billing_type,
                insurance_provider: formData.insurance_provider,
                insurance_card_number: formData.insurance_card_number
            });

            await patientService.createConsultation(
                patient.id,
                formData.service,
                formData.value,
                formData.billing_type
            );

            setRegisteredPatient(patient);
            setActiveStep('schedule');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
            {/* Steps Header - Responsive & Dynamic */}
            <div className="bg-slate-50/80 backdrop-blur-md px-8 py-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Cadastro Winchester</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Prontuário Digital • V3.0</p>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-200/50 rounded-xl transition-colors">
                        <Plus className="rotate-45 w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex items-center gap-2 mt-8">
                    {[
                        { id: 'info', label: 'Dados', icon: User },
                        { id: 'billing', label: 'Financeiro', icon: CreditCard },
                        { id: 'schedule', label: 'Finalizado', icon: CheckCircle2 }
                    ].map((step, idx) => (
                        <React.Fragment key={step.id}>
                            <div className={cn(
                                "flex items-center gap-3 transition-all duration-500",
                                activeStep === step.id ? "opacity-100 scale-105" : "opacity-40"
                            )}>
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                                    activeStep === step.id ? "bg-blue-600 text-white shadow-blue-200" : "bg-white text-slate-400"
                                )}>
                                    <step.icon className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">{step.label}</span>
                            </div>
                            {idx < 2 && <div className="flex-1 h-px bg-slate-200 mx-4 max-w-[40px]"></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Form Content - Responsive Grid */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeStep === 'info' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
                            <h3 className="text-lg font-bold text-slate-900">Informações Pessoais</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                <input
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                    placeholder="Ex: Yuri Winchester"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF Nacional</label>
                                <input
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf}
                                    onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contato WhatsApp</label>
                                <input
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                    placeholder="(00) 00000-0000"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Corporativo</label>
                                <input
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                    placeholder="exemplo@clinica.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 'billing' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                            <h3 className="text-lg font-bold text-slate-900">Configuração de Cobrança</h3>
                        </div>

                        <div className="flex p-1.5 bg-slate-100 rounded-[20px] w-full max-w-sm border border-slate-200/50">
                            <button
                                onClick={() => setFormData({ ...formData, billing_type: 'Particular' })}
                                className={cn(
                                    "flex-1 py-3 px-6 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all",
                                    formData.billing_type === 'Particular' ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100" : "text-slate-400 hover:text-slate-600"
                                )}
                            >Particular</button>
                            <button
                                onClick={() => setFormData({ ...formData, billing_type: 'Convênio' })}
                                className={cn(
                                    "flex-1 py-3 px-6 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all",
                                    formData.billing_type === 'Convênio' ? "bg-white text-blue-600 shadow-xl shadow-blue-100" : "text-slate-400 hover:text-slate-600"
                                )}
                            >Convênio</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {formData.billing_type === 'Convênio' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operadora</label>
                                        <select
                                            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                            value={formData.insurance_provider}
                                            onChange={e => setFormData({ ...formData, insurance_provider: e.target.value })}
                                        >
                                            <option value="">Selecione a Operadora...</option>
                                            <option value="Unimed">Unimed Winchester</option>
                                            <option value="Bradesco">Bradesco Saúde</option>
                                            <option value="SulAmérica">SulAmérica</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nº Carteirinha</label>
                                        <input
                                            className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                            placeholder="0000 0000 0000 0000"
                                            value={formData.insurance_card_number}
                                            onChange={e => setFormData({ ...formData, insurance_card_number: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Procedimento Base</label>
                                <input
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-slate-700"
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Repasse (R$)</label>
                                <input
                                    type="number"
                                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
                                    value={formData.value}
                                    onChange={e => setFormData({ ...formData, value: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeStep === 'schedule' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-emerald-100/50 rounded-[40px] flex items-center justify-center shadow-xl shadow-emerald-50">
                            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Paciente Vinculado!</h3>
                            <p className="text-sm font-bold text-slate-400 max-w-xs">{registeredPatient?.name} foi cadastrado com sucesso e já está disponível na fila do faturamento.</p>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 flex flex-col items-center gap-4 w-full max-w-sm">
                            <div className="flex items-center gap-4 w-full">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guia Padrão</p>
                                    <p className="text-xs font-bold text-slate-700">TISS Aguardando Liberação</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 active:scale-95 transition-all mt-4"
                            >Concluir e Voltar</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {activeStep !== 'schedule' && (
                <div className="p-8 border-t border-slate-100 bg-white md:bg-transparent">
                    <button
                        onClick={handleNext}
                        disabled={loading}
                        className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? 'Processando...' : (activeStep === 'info' ? 'Avançar para Financeiro' : 'Finalizar Cadastro')}
                        {!loading && <ChevronRight className="w-5 h-5" strokeWidth={3} />}
                    </button>
                    {activeStep === 'billing' && (
                        <button
                            onClick={() => setActiveStep('info')}
                            className="w-full mt-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                        >Voltar aos dados</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default PatientRegistration;