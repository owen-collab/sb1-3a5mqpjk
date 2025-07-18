import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  profile?: UserProfile;
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, userData: { nom: string; telephone: string }) {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      console.log('🔍 Tentative d\'inscription pour:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom: userData.nom,
            telephone: userData.telephone
          },
          emailRedirectTo: undefined // Désactiver la confirmation par email
        }
      });
      
      if (error) {
        console.error('Erreur Supabase lors de l\'inscription:', error);
        
        if (error.message.includes('User already registered')) {
          throw new Error('Un compte existe déjà avec cette adresse email');
        } else if (error.message.includes('Invalid email')) {
          throw new Error('Adresse email invalide');
        } else if (error.message.includes('Password')) {
          throw new Error('Le mot de passe ne respecte pas les critères requis');
        } else {
          throw new Error(`Erreur d'inscription: ${error.message}`);
        }
      }
      
      if (!data.user) {
        throw new Error('Erreur lors de la création du compte utilisateur');
      }
      
      console.log('✅ Inscription réussie pour:', email);
      
      // Créer le profil utilisateur manuellement si nécessaire
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            nom: userData.nom,
            telephone: userData.telephone,
            email: email
          });
        
        if (profileError && !profileError.message.includes('duplicate key')) {
          console.warn('Avertissement lors de la création du profil:', profileError);
        }
      } catch (profileError) {
        console.warn('Erreur lors de la création du profil (peut être normal):', profileError);
      }
      
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      console.log('🔍 Tentative de connexion pour:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erreur Supabase lors de la connexion:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email avant de vous connecter');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Trop de tentatives de connexion. Veuillez patienter quelques minutes.');
        } else {
          throw new Error(`Erreur de connexion: ${error.message}`);
        }
      }
      
      if (!data.user) {
        throw new Error('Erreur lors de la connexion');
      }
      
      console.log('✅ Connexion réussie pour:', email);
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    if (!supabase) {
      throw new Error('Supabase non configuré. Vérifiez vos variables d\'environnement et redémarrez le serveur.');
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion:', error);
        throw new Error(`Erreur de déconnexion: ${error.message}`);
      }
      console.log('✅ Déconnexion réussie');
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) {
      console.warn('Supabase non configuré - impossible de récupérer l\'utilisateur');
      return null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return null;
      }
      
      if (!user) return null;

      // Get user profile
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && !profileError.message.includes('No rows')) {
          console.warn('Erreur lors de la récupération du profil:', profileError);
        }

        return {
          id: user.id,
          email: user.email || '',
          profile: profile || undefined
        };
      } catch (profileError) {
        console.warn('Erreur lors de la récupération du profil:', profileError);
        return {
          id: user.id,
          email: user.email || ''
        };
      }
    } catch (error: any) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      return null;
    }
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user's appointments
  async getUserAppointments(userId: string) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data, error } = await supabase
      .from('rendezvous')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};