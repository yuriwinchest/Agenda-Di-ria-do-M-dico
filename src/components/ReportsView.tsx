
import React, { useState } from 'react';
import { cn } from '../lib/utils';

// Mock Data for Reports
const kpiData = [
    { id: 1, title: 'Total de Atendimentos', value: '1.245', trend: '+12%', trendUp: true, icon: 'stethoscope', color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 2, title: 'Faturamento Total', value: 'R$ 452.800', trend: '+8%', trendUp: true, icon: 'payments', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 3, title: 'Novos Pacientes', value: '184', trend: '-2%', trendUp: false, icon: 'person_add', color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 4, title: 'Ticket Médio', value: 'R$ 363,00', trend: '+5%', trendUp: true, icon: 'receipt_long', color: 'text-orange-600', bg: 'bg-orange-50' },
];

const doctorsPerformance = [
    { name: 'Dr. Mendes', count: 280, color: 'bg-blue-600' },
    { name: 'Dra. Ana', count: 150, color: 'bg-blue-600' },
    { name: 'Dr. Carlos', count: 240, color: 'bg-blue-600' },
    { name: 'Dra. Julia', count: 120, color: 'bg-blue-600' },
    { name: 'Dr. Paulo', count: 200, color: 'bg-blue-600' },
];
// Max value for scaling bars
const maxPerformance = Math.max(...doctorsPerformance.map(d => d.count)) * 1.2;

const specialtyPerformance = [
    { name: 'Cardiologia', count: 324, revenue: 'R$ 145.800,00', ticket: 'R$ 450,00', status: 'Acima da Meta', statusColor: 'bg-emerald-100 text-emerald-800' },
    { name: 'Dermatologia', count: 210, revenue: 'R$ 105.000,00', ticket: 'R$ 500,00', status: 'Na Meta', statusColor: 'bg-blue-100 text-blue-800' },
    { name: 'Pediatria', count: 415, revenue: 'R$ 124.500,00', ticket: 'R$ 300,00', status: 'Abaixo da Meta', statusColor: 'bg-orange-100 text-orange-800' },
    { name: 'Ortopedia', count: 180, revenue: 'R$ 54.000,00', ticket: 'R$ 300,00', status: 'Na Meta', statusColor: 'bg-blue-100 text-blue-800' },
    { name: 'Ginecologia', count: 116, revenue: 'R$ 23.500,00', ticket: 'R$ 202,00', status: 'Abaixo da Meta', statusColor: 'bg-orange-100 text-orange-800' },
];

const ReportsView: React.FC = () => {
    const [period, setPeriod] = useState<'mensal' | 'semanal' | 'diario'>('mensal');

    return (
        <div className="flex flex-col h-full gap-6">
            {/* Header / Filter Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setPeriod('mensal')}
                        className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", period === 'mensal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setPeriod('semanal')}
                        className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", period === 'semanal' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        Semanal
                    </button>
                    <button
                        onClick={() => setPeriod('diario')}
                        className={cn("px-4 py-1.5 text-sm font-medium rounded-md transition-all", period === 'diario' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
                    >
                        Diário
                    </button>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Todas as Especialidades</option>
                            <option>Cardiologia</option>
                            <option>Dermatologia</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none" style={{ fontSize: '20px' }}>
                            expand_more
                        </span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>filter_list</span>
                        Filtrar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi) => (
                    <div key={kpi.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-blue-300 transition-all">
                        <div className="flex justify-between items-start">
                            <div className={cn("p-2 rounded-lg", kpi.bg, kpi.color)}>
                                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{kpi.icon}</span>
                            </div>
                            <div className={cn("flex items-center text-xs font-semibold px-2 py-1 rounded-full", kpi.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                                <span className="material-symbols-outlined mr-0.5" style={{ fontSize: '14px' }}>
                                    {kpi.trendUp ? 'trending_up' : 'trending_down'}
                                </span>
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{kpi.title}</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bar Chart Mockup */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Atendimentos por Médico</h3>
                        <button className="text-blue-600 text-sm font-medium hover:underline">Ver detalhes</button>
                    </div>

                    <div className="flex items-end justify-between h-64 gap-4 pt-4 border-t border-slate-50 border-dashed">
                        {doctorsPerformance.map((doc, idx) => (
                            <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end group">
                                <div className="relative w-full max-w-[40px] bg-slate-100 rounded-t-md overflow-hidden h-full flex items-end">
                                    <div
                                        className={cn("w-full transition-all duration-700 ease-out group-hover:opacity-90", doc.color)}
                                        style={{ height: `${(doc.count / maxPerformance) * 100}%` }}
                                    ></div>
                                    {/* Tooltip on hover */}
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {doc.count} atendimentos
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 font-medium mt-3 text-center truncate w-full">{doc.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart Mockup (Pure CSS) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Origem da Receita</h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-48 h-48 rounded-full" style={{ background: 'conic-gradient(#3b82f6 0% 55%, #10b981 55% 85%, #f59e0b 85% 100%)' }}>
                            <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total</span>
                                <span className="text-xl font-bold text-slate-900">100%</span>
                            </div>
                        </div>

                        <div className="w-full mt-8 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    Particulares
                                </div>
                                <span className="font-bold text-slate-900">55%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    Convênios
                                </div>
                                <span className="font-bold text-slate-900">30%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    Outros
                                </div>
                                <span className="font-bold text-slate-900">15%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Desempenho Financeiro por Especialidade</h3>
                    <button className="mt-2 sm:mt-0 text-slate-600 hover:text-blue-600 text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-slate-200 hover:border-blue-200 bg-white">
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                        Exportar CSV
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                                <th className="px-6 py-4">Especialidade</th>
                                <th className="px-6 py-4 text-center">Atendimentos</th>
                                <th className="px-6 py-4 text-right">Faturamento Bruto</th>
                                <th className="px-6 py-4 text-right">Ticket Médio</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {specialtyPerformance.map((item, index) => (
                                <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 text-center text-slate-600">{item.count}</td>
                                    <td className="px-6 py-4 text-right text-slate-600 font-medium">{item.revenue}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{item.ticket}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold inline-block", item.statusColor)}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Table Footer / Pagination Mockup */}
                <div className="p-4 border-t border-slate-100 flex justify-center text-xs text-slate-400">
                    Mostrando 5 de 12 especialidades
                </div>
            </div>
        </div>
    );
};

export default ReportsView;
