import React from 'react';

const MedicalRecordsView: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 h-full">
             <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Prontuários Eletrônicos</h2>
                    <p className="mt-1 text-slate-500">Acesse históricos, exames e prescrições.</p>
                </div>
                 <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                    Nova Entrada
                </button>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Left: Recent Folders */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-800">Arquivos Recentes</h3>
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer group bg-white">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <span className="material-symbols-outlined">folder</span>
                                    </div>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                                    </button>
                                </div>
                                <h4 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">Maria Oliveira</h4>
                                <p className="text-xs text-slate-500 mb-4">Atualizado há 2 horas</p>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600">Exames</span>
                                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600">Prescrições</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Quick Upload/Drop */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center border-dashed border-2 border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer h-64">
                         <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>cloud_upload</span>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-1">Upload Rápido</h4>
                        <p className="text-xs text-slate-500 max-w-[200px]">Arraste arquivos PDF, JPG ou PNG para anexar a um prontuário.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                         <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="font-semibold text-slate-800 text-sm">Atualizações do Sistema</h3>
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                             <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">Exame processado</p>
                                    <p className="text-xs text-slate-500">Hemograma de João Santos finalizado.</p>
                                </div>
                            </div>
                             <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>warning</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">Assinatura Pendente</p>
                                    <p className="text-xs text-slate-500">Prontuário #442 precisa de revisão.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsView;