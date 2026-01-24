import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const BASE_URL = 'https://simodamilo.github.io/gym';
const OUTPUT_PATH = join(__dirname, '../public/sitemap.xml');

// Public routes that should be included in sitemap
// Protected routes are excluded as they require authentication
const PUBLIC_ROUTES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/login',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/signup',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/forgot-password',
    priority: '0.6',
    changefreq: 'monthly'
  }
];

/**
 * Generates sitemap XML content
 * @returns {string} XML content for sitemap
 */
function generateSitemapXML() {
  const currentDate = new Date().toISOString().split('T')[0];

  const urlEntries = PUBLIC_ROUTES.map(route => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Main function to generate and write sitemap
 */
function generateSitemap() {
  try {
    // Ensure public directory exists
    mkdirSync(join(__dirname, '../public'), { recursive: true });

    // Generate sitemap content
    const sitemapXML = generateSitemapXML();

    // Write to file
    writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');

    console.log('✅ Sitemap generated successfully at:', OUTPUT_PATH);
    console.log(`📍 Included ${PUBLIC_ROUTES.length} public routes`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the generator
generateSitemap();
