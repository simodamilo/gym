# Add Sitemap.xml Generation

**Date**: 2026-01-24
**Task**: Add automated sitemap.xml generation for SEO

## What Will Be Implemented

A sitemap.xml file that lists all publicly accessible pages of the application for search engine indexing, with an automated script to generate and update it during the build process.

## Approach

### 1. Sitemap Content

The sitemap will include only **public routes** (not protected routes that require authentication):
- `https://simodamilo.github.io/gym/` (root/index)
- `https://simodamilo.github.io/gym/login`
- `https://simodamilo.github.io/gym/signup`
- `https://simodamilo.github.io/gym/forgot-password`

Protected routes (workouts, profile, exercises) will **not** be included since:
- Search engines cannot access authenticated pages
- Including them would generate 403/redirect errors for crawlers
- They provide no SEO value

### 2. Implementation Strategy

**Option A: Node.js Script (Recommended)**
- Create `scripts/generate-sitemap.js` that:
  - Reads routes from `src/utils/routing/router.tsx`
  - Filters for public routes only
  - Generates XML with proper formatting
  - Outputs to `public/sitemap.xml`
  - Uses current date for `<lastmod>` tags
- Integrate into build process via npm script

**Option B: Static File**
- Manually create `public/sitemap.xml`
- Requires manual updates when routes change
- Simpler but less maintainable

**Recommended: Option A** - Automated script that stays in sync with router changes

### 3. Files to Create/Modify

**New files:**
- `scripts/generate-sitemap.js` - Sitemap generation script
- `public/sitemap.xml` - Generated sitemap file (gitignored or committed depending on preference)

**Modified files:**
- `package.json` - Add script commands:
  - `"generate:sitemap": "node scripts/generate-sitemap.js"`
  - Update `"build"` script to run sitemap generation before build
- `.gitignore` - Add `public/sitemap.xml` if we want it generated only (or commit it if we want version control)

### 4. XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://simodamilo.github.io/gym/</loc>
    <lastmod>2026-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://simodamilo.github.io/gym/login</loc>
    <lastmod>2026-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... other public routes ... -->
</urlset>
```

### 5. Best Practices Applied

- **XML Schema**: Use official sitemap protocol (http://www.sitemaps.org/schemas/sitemap/0.9)
- **Priority**: Set based on page importance (root=1.0, login/signup=0.8)
- **Change Frequency**: Set to "monthly" for relatively stable public pages
- **Last Modified**: Use current date when generated
- **URL Encoding**: Properly encode URLs if needed (though these URLs don't require it)
- **Location**: Place in `public/` folder so Vite copies it to dist root

### 6. Build Integration

Update build script in `package.json`:
```json
"build": "npm run generate:sitemap && tsc -b && vite build && cp dist/index.html dist/404.html"
```

This ensures sitemap is regenerated on every build with the latest route information.

## Architectural Decisions

1. **Automated over Manual**: Script-based generation prevents sitemap from becoming outdated when routes change
2. **Public Routes Only**: Excluding protected routes follows SEO best practices and avoids crawler errors
3. **Build-time Generation**: Running during build ensures deployment always has current sitemap
4. **Simple Node.js**: No additional dependencies needed, uses Node's built-in `fs` module

## Trade-offs

- **Automation Complexity**: Adds a build step, but the maintenance benefit outweighs this minor cost
- **Static vs Dynamic**: For an SPA with fixed public routes, static generation is appropriate. A dynamic approach (reading from router at runtime) would be overkill
- **Git Tracking**: Committing `sitemap.xml` provides visibility into changes, but it's a generated file. We'll gitignore it and regenerate on build

## Future Enhancements

If needed later:
- Add robots.txt that points to sitemap location
- Support for multiple languages if i18n routes are added
- Image sitemap if workout images become publicly accessible
- Automatic submission to search engines via APIs

---

## Implementation Completed

**Date**: 2026-01-24

### Files Created
1. `scripts/generate-sitemap.js` - Automated sitemap generation script
2. `public/sitemap.xml` - Generated sitemap file (gitignored)

### Files Modified
1. `package.json` - Added `generate:sitemap` script and integrated into build process
2. `.gitignore` - Added `public/sitemap.xml` to ignored files

### How It Works
- Script runs automatically before each build: `npm run build`
- Can also be run manually: `npm run generate:sitemap`
- Generates sitemap with 4 public routes (root, login, signup, forgot-password)
- Outputs to `public/sitemap.xml` which Vite copies to `dist/` during build
- Uses current date for `lastmod` field
- Follows official sitemap.org protocol

### Verification
- Build tested successfully
- Sitemap.xml correctly generated in both `public/` and `dist/` folders
- XML structure validated with proper schema and formatting
- All public routes included with appropriate priorities
