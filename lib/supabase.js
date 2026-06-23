import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://npsgiazpbhgpbdwmylne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wc2dpYXpwYmhncGJkd215bG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTI0NDMsImV4cCI6MjA5Nzc2ODQ0M30.DlDjvSWVj-Otm_7GloZq3PEMebMykrqB-5KU63s9uUY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);