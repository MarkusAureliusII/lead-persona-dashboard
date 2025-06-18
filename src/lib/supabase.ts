import { createClient } from '@supabase/supabase-js'

// Self-hosted Supabase configuration - Direct service connections (no Kong)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://217.154.225.184:3003'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpLXN0YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ4NjAyMDAsImV4cCI6MTg0MjY0NjYwMH0.LmAmqbkr_V-ZgPl4UQJf9z2Y2J9vF3nHdY1kF4M-8Wy'

// Direct Supabase services configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use direct auth service URL
    url: 'http://217.154.225.184:3004',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Custom headers for direct service access
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
})