import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../lib/utils'; // Adjust path if needed

interface DraggableAppointmentProps {
    appointment: any; // Type accurately if possible
    onClick: (id: string) => void;
    style: React.CSSProperties; // Position and height passed from parent
    getAppointmentColor: (type: string) => any;
}

export const DraggableAppointment = ({ appointment, onClick, style, getAppointmentColor }: DraggableAppointmentProps) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: appointment.id,
        data: {
            appointment, // Pass full data to event
            originalDate: appointment.appointment_date,
            originalTime: appointment.start_time
        }
    });

    const colors = getAppointmentColor(appointment.type);

    // Combine absolute positioning styled from parent with drag transform
    const combinedStyle = {
        ...style,
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 50 : 10,
        opacity: isDragging ? 0.8 : 1,
        touchAction: 'none' // Important for touch devices
    };

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={(e) => {
                // Prevent click if it was a drag (optional logic, but DndKit handles handled events usually)
                if (!isDragging) {
                    e.stopPropagation();
                    onClick(appointment.id);
                }
            }}
            className={cn(
                "absolute left-1 right-1 rounded hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing border-l-4 group",
                colors.bg,
                colors.border,
                isDragging && "shadow-2xl ring-2 ring-blue-400 rotate-1"
            )}
            style={combinedStyle}
        >
            {/* Inner Content with Overflow Hidden */}
            <div className="w-full h-full overflow-hidden p-2">
                {appointment.type === 'blocked' ? (
                    <div className="flex flex-col h-full justify-center items-center opacity-75">
                        <div className="flex items-center justify-center gap-1 mb-0.5">
                            <span className="material-symbols-outlined text-[14px]">block</span>
                        </div>
                        <p className="text-[10px] font-bold text-center leading-none uppercase tracking-wide truncate w-full px-1">{appointment.observations || appointment.notes || 'Bloqueado'}</p>
                    </div>
                ) : (
                    <>
                        <p className="text-xs font-bold text-slate-900 truncate leading-tight">{appointment.patient?.name || 'Sem paciente'}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[10px] text-slate-500">schedule</span>
                            <p className="text-[10px] font-medium text-slate-700">{appointment.start_time.slice(0, 5)}</p>
                        </div>
                        {appointment.doctor?.name && (
                            <p className="text-[9px] text-slate-500 truncate mt-0.5 border-t border-slate-200/50 pt-0.5">
                                {appointment.doctor.name}
                            </p>
                        )}
                    </>
                )}
            </div>

            {/* Hover Tooltip (Only showing when not dragging to avoid clutter) */}
            {!isDragging && appointment.type !== 'blocked' && (
                <div className="hidden group-hover:block absolute left-[95%] top-0 z-50 w-64 bg-slate-900 text-white p-4 rounded-xl shadow-2xl ml-2 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-900 rotate-45"></div>
                    <div className="space-y-3 relative">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Paciente</p>
                            <p className="font-bold text-sm leading-tight text-white mb-0.5">{appointment.patient?.name}</p>
                            {appointment.patient?.phone && (
                                <div className="flex items-center gap-1 text-xs text-slate-300">
                                    <span className="material-symbols-outlined text-[10px]">call</span>
                                    {appointment.patient.phone}
                                </div>
                            )}
                        </div>

                        {appointment.observations && (
                            <div className="pt-2 border-t border-slate-700/50">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Observações</p>
                                <p className="text-xs text-slate-300 italic line-clamp-3 bg-slate-800/50 p-2 rounded-lg">{appointment.observations}</p>
                            </div>
                        )}

                        <div className="pt-2 border-t border-slate-700/50 flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">{appointment.type}</span>
                            <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1",
                                appointment.status === 'confirmed' ? "bg-blue-500/20 text-blue-300" :
                                    appointment.status === 'arrived' ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-700 text-slate-400"
                            )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                {appointment.status === 'arrived' ? 'Chegou' : appointment.status}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
