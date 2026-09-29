import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
}

function getAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '';
}

function getServiceKey() {
  return process.env.SUPABASE_SECRET_KEY || '';
}

// Lazy-initialized public client
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(getUrl(), getAnonKey());
  }
  return _supabase;
}

// Server-side client with service role key for admin operations
export function createServerClient(): SupabaseClient {
  return createClient(getUrl(), getServiceKey());
}
