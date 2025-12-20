import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import {
    Mic,
    MicOff,
    Video as VideoIcon,
    VideoOff,
    PhoneOff,
    MonitorUp,
    Settings,
    Link as LinkIcon,
    Activity,
    Clipboard,
    Search,
    CheckCircle2,
    Copy,
    ExternalLink
} from 'lucide-react';

const TeleconsultationView: React.FC = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePatient, setActivePatient] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [copied, setCopied] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        loadTodayAppointments();
        startCamera();
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream, localVideoRef]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setLocalStream(stream);
        } catch (err) {
            console.error("Erro ao acessar câmera:", err);
        }
    };

    const loadTodayAppointments = async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('appointments')
                .select('*, patient:patients(name, phone)')
                .eq('appointment_date', today)
                .eq('type', 'Telepresença')
                .order('start_time', { ascending: true });

            if (error) throw error;

            setAppointments(data || []);
            if (data && data.length > 0 && !activePatient) {
                setActivePatient(data[0]);
            }
        } catch (e) {
            console.error(e);
            // Non-blocking fallback handled by component logic
        } finally {
            setLoading(false);
        }
    };

    const copyInviteLink = () => {
        if (!activePatient) return;
        const link = `${window.location.origin}/patient-room/${activePatient.id}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/10 overflow-hidden animate-in fade-in duration-1000">
            {/* Immersive Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4 mb-6 shrink-0 pt-2 lg:px-6">
                <div className="flex items-center gap-6">
                    <div className="lg:block hidden">
                        <div className="w-16 h-16 bg-white rounded-3xl border border-slate-100 shadow-xl flex items-center justify-center text-blue-600">
                            <VideoIcon className="w-8 h-8" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Ambiente Winchester</h2>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">SERVIDOR ONLINE</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">HOSPITAL CENTRAL • CANAL TELEDR-001</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex flex-col items-end mr-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Qualidade Conexão</p>
                        <p className="text-sm font-black text-emerald-500 flex items-center gap-2 mt-2">
                            <Activity className="w-4 h-4" />
                            EXCELENTE
                        </p>
                    </div>

                    <button
                        onClick={copyInviteLink}
                        disabled={!activePatient}
                        className={cn(
                            "flex items-center gap-3 px-8 h-14 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl active:scale-95 disabled:grayscale disabled:opacity-50",
                            copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        )}
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                        {copied ? "Link Copiado" : "Enviar Link para Paciente"}
                    </button>

                    <button className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-xl active:scale-90">
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Immersive Stage Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 pt-0 lg:px-6 min-h-0 overflow-hidden mb-4">
                {/* Left: Video Stage + Medical Notes */}
                <div className="flex-1 flex flex-col gap-6 min-h-0 min-w-0 h-full">

                    {/* Main Stage (Video Container) */}
                    <div className="relative flex-[1.8] bg-slate-950 rounded-[56px] shadow-2xl border border-slate-800 overflow-hidden group min-h-[420px]">
                        {/* Feed Holder */}
                        <div className="absolute inset-0 z-0 bg-slate-900">
                            {activePatient ? (
                                <>
                                    <img
                                        src={`https://images.unsplash.com/photo-${activePatient.id === '2' ? '1544005313-94ddf0286df2' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&q=80&w=1400`}
                                        className="w-full h-full object-cover opacity-70"
                                        alt="Paciente Feed"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                                    <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                                        <VideoOff className="w-12 h-12 text-slate-800" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-slate-700 font-black text-[12px] uppercase tracking-[0.5em]">Aguardando conexão...</p>
                                        <p className="text-slate-800 text-xs font-bold">Selecione um paciente na fila lateral para iniciar</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overlays */}
                        {activePatient && (
                            <div className="absolute top-10 left-10 z-20 flex items-center gap-5 bg-black/30 backdrop-blur-3xl border border-white/10 p-3 pr-8 rounded-[32px] animate-in fade-in slide-in-from-left-6 duration-700">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl shadow-2xl">
                                    {activePatient.patient?.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-black text-lg tracking-tight truncate">{activePatient.patient?.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.8)]"></span>
                                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Conexão Criptografada</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stage Controls */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 px-10 py-6 bg-slate-900/80 backdrop-blur-3xl border border-white/5 rounded-[44px] shadow-[0_40px_80px_rgba(0,0,0,0.7)] group">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90",
                                    isMuted ? "bg-rose-500 text-white shadow-xl shadow-rose-900/30" : "bg-white/5 text-white hover:bg-white/10"
                                )}
                            >
                                {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                            </button>
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90",
                                    isVideoOff ? "bg-rose-500 text-white shadow-xl shadow-rose-900/30" : "bg-white/5 text-white hover:bg-white/10"
                                )}
                            >
                                {isVideoOff ? <VideoOff className="w-7 h-7" /> : <VideoIcon className="w-7 h-7" />}
                            </button>
                            <button className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all active:scale-90">
                                <MonitorUp className="w-7 h-7" />
                            </button>

                            <div className="w-px h-12 bg-white/10 mx-2"></div>

                            <button className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-[0_24px_48px_rgba(225,29,72,0.4)] flex items-center justify-center transition-all hover:scale-110 active:scale-90">
                                <PhoneOff className="w-10 h-10" />
                            </button>
                        </div>

                        {/* Local PIP */}
                        <div className="absolute bottom-10 right-10 z-40 w-56 md:w-80 aspect-video bg-slate-800 rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl ring-[12px] ring-black/30 group-hover:scale-[1.03] transition-transform duration-700">
                            {isVideoOff ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <VideoOff className="w-12 h-12 text-slate-700" />
                                </div>
                            ) : (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-xl rounded-xl border border-white/5">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">DR. WINCHESTER</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility (Notes) Area */}
                    <div className="flex-1 bg-white rounded-[56px] border border-slate-100 shadow-xl flex flex-col overflow-hidden min-h-[280px]">
                        <div className="flex items-center gap-10 px-12 pt-6 border-b border-slate-50 shrink-0">
                            {['Evolução Clínica', 'Prescrições', 'Exames Solicitados', 'Anexos'].map((tab, i) => (
                                <button key={tab} className={cn(
                                    "pb-6 font-black text-[11px] uppercase tracking-[0.25em] transition-all relative",
                                    i === 0 ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                )}>
                                    {tab}
                                    {i === 0 && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600 rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 p-10 grid grid-cols-1 lg:grid-cols-12 gap-10 overflow-y-auto custom-scrollbar">
                            <div className="lg:col-span-4 space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Motivo Principal</p>
                                <div className="bg-slate-50 p-8 rounded-[40px] italic text-slate-600 text-sm leading-relaxed border border-slate-100 shadow-inner">
                                    "Paciente relata sintomas persistentes há 3 dias..."
                                </div>
                            </div>
                            <div className="lg:col-span-8 flex flex-col">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-4">Anotações Winchester Health</p>
                                <textarea
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-[40px] p-8 text-sm font-medium outline-none focus:bg-white focus:ring-8 focus:ring-blue-600/5 transition-all resize-none shadow-inner"
                                    placeholder="Inicie o registro eletrônico aqui..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Immersive Sidebar (Queue) */}
                <div className="w-full lg:w-[420px] flex flex-col shrink-0 min-h-0 h-full">
                    <div className="bg-white h-full rounded-[56px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                        <div className="p-10 border-b border-slate-50 bg-slate-50/20 shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-slate-900 text-2xl tracking-tighter">Fila Dinâmica</h3>
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-lg">
                                    <Activity className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Próximas Teleconsultas</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-5 opacity-40">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sincronizando Banco...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in zoom-in-95 duration-700">
                                    <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-1 ring-slate-100">
                                        <Search className="w-12 h-12 text-slate-200" />
                                    </div>
                                    <h4 className="font-black text-slate-400 text-sm uppercase tracking-widest">Nenhuma Sessão Ativa</h4>
                                    <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase tracking-tight">Os pacientes confirmados aparecerão aqui</p>
                                </div>
                            ) : appointments.map((apt) => (
                                <button
                                    key={apt.id}
                                    onClick={() => setActivePatient(apt)}
                                    className={cn(
                                        "w-full p-8 h-44 rounded-[48px] border transition-all relative overflow-hidden group text-left flex flex-col justify-between",
                                        activePatient?.id === apt.id
                                            ? "bg-slate-900 border-slate-800 text-white shadow-2xl scale-[1.02]"
                                            : "bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-900"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl",
                                                activePatient?.id === apt.id ? "bg-blue-600 text-white" : "bg-slate-100"
                                            )}>
                                                {apt.patient?.name.split(' ').map((n: any) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg tracking-tight leading-none">{apt.patient?.name}</h4>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className={cn("w-3.5 h-3.5", activePatient?.id === apt.id ? "text-blue-400" : "text-slate-400")} />
                                                    <span className={cn("text-[11px] font-black uppercase tracking-widest", activePatient?.id === apt.id ? "text-blue-400" : "text-slate-400")}>
                                                        {apt.start_time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {activePatient?.id === apt.id && (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full">
                                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                                                <span className="text-[10px] font-black">AO VIVO</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <p className={cn("text-[10px] font-black uppercase tracking-widest", activePatient?.id === apt.id ? "text-slate-500" : "text-slate-400")}>
                                            Paciente em Sala de Espera
                                        </p>
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            activePatient?.id === apt.id ? "bg-white/10 text-white" : "bg-slate-50 text-slate-300"
                                        )}>
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-10 border-t border-slate-50 bg-slate-50/10 shrink-0">
                            <button className="w-full h-16 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all hover:bg-slate-800 flex items-center justify-center gap-4">
                                <Clipboard className="w-6 h-6" />
                                Fechar Lote de Atendimento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;
