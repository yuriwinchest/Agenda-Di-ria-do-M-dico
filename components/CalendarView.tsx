import React from 'react';

const CalendarView: React.FC = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

    return (
        <div className="flex flex-col gap-6 h-full">
             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Agenda</h2>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                        <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded">Mês</button>
                        <button className="px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded shadow-sm">Semana</button>
                        <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded">Dia</button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white rounded-full text-slate-500 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-lg font-semibold text-slate-800 w-40 text-center">Out 22 - 28, 2023</span>
                    <button className="p-2 hover:bg-white rounded-full text-slate-500 hover:shadow-sm border border-transparent hover:border-slate-200 transition-all">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-0">
                {/* Header Days */}
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
                    <div className="p-4 border-r border-slate-200 w-20"></div>
                    {days.map((day, i) => (
                        <div key={day} className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${i === 2 ? 'bg-blue-50/50' : ''}`}>
                            <p className={`text-xs font-semibold uppercase ${i === 2 ? 'text-blue-600' : 'text-slate-500'}`}>{day}</p>
                            <p className={`text-lg font-bold mt-1 ${i === 2 ? 'text-blue-600' : 'text-slate-800'}`}>{22 + i}</p>
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="overflow-y-auto flex-1">
                    <div className="grid grid-cols-8">
                        {/* Time Column */}
                        <div className="w-20 border-r border-slate-200 bg-slate-50/30">
                            {hours.map(hour => (
                                <div key={hour} className="h-24 border-b border-slate-100 flex items-start justify-center p-2">
                                    <span className="text-xs text-slate-400 font-medium">{hour}:00</span>
                                </div>
                            ))}
                        </div>

                        {/* Days Columns */}
                        {Array.from({ length: 7 }).map((_, colIndex) => (
                            <div key={colIndex} className={`border-r border-slate-100 last:border-r-0 relative ${colIndex === 2 ? 'bg-blue-50/10' : ''}`}>
                                {/* Grid Lines */}
                                {hours.map(hour => (
                                    <div key={hour} className="h-24 border-b border-slate-100"></div>
                                ))}

                                {/* Example Appointments */}
                                {colIndex === 1 && (
                                    <div className="absolute top-2 left-1 right-1 h-32 bg-indigo-50 border-l-4 border-indigo-500 rounded p-2 hover:shadow-md transition-shadow cursor-pointer">
                                        <p className="text-xs font-bold text-indigo-700">Consulta Inicial</p>
                                        <p className="text-[10px] text-indigo-600 mt-1">08:00 - 09:30</p>
                                        <p className="text-[10px] text-indigo-500 mt-1">Roberto F.</p>
                                    </div>
                                )}
                                
                                {colIndex === 2 && (
                                    <>
                                        <div className="absolute top-[5rem] left-1 right-1 h-20 bg-emerald-50 border-l-4 border-emerald-500 rounded p-2 hover:shadow-md transition-shadow cursor-pointer z-10">
                                            <p className="text-xs font-bold text-emerald-700">Retorno</p>
                                            <p className="text-[10px] text-emerald-600 mt-1">10:00 - 11:00</p>
                                            <p className="text-[10px] text-emerald-500 mt-1">João Santos</p>
                                        </div>
                                         {/* Current Time Indicator */}
                                        <div className="absolute top-[7rem] left-0 right-0 border-t-2 border-red-400 z-20 flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-red-400 -ml-1"></div>
                                        </div>
                                    </>
                                )}

                                {colIndex === 3 && (
                                    <div className="absolute top-[14rem] left-1 right-1 h-20 bg-amber-50 border-l-4 border-amber-500 rounded p-2 hover:shadow-md transition-shadow cursor-pointer">
                                        <p className="text-xs font-bold text-amber-700">Exame</p>
                                        <p className="text-[10px] text-amber-600 mt-1">13:30 - 14:30</p>
                                        <p className="text-[10px] text-amber-500 mt-1">Ana Paula</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;