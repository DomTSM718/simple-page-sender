// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://cppwhkihleeitdmspaoy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcHdoa2lobGVlaXRkbXNwYW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTQ5NDgsImV4cCI6MjA2NTQ5MDk0OH0.HRNpH4rsXRoClXR2dyVkzkoMSx9WSSapaCkx64-2oZY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);