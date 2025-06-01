import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URLJR!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEYJR!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
