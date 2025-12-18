import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SchedulerModal from './scheduling/SchedulerModal';
import AppointmentDetailsModal from './scheduling/AppointmentDetailsModal';
import { cn } from '../lib/utils';

interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    start_time: string;
    end_time?: string;
    status: string;
    type: string;
    observations?: string;
    patient?: { name: string };
    doctor?: { name: string };
}

const CalendarView: React.FC = () => {
    const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getWeekStart(new Date()));
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8:00 to 18:00

    function getWeekStart(date: Date): Date {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        return date;
    });

    useEffect(() => {
        loadAppointments();
    }, [currentWeekStart, viewMode]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            let startDate: Date;
            let endDate: Date;

            if (viewMode === 'day') {
                startDate = new Date(currentWeekStart);
                endDate = new Date(currentWeekStart);
                endDate.setDate(endDate.getDate() + 1);
            } else if (viewMode === 'week') {
                startDate = new Date(currentWeekStart);
                endDate = new Date(currentWeekStart);
                endDate.setDate(endDate.getDate() + 7);
            } else { // month
                startDate = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), 1);
                endDate = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth() + 1, 0);
            }

            // Helper function for local date formatting
            const formatDate = (date: Date): string => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    patient:patients(name),
                    doctor:doctors(name)
                `)
                .gte('appointment_date', formatDate(startDate))
                .lt('appointment_date', formatDate(endDate))
                .neq('status', 'cancelled')
                .order('start_time');

            if (!error && data) {
                setAppointments(data as any);
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);
    };

    const getAppointmentsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return appointments.filter(apt => apt.appointment_date === dateStr);
    };

    const calculatePosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const startHour = 8;
        const totalMinutes = (hours - startHour) * 60 + minutes;
        const pixelsPerMinute = 96 / 60; // 96px (h-24) per hour
        return totalMinutes * pixelsPerMinute;
    };

    const getAppointmentColor = (type: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            'Consulta': { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-700' },
            'Retorno': { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-700' },
            'Exame': { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700' },
            'default': { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' }
        };
        return colors[type] || colors.default;
    };

    const formatWeekRange = () => {
        const start = weekDates[0];
        const end = weekDates[6];
        return `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    };

    // Helper to format date as YYYY-MM-DD without timezone issues
    const formatDateLocal = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDayClick = (date: Date) => {
        setSelectedDay(date);
        setViewMode('day');
        console.log('Day clicked:', formatDateLocal(date)); // Debug
    };

    const getFilteredAppointments = () => {
        if (viewMode === 'day' && selectedDay) {
            const dateStr = formatDateLocal(selectedDay);
            console.log('Filtering by date:', dateStr); // Debug
            console.log('Available appointments:', appointments.map(a => a.appointment_date)); // Debug
            return appointments.filter(apt => apt.appointment_date === dateStr);
        }
        return appointments;
    };

    return (
        <div className="flex flex-col gap-3 h-full relative">
            <SchedulerModal
                isOpen={isSchedulerOpen}
                onClose={() => {
                    setIsSchedulerOpen(false);
                    loadAppointments();
                }}
                initialDate={new Date()}
            />

            {selectedAppointmentId && (
                <AppointmentDetailsModal
                    isOpen={!!selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                    appointmentId={selectedAppointmentId}
                    onUpdate={loadAppointments}
                />
            )}

            {/* Compact Header - Single Row */}
            <div className="flex items-center justify-between gap-4 shrink-0">
                {/* Left: Title + View Filters */}
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">Agenda</h2>
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setViewMode('month');
                                setSelectedDay(null);
                            }}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                                viewMode === 'month' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            Mês
                        </button>
                        <button
                            onClick={() => {
                                setViewMode('week');
                                setSelectedDay(null);
                            }}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                                viewMode === 'week' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            Semana
                        </button>
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                                viewMode === 'day' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                            )}
                        >
                            Dia
                        </button>
                    </div>
                </div>

                {/* Right: Navigation + New Appointment */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button onClick={handlePreviousWeek} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <span className="text-sm font-semibold text-slate-800 min-w-[200px] text-center capitalize">{formatWeekRange()}</span>
                        <button onClick={handleNextWeek} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    {/* Display Mode Toggle */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                        <button
                            onClick={() => setDisplayMode('grid')}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                displayMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                            )}
                            title="Visualização em Grade"
                        >
                            <span className="material-symbols-outlined text-[20px]">grid_view</span>
                        </button>
                        <button
                            onClick={() => setDisplayMode('list')}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                displayMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'
                            )}
                            title="Visualização em Lista"
                        >
                            <span className="material-symbols-outlined text-[20px]">view_list</span>
                        </button>
                    </div>

                    <div className="h-8 w-px bg-slate-200"></div>

                    <button
                        onClick={() => setIsSchedulerOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Agendamento
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col min-h-0">
                {/* Header Days */}
                <div className="grid grid-cols-8 border-b border-slate-200 bg-slate-50">
                    <div className="p-4 border-r border-slate-200 w-20"></div>
                    {weekDates.map((date, i) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDay?.toDateString() === date.toDateString();
                        return (
                            <button
                                key={i}
                                onClick={() => handleDayClick(date)}
                                className={cn(
                                    "p-3 text-center border-r border-slate-200 last:border-r-0 transition-all hover:bg-blue-50 cursor-pointer",
                                    isToday && 'bg-blue-50/50',
                                    isSelected && 'bg-blue-100 ring-2 ring-blue-500 ring-inset'
                                )}
                            >
                                <p className={cn("text-xs font-semibold uppercase", isToday || isSelected ? 'text-blue-600' : 'text-slate-500')}>{days[date.getDay()]}</p>
                                <p className={cn("text-lg font-bold mt-1", isToday || isSelected ? 'text-blue-600' : 'text-slate-800')}>{date.getDate()}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Calendar Content - Grid or List */}
                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : displayMode === 'list' ? (
                        /* List View */
                        <div className="p-4 space-y-3">
                            {getFilteredAppointments().length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <span className="material-symbols-outlined text-5xl mb-2">event_busy</span>
                                    <p>Nenhum agendamento encontrado</p>
                                </div>
                            ) : (
                                getFilteredAppointments().map(apt => {
                                    const colors = getAppointmentColor(apt.type);
                                    return (
                                        <div
                                            key={apt.id}
                                            onClick={() => setSelectedAppointmentId(apt.id)}
                                            className={cn(
                                                "p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-all",
                                                colors.bg,
                                                colors.border
                                            )}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={cn("font-bold text-sm", colors.text)}>{apt.type}</span>
                                                        <span className="text-xs text-slate-400">•</span>
                                                        <span className="text-sm font-semibold text-slate-700">{apt.start_time}</span>
                                                    </div>
                                                    <p className="text-slate-900 font-medium">{apt.patient?.name || 'Sem paciente'}</p>
                                                    <p className="text-sm text-slate-600 mt-1">{apt.doctor?.name || 'Sem médico'}</p>
                                                    {apt.observations && (
                                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{apt.observations}</p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className="px-2 py-1 text-xs font-medium bg-white rounded border border-slate-200">
                                                        {new Date(apt.appointment_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-1 text-xs font-medium rounded",
                                                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                    )}>
                                                        {apt.status === 'confirmed' ? 'Confirmado' :
                                                            apt.status === 'completed' ? 'Concluído' : 'Agendado'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    ) : (
                        /* Grid View */
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
                            {weekDates.map((date, colIndex) => {
                                const dayAppointments = getAppointmentsForDay(date);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <div key={colIndex} className={cn("border-r border-slate-100 last:border-r-0 relative", isToday && 'bg-blue-50/10')}>
                                        {/* Grid Lines */}
                                        {hours.map(hour => (
                                            <div
                                                key={hour}
                                                onClick={() => setIsSchedulerOpen(true)}
                                                className="h-24 border-b border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                                title="Clique para agendar"
                                            >
                                                <div className="hidden group-hover:flex w-full h-full items-center justify-center">
                                                    <span className="material-symbols-outlined text-blue-300">add</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Real Appointments */}
                                        {dayAppointments.map(apt => {
                                            const colors = getAppointmentColor(apt.type);
                                            const topPosition = calculatePosition(apt.start_time);

                                            return (
                                                <div
                                                    key={apt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAppointmentId(apt.id);
                                                    }}
                                                    className={cn(
                                                        "absolute left-1 right-1 rounded p-2 hover:shadow-lg transition-all cursor-pointer z-10 border-l-4",
                                                        colors.bg,
                                                        colors.border
                                                    )}
                                                    style={{
                                                        top: `${topPosition}px`,
                                                        minHeight: '80px'
                                                    }}
                                                >
                                                    <p className={cn("text-xs font-bold", colors.text)}>{apt.type}</p>
                                                    <p className="text-[10px] text-slate-600 mt-1">{apt.start_time}</p>
                                                    <p className="text-[10px] text-slate-500 mt-1 truncate">{apt.patient?.name || 'Sem paciente'}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;