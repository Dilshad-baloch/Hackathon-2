import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserState {
  customers: Profile[];
  currentCustomer: Profile | null;
  customerEvents: Database['public']['Tables']['events']['Row'][];
  loading: boolean;
  error: string | null;
  
  fetchCustomers: () => Promise<void>;
  fetchCustomerById: (id: string) => Promise<Profile | null>;
  fetchCustomerEvents: (customerId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  customers: [],
  currentCustomer: null,
  customerEvents: [],
  loading: false,
  error: null,
  
  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ customers: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchCustomerById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentCustomer: data, loading: false });
      return data;
    } catch (error: any) {
      console.error('Error fetching customer by ID:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  fetchCustomerEvents: async (customerId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ customerEvents: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching customer events:', error);
      set({ error: error.message, loading: false });
    }
  },
}));