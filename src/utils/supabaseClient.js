import { createClient } from '@supabase/supabase-js';

// Hardcoded values as fallback (only for development/testing)
const FALLBACK_URL = 'https://lxljeehmdzrvxwaqlmhf.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGplZWhtZHpydnh3YXFsbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDQzOTksImV4cCI6MjA2MTAyMDM5OX0.gU4LoXQ0ETWS-vD3aQMubgeYKwqcFVzzb3r6LTaNNJQ';

// Try to get values from different environment variable formats
const supabaseUrl =
  (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_URL : undefined) ||
  (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_URL : undefined) ||
  (typeof window !== 'undefined' && window.ENV ? window.ENV.SUPABASE_URL : undefined) ||
  FALLBACK_URL;

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_SUPABASE_ANON_KEY : undefined) ||
  (typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined) ||
  (typeof window !== 'undefined' && window.ENV ? window.ENV.SUPABASE_ANON_KEY : undefined) ||
  FALLBACK_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseAnonKey ? '[REDACTED]' : 'undefined');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
