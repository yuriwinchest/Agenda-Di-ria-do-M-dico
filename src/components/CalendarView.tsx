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
    const [selectedDay, setSelectedDay] = useState<Date | null>(new Date()); // Start with today
    const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [schedulingDate, setSchedulingDate] = useState<Date>(new Date());

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
    }, [currentWeekStart, viewMode, selectedDay]);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            let startDate: Date;
            let endDate: Date;

            if (viewMode === 'day') {
                const targetDay = selectedDay || currentWeekStart;
                startDate = new Date(targetDay);
                endDate = new Date(targetDay);
                endDate.setDate(endDate.getDate() + 1);
            } else if (viewMode === 'week') {
                startDate = new Date(currentWeekStart);
                endDate = new Date(currentWeekStart);
                endDate.setDate(endDate.getDate() + 7);
            } else { // month
                // For month view, we want to fetch the whole month of the currentWeekStart
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

    // Initial fetch
    useEffect(() => {
        loadAppointments();
    }, [selectedDay, viewMode]);

    // Timer for Current Time Line
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const handlePreviousWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() - 7);
        setCurrentWeekStart(newStart);

        if (viewMode === 'day' && selectedDay) {
            const newSelected = new Date(selectedDay);
            newSelected.setDate(newSelected.getDate() - 7);
            setSelectedDay(newSelected);
        }
    };

    const handleNextWeek = () => {
        const newStart = new Date(currentWeekStart);
        newStart.setDate(newStart.getDate() + 7);
        setCurrentWeekStart(newStart);

        if (viewMode === 'day' && selectedDay) {
            const newSelected = new Date(selectedDay);
            newSelected.setDate(newSelected.getDate() + 7);
            setSelectedDay(newSelected);
        }
    };

    const getAppointmentsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return appointments.filter(apt => apt.appointment_date === dateStr);
    };

    const PIXELS_PER_MINUTE = 96 / 60; // 96px (h-24) per hour

    const calculatePosition = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const startHour = 8;
        const totalMinutes = (hours - startHour) * 60 + minutes;
        return totalMinutes * PIXELS_PER_MINUTE;
    };

    const calculateDurationHeight = (start: string, end?: string) => {
        let diff = 30; // Default 30 mins

        if (end) {
            const [startHours, startMinutes] = start.split(':').map(Number);
            const [endHours, endMinutes] = end.split(':').map(Number);
            const startTotal = startHours * 60 + startMinutes;
            const endTotal = endHours * 60 + endMinutes;
            const calculatedDiff = endTotal - startTotal;
            if (calculatedDiff > 0) diff = calculatedDiff;
        }

        return (diff * PIXELS_PER_MINUTE) - 2; // Subtract 2px for visual gap
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

    const parseDateLocal = (dateStr: string) => {
        if (!dateStr) return new Date();
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    const handleDayClick = (date: Date) => {
        setSelectedDay(date);
        setViewMode('day');
        console.log('Day clicked:', formatDateLocal(date)); // Debug
    };

    const getFilteredAppointments = () => {
        if (viewMode === 'day' && selectedDay) {
            const dateStr = formatDateLocal(selectedDay);
            return appointments.filter(apt => apt.appointment_date === dateStr);
        }
        return appointments;
    };

    const getVisibleDates = () => {
        if (viewMode === 'day' && selectedDay) {
            return [selectedDay];
        }
        return weekDates;
    };

    const handleMonthSelect = (monthIndex: number) => {
        const newDate = new Date(currentWeekStart);
        newDate.setFullYear(currentWeekStart.getFullYear(), monthIndex, 1);
        setCurrentWeekStart(newDate);
        setSelectedDay(newDate);
        setShowDatePicker(false);
    };

    const handleYearChange = (increment: number) => {
        const newDate = new Date(currentWeekStart);
        newDate.setFullYear(newDate.getFullYear() + increment);
        setCurrentWeekStart(newDate);
        setSelectedDay(newDate);
    };

    return (
        <div className="flex flex-col gap-3 h-full relative">
            <SchedulerModal
                isOpen={isSchedulerOpen}
                onClose={() => {
                    setIsSchedulerOpen(false);
                    loadAppointments();
                }}
                initialDate={schedulingDate}
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
                    <div className="flex items-center gap-2 relative">
                        <button onClick={handlePreviousWeek} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowDatePicker(!showDatePicker)}
                                className="text-sm font-semibold text-slate-800 min-w-[200px] text-center capitalize hover:bg-slate-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-slate-500">calendar_month</span>
                                {formatWeekRange()}
                            </button>

                            {/* Month Picker Popover */}
                            {showDatePicker && (
                                <div className="absolute top-full text-center mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <button onClick={() => handleYearChange(-1)} className="p-1 hover:bg-slate-100 rounded-full">
                                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                                        </button>
                                        <span className="font-bold text-slate-700">{currentWeekStart.getFullYear()}</span>
                                        <button onClick={() => handleYearChange(1)} className="p-1 hover:bg-slate-100 rounded-full">
                                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const date = new Date(currentWeekStart.getFullYear(), i, 1);
                                            const isCurrentMonth = i === currentWeekStart.getMonth();
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handleMonthSelect(i)}
                                                    className={cn(
                                                        "text-xs p-2 rounded-lg font-medium transition-colors",
                                                        isCurrentMonth
                                                            ? "bg-blue-600 text-white"
                                                            : "hover:bg-blue-50 text-slate-600"
                                                    )}
                                                >
                                                    {date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

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
                        onClick={() => {
                            setSchedulingDate(selectedDay || new Date());
                            setIsSchedulerOpen(true);
                        }}
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
                    {getVisibleDates().map((date, i) => {
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDay?.toDateString() === date.toDateString();
                        const appointmentCount = getAppointmentsForDay(date).length;
                        return (
                            <button
                                key={i}
                                onClick={() => handleDayClick(date)}
                                className={cn(
                                    "p-3 text-center border-r border-slate-200 last:border-r-0 transition-all hover:bg-blue-50 cursor-pointer flex flex-col items-center",
                                    isToday && 'bg-blue-50/50',
                                    isSelected && 'bg-blue-100 ring-2 ring-blue-500 ring-inset',
                                    getVisibleDates().length === 1 && "col-span-7"
                                )}
                            >
                                <p className={cn("text-xs font-semibold uppercase", isToday || isSelected ? 'text-blue-600' : 'text-slate-500')}>{days[date.getDay()]}</p>
                                <p className={cn("text-lg font-bold mt-1", isToday || isSelected ? 'text-blue-600' : 'text-slate-800')}>{date.getDate()}</p>
                                <span className={cn("text-[10px] font-medium mt-1 px-2 py-0.5 rounded-full", isToday || isSelected ? 'bg-blue-200 text-blue-700' : 'bg-slate-100 text-slate-500')}>
                                    {appointmentCount} consultas
                                </span>
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
                                                        {parseDateLocal(apt.appointment_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
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
                            {getVisibleDates().map((date, colIndex) => {
                                const dayAppointments = getAppointmentsForDay(date);
                                const isToday = date.toDateString() === new Date().toDateString();

                                return (
                                    <div
                                        key={colIndex}
                                        className={cn(
                                            "border-r border-slate-100 last:border-r-0 relative",
                                            isToday && 'bg-blue-50/10',
                                            getVisibleDates().length === 1 && "col-span-7"
                                        )}
                                    >
                                        {/* Grid Lines */}
                                        {hours.map(hour => (
                                            <div
                                                key={hour}
                                                onClick={() => {
                                                    setSchedulingDate(date);
                                                    setIsSchedulerOpen(true);
                                                }}
                                                className="h-24 border-b border-slate-100 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                                title="Clique para agendar"
                                            >
                                                <div className="hidden group-hover:flex w-full h-full items-center justify-center">
                                                    <span className="material-symbols-outlined text-blue-300">add</span>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Current Time Line */}
                                        {isToday && (
                                            <div
                                                className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                                                style={{ top: `${calculatePosition(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))}px` }}
                                            >
                                                <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 shadow-sm"></div>
                                                <div className="h-[2px] bg-red-500 w-full shadow-sm"></div>
                                            </div>
                                        )}

                                        {/* Real Appointments */}
                                        {dayAppointments.map(apt => {
                                            const colors = getAppointmentColor(apt.type);
                                            const topPosition = calculatePosition(apt.start_time);
                                            const height = calculateDurationHeight(apt.start_time, apt.end_time);

                                            return (
                                                <div
                                                    key={apt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAppointmentId(apt.id);
                                                    }}
                                                    className={cn(
                                                        "absolute left-1 right-1 rounded p-2 hover:shadow-lg transition-all cursor-pointer z-10 border-l-4 overflow-hidden",
                                                        colors.bg,
                                                        colors.border
                                                    )}
                                                    style={{
                                                        top: `${topPosition}px`,
                                                        height: `${height}px`,
                                                        minHeight: '30px'
                                                    }}
                                                >
                                                    <p className="text-xs font-bold text-slate-900 truncate leading-tight">{apt.patient?.name || 'Sem paciente'}</p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <span className="material-symbols-outlined text-[10px] text-slate-500">schedule</span>
                                                        <p className="text-[10px] font-medium text-slate-700">{apt.start_time.slice(0, 5)}</p>
                                                    </div>
                                                    {apt.doctor?.name && (
                                                        <p className="text-[9px] text-slate-500 truncate mt-0.5 border-t border-slate-200/50 pt-0.5">
                                                            {apt.doctor.name}
                                                        </p>
                                                    )}
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
            {showDatePicker && (
                <div className="fixed inset-0 z-40" onClick={() => setShowDatePicker(false)}></div>
            )}
        </div>
    );
};

export default CalendarView;