import { createClient } from '@supabase/supabase-js'

// Supabase-Konfiguration für Self-Hosted Setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://217.154.225.184:8000'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpLXN0YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NjAyMDAsImV4cCI6MTg0MjY0NjYwMH0.LmAmqbkr_V-ZgPl4UQJf9z2Y2J9vF3nHdY1kF4M-8Wy'

// Self-hosted configuration using Kong gateway for all requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})