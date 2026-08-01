import { env } from '#/env.ts'

/**
 * Google sign-in is on by default so a fresh clone works without setup. Only
 * an explicit `false` turns it off, which is what `bun run deploy` sets for the
 * Cloudflare build — the flag is inlined by Vite, so it has to be present at
 * build time rather than as a Worker secret.
 */
export function isGoogleAuthEnabled(flag: string | undefined): boolean {
  return flag !== 'false'
}

export const SHOW_GOOGLE_AUTH = isGoogleAuthEnabled(
  env.VITE_ENABLE_GOOGLE_AUTH,
)
