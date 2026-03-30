import { writable } from 'svelte/store';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

export const supabaseStore = writable<SupabaseClient | null>(null);
export const sessionStore = writable<Session | null>(null);
