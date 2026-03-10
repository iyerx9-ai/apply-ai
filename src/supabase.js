import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://utbupoztacivqxetugdw.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0YnVwb3p0YWNpdnF4ZXR1Z2R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMjE1MzIsImV4cCI6MjA4ODY5NzUzMn0.M5N_NFQ6FXrRWR9Lb0dzVnPcKmAPBbz6hCKdsAbLhzM'

export const supabase = createClient(supabaseUrl, supabaseKey)
