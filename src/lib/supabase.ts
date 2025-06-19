import { createClient } from '@supabase/supabase-js'

// Self-hosted Supabase configuration - Direct service connections (no Kong)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://217.154.225.184:3003'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpLXN0YWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODU0MTcsImV4cCI6MjA2NTY0NTQxN30.SBgYMBVRxb7IIyKd2vLGsJ3Up8TLoGgq4YCqrPoYvvQ'

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