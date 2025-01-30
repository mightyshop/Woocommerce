import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export interface Slider {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  clicks: number;
  active: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

export const getSliders = async () => {
  const { data, error } = await supabase
    .from('sliders')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching sliders:', error.message);
    return [];
  }

  return data;
};

export const createSlider = async (slider: Omit<Slider, 'id' | 'clicks' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('sliders')
    .insert([slider])
    .select()
    .single();

  if (error) {
    throw new Error('Failed to create slider');
  }

  return data;
};

export const updateSlider = async (id: string, slider: Partial<Omit<Slider, 'id' | 'created_at' | 'updated_at'>>) => {
  const { data, error } = await supabase
    .from('sliders')
    .update(slider)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('Failed to update slider');
  }

  return data;
};

export const deleteSlider = async (id: string) => {
  const { error } = await supabase
    .from('sliders')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error('Failed to delete slider');
  }
};

export const incrementSliderClicks = async (id: string) => {
  const { error } = await supabase
    .rpc('increment_slider_clicks', { slider_id: id });

  if (error) {
    console.error('Error tracking click:', error.message);
  }
};