import React from 'react';

const TeleconsultationView: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0 mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Teleconsultas</h2>
                    <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>videocam</span>
                        <span className="text-base font-normal">Gerencie suas consultas online</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings_suggest</span>
                        Testar Equipamento
                    </button>
                    <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-semibold text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>link</span>
                        Novo Link de Convite
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
                
                {/* Left Column: Video & Clinical Data */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto lg:overflow-hidden pr-1">
                    
                    {/* Video Container */}
                    <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg shrink-0 group ring-1 ring-slate-900/5">
                        {/* Main Patient Video */}
                        <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn4JhwYoYr2AwTZOoPcdLcOkKAnf9MQjSwcTqEpD94NiDgUX_i8tbT-6Pl3WHomyiTmx8e8oKP_fv1ROawf4CC6Gh1BI6-vbtWmyFplL39GzFboakC_GmmiejFFowGsZ19TMevpQTLTClyVvI6Osl4Kg5ck-8ipqNPUkxBy2pmO8kJBRJoDKuvI2IurM6xGxsI8xvluYUwTtVcaxVRFt1MTO8FJeh4cupHVlG_c6zzDarE9co-YFVb3XBDVOmn-u6UA2gcQ7TGxXT7"
                            alt="João Santos"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>

                        {/* Top Left: Patient Info */}
                        <div className="absolute top-5 left-5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white/20 shadow-md" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBn4JhwYoYr2AwTZOoPcdLcOkKAnf9MQjSwcTqEpD94NiDgUX_i8tbT-6Pl3WHomyiTmx8e8oKP_fv1ROawf4CC6Gh1BI6-vbtWmyFplL39GzFboakC_GmmiejFFowGsZ19TMevpQTLTClyVvI6Osl4Kg5ck-8ipqNPUkxBy2pmO8kJBRJoDKuvI2IurM6xGxsI8xvluYUwTtVcaxVRFt1MTO8FJeh4cupHVlG_c6zzDarE9co-YFVb3XBDVOmn-u6UA2gcQ7TGxXT7")` }}></div>
                            <div>
                                <h3 className="text-white font-semibold text-lg drop-shadow-md leading-tight">João Santos</h3>
                                <div className="flex items-center gap-2 text-white/90 text-xs font-medium bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full mt-0.5 w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    04:12 • Em andamento
                                </div>
                            </div>
                        </div>

                        {/* Top Right: Status */}
                        <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 shadow-sm">
                            <span className="material-symbols-outlined text-emerald-400" style={{ fontSize: '18px' }}>wifi</span>
                            <span className="text-white text-xs font-medium">Conexão Estável</span>
                        </div>

                        {/* Bottom Center: Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>mic</span>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>videocam</span>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>present_to_all</span>
                            </button>
                            <button className="w-14 h-14 rounded-full bg-red-500 border border-red-400 flex items-center justify-center text-white hover:bg-red-600 shadow-lg shadow-red-500/40 transition-all hover:scale-105 active:scale-95 ml-2">
                                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>call_end</span>
                            </button>
                        </div>

                        {/* Bottom Right: Self View (PIP) */}
                        <div className="absolute bottom-5 right-5 w-36 md:w-48 aspect-video bg-slate-800 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                             <img 
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFHQB2MHVm8v9XVNUegviDDs4HI5ULkh6zrUF_2OM3AP3jCYfsJOsiI8bZgy996BCY2GrWBAS8_Gt0xPSMPeUaO_NiIWTedT3-kyZF92QcTOvQWzDU5f5cERlt05RUl2YPMBGZ2fmvsAxo4MnFXJbNXzynXapcYg7oi276odaV8YwoI-V5CvCUM0EeS1PWZ9fefXi1tVrvnE9djEk1GjrJd0lXoB-C1nL0xshWTsAzK_GAFN4fTVYiP94sQt6-Dpsxwo-yhmPV4y0m"
                                alt="Dr. Lucas Silva"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                    </div>

                    {/* Tabs & Details Section */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-0 overflow-hidden">
                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-1 px-4 pt-2 border-b border-slate-200">
                            <button className="px-4 py-3 text-blue-600 font-semibold text-sm border-b-2 border-blue-600">Resumo Clínico</button>
                            <button className="px-4 py-3 text-slate-500 font-medium text-sm hover:text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors">Histórico de Exames</button>
                            <button className="px-4 py-3 text-slate-500 font-medium text-sm hover:text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors">Prescrições</button>
                            <button className="px-4 py-3 text-slate-500 font-medium text-sm hover:text-slate-700 hover:bg-slate-50 rounded-t-lg transition-colors">Anexos</button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                {/* Vitals Cards */}
                                <div className="flex flex-col gap-4">
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>ecg_heart</span>
                                        Dados Vitais Recentes
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 hover:border-slate-300 transition-colors">
                                            <p className="text-slate-500 text-xs font-medium">Pressão Arterial</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-bold text-slate-900">120/80</p>
                                                <p className="text-slate-400 text-xs">mmHg</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 hover:border-slate-300 transition-colors">
                                            <p className="text-slate-500 text-xs font-medium">Frequência Cardíaca</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-bold text-slate-900">72</p>
                                                <p className="text-slate-400 text-xs">bpm</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 hover:border-slate-300 transition-colors">
                                            <p className="text-slate-500 text-xs font-medium">Temperatura</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-bold text-slate-900">36.5</p>
                                                <p className="text-slate-400 text-xs">°C</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 hover:border-slate-300 transition-colors">
                                            <p className="text-slate-500 text-xs font-medium">Saturação O2</p>
                                            <div className="flex items-baseline gap-1">
                                                <p className="text-2xl font-bold text-slate-900">98</p>
                                                <p className="text-slate-400 text-xs">%</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Notes Section */}
                                <div className="flex flex-col gap-4 h-full">
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                                        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '18px' }}>edit_note</span>
                                        Anotações da Sessão
                                    </h4>
                                    <div className="flex-1 flex flex-col relative">
                                        <textarea 
                                            className="w-full h-full min-h-[160px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 focus:bg-white focus:border-blue-300 transition-all outline-none resize-none placeholder:text-slate-400 leading-relaxed"
                                            placeholder="Registre as queixas principais, observações clínicas e condutas durante a teleconsulta..."
                                        ></textarea>
                                        <div className="absolute bottom-3 right-3">
                                             <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors">Salvar Rascunho</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Patient Queue */}
                <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto lg:overflow-hidden">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800">Próximas Consultas</h3>
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full border border-blue-200">4</span>
                            </div>
                            <button className="text-slate-400 hover:bg-slate-200 hover:text-slate-600 p-1 rounded transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            {/* Active Patient Card */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 relative overflow-hidden shadow-sm">
                                <div className="absolute top-0 right-0 px-2.5 py-1 bg-blue-100 rounded-bl-lg border-b border-l border-blue-200/50">
                                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        Ao Vivo
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mb-4 mt-2">
                                    <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBn4JhwYoYr2AwTZOoPcdLcOkKAnf9MQjSwcTqEpD94NiDgUX_i8tbT-6Pl3WHomyiTmx8e8oKP_fv1ROawf4CC6Gh1BI6-vbtWmyFplL39GzFboakC_GmmiejFFowGsZ19TMevpQTLTClyVvI6Osl4Kg5ck-8ipqNPUkxBy2pmO8kJBRJoDKuvI2IurM6xGxsI8xvluYUwTtVcaxVRFt1MTO8FJeh4cupHVlG_c6zzDarE9co-YFVb3XBDVOmn-u6UA2gcQ7TGxXT7")` }}></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm leading-tight">João Santos</p>
                                        <p className="text-xs text-slate-600 font-medium mt-0.5">Retorno • 08:30 - 09:00</p>
                                    </div>
                                </div>
                                <button className="w-full py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                    Ver Prontuário
                                </button>
                            </div>

                            {/* Queue List */}
                            <div className="space-y-3">
                                {/* Item 1 */}
                                <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer group bg-white">
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">09:00</span>
                                        <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded border border-amber-100">Sala de Espera</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center bg-slate-200 grayscale group-hover:grayscale-0 transition-all duration-300 border border-slate-100" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjevkAsnuh6q3ZzvVsP0vuJrHFf5TBNM2u9OMlAIH9jKkD-dxrKs6_EAfzuJpTXyDajvkMli6guLvYCnA9I7j5OCB5PH9kWtudVPRiPYKlZtNLVAPntFfoU_q4ccjOUi4ViAD2y1t9niZKVtzt-xQnX3hD1Z1BEj685SWDjZCagee0JnJR0cz2TE5n__LPI9ZHguKO1WNzTYE7iyW2w-VUMlD01cn6m09ipQrkby5UwWPev6R7_8_Byw9yodPrG3b5FSOPG5eKA53D")` }}></div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Ana Paula</p>
                                            <p className="text-xs text-slate-500">Exame de Sangue</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer group bg-white">
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">10:00</span>
                                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-200">Agendado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center bg-slate-200 grayscale group-hover:grayscale-0 transition-all duration-300 border border-slate-100" style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD2Q_BuBBOAMqJOdM7sCtRne14dpIYKvKiVnFmFXhZl_UbJN9XtI_0lAZJ8JfA-8LFa_aweArCuaOi7o8-VJjtZcn4T5_wd8FarRjmNPRwMiWPn9VdfMtWbB0JiK6Rn9XsRRxAP3Jw4cw2lC512YwcdatNr0d-CbyJ5zphhhaBahSf4cG_z7_polCDqUKfi87AWGw2lD7HZRHEGul4F5EaDocPE_CvMGnUytdAMdCXVJ0SMl0qHeR9VR8sfEyy5bjetpxEFfvhS9nWb")` }}></div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Carlos Drumond</p>
                                            <p className="text-xs text-slate-500">Primeira Consulta</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Item 3 */}
                                <div className="flex flex-col gap-2 p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer group bg-white">
                                    <div className="flex justify-between items-center">
                                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-semibold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">11:30</span>
                                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase rounded border border-slate-200">Agendado</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 group-hover:bg-blue-100 transition-colors">FC</div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">Fernanda Costa</p>
                                            <p className="text-xs text-slate-500">Retorno</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Queue Footer */}
                         <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                                Ver Agenda Completa
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;