import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  register: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  
  checkAuth: async () => {
    try {
      set({ loading: true });
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, profile: null, loading: false });
        return;
      }
      
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ 
        user: session.user,
        profile: profile || null,
        loading: false 
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      set({ loading: false });
    }
  },
  
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        set({ user: data.user, profile: profile || null });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { error };
    }
  },
  
  register: async (email, password, fullName) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) return { error };
      
      if (data.user) {
        set({ user: data.user });
      }
      
      return { error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { error };
    }
  },
  
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null });
  },
  
  updateProfile: async (updates) => {
    const { user } = get();
    
    if (!user) return { error: new Error('User not authenticated') };
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
        // Refresh profile data
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        set({ profile: updatedProfile || null });
      }
      
      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  },
}));