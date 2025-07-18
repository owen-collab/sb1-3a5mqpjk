import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co')
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

// Database types based on your schema
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
  payment_method?: 'card' | 'mobile_money';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Rendez-vous service
export const rendezVousService = {
  async create(data: Omit<RendezVous, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    console.log('🚀 Tentative de création rendez-vous:', data);
    
    const { data: result, error } = await supabase
      .from('rendezvous')
      .insert([{
        ...data,
        status: data.status || 'nouveau',
        payment_status: data.payment_status || 'pending'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la création du rendez-vous:', error);
      throw error;
    }
    
    console.log('✅ Rendez-vous créé avec succès:', result);
    return result;
  },

  async getAll(): Promise<RendezVous[]> {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<RendezVous> {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<RendezVous>) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { error } = await supabase
      .from('rendezvous')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Payment service
export const paymentService = {
  async create(data: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    console.log('💳 Tentative de création paiement:', data);
    
    const { data: result, error } = await supabase
      .from('payments')
      .insert([{
        ...data,
        currency: data.currency || 'XAF'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Erreur lors de la création du paiement:', error);
      throw error;
    }
    
    console.log('✅ Paiement créé avec succès:', result);
    return result;
  },

  async getAll(): Promise<Payment[]> {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        rendezvous:rendezvous_id (
          nom,
          service,
          date,
          heure
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Payment> {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        rendezvous:rendezvous_id (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Payment>) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    if (!supabase) throw new Error('Supabase not initialized');
    
    const { error } = await supabase
      .from('payments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Real-time subscriptions
export const subscribeToRendezVous = (callback: (payload: any) => void) => {
  if (!supabase) {
    console.warn('Supabase not initialized, cannot subscribe to changes');
    return { unsubscribe: () => {} };
  }
  
  return supabase
    .channel('rendezvous-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'rendezvous' }, 
      callback
    )
    .subscribe();
};

export const subscribeToPayments = (callback: (payload: any) => void) => {
  if (!supabase) {
    console.warn('Supabase not initialized, cannot subscribe to changes');
    return { unsubscribe: () => {} };
  }
  
  return supabase
    .channel('payments-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payments' }, 
      callback
    )
    .subscribe();
};

// Utility functions for debugging and testing
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return false;
  }
  
  try {
    const { data, error } = await supabase
      .from('rendezvous')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
};

export const testSupabaseInsert = async (): Promise<boolean> => {
  if (!supabase) {
    console.warn('Supabase not initialized');
    return false;
  }
  
  try {
    console.log('🧪 Test d\'insertion Supabase...');
    
    // Test insert avec un enregistrement de test
    const testData = {
      nom: 'Test Automatique',
      telephone: '+237000000000',
      service: 'diagnostic',
      message: 'Test de connexion automatique - sera supprimé',
      status: 'nouveau' as const,
      payment_status: 'pending' as const
    };
    
    const { data, error } = await supabase
      .from('rendezvous')
      .insert([testData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Test d\'insertion échoué:', error);
      return false;
    }
    
    console.log('✅ Test d\'insertion réussi, nettoyage...');
    
    // Nettoyer l'enregistrement de test
    if (data?.id) {
      await supabase
        .from('rendezvous')
        .delete()
        .eq('id', data.id);
      console.log('🧹 Enregistrement de test supprimé');
    }
    
    console.log('✅ Test d\'insertion Supabase terminé avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test d\'insertion:', error);
    return false;
  }
};

export const getSupabaseStats = async () => {
  if (!supabase) {
    return {
      rendezvous: 0,
      payments: 0,
      errors: {
        rendezvous: 'Supabase not initialized',
        payments: 'Supabase not initialized'
      }
    };
  }
  
  const stats = {
    rendezvous: 0,
    payments: 0,
    errors: {} as Record<string, string>
  };
  
  try {
    const { count: rendezvousCount, error: rendezvousError } = await supabase
      .from('rendezvous')
      .select('*', { count: 'exact', head: true });
    
    if (rendezvousError) {
      stats.errors.rendezvous = rendezvousError.message;
    } else {
      stats.rendezvous = rendezvousCount || 0;
    }
  } catch (error) {
    stats.errors.rendezvous = error instanceof Error ? error.message : 'Unknown error';
  }
  
  try {
    const { count: paymentsCount, error: paymentsError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true });
    
    if (paymentsError) {
      stats.errors.payments = paymentsError.message;
    } else {
      stats.payments = paymentsCount || 0;
    }
  } catch (error) {
    stats.errors.payments = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return stats;
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Log configuration status
if (typeof window !== 'undefined') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Configuration Supabase incomplète. Vérifiez vos variables d\'environnement:');
    console.warn('- VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
    console.warn('- VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Définie' : '❌ Manquante');
    console.warn('📝 Créez un fichier .env avec ces variables pour activer Supabase');
  } else {
    console.log('✅ Client Supabase initialisé avec succès');
    console.log('🔗 URL:', supabaseUrl);
    console.log('🔑 Clé anonyme configurée');
  }
}