import { describe, expect, it } from 'vitest'

import {
  getMobileAuthScheme,
  getMobileTrustedOrigins,
  mergeTrustedOrigins,
} from '#/lib/auth-mobile-config.ts'

describe('auth mobile config', () => {
  it('includes the Expo app scheme in trusted origins', () => {
    expect(getMobileTrustedOrigins()).toEqual(
      expect.arrayContaining(['Celestret://', 'exp://']),
    )
  })

  it('uses the Celestret deep-link scheme', () => {
    expect(getMobileAuthScheme()).toBe('Celestret')
  })

  it('merges mobile and web trusted origins without duplicates', () => {
    expect(
      mergeTrustedOrigins(['https://app.example.com'], ['Celestret://']),
    ).toEqual(['https://app.example.com', 'Celestret://'])
  })
})
