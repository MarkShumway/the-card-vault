/**
 * supabase.ts
 *
 * Initializes and exports the Supabase client instance used throughout
 * the application for database queries, authentication, and storage.
 *
 * The client is typed against the generated Database type to provide
 * full TypeScript inference on table shapes, column names, and return types.
 *
 * Environment variables (required):
 *   - VITE_SUPABASE_URL       The Supabase project URL
 *   - VITE_SUPABASE_ANON_KEY  The public anon key for client-side access
 *
 * Note: Both variables must be defined at build time. If either is missing,
 * the module will throw at import time rather than failing silently later
 * during a data operation.
 *
 * Usage:
 *   import { supabase } from '../services/supabase'
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
