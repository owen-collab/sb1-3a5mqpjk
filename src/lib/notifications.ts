import { supabase } from './supabase';

export interface Notification {
  id: string;
  user_id?: string;
  rendezvous_id: string;
  type: 'email' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  message: string;
  scheduled_for?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export const notificationService = {
  // Create notification
  async create(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'sent_at'>) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Schedule appointment confirmation
  async scheduleConfirmation(rendezvousId: string, userEmail: string, userName: string, service: string, date?: string, heure?: string) {
    const message = `Bonjour ${userName}, votre rendez-vous pour ${service} ${date && heure ? `le ${date} à ${heure}` : ''} a été confirmé. Merci de votre confiance ! - IN AUTO`;
    
    return this.create({
      rendezvous_id: rendezvousId,
      type: 'email',
      status: 'pending',
      message,
      scheduled_for: new Date().toISOString()
    });
  },

  // Schedule appointment reminder
  async scheduleReminder(rendezvousId: string, userEmail: string, userName: string, service: string, appointmentDate: string) {
    const reminderDate = new Date(appointmentDate);
    reminderDate.setDate(reminderDate.getDate() - 1); // 1 day before
    
    const message = `Rappel : Votre rendez-vous chez IN AUTO pour ${service} est prévu demain. N'oubliez pas ! Appelez-nous au (+237) 675 978 777 si besoin.`;
    
    return this.create({
      rendezvous_id: rendezvousId,
      type: 'email',
      status: 'pending',
      message,
      scheduled_for: reminderDate.toISOString()
    });
  },

  // Schedule status update notification
  async scheduleStatusUpdate(rendezvousId: string, userName: string, newStatus: string) {
    const statusMessages = {
      'confirme': 'Votre rendez-vous a été confirmé par notre équipe.',
      'en_cours': 'Votre véhicule est actuellement en cours de traitement.',
      'termine': 'Votre véhicule est prêt ! Vous pouvez venir le récupérer.',
      'annule': 'Votre rendez-vous a été annulé. Contactez-nous pour reprogrammer.'
    };
    
    const message = `Bonjour ${userName}, ${statusMessages[newStatus as keyof typeof statusMessages] || 'Le statut de votre rendez-vous a été mis à jour.'} - IN AUTO`;
    
    return this.create({
      rendezvous_id: rendezvousId,
      type: 'email',
      status: 'pending',
      message,
      scheduled_for: new Date().toISOString()
    });
  },

  // Get pending notifications
  async getPending() {
    if (!supabase) {
      console.warn('⚠️ Supabase non configuré - notifications désactivées');
      return [];
    }
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('scheduled_for', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Mark notification as sent
  async markAsSent(id: string) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark notification as failed
  async markAsFailed(id: string) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('notifications')
      .update({ status: 'failed' })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Simulate sending notifications (replace with real email/SMS service)
  async processNotifications() {
    try {
      const pending = await this.getPending();
      
      if (pending.length === 0) {
        return;
      }
    
      for (const notification of pending) {
        try {
          // Simulate email/SMS sending
          console.log(`Sending ${notification.type}:`, notification.message);
          
          // In a real app, you would integrate with:
          // - Email: SendGrid, Mailgun, AWS SES
          // - SMS: Twilio, AWS SNS
          
          // Simulate success (90% success rate)
          if (Math.random() > 0.1) {
            await this.markAsSent(notification.id);
            console.log(`✅ Notification ${notification.id} sent successfully`);
          } else {
            await this.markAsFailed(notification.id);
            console.log(`❌ Notification ${notification.id} failed to send`);
          }
        } catch (error) {
          console.error(`Error processing notification ${notification.id}:`, error);
          await this.markAsFailed(notification.id);
        }
      }
    } catch (error) {
      console.warn('⚠️ Notifications désactivées - Supabase non configuré');
    }
  }
};