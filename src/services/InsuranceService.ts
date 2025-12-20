import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../utils/eventBus';

class InsuranceService {
    async getInsurances() {
        const { data, error } = await supabase
            .from('insurances')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error('Error fetching insurances:', error);
            // Fallback mock for safety during migration
            return [
                { id: '1', name: 'Unimed Central', operator_code: 'UNI-999', version: '4.01.00', plans: [], professionals: [] },
                { id: '2', name: 'Bradesco Saúde', operator_code: 'BRD-123', version: '4.01.00', plans: [], professionals: [] }
            ];
        }
        return data;
    }

    async saveInsurance(insurance: any) {
        const isNew = !insurance.id;
        const { data, error } = await supabase
            .from('insurances')
            .upsert([insurance])
            .select();

        if (error) throw error;

        // EDA Persistence
        eventBus.publish(EVENTS.INSURANCE_UPDATED, data[0], {
            persist: true,
            aggregateId: data[0].id
        });

        return data[0];
    }

    async getProcedures() {
        const { data, error } = await supabase
            .from('tuss_procedures')
            .select('*')
            .order('description', { ascending: true });

        if (error) throw error;
        return data;
    }

    async createTissGuide(guideData: any) {
        const { data, error } = await supabase
            .from('tiss_guides')
            .insert([guideData])
            .select();

        if (error) throw error;

        // EDA Audit
        eventBus.publish(EVENTS.GUIDE_OPENED, data[0], {
            persist: true,
            aggregateId: data[0].id
        });

        return data[0];
    }
}

export const insuranceService = new InsuranceService();
