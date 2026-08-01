import { describe, expect, test } from 'vitest'

import { isGoogleAuthEnabled } from '#/features/auth/google-auth.ts'

describe('isGoogleAuthEnabled', () => {
  test('defaults to enabled so a fresh clone gets Google without any setup', () => {
    expect(isGoogleAuthEnabled(undefined)).toBe(true)
  })

  test('treats an empty value as unset, matching emptyStringAsUndefined', () => {
    expect(isGoogleAuthEnabled('')).toBe(true)
  })

  test('stays enabled for an explicit "true"', () => {
    expect(isGoogleAuthEnabled('true')).toBe(true)
  })

  test('only an explicit "false" disables it — this is what the deploy sets', () => {
    expect(isGoogleAuthEnabled('false')).toBe(false)
  })

  test('does not disable on near-miss values, since the env schema only allows true/false', () => {
    expect(isGoogleAuthEnabled('FALSE')).toBe(true)
    expect(isGoogleAuthEnabled('0')).toBe(true)
    expect(isGoogleAuthEnabled('no')).toBe(true)
  })
})
