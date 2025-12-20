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
    const [isVideoOff, setIsVideoOff] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePatient, setActivePatient] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('Evolução');
    const [evolutionText, setEvolutionText] = useState('');
    const [prescriptionText, setPrescriptionText] = useState('');
    const [examsText, setExamsText] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const localVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        loadTodayAppointments();
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Callback ref to handle video element mounting and stream binding
    const setVideoRef = (node: HTMLVideoElement | null) => {
        if (node) {
            localVideoRef.current = node;
            if (localStream && !isVideoOff) {
                node.srcObject = localStream;
                node.play().catch(e => console.warn("Auto-play blocked:", e));
            }
        }
    };

    // Keep stream in sync with video element
    useEffect(() => {
        if (localVideoRef.current) {
            if (localStream && !isVideoOff) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.play().catch(e => console.warn("Auto-play sync blocked:", e));
            } else {
                localVideoRef.current.srcObject = null;
            }
        }
    }, [localStream, isVideoOff]);

    const startCamera = async () => {
        console.log("Iniciando acesso aos dispositivos...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).catch(async (err) => {
                console.warn("Falha ao abrir vídeo + áudio, tentando apenas vídeo...", err);
                return await navigator.mediaDevices.getUserMedia({ video: true });
            });

            console.log("Stream obtido com sucesso:", stream.id);
            setLocalStream(stream);
            setIsVideoOff(false);
        } catch (err: any) {
            console.error("Erro detalhado na câmera:", err);
            const msg = err.name === 'NotAllowedError'
                ? "Acesso à câmera foi recusado. Por favor, habilite a permissão no seu navegador."
                : `Erro ao iniciar câmera: ${err.message}. Verifique a conexão do dispositivo.`;
            alert(msg);
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

    const saveMedicalRecord = async () => {
        if (!activePatient) return;
        setIsSaving(true);
        try {
            const table = activeTab === 'Evolução' ? 'medical_evolutions' :
                activeTab === 'Prescrições' ? 'prescriptions' : 'exam_requests';

            const content = activeTab === 'Evolução' ? evolutionText :
                activeTab === 'Prescrições' ? prescriptionText : examsText;

            const payload: any = {
                appointment_id: activePatient.id,
                patient_id: activePatient.patient_id,
                doctor_id: activePatient.doctor_id,
            };

            if (activeTab === 'Evolução') payload.content = content;
            else if (activeTab === 'Prescrições') payload.medications = [{ text: content }];
            else payload.exams = [{ text: content }];

            const { error } = await supabase.from(table).insert([payload]);
            if (error) throw error;
            alert(`${activeTab} salva com sucesso!`);
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar registro.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-full bg-slate-50/10 animate-in fade-in duration-1000">
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
            <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 pt-0 lg:px-6 mb-2">
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

                        {/* Patient info - Positioned TOP-LEFT */}
                        {activePatient && (
                            <div className="absolute top-8 left-8 z-50 flex items-center gap-3 bg-black/50 backdrop-blur-2xl border border-white/10 p-2 pr-6 rounded-2xl animate-in fade-in slide-in-from-left-4 duration-700">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-lg">
                                    {activePatient.patient?.name?.split(' ')?.map((n: string) => n[0]).join('') || '?'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-white font-black text-sm tracking-tight truncate max-w-[200px]">{activePatient.patient?.name}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex h-1.5 w-1.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Sessão Segura Winchester</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stage Controls - Floating Bottom Left */}
                        <div className="absolute bottom-8 left-8 z-50 flex items-center gap-4 px-6 py-4 bg-slate-900/95 backdrop-blur-3xl border border-white/10 rounded-[28px] shadow-2xl ring-1 ring-white/5">
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                    isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>
                            <button
                                onClick={() => {
                                    if (!localStream) {
                                        startCamera();
                                    } else {
                                        setIsVideoOff(!isVideoOff);
                                    }
                                }}
                                className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                    (!localStream || isVideoOff) ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {(!localStream || isVideoOff) ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                            </button>
                            {!localStream && (
                                <button
                                    onClick={startCamera}
                                    className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 animate-pulse whitespace-nowrap flex items-center gap-2"
                                >
                                    <VideoIcon className="w-4 h-4" />
                                    Ativar Câmera
                                </button>
                            )}
                            <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center hidden sm:flex">
                                <MonitorUp className="w-5 h-5" />
                            </button>

                            <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block"></div>

                            <button className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95">
                                <PhoneOff className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Local PIP - Positioned BOTTOM-RIGHT */}
                        <div className="absolute bottom-8 right-8 z-[60] w-56 md:w-64 aspect-video bg-slate-900 rounded-[32px] overflow-hidden border border-white/20 shadow-2xl transition-all duration-700 hover:scale-[1.05] ring-2 ring-white/10 group/pip">
                            {isVideoOff || !localStream ? (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-white/5">
                                        <User className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Sua Câmera Offline</p>
                                </div>
                            ) : (
                                <video
                                    ref={setVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 backdrop-blur-xl rounded-lg border border-white/5">
                                <span className="text-[7px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                                    <div className={`w-1 h-1 rounded-full ${(!localStream || isVideoOff) ? 'bg-slate-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                                    VOCÊ (DR. WINCHESTER)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Utility (Notes) Area */}
                    <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-xl flex flex-col min-h-[400px]">
                        <div className="flex items-center justify-between px-8 pt-4 border-b border-slate-50 shrink-0">
                            <div className="flex items-center gap-6">
                                {['Evolução', 'Prescrições', 'Exames', 'Anexos'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "pb-4 font-black text-[9px] uppercase tracking-widest transition-all relative",
                                            activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></div>}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={saveMedicalRecord}
                                disabled={isSaving || !activePatient}
                                className="mb-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
                            >
                                {isSaving ? "Salvando..." : "Salvar Registro"}
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto custom-scrollbar">
                            <div className="lg:col-span-4 space-y-3">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Contexto do Paciente</p>
                                <div className="bg-slate-50/50 p-6 rounded-3xl text-slate-600 text-xs leading-relaxed border border-slate-100">
                                    <p className="font-bold text-slate-900 mb-2 uppercase text-[10px]">Motivo Principal:</p>
                                    <p className="italic">"{activePatient?.observations || 'Não informado'}"</p>

                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="font-bold text-slate-900 mb-2 uppercase text-[10px]">Status:</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                            <span className="text-[10px] font-black uppercase">Pronto para {activeTab}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-8 flex flex-col">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-3">
                                    {activeTab === 'Evolução' ? 'Notas de Evolução Clínica' :
                                        activeTab === 'Prescrições' ? 'Prescrição de Medicamentos' :
                                            activeTab === 'Exames' ? 'Solicitação de Exames Complementares' : 'Anexos e Documentos'}
                                </p>
                                {activeTab === 'Anexos' ? (
                                    <div className="flex-1 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                            <ExternalLink className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-500">Arraste arquivos aqui para anexar</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PDF, JPG ou PNG até 10MB</p>
                                        </div>
                                    </div>
                                ) : (
                                    <textarea
                                        className="flex-1 bg-slate-50 border border-slate-100 rounded-3xl p-6 text-xs font-medium outline-none focus:bg-white focus:ring-1 focus:ring-blue-100 transition-all resize-none min-h-[250px]"
                                        placeholder={`Inicie o registro de ${activeTab.toLowerCase()} aqui...`}
                                        value={activeTab === 'Evolução' ? evolutionText :
                                            activeTab === 'Prescrições' ? prescriptionText : examsText}
                                        onChange={(e) => {
                                            if (activeTab === 'Evolução') setEvolutionText(e.target.value);
                                            else if (activeTab === 'Prescrições') setPrescriptionText(e.target.value);
                                            else setExamsText(e.target.value);
                                        }}
                                    ></textarea>
                                )}
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
                                                {apt.patient?.name?.split(' ')?.map((n: any) => n[0]).join('') || '?'}
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
