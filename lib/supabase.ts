import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Same project as the web frontend
const SUPABASE_URL = 'https://rgfmyxojdtriibdrxgnv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZm15eG9qZHRyaWliZHJ4Z252Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzM4MTQsImV4cCI6MjA5MDM0OTgxNH0.7C5xVyqS6CmOir-pj5JqwpXOKSotp7S3wKEuWSFw7AA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
