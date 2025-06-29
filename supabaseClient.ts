// supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wdekhrwvgwtzejldudcz.supabase.co';     // ← Cambiá por tu URL real
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWtocnd2Z3d0emVqbGR1ZGN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MjM5MzIsImV4cCI6MjA2NjI5OTkzMn0.54NDb97rgNKc5iGHyQeIOqBVALTKKh4ZGMATMil59O0';                    // ← Cambiá por tu anon key real

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
