import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waymjbgcpfbxrjxrlizr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheW1qYmdjcGZieHJqeHJsaXpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzUxMTcsImV4cCI6MjA2MDc1MTExN30.J1n1Lgd6DW30tuaEEyOEjHqtbA92La4Wa87TPu3Ge70';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
