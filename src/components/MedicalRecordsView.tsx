import React, { useState } from 'react';

const MedicalRecordsView: React.FC = () => {
    const [isSigning, setIsSigning] = useState(false);
    const [signatureSuccess, setSignatureSuccess] = useState(false);

    const handleSignRecord = () => {
        setIsSigning(true);
        // Mocking digital signature process
        setTimeout(() => {
            setIsSigning(false);
            setSignatureSuccess(true);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Prontuário Eletrônico</h2>
                    <p className="mt-1 text-slate-500">Histórico clínico, exames e faturamento integrado.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-5 h-10 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>history</span>
                        Histórico
                    </button>
                    <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                        Nova Evolução
                    </button>
                </div>
            </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* Left: Patient Record Info */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 text-sm">Prontuário: Maria Oliveira</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Convênio: SulAmérica • Guia: 887261</p>
                            </div>
                        </div>
                        {signatureSuccess && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                Assinado Digitalmente
                            </span>
                        )}
                    </div>

                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-blue-600 uppercase">Anamnese / Evolução</span>
                                    <span className="text-[10px] text-slate-400">18/12/2025 09:15</span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    Paciente apresenta quadro de cefaleia tensional persistente há 3 dias. Refere stress laboral elevado.
                                    Sem sinais flogísticos ou déficits focais. Orientada repouso e analgesia.
                                    Solicitado acompanhamento se houver piora.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">description</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Receitário Digital</p>
                                            <p className="text-[10px] text-slate-500">Prescrição via Memed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[20px]">assignment</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Atestado Médico</p>
                                            <p className="text-[10px] text-slate-500">2 dias de afastamento</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3">
                        <button
                            onClick={handleSignRecord}
                            disabled={isSigning || signatureSuccess}
                            className={`flex items-center gap-2 px-6 h-10 font-bold text-xs rounded-lg transition-all ${signatureSuccess
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
                                }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                                {isSigning ? 'sync' : signatureSuccess ? 'done_all' : 'draw'}
                            </span>
                            {isSigning ? 'Assinando...' : signatureSuccess ? 'Registro Assinado' : 'Assinar Digitalmente (ICP-Brasil)'}
                        </button>
                    </div>
                </div>

                {/* Right: Attachments & Billing Context */}
                <div className="w-80 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                        <h4 className="font-bold text-slate-800 text-sm mb-4">Anexos do Paciente</h4>
                        <div className="space-y-3 shrink-0">
                            {[
                                { name: 'Guia_Sulamérica.pdf', type: 'Guia TISS', color: 'blue' },
                                { name: 'Exame_Sangue.pdf', type: 'Resultados', color: 'emerald' },
                            ].map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                                    <div className="flex items-center gap-2">
                                        <span className={`material-symbols-outlined text-${file.color}-500 text-[20px]`}>picture_as_pdf</span>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-bold text-slate-700 truncate">{file.name}</p>
                                            <p className="text-[8px] text-slate-400 font-bold uppercase">{file.type}</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-slate-300 text-[16px]">download</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 mb-2">add_a_photo</span>
                            <p className="text-[10px] font-medium text-slate-500">Arraste novos exames ou guias para anexar</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">Resumo Operacional</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>vpn_key</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-800 font-bold">Token Validado</p>
                                    <p className="text-[10px] text-slate-500">Validade: 18/12 - 23:59</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start opacity-50">
                                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>upload_file</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-800 font-bold">Lote de Faturamento</p>
                                    <p className="text-[10px] text-slate-500">Aguardando fechamento do lote</p>
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
