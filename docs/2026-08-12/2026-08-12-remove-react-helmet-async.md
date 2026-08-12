# Remove react-helmet-async

## Problem

`npm install` failed with `ERESOLVE`: `react-helmet-async@2.0.5` declares a peer
dependency of `react@^16.6.0 || ^17.0.0 || ^18.0.0`, while the project runs
`react@19.1.1`.

## Approach

React 19 natively hoists `<title>`, `<meta>` and `<link>` rendered from any
component to `<head>`, which makes `react-helmet-async` redundant here.

Changes:
- `src/components/seo/PageSEO.tsx` — replaced the `<Helmet>` wrapper with a
  plain fragment; the tags inside are unchanged and are now hoisted by React 19.
- `src/main.tsx` — removed the `HelmetProvider` wrapper and its import.
- `package.json` — dropped the `react-helmet-async` dependency.

## Trade-offs

React 19 does not deduplicate `<meta>` tags the way Helmet did. This is fine
because a single `PageSEO` is rendered per route; if nested usage is introduced
later, duplicate meta tags would need handling.

## Verification

- `npm install` — succeeds, no peer conflicts.
- `npx tsc -b` — clean.
- `vite build` — succeeds. Note: the default Node heap OOMs during the build in
  this environment; `NODE_OPTIONS=--max-old-space-size=4096` works. Unrelated to
  this change.
- `npm run lint` — 22 pre-existing errors in untouched files
  (`no-explicit-any`, `react-refresh/only-export-components`); none introduced here.
