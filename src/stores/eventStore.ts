import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { useAuthStore } from './authStore';

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

interface EventState {
  events: Event[];
  myEvents: Event[];
  pendingEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  
  fetchEvents: () => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  fetchPendingEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<Event | null>;
  createEvent: (event: EventInsert) => Promise<{ data: Event | null; error: any | null }>;
  updateEvent: (id: string, updates: EventUpdate) => Promise<{ error: any | null }>;
  deleteEvent: (id: string) => Promise<{ error: any | null }>;
  approveEvent: (id: string) => Promise<{ error: any | null }>;
  rejectEvent: (id: string) => Promise<{ error: any | null }>;
  uploadImage: (file: File) => Promise<{ url: string | null; error: any | null }>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  myEvents: [],
  pendingEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
  
  fetchEvents: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date_time', { ascending: true });
      
      if (error) throw error;
      
      set({ events: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching events:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchMyEvents: async () => {
    const user = useAuthStore.getState().user;
    
    if (!user) {
      set({ myEvents: [], loading: false });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ myEvents: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching my events:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchPendingEvents: async () => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ pendingEvents: data || [], loading: false });
    } catch (error: any) {
      console.error('Error fetching pending events:', error);
      set({ error: error.message, loading: false });
    }
  },
  
  fetchEventById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentEvent: data, loading: false });
      return data;
    } catch (error: any) {
      console.error('Error fetching event by ID:', error);
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  createEvent: async (event) => {
    try {
      set({ loading: true, error: null });
      
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update myEvents list
      const myEvents = get().myEvents;
      set({ myEvents: [data, ...myEvents], loading: false });
      
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating event:', error);
      set({ error: error.message, loading: false });
      return { data: null, error };
    }
  },
  
  updateEvent: async (id, updates) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      // Update events in state
      const { events, myEvents, pendingEvents, currentEvent } = get();
      
      const updatedEvents = events.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      
      const updatedMyEvents = myEvents.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      
      const updatedPendingEvents = pendingEvents.map(event => 
        event.id === id ? { ...event, ...updates } : event
      );
      
      const updatedCurrentEvent = currentEvent && currentEvent.id === id 
        ? { ...currentEvent, ...updates } 
        : currentEvent;
      
      set({ 
        events: updatedEvents, 
        myEvents: updatedMyEvents,
        pendingEvents: updatedPendingEvents,
        currentEvent: updatedCurrentEvent,
        loading: false 
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Error updating event:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },
  
  deleteEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update events in state
      const { events, myEvents, pendingEvents } = get();
      
      set({ 
        events: events.filter(event => event.id !== id),
        myEvents: myEvents.filter(event => event.id !== id),
        pendingEvents: pendingEvents.filter(event => event.id !== id),
        loading: false 
      });
      
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting event:', error);
      set({ error: error.message, loading: false });
      return { error };
    }
  },
  
  approveEvent: async (id) => {
    return get().updateEvent(id, { status: 'approved' });
  },
  
  rejectEvent: async (id) => {
    return get().updateEvent(id, { status: 'rejected' });
  },
  
  uploadImage: async (file) => {
    try {
      set({ loading: true, error: null });
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `event-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);
      
      set({ loading: false });
      return { url: data.publicUrl, error: null };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      set({ error: error.message, loading: false });
      return { url: null, error };
    }
  },
}));