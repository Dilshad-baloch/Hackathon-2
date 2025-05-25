import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Participant = Database['public']['Tables']['participants']['Row'];
type ParticipantInsert = Database['public']['Tables']['participants']['Insert'];

interface ParticipantState {
  participants: Participant[];
  loading: boolean;
  error: string | null;
  
  fetchParticipantsByEventId: (eventId: string) => Promise<void>;
  addParticipant: (participant: ParticipantInsert) => Promise<{ error: any | null }>;
  removeParticipant: (id: string) => Promise<{ error: any | null }>;
}

export const useParticipantStore = create<ParticipantState>((set, get) => ({
  participants: [],
  loading: false,
  error: null,
  
  fetchParticipantsByEventId: async (eventId) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('event_id', eventId)
        .order('added_at', { ascending: false });
      
      if (error) throw error;
      
      set({ participants: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching participants:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  addParticipant: async (participant) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('participants')
        .insert(participant)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update participants list
      const participants = get().participants;
      set({ participants: [data, ...participants], loading: false });
      
      return { error: null };
    } catch (error: any) {
      console.error('Error adding participant:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },
  
  removeParticipant: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update participants list
      const participants = get().participants;
      set({ 
        participants: participants.filter(p => p.id !== id),
        loading: false 
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Error removing participant:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },
}));