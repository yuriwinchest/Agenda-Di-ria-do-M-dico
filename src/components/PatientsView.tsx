import React, { useState } from 'react';
import { Patient } from '../types';
import PatientRegistration from './PatientRegistration';

const patients: Patient[] = [
    { id: '1', name: 'Maria Oliveira', age: 28, gender: 'Feminino', insurance: 'Particular', email: 'maria.oli@gmail.com', phone: '(11) 99999-1234', lastVisit: '20 Out, 2023', status: 'Active', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_-uWM6Vra-gnYAjXlHAwILCAFvTRVHqyAg34gf0VRMRe9y5yl5CNMT9ve-2XysLQDrI74PRbNyPCdt4vDD2mQFgL56K3nUGell_yr8Ckr8ZT1jxdk0ID3pgGE7N6z_p0-duVX8KE_IjK6wMdrnDTfZqq2mcItCwsGzPV5b3dNfjHCJTlwZC_MHvhmINComP5utF3yBwdIwiqS47AdeXCeBRuFHrJ7FVEOfMtMGgmxVsJsHPIWtk24LrUUdIuZF2BG3a6eAgtiAY0E', type: 'Particular' },
    { id: '2', name: 'João Santos', age: 32, gender: 'Masculino', insurance: 'Unimed', email: 'joao.santos@email.com', phone: '(11) 98888-5678', lastVisit: '24 Out, 2023', status: 'Active', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBn4JhwYoYr2AwTZOoPcdLcOkKAnf9MQjSwcTqEpD94NiDgUX_i8tbT-6Pl3WHomyiTmx8e8oKP_fv1ROawf4CC6Gh1BI6-vbtWmyFplL39GzFboakC_GmmiejFFowGsZ19TMevpQTLTClyVvI6Osl4Kg5ck-8ipqNPUkxBy2pmO8kJBRJoDKuvI2IurM6xGxsI8xvluYUwTtVcaxVRFt1MTO8FJeh4cupHVlG_c6zzDarE9co-YFVb3XBDVOmn-u6UA2gcQ7TGxXT7', type: 'Convênio' },
    { id: '3', name: 'Ana Paula', age: 25, gender: 'Feminino', insurance: 'Bradesco', email: 'ana.paula@email.com', phone: '(11) 97777-4321', lastVisit: '15 Out, 2023', status: 'Active', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjevkAsnuh6q3ZzvVsP0vuJrHFf5TBNM2u9OMlAIH9jKkD-dxrKs6_EAfzuJpTXyDajvkMli6guLvYCnA9I7j5OCB5PH9kWtudVPRiPYKlZtNLVAPntFfoU_q4ccjOUi4ViAD2y1t9niZKVtzt-xQnX3hD1Z1BEj685SWDjZCagee0JnJR0cz2TE5n__LPI9ZHguKO1WNzTYE7iyW2w-VUMlD01cn6m09ipQrkby5UwWPev6R7_8_Byw9yodPrG3b5FSOPG5eKA53D', type: 'Convênio' },
    { id: '4', name: 'Carlos Drumond', age: 45, gender: 'Masculino', insurance: 'Particular', email: 'carlos.d@email.com', phone: '(11) 96666-8765', lastVisit: '10 Set, 2023', status: 'Inactive', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Q_BuBBOAMqJOdM7sCtRne14dpIYKvKiVnFmFXhZl_UbJN9XtI_0lAZJ8JfA-8LFa_aweArCuaOi7o8-VJjtZcn4T5_wd8FarRjmNPRwMiWPn9VdfMtWbB0JiK6Rn9XsRRxAP3Jw4cw2lC512YwcdatNr0d-CbyJ5zphhhaBahSf4cG_z7_polCDqUKfi87AWGw2lD7HZRHEGul4F5EaDocPE_CvMGnUytdAMdCXVJ0SMl0qHeR9VR8sfEyy5bjetpxEFfvhS9nWb', type: 'Particular' },
    { id: '5', name: 'Julia Roberts', age: 39, gender: 'Feminino', insurance: 'SulAmérica', email: 'j.roberts@email.com', phone: '(11) 95555-4321', lastVisit: '05 Out, 2023', status: 'Active', avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg', type: 'Convênio' },
    { id: '6', name: 'Roberto Firmino', age: 29, gender: 'Masculino', insurance: 'Unimed', email: 'bobby@email.com', phone: '(11) 94444-1234', lastVisit: '01 Out, 2023', status: 'Active', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg', type: 'Convênio' },
];

const PatientsView: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);

    if (isRegistering) {
        return <PatientRegistration onBack={() => setIsRegistering(false)} />;
    }

    return (
        <div className="flex flex-col gap-6 h-full animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Pacientes</h2>
                    <p className="mt-1 text-slate-500">Gerencie todos os registros de pacientes da clínica.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 h-10 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                        Exportar
                    </button>
                    <button 
                        onClick={() => setIsRegistering(true)}
                        className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person_add</span>
                        Novo Paciente
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col flex-1 overflow-hidden min-h-0">
                {/* Filters */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
                    <div className="relative max-w-sm w-full">
                         <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: '20px' }}>search</span>
                        <input 
                            type="text" 
                            placeholder="Buscar por nome, email ou CPF..." 
                            className="w-full h-10 pl-10 pr-4 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none">
                            <option>Todos os Convênios</option>
                            <option>Particular</option>
                            <option>Unimed</option>
                        </select>
                         <select className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:ring-2 focus:ring-blue-500/50 outline-none">
                            <option>Status: Ativo</option>
                            <option>Inativo</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Paciente</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Convênio</th>
                                <th className="px-6 py-4">Última Visita</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url("${patient.avatarUrl}")` }}></div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{patient.name}</div>
                                                <div className="text-xs text-slate-500">{patient.age} anos • {patient.gender}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-700">{patient.email}</div>
                                        <div className="text-xs text-slate-500">{patient.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patient.insurance === 'Particular' ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-50 text-blue-700'}`}>
                                            {patient.insurance}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {patient.lastVisit}
                                    </td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${patient.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${patient.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            {patient.status === 'Active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {/* Footer Pagination */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
                    <p className="text-xs text-slate-500">Mostrando <span className="font-medium text-slate-900">1-6</span> de <span className="font-medium text-slate-900">124</span> pacientes</p>
                    <div className="flex gap-2">
                         <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Anterior</button>
                         <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientsView;