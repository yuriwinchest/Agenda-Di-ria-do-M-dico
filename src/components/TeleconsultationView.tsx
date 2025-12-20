import React from 'react';

const TeleconsultationView: React.FC = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden gap-4">
            {/* Page Header - Compact to save space */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Telemedicina</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Canal de Atendimento Seguro</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-11 bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-lg">settings</span>
                        Configurar
                    </button>
                    <button className="flex items-center gap-2 px-6 h-11 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                        <span className="material-symbols-outlined text-lg">link</span>
                        Convidar
                    </button>
                </div>
            </div>

            {/* Main Content Area - Grid that fits the remaining height */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">

                {/* Left Column: Video & Clinical Data */}
                <div className="flex-1 flex flex-col gap-6 min-h-0 min-w-0">

                    {/* Video Area - Optimized Height */}
                    <div className="relative w-full flex-1 max-h-[60%] lg:max-h-[55%] bg-slate-950 rounded-[32px] overflow-hidden shadow-2xl group border border-slate-800">
                        {/* Fake Stream Background */}
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71f1e3c770?auto=format&fit=crop&q=80&w=800"
                                alt="Fundo Telemedicina"
                                className="w-full h-full object-cover opacity-40 blur-sm"
                            />
                        </div>

                        {/* Patient Large View */}
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                                <img
                                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
                                    className="w-full h-full object-cover"
                                    alt="Paciente"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Top Overlay: Info */}
                        <div className="absolute top-6 left-6 flex items-center gap-4 bg-black/30 backdrop-blur-xl border border-white/10 p-2.5 pr-6 rounded-2xl">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-black text-white">JS</div>
                            <div>
                                <p className="text-white font-black text-sm tracking-tight">João Santos</p>
                                <p className="text-[10px] text-white/60 font-black uppercase tracking-widest">Retorno • 00:04:12</p>
                            </div>
                        </div>

                        {/* Bottom Center: Action Bar - Always visible and centered */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl z-20">
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center group/btn active:scale-95">
                                <span className="material-symbols-outlined text-xl group-hover/btn:scale-110">mic</span>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center group/btn active:scale-95">
                                <span className="material-symbols-outlined text-xl group-hover/btn:scale-110">videocam</span>
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center group/btn active:scale-95">
                                <span className="material-symbols-outlined text-xl group-hover/btn:scale-110">screen_share</span>
                            </button>
                            <div className="w-px h-8 bg-white/10 mx-1"></div>
                            <button className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-900/30 transition-all flex items-center justify-center group/btn active:scale-95">
                                <span className="material-symbols-outlined text-2xl group-hover/btn:scale-125 transition-transform">call_end</span>
                            </button>
                        </div>

                        {/* Small Doctor View (PIP) - Fixed location */}
                        <div className="absolute bottom-6 right-6 w-40 md:w-56 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl ring-4 ring-black/20">
                            <img
                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
                                className="w-full h-full object-cover"
                                alt="Médico"
                            />
                        </div>
                    </div>

                    {/* Bottom Utility Area - Scrollable but fits height */}
                    <div className="flex-1 bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
                        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-100">
                            <button className="px-6 py-3 text-blue-600 font-black text-[10px] uppercase tracking-widest border-b-4 border-blue-600">Prontuário</button>
                            <button className="px-6 py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600">Prescrições</button>
                            <button className="px-6 py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600">Exames</button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-3 bg-emerald-500 rounded-full"></span>
                                        Sinais Vitais
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">Pressão</p>
                                            <p className="text-xl font-black text-slate-900">12/8</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase">BPM</p>
                                            <p className="text-xl font-black text-slate-900">74</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 h-full">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-3 bg-blue-500 rounded-full"></span>
                                        Anotações Clínicas
                                    </h4>
                                    <textarea
                                        className="flex-1 min-h-[120px] bg-slate-50 border border-slate-200 rounded-[20px] p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all resize-none"
                                        placeholder="Descreva a anamnese e condutas..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Queue Sidebar - Fixed Width */}
                <div className="w-full lg:w-80 flex flex-col shrink-0 min-h-0">
                    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Próximos</h3>
                            <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">4</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {/* Active Patient Card */}
                            <div className="p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-20"><span className="material-symbols-outlined text-xs">record_voice_over</span></div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">JS</div>
                                    <div className="min-w-0">
                                        <p className="font-black text-sm truncate">João Santos</p>
                                        <p className="text-[10px] text-white/60 font-black uppercase">Agora</p>
                                    </div>
                                </div>
                                <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Abrir Ficha</button>
                            </div>

                            {/* Queue Items */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-[28px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">AP</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 text-sm truncate">Ana Paula {i}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5">10:30 • Rotina</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;

export default TeleconsultationView;