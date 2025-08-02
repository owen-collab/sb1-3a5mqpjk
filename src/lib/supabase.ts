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
  user_id?: string;
  status: 'nouveau' | 'confirme' | 'en_cours' | 'termine' | 'annule';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}


// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Créer le client Supabase avec gestion d'erreurs
let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    console.log('✅ Supabase client initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Supabase client:', error);
    supabase = null;
  }
} else {
  console.warn('⚠️ Supabase environment variables missing');
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Present' : 'Missing');
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
      name: 'Test User',
      phone: '+237600000000',
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
      
      // Map English database columns to French field names
      return (data || []).map((item: any) => ({
        id: item.id,
        nom: item.name,
        telephone: item.phone,
        email: item.email,
        service: item.service,
        date: item.date,
        heure: item.heure,
        message: item.message,
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
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
      // Map French field names to English database column names
      const mappedData = {
        name: rendezVous.nom,
        phone: rendezVous.telephone,
        email: rendezVous.email,
        service: rendezVous.service,
        date: rendezVous.date,
        heure: rendezVous.heure,
        message: rendezVous.message,
        user_id: rendezVous.user_id
      };
      
      // Vérifier la limite de rendez-vous par créneau (maximum 3)
      if (mappedData.date && mappedData.heure) {
        const { count, error: countError } = await supabase
          .from('rendezvous')
          .select('*', { count: 'exact', head: true })
          .eq('date', mappedData.date)
          .eq('heure', mappedData.heure)
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
        .insert([mappedData])
        .select('id, name, phone, email, service, date, heure, message, user_id, created_at, updated_at, status, payment_status')
        .single();
      
      if (error) {
        console.error('Erreur lors de la création du rendez-vous:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }
      
      // Map back to French field names for the response
      return {
        id: data.id,
        nom: data.name,
        telephone: data.phone,
        email: data.email,
        service: data.service,
        date: data.date,
        heure: data.heure,
        message: data.message,
        user_id: data.user_id,
        status: data.status,
        payment_status: data.payment_status,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
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
        .select('id, name, phone, email, service, date, heure, message, user_id, created_at, updated_at, status, payment_status')
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
