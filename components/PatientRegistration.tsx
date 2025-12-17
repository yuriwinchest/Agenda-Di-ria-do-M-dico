import React from 'react';

interface PatientRegistrationProps {
    onBack: () => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onBack }) => {
    return (
        <div className="flex flex-col h-full gap-6 animate-in fade-in zoom-in-95 duration-300 pb-8">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <button onClick={onBack} className="hover:text-blue-600 transition-colors">Home</button>
                    <span>/</span>
                    <button onClick={onBack} className="hover:text-blue-600 transition-colors">Pacientes</button>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Cadastro</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Cadastro de Paciente</h2>
                        <p className="mt-1 text-slate-500">Preencha os dados abaixo para registrar um novo paciente.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>print</span>
                            Imprimir Ficha
                        </button>
                        <button 
                            onClick={onBack}
                            className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>save</span>
                            Salvar Cadastro
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                
                {/* Left Column: Photo & Status */}
                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                    {/* Profile Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 overflow-hidden">
                                <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#cbd5e1' }}>person</span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-sm group-hover:bg-blue-700 transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_camera</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">Foto do Paciente</h3>
                        <p className="text-xs text-slate-400 mb-6">Recomendado: 400x400px</p>

                        <div className="w-full pt-6 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Status do Paciente
                            </label>
                            <div className="relative">
                                <select className="w-full h-10 pl-3 pr-8 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/50 outline-none">
                                    <option>Ativo</option>
                                    <option>Inativo</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 pointer-events-none" style={{ fontSize: '20px' }}>expand_more</span>
                            </div>
                        </div>
                    </div>

                    {/* Observations Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4 flex-1">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                            <span className="material-symbols-outlined text-slate-600" style={{ fontSize: '22px' }}>chat_bubble_outline</span>
                            <h3>Observações</h3>
                        </div>
                        <div className="flex-1">
                             <textarea 
                                className="w-full h-full min-h-[150px] bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/50 outline-none resize-none placeholder:text-slate-500 leading-relaxed"
                                placeholder="Adicione observações importantes sobre o paciente (ex: Preferência de horário, alergias conhecidas, etc)."
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    {/* Info Alert */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>info</span>
                            </div>
                            <p className="text-sm text-blue-800 font-medium">Antes de cadastrar, verifique se o paciente já existe.</p>
                        </div>
                        <div className="relative w-full sm:w-auto sm:min-w-[320px]">
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>search</span>
                            <input 
                                type="text" 
                                placeholder="Buscar por CPF ou Nome..." 
                                className="w-full h-10 pl-4 pr-10 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 outline-none placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Personal Data */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: '24px' }}>person</span>
                            <h3 className="font-bold text-slate-900 text-lg">Dados Pessoais</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome Completo</label>
                                    <input type="text" placeholder="Ex: João da Silva" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CPF <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="000.000.000-00" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-40">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Nascimento</label>
                                    <div className="relative">
                                         <input type="text" placeholder="mm/dd/yyyy" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                                         <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none" style={{ fontSize: '18px' }}>calendar_today</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Gênero</label>
                                    <div className="relative">
                                        <select className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                            <option>Selecione...</option>
                                            <option>Masculino</option>
                                            <option>Feminino</option>
                                            <option>Outro</option>
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 pointer-events-none" style={{ fontSize: '20px' }}>expand_more</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone / Celular</label>
                                    <input type="text" placeholder="(00) 00000-0000" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input type="email" placeholder="email@exemplo.com" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="pt-6 border-t border-slate-100">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">
                                Endereço
                            </label>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-40">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">CEP</label>
                                    <div className="relative">
                                        <input type="text" placeholder="00000-000" className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 cursor-pointer hover:text-blue-600" style={{ fontSize: '18px' }}>search</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Rua / Logradouro</label>
                                    <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Número</label>
                                    <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                            <span className="material-symbols-outlined text-blue-600" style={{ fontSize: '24px' }}>health_and_safety</span>
                            <h3 className="font-bold text-slate-900 text-lg">Convênio e Plano</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Operadora / Convênio</label>
                                <div className="relative">
                                    <select className="w-full h-10 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                                        <option>Particular</option>
                                        <option>Unimed</option>
                                        <option>Bradesco Saúde</option>
                                        <option>SulAmérica</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-500 pointer-events-none" style={{ fontSize: '20px' }}>expand_more</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo de Plano</label>
                                <input type="text" placeholder="Ex: Enfermaria, Apartamento" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400" />
                            </div>
                            
                            <div className="md:col-span-2 flex flex-col md:flex-row gap-6 md:items-end">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Número da Carteirinha</label>
                                    <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                </div>
                                <div className="w-full md:w-40">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Validade da Carteirinha</label>
                                    <div className="relative">
                                        <input type="text" placeholder="mm/dd/yyy" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none" style={{ fontSize: '18px' }}>calendar_today</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-48">
                                    <button className="w-full h-10 bg-blue-50 text-blue-600 font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors border border-blue-100">
                                        Verificar Elegibilidade
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;