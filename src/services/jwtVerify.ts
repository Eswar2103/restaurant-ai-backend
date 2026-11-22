import { createRemoteJWKSet } from "jose";

type JWKSRESOLVER = ReturnType<typeof createRemoteJWKSet>;

let JWKS: JWKSRESOLVER;

function getJWKKey() {
  if (!JWKS) {
    JWKS = createRemoteJWKSet(new URL(process.env.SUPABASE_JWKS_URL ?? ""));
  }
  return JWKS;
}

export { getJWKKey };
