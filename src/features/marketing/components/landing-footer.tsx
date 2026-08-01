import { Link } from '@tanstack/react-router'

import { SITE } from '#/features/marketing/landing-content.ts'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name}. MIT License.
        </p>
        <nav aria-label="Legal" className="flex flex-wrap gap-4">
          <Link className="hover:text-foreground" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-foreground" to="/data-deletion">
            Data deletion
          </Link>
          <a
            className="hover:text-foreground"
            href={SITE.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  )
}
