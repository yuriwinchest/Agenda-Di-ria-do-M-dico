export interface Patient {
    id: string;
    name: string;
    avatarUrl: string;
    age?: number;
    gender?: string;
    weight?: string;
    height?: string;
    insurance: string;
    type: string;
    email?: string;
    phone?: string;
    lastVisit?: string;
    status?: 'Active' | 'Inactive';
}

export type AppointmentStatus = 'Concluído' | 'Em Atendimento' | 'Aguardando' | 'Agendado' | 'Empty';

export interface Appointment {
    id: string;
    time: string;
    patient?: Patient;
    status: AppointmentStatus;
}

export interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    colorClass: string;
    bgClass: string;
}

export type ViewType = 'dashboard' | 'calendar' | 'teleconsultation' | 'patients' | 'records' | 'doctors' | 'finance' | 'reports' | 'settings';