import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-20">
            {/* Search */}
            <div className="flex items-center w-full max-w-md">
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '20px' }}>search</span>
                    <input 
                        className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/50 placeholder:text-slate-400 outline-none transition-all" 
                        placeholder="Buscar pacientes, horários..." 
                        type="text"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>help</span>
                </button>
                
                <div className="h-8 w-px bg-slate-200 mx-1"></div>
                
                <div className="text-sm text-right hidden sm:block">
                    <p className="font-semibold text-slate-900">Outubro</p>
                    <p className="text-xs text-slate-500">2023</p>
                </div>
                
                <button className="flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>calendar_month</span>
                </button>
            </div>
        </header>
    );
};

export default Header;