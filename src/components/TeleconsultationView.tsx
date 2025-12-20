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
    ExternalLink,
    Clock,
    User
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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 mb-4 shrink-0 pt-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                        <VideoIcon className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none truncate">Ambiente Winchester</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100 shrink-0">
                                <span className="flex h-1.5 w-1.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                                </span>
                                <span className="text-[8px] font-bold text-blue-600 uppercase tracking-widest">ONLINE</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">HOSPITAL CENTRAL • CANAL TELEDR-001</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden xl:flex flex-col items-end mr-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none text-right">Qualidade de Conexão</p>
                        <p className="text-xs font-black text-emerald-500 flex items-center gap-2 mt-1 underline underline-offset-4 decoration-emerald-200">
                            <Activity className="w-3.5 h-3.5" />
                            EXCELENTE
                        </p>
                    </div>

                    <button
                        onClick={copyInviteLink}
                        disabled={!activePatient}
                        className={cn(
                            "flex items-center gap-2 px-6 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:grayscale disabled:opacity-50",
                            copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        )}
                    >
                        {copied ? <CheckCircle2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? "Link Copiado" : "Enviar Link para Paciente"}</span>
                        <span className="sm:hidden">{copied ? "Copiado" : "Enviar Link"}</span>
                    </button>

                    <button className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Immersive Stage Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 pt-0 lg:px-6 min-h-0 overflow-hidden mb-2">
                {/* Left: Video Stage + Medical Notes */}
                <div className="flex-[1.4] flex flex-col gap-4 min-h-0 min-w-0">

                    {/* Main Stage (Video Container) */}
                    <div className="relative flex-[1.6] bg-slate-950 rounded-[40px] shadow-2xl border border-slate-800 overflow-hidden group min-h-[350px]">
                        {/* Feed Holder */}
                        <div className="absolute inset-0 z-0 bg-slate-900">
                            {activePatient ? (
                                <>
                                    <img
                                        src={`https://images.unsplash.com/photo-${activePatient.id === '2' ? '1544005313-94ddf0286df2' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&q=80&w=1400`}
                                        className="w-full h-full object-cover opacity-60"
                                        alt="Paciente Feed"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                    <div className="w-24 h-24 rounded-full border border-dashed border-slate-800 flex items-center justify-center">
                                        <VideoOff className="w-8 h-8 text-slate-800" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-slate-700 font-black text-[10px] uppercase tracking-widest">Aguardando conexão...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Top Overlay (Patient Info) */}
                        {activePatient && (
                            <div className="absolute top-6 left-6 z-20 flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-2 pr-6 rounded-2xl animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                                    {activePatient.patient?.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-black text-sm tracking-tight truncate">{activePatient.patient?.name}</h3>
                                    <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                                        PROTEGIDO
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Stage Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-6 py-4 bg-slate-900/90 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                    isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                                    isVideoOff ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                            </button>
                            <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hidden sm:flex">
                                <MonitorUp className="w-5 h-5" />
                            </button>

                            <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block"></div>

                            <button className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                                <PhoneOff className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Local PIP */}
                        <div className="absolute bottom-6 right-6 z-40 w-44 md:w-56 aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700">
                            {isVideoOff ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <User className="w-10 h-10 text-slate-700" />
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
                            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-lg rounded-lg border border-white/5">
                                <span className="text-[8px] font-black text-white uppercase tracking-widest">DR. WINCHESTER</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility (Notes) Area */}
                    <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col overflow-hidden min-h-[220px]">
                        <div className="flex items-center gap-6 px-8 pt-4 border-b border-slate-50 shrink-0">
                            {['Evolução', 'Prescrições', 'Exames', 'Anexos'].map((tab, i) => (
                                <button key={tab} className={cn(
                                    "pb-4 font-black text-[9px] uppercase tracking-widest transition-all relative",
                                    i === 0 ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                )}>
                                    {tab}
                                    {i === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
                            <div className="lg:col-span-4 space-y-3">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Motivo Principal</p>
                                <div className="bg-slate-50/50 p-6 rounded-3xl italic text-slate-600 text-xs leading-relaxed border border-slate-100">
                                    "Paciente relata sintomas persistentes há 3 dias..."
                                </div>
                            </div>
                            <div className="lg:col-span-8 flex flex-col">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3">Anotações Winchester Health</p>
                                <textarea
                                    className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all resize-none"
                                    placeholder="Inicie o registro eletrônico aqui..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="w-full lg:w-[320px] xl:w-[380px] flex flex-col shrink-0 min-h-0 h-full">
                    <div className="bg-white h-full rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/20 shrink-0">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-slate-900 text-xl tracking-tighter">Fila Dinâmica</h3>
                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Próximas Teleconsultas</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
                                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[8px] font-black uppercase tracking-widest">Sincronizando...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-8 text-center h-full animate-in fade-in zoom-in-95 duration-700">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner ring-1 ring-slate-100">
                                        <Search className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Nenhuma Sessão Ativa</h4>
                                </div>
                            ) : appointments.map((apt) => (
                                <button
                                    key={apt.id}
                                    onClick={() => setActivePatient(apt)}
                                    className={cn(
                                        "w-full p-6 rounded-3xl border transition-all relative overflow-hidden group text-left flex flex-col justify-between",
                                        activePatient?.id === apt.id
                                            ? "bg-slate-900 border-slate-800 text-white shadow-xl scale-[1.02]"
                                            : "bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-900"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-[14px] flex items-center justify-center font-black text-lg shadow-sm border border-transparent",
                                                activePatient?.id === apt.id ? "bg-blue-600 text-white" : "bg-slate-100 border-slate-200/50"
                                            )}>
                                                {apt.patient?.name.split(' ').map((n: any) => n[0]).join('')}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-black text-sm tracking-tight leading-none truncate">{apt.patient?.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">
                                                        {apt.start_time.substring(0, 5)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {activePatient?.id === apt.id && (
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full">
                                                <span className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></span>
                                                <span className="text-[8px] font-black uppercase">VIVO</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                                        <p className={cn("text-[9px] font-bold uppercase tracking-widest opacity-40")}>
                                            Sala de Espera
                                        </p>
                                        <ExternalLink className={cn("w-3.5 h-3.5", activePatient?.id === apt.id ? "text-white" : "text-slate-300")} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-8 border-t border-slate-50 shrink-0 bg-white">
                            <button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-slate-800 flex items-center justify-center gap-3">
                                <Clipboard className="w-5 h-5 opacity-40" />
                                Lote de Atendimento
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;
