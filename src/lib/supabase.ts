import { createClient } from '@supabase/supabase-js'

// Supabase-Konfiguration für Self-Hosted Setup
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qkzikqgypwliucfdmcbj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFremlrcWd5cHdsaXVjZmRtY2JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzMxMTksImV4cCI6MjA2NTUwOTExOX0.twHRQE41iyNX_sz5bacmbUhTZIJEkBnQO0jFxa46p1Q'

// Self-hosted configuration with separate auth URL
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Use direct auth service URL for authentication
    url: 'http://217.154.225.184:3004',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})