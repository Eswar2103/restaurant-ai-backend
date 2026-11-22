import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from "../types/database.types";

dotenv.config();

const supabaseUrl: string = process.env.SUPABASE_URL ?? "";
const supabaseKey: string = process.env.SUPABASE_ANON_KEY ?? "";

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createUserClient(accessToken: string, refreshToken: string) {
  const client = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    },
  });

  if (accessToken && refreshToken) {
    try {
      const { error } = await client.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) {
        return { client, error };
      }
    } catch (err) {
      return { client, error: err };
    }
  }

  return { client };
}

async function refreshSession(refreshToken: string) {
  const refreshSupabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await refreshSupabase.auth.refreshSession({
    refresh_token: refreshToken,
  });
  if (error) {
    return { error: error };
  }
  const { session } = data;
  return { token: session?.access_token, refreshToken: session?.refresh_token };
}

export { supabase, createUserClient, refreshSession };
