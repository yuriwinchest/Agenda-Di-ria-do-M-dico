import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../utils/eventBus';

class PatientService {
    async registerPatient(patientData: any) {
        const { data, error } = await supabase
            .from('patients')
            .insert([patientData])
            .select()
            .single();

        if (error) throw error;

        // Publish event for coordination
        eventBus.publish(EVENTS.PATIENT_CREATED, data);

        return data;
    }

    async getPatients(searchTerm: string = '') {
        let query = supabase.from('patients').select('*');

        if (searchTerm) {
            query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data;
    }

    async createConsultation(patientId: string, description: string, amount: number, type: 'Particular' | 'Convênio') {
        const { error } = await supabase
            .from('transactions')
            .insert([{
                patient_id: patientId,
                description,
                amount,
                status: 'pending',
                billing_status: type === 'Convênio' ? 'pending' : null
            }]);

        if (error) throw error;

        eventBus.publish(EVENTS.APPOINTMENT_SCHEDULED, { patientId, type });
    }
}

export const patientService = new PatientService();
