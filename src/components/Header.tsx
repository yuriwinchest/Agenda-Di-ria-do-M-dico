import React from 'react';
import {
    Bell,
    HelpCircle,
    Calendar as CalendarIcon,
    Search,
    CreditCard,
    Plus,
    LayoutGrid,
    UserCircle,
    Globe2
} from 'lucide-react';
import { cn } from '../lib/utils';

const Header: React.FC = () => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0 shadow-sm">
            {/* Left: Quick Actions */}
            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Pesquisar paciente, consulta..."
                        className="w-80 bg-slate-50 border border-transparent focus:border-blue-100 focus:bg-white focus:ring-4 focus:ring-blue-500/5 rounded-xl py-2 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Servidor Online</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <div className="flex bg-slate-50 p-1 rounded-xl mr-2">
                    <button className="px-3 py-1.5 bg-white shadow-sm border border-slate-100 rounded-lg text-xs font-bold text-blue-600 flex items-center gap-2 transition-all active:scale-95">
                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                        Nova Guia
                    </button>
                    <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">
                        Faturamento
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-2"></div>

                <div className="flex items-center gap-1.5 relative group">
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                        <Bell className="w-[18px] h-[18px]" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-bounce" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <HelpCircle className="w-[18px] h-[18px]" />
                    </button>
                    <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all md:hidden">
                        <Search className="w-[18px] h-[18px]" />
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-100 mx-2"></div>

                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                    <div className="text-right hidden sm:block">
                        <p className="font-black text-slate-800 text-[10px] uppercase tracking-tighter">Dezembro</p>
                        <p className="text-blue-600 font-black text-xs leading-none">2024</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                </button>
            </div>
        </header>
    );
};

export default Header;