import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://waymjbgcpfbxrjxrlizr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheW1qYmdjcGZieHJqeHJsaXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE3NTExNywiZXhwIjoyMDYwNzUxMTE3fQ.klkC2BGUyDXpGBDwEx-tONepHQ-vgsmRTbmXL4ZCZUA';
export const supabase = createClient(supabaseUrl, supabaseKey);



