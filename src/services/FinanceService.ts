import { supabase } from '../lib/supabase';
import { eventBus, EVENTS } from '../utils/eventBus';

export interface TransactionData {
    patient_id: string;
    description: string;
    amount: number;
    billing_type: 'Particular' | 'Convênio';
    payment_method?: string;
    status: 'pending' | 'paid' | 'refund';
}

class FinanceService {
    async getTransactions(status: string) {
        const { data, error } = await supabase
            .from('transactions')
            .select(`
                id,
                amount,
                status,
                billing_status,
                description,
                created_at,
                patient_id,
                patients (
                    name,
                    insurance_provider,
                    insurance_card_number,
                    billing_type,
                    cpf,
                    phone,
                    email
                )
            `)
            .eq('status', status === 'refund' ? 'refunded' : status);

        if (error) throw error;
        return data;
    }

    async processPayment(transactionId: string, paymentMethod: string) {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                status: 'paid',
                billing_status: 'authorized',
                payment_method: paymentMethod,
                payment_date: new Date().toISOString()
            })
            .eq('id', transactionId)
            .select();

        if (error) throw error;

        // EDA Persistence
        eventBus.publish(EVENTS.PAYMENT_COMPLETED, data[0], {
            persist: true,
            aggregateId: transactionId
        });

        return data;
    }

    async denyAuthorization(transactionId: string) {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                billing_status: 'denied',
                status: 'paid'
            })
            .eq('id', transactionId)
            .select();

        if (error) throw error;

        eventBus.publish(EVENTS.INSURANCE_UPDATED, { transactionId, status: 'denied' }, {
            persist: true,
            aggregateId: transactionId
        });
    }

    async getGuides() {
        const { data, error } = await supabase
            .from('tiss_guides')
            .select(`
                *,
                patients (name, insurance_provider, insurance_card_number)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    async closeGuide(guideId: string) {
        const { data, error } = await supabase
            .from('tiss_guides')
            .update({ status: 'fechada' })
            .eq('id', guideId)
            .select();

        if (error) throw error;

        eventBus.publish(EVENTS.GUIDE_CLOSED, data[0], {
            persist: true,
            aggregateId: guideId
        });

        return data[0];
    }
}

export const financeService = new FinanceService();
