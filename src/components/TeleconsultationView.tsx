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
            if (data && data.length > 0) {
                setActivePatient(data[0]);
            }
        } catch (e) {
            console.error(e);
            // Fallback mock if database is not ready
            const mock = [
                { id: '1', start_time: '10:00', patient: { name: 'João Santos', phone: '(11) 98888-7777' } },
                { id: '2', start_time: '11:00', patient: { name: 'Ana Maria', phone: '(11) 97777-6666' } },
                { id: '3', start_time: '14:30', patient: { name: 'Carlos Lima', phone: '(11) 96666-5555' } }
            ];
            setAppointments(mock);
            setActivePatient(mock[0]);
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
        <div className="flex flex-col h-full bg-slate-50/30 overflow-hidden animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex items-center justify-between px-2 mb-4 shrink-0 px-4 mt-2">
                <div className="space-y-0.5">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Ambiente Virtual Winchester</h2>
                    <div className="flex items-center gap-3">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">HOSPITAL CENTRAL • CANAL TELEDR-041</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Conexão</p>
                        <p className="text-xs font-black text-emerald-500 flex items-center gap-1.5 mt-1">
                            <Activity className="w-3.5 h-3.5" />
                            EXCELENTE
                        </p>
                    </div>
                    <button
                        onClick={copyInviteLink}
                        className={cn(
                            "flex items-center gap-3 px-6 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95",
                            copied ? "bg-emerald-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200"
                        )}
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Link Copiado
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-4 h-4" />
                                Enviar Link para Paciente
                            </>
                        )}
                    </button>
                    <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm active:scale-90">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 pt-0 min-h-0">
                {/* Left Side: Video + Medical Notes */}
                <div className="flex-1 flex flex-col gap-6 min-h-0 min-w-0">

                    {/* Main Video Stage */}
                    <div className="relative flex-1 bg-slate-950 rounded-[48px] shadow-2xl border border-slate-800 overflow-hidden shrink-0 group">
                        {/* Feed Holder - Simulated Patient Feed */}
                        <div className="absolute inset-0 z-0 bg-slate-900">
                            {activePatient ? (
                                <>
                                    <img
                                        src={`https://images.unsplash.com/photo-${activePatient.id === '2' ? '1544005313-94ddf0286df2' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&q=80&w=1200`}
                                        className="w-full h-full object-cover opacity-80"
                                        alt="Paciente Principal"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-4">
                                    <VideoOff className="w-16 h-16 opacity-20" />
                                    <p className="font-black text-[10px] uppercase tracking-[0.4em]">Selecione um paciente na fila</p>
                                </div>
                            )}
                        </div>

                        {/* Top Overlays */}
                        {activePatient && (
                            <div className="absolute top-8 left-8 z-20 flex items-center gap-4 bg-black/40 backdrop-blur-2xl border border-white/10 p-2.5 pr-6 rounded-3xl animate-in slide-in-from-left-4 duration-500">
                                <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg ring-1 ring-white/20">
                                    {activePatient.patient?.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-black text-sm tracking-tight truncate">{activePatient.patient?.name}</p>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-0.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                        SESSÃO ATIVA
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Video Controls Area */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-5 px-8 py-5 bg-slate-900/90 backdrop-blur-3xl border border-white/5 rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.6)]">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 group",
                                    isMuted ? "bg-rose-500 text-white shadow-lg shadow-rose-900/20" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                className={cn(
                                    "w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 group",
                                    isVideoOff ? "bg-rose-500 text-white shadow-lg shadow-rose-900/20" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <VideoIcon className="w-6 h-6" />}
                            </button>
                            <button className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 group">
                                <MonitorUp className="w-6 h-6" />
                            </button>
                            <div className="w-px h-10 bg-white/10 mx-2"></div>
                            <button className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-2xl shadow-rose-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-90 group">
                                <PhoneOff className="w-8 h-8 rotate-0 group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>

                        {/* Local PIP (Doctor Feed) */}
                        <div className="absolute bottom-8 right-8 z-40 w-44 md:w-64 aspect-video bg-slate-800 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl ring-8 ring-black/20 group-hover:scale-105 transition-transform duration-500">
                            {isVideoOff ? (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <User className="w-12 h-12 text-slate-800" />
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
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">VOCÊ (MÉDICO)</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility Area */}
                    <div className="h-48 md:h-64 bg-white rounded-[40px] border border-slate-200 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-700">
                        <div className="flex items-center gap-8 px-10 pt-5 border-b border-slate-100 shrink-0">
                            {['Dados Clínicos', 'Sintomas Relatados', 'Prescrições Online', 'Arquivos'].map((tab, idx) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "pb-5 pt-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all relative group",
                                        idx === 0 ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {tab}
                                    {idx === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 overflow-y-auto custom-scrollbar">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Motivo da Consulta</label>
                                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 italic text-slate-600 text-sm font-medium">
                                    "Paciente relata cansaço excessivo e palpitações esporádicas há 3 dias após esforço físico..."
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observações em Tempo Real</label>
                                <textarea
                                    className="w-full h-24 bg-slate-50 border border-slate-200 rounded-[32px] p-6 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all resize-none font-medium"
                                    placeholder="Inicie as anotações clínicas aqui..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Dynamic Queue */}
                <div className="w-full lg:w-96 flex flex-col shrink-0 min-h-0">
                    <div className="bg-white h-full rounded-[48px] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                            <div>
                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Fila TeleConsulta</h3>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Sessões Agendadas para Hoje</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {loading ? (
                                <div className="h-full flex items-center justify-center p-12 text-center text-slate-400">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4 mx-auto"></div>
                                    <p className="font-black text-[10px] uppercase tracking-widest">Conectando ao Winchester Cloud...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center text-slate-300 gap-3">
                                    <Search className="w-10 h-10 opacity-20" />
                                    <p className="font-black text-[10px] uppercase tracking-widest">Nenhuma teleconsulta agendada</p>
                                </div>
                            ) : appointments.map((apt) => (
                                <button
                                    key={apt.id}
                                    onClick={() => setActivePatient(apt)}
                                    className={cn(
                                        "w-full p-6 h-36 rounded-[40px] border transition-all relative overflow-hidden group text-left flex flex-col justify-between",
                                        activePatient?.id === apt.id
                                            ? "bg-slate-900 border-slate-800 text-white shadow-2xl shadow-slate-900/40"
                                            : "bg-white border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 text-slate-900"
                                    )}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg",
                                                activePatient?.id === apt.id ? "bg-blue-600" : "bg-slate-100 group-hover:bg-white"
                                            )}>
                                                {apt.patient?.name.split(' ').map((n: any) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="font-black text-sm tracking-tight">{apt.patient?.name}</p>
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest mt-0.5",
                                                    activePatient?.id === apt.id ? "text-blue-400" : "text-slate-400"
                                                )}>
                                                    INÍCIO: {apt.start_time}
                                                </p>
                                            </div>
                                        </div>
                                        {activePatient?.id === apt.id && (
                                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <PhoneOff className={cn("w-3.5 h-3.5", activePatient?.id === apt.id ? "text-rose-400" : "text-slate-300")} />
                                            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", activePatient?.id === apt.id ? "text-slate-400" : "text-slate-300")}>
                                                Aguarda Conexão
                                            </span>
                                        </div>
                                        <ExternalLink className={cn("w-4 h-4", activePatient?.id === apt.id ? "text-white" : "text-slate-200")} />
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50/30 shrink-0">
                            <button className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all hover:bg-slate-800 flex items-center justify-center gap-3">
                                <Clipboard className="w-5 h-5" />
                                Relatório Geral Diário
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeleconsultationView;
