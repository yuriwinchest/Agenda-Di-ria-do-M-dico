import React from 'react';

const RightPanel: React.FC = () => {
    return (
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
            {/* Calendar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-900">Outubro 2023</h4>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-7 text-center text-xs gap-y-2">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                        <span key={i} className="text-slate-400 font-medium py-1">{day}</span>
                    ))}
                    {/* Days */}
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                         <button key={d} className="text-slate-400 hover:bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">{d}</button>
                    ))}
                    <button className="text-slate-700 hover:bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">22</button>
                    <button className="text-slate-700 hover:bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">23</button>
                    <button className="bg-blue-600 text-white shadow-md shadow-blue-500/30 rounded-full w-8 h-8 flex items-center justify-center mx-auto font-bold">24</button>
                    {[25, 26, 27, 28].map(d => (
                         <button key={d} className="text-slate-700 hover:bg-slate-50 rounded-full w-8 h-8 flex items-center justify-center mx-auto">{d}</button>
                    ))}
                </div>
            </div>

            {/* Active Patient Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-blue-50/30">
                    <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Paciente em Atendimento
                    </h4>
                </div>
                <div className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div 
                            className="w-10 h-10 rounded-full bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7G-hRL39WRWnI33S4Zn09L3MHaaz6KSooWz7Al5xf0YcKw_zIkcKgku3TThf1KUrOCIkidaGT0SePsuLJIihZ0J7mI8MFzy3IZlqlW_ykKH3KL2QZQeex86AXBA834AletACWTwCdzx0MtBK_NgDSGgz9ZdfWp0CVPVvbCn9V3zxysmf90pVszzhB3UbnvXVaqZCvCkjRJoQmJ1toAQyzUFr3SEjnOAvm1kYmo63_kTjEzTBIfiDUVruGDC38PdR22HV3FyCPs18I")` }}
                        ></div>
                        <div>
                            <p className="font-semibold text-sm text-slate-900">João Santos</p>
                            <p className="text-xs text-slate-500">32 anos • Masculino</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 block mb-0.5">Peso</span>
                            <span className="font-semibold text-slate-700">78kg</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-slate-400 block mb-0.5">Altura</span>
                            <span className="font-semibold text-slate-700">1.82m</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Anotações Rápidas</p>
                        <textarea 
                            className="w-full bg-slate-50 border-none rounded-lg text-sm p-3 h-24 resize-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 placeholder:text-slate-400" 
                            placeholder="Digite observações aqui..."
                        ></textarea>
                    </div>

                    <button className="w-full py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                        Ver Prontuário Completo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RightPanel;