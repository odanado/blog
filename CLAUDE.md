# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static blog built with Astro v4.8.2, using TypeScript in strict mode. Content is managed through Astro's Content Collections API with articles stored as Markdown files.

## Essential Commands

### Development

- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build static site to `/dist`
- `npm run preview` - Preview built site

### Code Quality

- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Auto-format code with Prettier
- `npm run lint:eslint` - Run only ESLint
- `npm run lint:prettier` - Run only Prettier check

### Testing

- Visual regression tests in `/test/e2e/` compare production vs development builds using Playwright
- Run tests with `npm run test:e2e`

### After Completing Work

- **Always run `npm run lint` after completing your work** - Ensures ESLint and Prettier checks pass
- If lint fails, run `npm run format` to auto-fix formatting issues
- The CI will fail if lint checks don't pass

## Architecture

### Content Structure

- Articles are in `/src/content/articles/[year]/[month]/[slug].md`
- Articles require frontmatter with `title` (string) and `publishedAt` (date)
- Content schema is validated with Zod (see `/src/content/config.ts`)

### Key Directories

- `/src/pages/` - Page routes including dynamic routes for articles
- `/src/components/` - Reusable Astro components
- `/src/layouts/` - Page layouts
- `/public/` - Static assets

### Routing

- Homepage lists all articles
- Article URLs: `/articles/[year]/[month]/[slug]`
- Dynamic routing handled by `/src/pages/articles/[...slug].astro`

## Key Technical Details

### Environment Variables

- `ORIGIN` - Used for site URL configuration in production

### Image Optimization

When adding images, optimize them first using Squoosh.app as recommended in README.md

### Deployment

- GitHub Actions handles CI/CD
- Deploys to Cloudflare
- Automated dependency updates via Renovate

### TypeScript Configuration

- Strict mode is enabled
- Extends Astro's base TypeScript config
- ESLint uses flat config with TypeScript and Astro plugins
