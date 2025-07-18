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
    if (!supabase) throw new Error('Supabase non configuré');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nom: userData.nom,
            telephone: userData.telephone
          }
        }
      });
      
      if (error) throw error;
      
      // Vérifier si l'utilisateur a été créé
      if (!data.user) {
        throw new Error('Erreur lors de la création du compte utilisateur');
      }
      
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase non configuré');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Vérifier si la connexion a réussi
      if (!data.user) {
        throw new Error('Erreur lors de la connexion');
      }
      
      return data;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Sign out
  async signOut() {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!supabase) throw new Error('Supabase non configuré');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      profile: profile || undefined
    };
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