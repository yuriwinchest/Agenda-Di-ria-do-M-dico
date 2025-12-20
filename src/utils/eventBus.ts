import { supabase } from '../lib/supabase';

type Handler = (data?: any) => void;

interface PublishOptions {
    persist?: boolean;
    aggregateId?: string;
    userId?: string;
}

class EventBus {
    private events: { [key: string]: Handler[] } = {};

    subscribe(event: string, handler: Handler): () => void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(handler);

        return () => {
            this.events[event] = this.events[event].filter(h => h !== handler);
        };
    }

    async publish(event: string, data?: any, options: PublishOptions = {}) {
        // Local notifications (Sync)
        if (this.events[event]) {
            this.events[event].forEach(handler => handler(data));
        }

        // Remote Persistence (Async EDA)
        if (options.persist) {
            try {
                await supabase.from('system_events').insert([{
                    event_type: event,
                    aggregate_id: options.aggregateId,
                    user_id: options.userId,
                    payload: data
                }]);
            } catch (error) {
                console.error('Error persisting event:', error);
            }
        }
    }
}

export const eventBus = new EventBus();

export const EVENTS = {
    // Operational
    PATIENT_CREATED: 'PATIENT_CREATED',
    APPOINTMENT_SCHEDULED: 'APPOINTMENT_SCHEDULED',
    PAYMENT_COMPLETED: 'PAYMENT_COMPLETED',
    INSURANCE_UPDATED: 'INSURANCE_UPDATED',
    VIEW_CHANGED: 'VIEW_CHANGED',

    // TISS / Billing Flow
    GUIDE_OPENED: 'GUIDE_OPENED',
    GUIDE_AUTHORIZED: 'GUIDE_AUTHORIZED',
    GUIDE_EXECUTED: 'GUIDE_EXECUTED',
    GUIDE_CLOSED: 'GUIDE_CLOSED',
    BATCH_GENERATED: 'BATCH_GENERATED'
};
