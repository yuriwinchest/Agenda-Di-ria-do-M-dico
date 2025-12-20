import React, { useState } from 'react';
import { cn } from '../lib/utils';
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    PhoneOff,
    MonitorUp,
    Maximize2,
    Settings,
    Link as LinkIcon,
    Activity,
    ClipboardText,
    Stethoscope,
    FlaskConical,
    Search,
    User,
    MoreVertical
} from 'lucide-react';

const TeleconsultationView: React.FC = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    return (
        <div className="flex flex-col h-full bg-slate-50/30 overflow-hidden">
            {/* Header Area - Compact */}
            <div className="flex items-center justify-between px-2 mb-4 shrink-0">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Telemedicina</h2>
                    <div className="flex items-center gap-2">
                        <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Sessão Criptografada • Winchester v3</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <Settings className="w-3.5 h-3.5" />
                        Teste
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                        <LinkIcon className="w-3.5 h-3.5" />
                        Convidar
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-5 min-h-0">
                {/* Left Side: Video + Medical Notes */}
                <div className="flex-1 flex flex-col gap-5 min-h-0 min-w-0">

                    {/* Video Container - Fixed Height for Stability */}
                    <div className="relative w-full h-[380px] lg:h-[420px] bg-slate-950 rounded-[40px] shadow-2xl border border-slate-800 overflow-hidden shrink-0 group">
                        {/* Feed Holder */}
                        <div className="absolute inset-0 z-0 bg-slate-900">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200"
                                className="w-full h-full object-cover"
                                alt="Paciente Principal"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40"></div>
                        </div>

                        {/* Top Overlays */}
                        <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/30 backdrop-blur-xl border border-white/10 p-2 pr-5 rounded-2xl">
                            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center font-black text-white text-xs">JS</div>
                            <div>
                                <p className="text-white font-black text-xs">João Santos</p>
                                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Ao Vivo
                                </p>
                            </div>
                        </div>

                        <div className="absolute top-6 right-6 z-20">
                            <div className="bg-black/30 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Estável</span>
                            </div>
                        </div>

                        {/* CONTROLS - LIFTED AND ALWAYS VISIBLE */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-4 bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 group",
                                    isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 group",
                                    isVideoOff ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 group">
                                <MonitorUp className="w-5 h-5" />
                            </button>
                            <div className="w-px h-8 bg-white/10 mx-2"></div>
                            <button className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl shadow-rose-900/40 flex items-center justify-center transition-all hover:scale-105 active:scale-90 group">
                                <PhoneOff className="w-7 h-7" />
                            </button>
                        </div>

                        {/* Doctor PIP */}
                        <div className="absolute bottom-6 right-6 z-20 w-40 md:w-56 aspect-video bg-slate-800 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl ring-4 ring-black/20">
                            <img
                                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
                                className="w-full h-full object-cover"
                                alt="Médico"
                            />
                        </div>
                    </div>

                    {/* Quick Charts / Notes - Fills remaining space */}
                    <div className="flex-1 bg-white rounded-[40px] border border-slate-200 shadow-sm flex flex-col min-h-0 overflow-hidden">
                        <div className="flex items-center gap-4 px-8 pt-4 border-b border-slate-100 shrink-0">
                            <button className="pb-4 pt-2 text-blue-600 font-black text-[10px] uppercase tracking-widest border-b-4 border-blue-600 transition-all">Prontuário</button>
                            <button className="pb-4 pt-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Histórico</button>
                            <button className="pb-4 pt-2 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-all">Anexos</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                                        Dados Atuais
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pressão</p>
                                            <p className="text-xl font-black text-slate-900 leading-none">12/8</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">FC</p>
                                            <p className="text-xl font-black text-slate-900 leading-none">72 <span className="text-[10px] text-slate-400">bpm</span></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 flex flex-col">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                                        Anamnese
                                    </h4>
                                    <textarea
                                        className="flex-1 min-h-[140px] bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all resize-none"
                                        placeholder="Descreva a evolução do paciente..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Patient List / Queue */}
                <div className="w-full lg:w-80 flex flex-col shrink-0 min-h-0">
                    <div className="bg-white h-full rounded-[40px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Fila de Espera</h3>
                            <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-full border border-slate-200">HOJE</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[32px] text-white shadow-xl shadow-blue-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-20"><Search className="w-5 h-5" /></div>
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">JS</div>
                                    <div className="min-w-0">
                                        <p className="font-black text-sm truncate">João Santos</p>
                                        <p className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none mt-1">Sessão em Curso</p>
                                    </div>
                                </div>
                                <button className="w-full py-3 bg-white text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Ver Ficha</button>
                            </div>

                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-[28px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer group flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors uppercase italic">{i % 2 === 0 ? 'AM' : 'CL'}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-900 text-sm truncate uppercase tracking-tight">{i % 2 === 0 ? 'Ana Maria' : 'Carlos Lima'}</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-wider">{10 + i}:00 • Telepresença</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-t border-slate-100 shrink-0">
                            <button className="w-full h-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Ver Agenda Completa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;