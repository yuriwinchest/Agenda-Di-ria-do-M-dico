import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

export interface ProcedureData {
    id: string;
    code: string;
    name: string;
    category: string;
    base_price: number;
}

interface ProcedureSelectorProps {
    onSelect: (procedure: ProcedureData) => void;
    initialData?: ProcedureData | null;
}

const ProcedureSelector: React.FC<ProcedureSelectorProps> = ({ onSelect, initialData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [procedures, setProcedures] = useState<ProcedureData[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.length >= 3) {
                searchProcedures();
            } else {
                fetchDefaultProcedures();
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchDefaultProcedures = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('procedures')
            .select('*')
            .limit(10);
        if (data) setProcedures(data as ProcedureData[]);
        setLoading(false);
    };

    const searchProcedures = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('procedures')
            .select('*')
            .or(`name.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%`)
            .limit(20);
        if (data) setProcedures(data as ProcedureData[]);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-800">Selecione o Procedimento (TUSS)</h3>

            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input
                    type="text"
                    placeholder="Busque por código ou nome do procedimento..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 max-h-[300px] overflow-y-auto border border-slate-100 rounded-lg bg-white">
                {procedures.map(proc => (
                    <div
                        key={proc.id}
                        onClick={() => onSelect(proc)}
                        className={cn(
                            "p-3 border-b border-slate-50 last:border-0 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center group",
                            initialData?.id === proc.id ? "bg-blue-50 border-blue-200" : ""
                        )}
                    >
                        <div className="flex-1">
                            <p className="font-bold text-slate-800 text-sm">{proc.name}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">TUSS: {proc.code} • {proc.category}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-blue-600 text-sm">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proc.base_price)}
                            </p>
                        </div>
                    </div>
                ))}
                {procedures.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-400">Nenhum procedimento encontrado.</div>
                )}
            </div>
        </div>
    );
};

export default ProcedureSelector;
