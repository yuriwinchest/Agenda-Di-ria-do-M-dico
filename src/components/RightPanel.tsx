import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    User,
    Activity,
    FileText,
    MessageSquare,
    Calendar,
    Pin,
    ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const RightPanel: React.FC = () => {
    return (
        <div className="flex flex-col gap-8 h-full">
            {/* Quick Mini Calendar */}
            <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-100 transition-all duration-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Agenda</h4>
                    </div>
                    <div className="flex gap-1.5 p-1 bg-slate-50 rounded-xl">
                        <button className="p-1 px-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 transition-all duration-300">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1 px-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-400 transition-all duration-300">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="text-center text-xs font-bold mb-4 text-slate-400 uppercase tracking-widest">
                    Dezembro 2024
                </div>

                <div className="grid grid-cols-7 text-center text-[10px] gap-1">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                        <span key={i} className="text-slate-300 font-black py-2">{day}</span>
                    ))}
                    {/* Simplified placeholder days for 18 Dec 2024 */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                        const isToday = d === 18;
                        const isSelected = d === 18;
                        return (
                            <button
                                key={d}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300",
                                    isToday ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {d}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Patient Card */}
            <div className="bg-slate-900 rounded-[40px] shadow-2xl shadow-slate-200 flex flex-col overflow-hidden relative group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="p-6 pb-2 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Em Consulta</span>
                        </div>
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Pin className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4 group-hover:scale-110 transition-transform duration-500">
                            <div className="w-24 h-24 rounded-[36px] bg-gradient-to-tr from-blue-600 to-indigo-500 p-1">
                                <img
                                    src="https://randomuser.me/api/portraits/men/32.jpg"
                                    alt="Patient"
                                    className="w-full h-full rounded-[34px] object-cover border-4 border-slate-900"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <h4 className="text-xl font-black text-white tracking-tight">João Santos</h4>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">ID: #48293 • 32 ANOS</p>
                    </div>
                </div>

                <div className="p-6 flex flex-col gap-6 relative z-10">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 backdrop-blur-lg p-3 rounded-2xl border border-white/5">
                            <span className="text-white/30 text-[9px] font-black uppercase block mb-1">Altura</span>
                            <span className="text-white font-bold tracking-tight">1.82 m</span>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg p-3 rounded-2xl border border-white/5">
                            <span className="text-white/30 text-[9px] font-black uppercase block mb-1">Peso</span>
                            <span className="text-white font-bold tracking-tight">78 kg</span>
                        </div>
                    </div>

                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                            <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">Observações Rápidas</p>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-medium italic">
                            "Alergia a Dipirona. Paciente relata dores intensas na região lombar há 3 dias."
                        </p>
                    </div>

                    <button className="w-full h-14 bg-white text-slate-900 rounded-[22px] font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3 group/btn">
                        Ver Prontuário
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;