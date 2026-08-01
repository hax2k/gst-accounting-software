// @vitest-environment jsdom
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { LandingPage } from '#/features/marketing/components/landing-page.tsx'
import { HERO, SITE } from '#/features/marketing/landing-content.ts'

vi.mock('#/lib/auth-client.ts', () => ({
  authClient: {
    getSession: vi.fn(async () => ({ data: null })),
  },
}))

function renderLanding() {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
  })
  const signupRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/signup',
    component: () => null,
  })
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => null,
  })
  const privacyRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/privacy',
    component: () => null,
  })
  const dataDeletionRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/data-deletion',
    component: () => null,
  })
  const dashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/app/dashboard',
    component: () => null,
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([
      indexRoute,
      signupRoute,
      loginRoute,
      privacyRoute,
      dataDeletionRoute,
      dashboardRoute,
    ]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  return render(<RouterProvider router={router} />)
}

afterEach(() => {
  cleanup()
})

describe('LandingPage', () => {
  test('renders headline and primary conversion links', async () => {
    renderLanding()

    expect(
      await screen.findByRole('heading', { level: 1, name: HERO.headline }),
    ).toBeTruthy()

    const startLinks = screen.getAllByRole('link', { name: /start free/i })
    expect(startLinks.length).toBeGreaterThan(0)
    expect(startLinks[0]?.getAttribute('href')).toBe('/signup')

    const githubLinks = screen.getAllByRole('link', { name: /github/i })
    expect(
      githubLinks.some(
        (link) => link.getAttribute('href') === SITE.githubUrl,
      ),
    ).toBe(true)
  })
})
