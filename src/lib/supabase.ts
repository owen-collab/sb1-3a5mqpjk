import { createClient } from '@supabase/supabase-js';

// Types
export interface RendezVous {
  id: string;
  nom: string;
  telephone: string;
  email?: string;
  service: string;
  date?: string;
  heure?: string;
  message?: string;
  status: 'nouveau' | 'confirme' | 'en_cours' | 'termine' | 'annule';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  rendezvous_id?: string;
  stripe_payment_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  payment_method?: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Test functions
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.log('❌ Client Supabase non initialisé');
    return false;
  }

  try {
    const { data, error } = await supabase
      .from('rendezvous')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error);
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error);
    return false;
  }
};

export const testSupabaseInsert = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const testData = {
      nom: 'Test User',
      telephone: '+237600000000',
      service: 'test',
      status: 'nouveau' as const,
      payment_status: 'pending' as const
    };

    const { data, error } = await supabase
      .from('rendezvous')
      .insert([testData])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur d\'insertion:', error);
      return false;
    }

    // Nettoyer le test
    if (data?.id) {
      await supabase.from('rendezvous').delete().eq('id', data.id);
    }

    console.log('✅ Test d\'insertion réussi');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test d\'insertion:', error);
    return false;
  }
};

export const getSupabaseStats = async () => {
  const stats = {
    rendezvous: 0,
    payments: 0,
    errors: {
      rendezvous: null as string | null,
      payments: null as string | null
    }
  };

  if (!supabase) {
    stats.errors.rendezvous = 'Client non initialisé';
    stats.errors.payments = 'Client non initialisé';
    return stats;
  }

  try {
    const { count: rdvCount, error: rdvError } = await supabase
      .from('rendezvous')
      .select('*', { count: 'exact', head: true });
    
    if (rdvError) {
      stats.errors.rendezvous = rdvError.message;
    } else {
      stats.rendezvous = rdvCount || 0;
    }
  } catch (error) {
    stats.errors.rendezvous = error instanceof Error ? error.message : 'Erreur inconnue';
  }

  try {
    const { count: paymentCount, error: paymentError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });
    
    if (paymentError) {
      stats.errors.payments = paymentError.message;
    } else {
      stats.payments = paymentCount || 0;
    }
  } catch (error) {
    stats.errors.payments = error instanceof Error ? error.message : 'Erreur inconnue';
  }

  return stats;
};

// Services
export const rendezVousService = {
  async getAll(): Promise<RendezVous[]> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(rendezVous: Omit<RendezVous, 'id' | 'created_at' | 'updated_at'>): Promise<RendezVous> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    // Vérifier la limite de rendez-vous par créneau (maximum 3)
    if (rendezVous.date && rendezVous.heure) {
      const { count, error: countError } = await supabase
        .from('rendezvous')
        .select('*', { count: 'exact', head: true })
        .eq('date', rendezVous.date)
        .eq('heure', rendezVous.heure)
        .neq('status', 'annule'); // Exclure les rendez-vous annulés
      
      if (countError) {
        console.error('Erreur lors de la vérification du créneau:', countError);
        throw new Error('Erreur lors de la vérification de disponibilité du créneau');
      }
      
      if (count && count >= 3) {
        throw new Error('SLOT_FULL: Ce créneau horaire est complet (maximum 3 rendez-vous). Veuillez choisir un autre créneau.');
      }
    }
    
    const { data, error } = await supabase
      .from('rendezvous')
      .insert([rendezVous])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<RendezVous>): Promise<RendezVous> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { error } = await supabase
      .from('rendezvous')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>): Promise<Payment> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('payments')
      .insert([payment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Payment>): Promise<Payment> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const subscribeToRendezVous = (callback: (payload: any) => void) => {
  if (!supabase) throw new Error('Supabase non configuré');
  
  return supabase
    .channel('rendezvous-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'rendezvous' }, 
      callback
    )
    .subscribe();
};

export const subscribeToPayments = (callback: (payload: any) => void) => {
  if (!supabase) throw new Error('Supabase non configuré');
  
  return supabase
    .channel('payments-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payments' }, 
      callback
    )
    .subscribe();
};