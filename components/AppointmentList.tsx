import React from 'react';
import { Appointment } from '../types';

const appointments: Appointment[] = [
    {
        id: '1',
        time: '08:00',
        status: 'Concluído',
        patient: {
            id: 'p1',
            name: 'Maria Oliveira',
            type: 'Consulta de Rotina • Particular',
            insurance: 'Particular',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_-uWM6Vra-gnYAjXlHAwILCAFvTRVHqyAg34gf0VRMRe9y5yl5CNMT9ve-2XysLQDrI74PRbNyPCdt4vDD2mQFgL56K3nUGell_yr8Ckr8ZT1jxdk0ID3pgGE7N6z_p0-duVX8KE_IjK6wMdrnDTfZqq2mcItCwsGzPV5b3dNfjHCJTlwZC_MHvhmINComP5utF3yBwdIwiqS47AdeXCeBRuFHrJ7FVEOfMtMGgmxVsJsHPIWtk24LrUUdIuZF2BG3a6eAgtiAY0E',
            age: 28,
            gender: 'Feminino'
        }
    },
    {
        id: '2',
        time: '08:30',
        status: 'Em Atendimento',
        patient: {
            id: 'p2',
            name: 'João Santos',
            type: 'Retorno • Unimed',
            insurance: 'Unimed',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn4JhwYoYr2AwTZOoPcdLcOkKAnf9MQjSwcTqEpD94NiDgUX_i8tbT-6Pl3WHomyiTmx8e8oKP_fv1ROawf4CC6Gh1BI6-vbtWmyFplL39GzFboakC_GmmiejFFowGsZ19TMevpQTLTClyVvI6Osl4Kg5ck-8ipqNPUkxBy2pmO8kJBRJoDKuvI2IurM6xGxsI8xvluYUwTtVcaxVRFt1MTO8FJeh4cupHVlG_c6zzDarE9co-YFVb3XBDVOmn-u6UA2gcQ7TGxXT7',
            age: 32,
            gender: 'Masculino'
        }
    },
    {
        id: '3',
        time: '09:00',
        status: 'Aguardando',
        patient: {
            id: 'p3',
            name: 'Ana Paula',
            type: 'Exame de Sangue • Bradesco Saúde',
            insurance: 'Bradesco Saúde',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjevkAsnuh6q3ZzvVsP0vuJrHFf5TBNM2u9OMlAIH9jKkD-dxrKs6_EAfzuJpTXyDajvkMli6guLvYCnA9I7j5OCB5PH9kWtudVPRiPYKlZtNLVAPntFfoU_q4ccjOUi4ViAD2y1t9niZKVtzt-xQnX3hD1Z1BEj685SWDjZCagee0JnJR0cz2TE5n__LPI9ZHguKO1WNzTYE7iyW2w-VUMlD01cn6m09ipQrkby5UwWPev6R7_8_Byw9yodPrG3b5FSOPG5eKA53D',
            age: 25,
            gender: 'Feminino'
        }
    },
    {
        id: '4',
        time: '09:30',
        status: 'Empty',
    },
    {
        id: '5',
        time: '10:00',
        status: 'Agendado',
        patient: {
            id: 'p4',
            name: 'Carlos Drumond',
            type: 'Primeira Consulta • Particular',
            insurance: 'Particular',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Q_BuBBOAMqJOdM7sCtRne14dpIYKvKiVnFmFXhZl_UbJN9XtI_0lAZJ8JfA-8LFa_aweArCuaOi7o8-VJjtZcn4T5_wd8FarRjmNPRwMiWPn9VdfMtWbB0JiK6Rn9XsRRxAP3Jw4cw2lC512YwcdatNr0d-CbyJ5zphhhaBahSf4cG_z7_polCDqUKfi87AWGw2lD7HZRHEGul4F5EaDocPE_CvMGnUytdAMdCXVJ0SMl0qHeR9VR8sfEyy5bjetpxEFfvhS9nWb',
            age: 45,
            gender: 'Masculino'
        }
    }
];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
        case 'Concluído':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    Concluído
                </span>
            );
        case 'Aguardando':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Aguardando
                </span>
            );
        case 'Agendado':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    Agendado
                </span>
            );
        default:
            return null;
    }
};

const AppointmentList: React.FC = () => {
    return (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden min-h-[600px]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Pacientes Agendados</h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">Ver calendário completo</button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {appointments.map((appointment) => {
                    const isSpecial = appointment.status === 'Em Atendimento';
                    const isEmpty = appointment.status === 'Empty';

                    if (isEmpty) {
                        return (
                            <div key={appointment.id} className="flex border-b border-slate-100 hover:bg-slate-50 transition-colors group border-dashed">
                                <div className="w-20 p-4 flex flex-col items-center justify-center border-r border-slate-100 text-slate-300">
                                    <span className="text-sm font-normal">{appointment.time}</span>
                                </div>
                                <div className="flex-1 p-4 flex items-center justify-center">
                                    <button className="text-slate-400 text-sm font-medium flex items-center gap-2 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add_circle</span>
                                        Adicionar encaixe
                                    </button>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div 
                            key={appointment.id} 
                            className={`flex border-b border-slate-100 ${isSpecial ? 'bg-blue-50/40 relative' : 'hover:bg-slate-50 transition-colors group'}`}
                        >
                            {isSpecial && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                            
                            <div className={`w-20 p-4 flex flex-col items-center justify-center border-r border-slate-100 ${isSpecial ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                <span className={isSpecial ? 'text-base' : 'text-sm font-medium'}>{appointment.time}</span>
                            </div>

                            <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div 
                                            className={`w-10 h-10 ${isSpecial ? 'w-12 h-12' : ''} rounded-full bg-cover bg-center bg-no-repeat shadow-sm`}
                                            style={{ backgroundImage: `url("${appointment.patient?.avatarUrl}")` }}
                                        ></div>
                                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isSpecial ? 'w-3.5 h-3.5 bg-emerald-500 animate-pulse' : appointment.status === 'Concluído' ? 'bg-green-500' : appointment.status === 'Aguardando' ? 'bg-amber-500' : 'bg-slate-300'} rounded-full border-2 border-white`}></div>
                                    </div>
                                    <div className={isSpecial ? 'flex flex-col justify-center h-12' : ''}>
                                        <h4 className={`text-slate-900 ${isSpecial ? 'font-bold text-base' : 'font-semibold text-sm'}`}>{appointment.patient?.name}</h4>
                                        <p className="text-slate-500 text-xs">{appointment.patient?.type}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {isSpecial ? (
                                        <>
                                            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>history</span>
                                                Histórico
                                            </button>
                                            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm shadow-emerald-200 transition-colors">
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>play_arrow</span>
                                                Em Atendimento
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <StatusBadge status={appointment.status} />
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>more_vert</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppointmentList;