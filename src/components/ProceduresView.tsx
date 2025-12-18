import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Assuming supabase client is here

interface Procedure {
    id: string;
    code: string;
    name: string;
    category: string;
    base_price: number;
    active: boolean;
}

const ProceduresView: React.FC = () => {
    const [procedures, setProcedures] = useState<Procedure[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProcedures();
    }, []);

    const fetchProcedures = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('procedures')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching procedures:', error);
        } else {
            setProcedures(data || []);
        }
        setLoading(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const filteredProcedures = procedures.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.includes(searchTerm)
    );

    return (
        <div className="flex flex-col gap-6 h-full p-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Procedimentos e Tabela TUSS</h2>
                    <p className="mt-1 text-slate-500">Gerencie a tabela de preços e códigos de serviço da clínica.</p>
                </div>
                <button className="flex items-center gap-2 px-5 h-10 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/30">
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                    Novo Procedimento
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou código TUSS..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <select className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 outline-none">
                        <option>Todas as Categorias</option>
                        <option>Consultas</option>
                        <option>Exames</option>
                        <option>Cirurgias</option>
                    </select>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Código TUSS</th>
                                    <th className="px-6 py-4 font-bold">Procedimento</th>
                                    <th className="px-6 py-4 font-bold">Categoria</th>
                                    <th className="px-6 py-4 font-bold text-right">Preço Base</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredProcedures.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-blue-600 font-bold">{item.code}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.base_price)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProceduresView;
