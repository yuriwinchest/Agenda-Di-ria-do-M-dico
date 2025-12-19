import React, { useState } from 'react';
import {
    Mail,
    Lock,
    ChevronRight,
    ShieldCheck,
    Zap,
    Activity,
    BarChart3,
    AlertCircle,
    Stethoscope,
    Globe
} from 'lucide-react';
import { cn } from '../lib/utils';
import loginHero from '../assets/login_hero.png';
import spaceBg from '../assets/space_bg.png';
import planetEarth from '../assets/planet_earth.png';
import planetMars from '../assets/planet_mars.png';
import planetSaturn from '../assets/planet_saturn.png';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const features = [
        { icon: Zap, title: "Agenda Inteligente", desc: "Gestão de horários com drag-and-drop intuitivo." },
        { icon: ShieldCheck, title: "Prontuário Seguro", desc: "Registros clínicos com assinatura digital ICP-Brasil." },
        { icon: Activity, title: "Faturamento TUSS", desc: "Integração total com convênios e tabelas médicas." },
        { icon: BarChart3, title: "Gestão Financeira", desc: "Controle de fluxo de caixa e repasses médicos." }
    ];

    const stars = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5
    }));

    return (
        <div className="min-h-screen w-full relative overflow-hidden font-sans bg-slate-950">

            {/* 🌌 GLOBAL SPACE BACKGROUND LAYER (Covers both sides) */}
            <div className="fixed inset-0 z-0">
                <img src={spaceBg} alt="Space" className="w-full h-full object-cover opacity-30" />

                {/* Global Stars */}
                {stars.map(star => (
                    <div
                        key={star.id}
                        className="absolute bg-white rounded-full animate-twinkle pointer-events-none"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            animationDelay: `${star.delay}s`
                        }}
                    />
                ))}

                {/* Global Comet */}
                <div className="absolute top-0 left-0 w-80 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-white animate-comet opacity-70 pointer-events-none" />

                {/* 🌏 GLOBAL REALISTIC PLANETS (Moving across entire screen) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <img
                        src={planetEarth}
                        alt="Earth"
                        className="absolute w-80 h-80 object-contain animate-planet-1 mix-blend-screen rounded-full sharp-planet shadow-2xl shadow-blue-500/10"
                    />
                    <img
                        src={planetMars}
                        alt="Mars"
                        className="absolute w-40 h-40 object-contain animate-planet-2 mix-blend-screen rounded-full sharp-planet shadow-xl shadow-orange-500/10"
                    />
                    <img
                        src={planetSaturn}
                        alt="Saturn"
                        className="absolute w-[500px] h-[500px] object-contain animate-planet-3 mix-blend-screen sharp-planet shadow-2xl shadow-amber-500/10"
                    />
                </div>
            </div>

            {/* 🛠️ MAIN CONTENT LAYOUT */}
            <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">

                {/* LEFT SIDE: LOGIN FORM */}
                <div className="w-full lg:w-1/2 flex flex-col h-screen overflow-y-auto custom-scrollbar bg-slate-950/40 backdrop-blur-sm border-r border-white/5">
                    <div className="max-w-md w-full mx-auto px-8 md:px-12 py-12 lg:py-20 flex flex-col min-h-full">

                        {/* Header */}
                        <div className="space-y-6 mb-12">
                            <div className="flex items-center gap-4 hover:scale-105 transition-transform cursor-pointer w-fit group">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:bg-blue-500">
                                    <Stethoscope className="w-8 h-8 text-white transition-transform group-hover:rotate-12" strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                                        Integra<span className="text-blue-500">Clinic</span>
                                    </h1>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1">Stellar Platform</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1] md:leading-[1.1]">
                                    A tecnologia que <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">orbita</span> sua clínica.
                                </h2>
                                <p className="text-slate-300 font-bold text-lg opacity-80 italic">O futuro da medicina digital acessível hoje.</p>
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            {features.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div key={i} className="p-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-md group">
                                        <Icon className="w-5 h-5 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
                                        <h4 className="text-[11px] font-black uppercase tracking-wider text-white mb-1">{f.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold leading-tight">{f.desc}</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Form Area */}
                        <div className="space-y-6 flex-1">
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="E-mail profissional"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-8 pr-6 text-sm font-bold outline-none focus:bg-white/10 focus:border-blue-500 transition-all placeholder:text-slate-500 text-white shadow-inner"
                                />
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[24px] py-5 pl-8 pr-6 text-sm font-bold outline-none focus:bg-white/10 focus:border-blue-500 transition-all placeholder:text-slate-500 text-white shadow-inner"
                                />
                            </div>

                            <button
                                onClick={onLogin}
                                className="w-full h-16 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 active:scale-[0.98] group relative overflow-hidden mt-4"
                            >
                                <span className="relative z-10">Iniciar Acesso Estelar</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                            </button>

                            <div className="flex items-center justify-between px-2 pt-4">
                                <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Recuperar credenciais</button>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                                    <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Português (BR)</button>
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mt-12 text-center">
                            <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.5em]">IntegraClinic Intelligence Systems</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: PHOTO SIDE (With Global Particles passing through) */}
                <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden items-end p-12">
                    {/* Background Hero Image */}
                    <img
                        src={loginHero}
                        alt="Doctors"
                        className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[30s] hover:scale-105"
                    />

                    {/* Subtle Gradient to improve visibility of bottom text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    {/* FULLY TRANSPARENT GLASS OVERLAY (Shifted Lower) */}
                    <div className="relative w-full p-10 bg-white/5 backdrop-blur-3xl rounded-[48px] border border-white/10 shadow-2xl transition-all hover:bg-white/10 group/card">
                        <h3 className="text-5xl font-black text-white leading-[1] tracking-tighter mb-10 opacity-90 group-hover/card:opacity-100 transition-opacity drop-shadow-2xl">
                            A evolução <br /> está no seu <br /> <span className="text-blue-500">consultório.</span>
                        </h3>

                        <div className="grid grid-cols-3 gap-6 opacity-60 group-hover/card:opacity-100 transition-all">
                            <div>
                                <p className="text-3xl font-black text-white tracking-tighter">99.9%</p>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Disponibilidade</p>
                            </div>
                            <div className="border-l border-white/20 pl-6">
                                <p className="text-3xl font-black text-white tracking-tighter">SSL+</p>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Criptografia</p>
                            </div>
                            <div className="border-l border-white/20 pl-6">
                                <p className="text-3xl font-black text-white tracking-tighter">TUSS</p>
                                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Consolidado</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
