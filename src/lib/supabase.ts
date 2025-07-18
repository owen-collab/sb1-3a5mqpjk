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
  user_id?: string;
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

// Validation des variables d'environnement
const validateSupabaseConfig = () => {
  const errors = [];
  
  if (!supabaseUrl) {
    console.warn('⚠️ VITE_SUPABASE_URL est manquant - fonctionnalités limitées');
  } else if (!supabaseUrl.includes('supabase.co')) {
    console.warn('⚠️ VITE_SUPABASE_URL semble invalide (doit contenir "supabase.co")');
  }
  
  if (!supabaseKey) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY est manquant - fonctionnalités limitées');
  } else if (supabaseKey.length < 100) {
    console.warn('⚠️ VITE_SUPABASE_ANON_KEY semble invalide (trop court)');
  }
  
  if (!supabaseUrl || !supabaseKey) {
    console.info('ℹ️ Pour configurer Supabase:');
    console.info('  1. Créez un fichier .env à la racine du projet');
    console.info('  2. Ajoutez vos clés Supabase:');
    console.info('     VITE_SUPABASE_URL=https://votre-projet.supabase.co');
    console.info('     VITE_SUPABASE_ANON_KEY=votre_clé_anonyme');
    console.info('  3. Redémarrez le serveur avec: npm run dev');
    return false;
  }
  
  console.info('✅ Configuration Supabase valide');
  return true;
};

// Créer le client Supabase avec gestion d'erreurs
let supabase: any = null;

try {
  if (supabaseUrl && supabaseKey && validateSupabaseConfig()) {
    supabase = createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    console.info('✅ Client Supabase initialisé avec succès');
  } else {
    console.info('ℹ️ Client Supabase non initialisé - variables d\'environnement manquantes');
  }
} catch (error) {
  console.warn('⚠️ Erreur lors de l\'initialisation du client Supabase:', error);
  supabase = null;
}

export { supabase };

// Test functions
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabase) {
    console.error('❌ Client Supabase non initialisé - vérifiez votre configuration');
    return false;
  }

  try {
    console.log('🔍 Test de connexion Supabase...');
    
    // Test simple de connexion
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message.includes('Invalid API key')) {
      console.error('❌ Clé API Supabase invalide');
      return false;
    }
    
    // Test d'accès à la base de données
    const { data: dbData, error: dbError } = await supabase
      .from('rendezvous')
      .select('count', { count: 'exact', head: true });
    
    if (dbError) {
      console.error('❌ Erreur de connexion à la base de données:', dbError.message);
      
      if (dbError.message.includes('relation "rendezvous" does not exist')) {
        console.error('💡 Solution: Exécutez les migrations SQL dans votre dashboard Supabase');
      } else if (dbError.message.includes('JWT')) {
        console.error('💡 Solution: Vérifiez votre clé ANON dans le dashboard Supabase');
      }
      return false;
    }
    
    console.log('✅ Connexion Supabase réussie - Base de données accessible');
    return true;
  } catch (error) {
    console.error('❌ Erreur réseau lors du test de connexion:', error);
    return false;
  }
};

export const testSupabaseInsert = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    console.log('🔍 Test d\'insertion en base...');
    
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
      console.error('❌ Erreur d\'insertion:', error.message);
      
      if (error.message.includes('RLS')) {
        console.error('💡 Solution: Vérifiez les politiques RLS dans votre dashboard Supabase');
      } else if (error.message.includes('permission denied')) {
        console.error('💡 Solution: Vérifiez les permissions de la table rendezvous');
      }
      return false;
    }

    // Nettoyer le test
    if (data?.id) {
      await supabase.from('rendezvous').delete().eq('id', data.id);
      console.log('🧹 Données de test nettoyées');
    }

    console.log('✅ Test d\'insertion réussi - Permissions OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur réseau lors du test d\'insertion:', error);
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
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      const { data, error } = await supabase
        .from('rendezvous')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des rendez-vous:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }
      
      return data || [];
    } catch (error) {
      console.error('Erreur réseau:', error);
      throw error;
    }
  },

  async create(rendezVous: Omit<RendezVous, 'id' | 'created_at' | 'updated_at'>): Promise<RendezVous> {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
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
      
      if (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<RendezVous>): Promise<RendezVous> {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      const { data, error } = await supabase
        .from('rendezvous')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      const { error } = await supabase
        .from('rendezvous')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Erreur lors de la suppression:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
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