import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import slugify from 'slugify';
import csvParser from 'csv-parser';
import { Readable } from 'stream';

// Types
interface Salon {
  id: string;
  title: string;
  slug: string;
  website?: string;
  telephone?: string;
  address?: string;
  postal_code?: string;
  latitude?: string;
  longitude?: string;
  email?: string;
  opening_hours?: string;
  description?: string;
  service_product?: string;
  reviews?: string;
  average_star?: string;
  city_id?: string;
  city_name?: string;
  state_id?: string;
  state_name?: string;
  category_ids?: string[];
  detail_keys?: string[];
  detail_values?: string[];
  amenity_ids?: string[];
  payment_ids?: string[];
  images?: string[];
}

interface City {
  id: string;
  city: string;
  slug: string;
  state_id: string;
  state_name?: string;
  salon_ids?: string[];
  latitude?: string;
  longitude?: string;
}

interface State {
  id: string;
  state: string;
  slug: string;
  city_ids?: string[];
  salon_ids?: string[];
  latitude?: string;
  longitude?: string;
}

interface Category {
  id: string;
  category: string;
  slug: string;
  salon_ids?: string[];
}

// Get absolute path to the data directory
const getDataPath = (file: string) => path.join(process.cwd(), 'data', file);

// Ensure directory exists
const ensureDirectory = async (dir: string) => {
  if (!fs.existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Create slug from name
const createSlug = (name: string) => {
  return slugify(name, {
    lower: true,
    strict: true,
    replacement: '-',
  });
};

// Generate HTML template with Leaflet CSS
const generateHtmlTemplate = (title: string, metaDescription: string, content: string) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${metaDescription}">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <style>
    /* Leaflet map placeholder styles */
    .leaflet-container {
      height: 400px;
      width: 100%;
      max-width: 100%;
      max-height: 100%;
    }
    /* Fix for Leaflet marker images on static pages */
    .leaflet-default-icon-path {
      background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png);
    }
    .leaflet-marker-shadow {
      background-image: url(https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png);
    }
  </style>
</head>
<body>
  <div id="app">
    ${content}
  </div>
  <script>
    // Placeholder for Leaflet initialization on static pages
    document.addEventListener('DOMContentLoaded', function() {
      // Add classes to indicate this is a static build
      document.body.classList.add('static-build');
    });
  </script>
</body>
</html>`;
};

// Generate sitemap.xml
const generateSitemap = (urls: string[], baseUrl: string) => {
  const urlElements = urls.map(url => `
    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
    </url>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
};

// Generate HTML sitemap
const generateHtmlSitemap = (data: { url: string; title: string }[]) => {
  const listItems = data.map(item => `<li><a href="${item.url}">${item.title}</a></li>`).join('');

  return `<div class="sitemap">
    <h1>Sitemap</h1>
    <ul>${listItems}</ul>
  </div>`;
};

// Split sitemap into chunks if needed
const splitSitemap = (urls: { url: string; title: string }[], chunkSize: number) => {
  const chunks: { url: string; title: string }[][] = [];
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }
  return chunks;
};

// Main function to process data and generate files
const processData = async () => {
  try {
    console.log('Starting HTML generation...');
    
    // Ensure data directory exists
    await ensureDirectory(getDataPath(''));
    
    // Extract data.zip if it exists
    const zipPath = getDataPath('data.zip');
    if (fs.existsSync(zipPath)) {
      console.log('Extracting data.zip...');
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(getDataPath(''), true);
      console.log('Extraction complete.');
    }
    
    // Create directories for JSON data
    const publicDataDir = path.join(process.cwd(), 'public', 'data');
    await ensureDirectory(publicDataDir);
    
    // Create directories for generated HTML
    const publicDir = path.join(process.cwd(), 'public');
    const companiesDir = path.join(publicDir, 'companies');
    const citiesDir = path.join(publicDir, 'cities');
    const statesDir = path.join(publicDir, 'states');
    
    await ensureDirectory(publicDir);
    await ensureDirectory(companiesDir);
    await ensureDirectory(citiesDir);
    await ensureDirectory(statesDir);
    
    console.log('Processing CSV files...');
    
    // Parse salons.csv
    const salons: Salon[] = [];
    if (fs.existsSync(getDataPath('salons.csv'))) {
      const salonsStream = fs.createReadStream(getDataPath('salons.csv')).pipe(csvParser());
      for await (const row of salonsStream) {
        const salon: Salon = {
          id: row.id || `salon-${salons.length + 1}`,
          title: row.title || `Salon ${salons.length + 1}`,
          slug: createSlug(row.title || `salon-${salons.length + 1}`),
          website: row.website || '',
          telephone: row.telephone || '',
          address: row.address || '',
          postal_code: row.postal_code || '',
          latitude: row.latitude || '',
          longitude: row.longitude || '',
          email: row.email || '',
          opening_hours: row.opening_hours || '',
          description: row.description || '',
          service_product: row.service_product || '',
          reviews: row.reviews || '0',
          average_star: row.average_star || '0',
          city_id: row.city_id || '',
          city_name: row.city_name || '',
          state_id: row.state_id || '',
          state_name: row.state_name || '',
          category_ids: row.category_ids ? row.category_ids.split(',') : [],
          detail_keys: row.detail_keys ? row.detail_keys.split(',') : [],
          detail_values: row.detail_values ? row.detail_values.split(',') : [],
          amenity_ids: row.amenity_ids ? row.amenity_ids.split(',') : [],
          payment_ids: row.payment_ids ? row.payment_ids.split(',') : [],
          images: row.images ? row.images.split(',') : [],
        };
        salons.push(salon);
      }
    }
    
    // Parse cities.csv
    const cities: City[] = [];
    if (fs.existsSync(getDataPath('cities.csv'))) {
      const citiesStream = fs.createReadStream(getDataPath('cities.csv')).pipe(csvParser());
      for await (const row of citiesStream) {
        const city: City = {
          id: row.id || `city-${cities.length + 1}`,
          city: row.city || `City ${cities.length + 1}`,
          slug: createSlug(row.city || `city-${cities.length + 1}`),
          state_id: row.state_id || '',
          state_name: row.state_name || '',
          salon_ids: row.salon_ids ? row.salon_ids.split(',') : [],
          latitude: row.latitude || '',
          longitude: row.longitude || '',
        };
        cities.push(city);
      }
    }
    
    // Parse states.csv
    const states: State[] = [];
    if (fs.existsSync(getDataPath('states.csv'))) {
      const statesStream = fs.createReadStream(getDataPath('states.csv')).pipe(csvParser());
      for await (const row of statesStream) {
        const state: State = {
          id: row.id || `state-${states.length + 1}`,
          state: row.state || `State ${states.length + 1}`,
          slug: createSlug(row.state || `state-${states.length + 1}`),
          city_ids: row.city_ids ? row.city_ids.split(',') : [],
          salon_ids: row.salon_ids ? row.salon_ids.split(',') : [],
          latitude: row.latitude || '',
          longitude: row.longitude || '',
        };
        states.push(state);
      }
    }
    
    // Parse categories.csv
    const categories: Category[] = [];
    if (fs.existsSync(getDataPath('categories.csv'))) {
      const categoriesStream = fs.createReadStream(getDataPath('categories.csv')).pipe(csvParser());
      for await (const row of categoriesStream) {
        const category: Category = {
          id: row.id || `category-${categories.length + 1}`,
          category: row.category || `Category ${categories.length + 1}`,
          slug: createSlug(row.category || `category-${categories.length + 1}`),
          salon_ids: row.salon_ids ? row.salon_ids.split(',') : [],
        };
        categories.push(category);
      }
    }
    
    console.log(`Processed: ${salons.length} salons, ${cities.length} cities, ${states.length} states, ${categories.length} categories`);
    
    // Update city and state objects with salon IDs
    for (const salon of salons) {
      if (salon.city_id) {
        const city = cities.find(c => c.id === salon.city_id);
        if (city) {
          city.salon_ids = city.salon_ids || [];
          if (!city.salon_ids.includes(salon.id)) {
            city.salon_ids.push(salon.id);
          }
        }
      }
      
      if (salon.state_id) {
        const state = states.find(s => s.id === salon.state_id);
        if (state) {
          state.salon_ids = state.salon_ids || [];
          if (!state.salon_ids.includes(salon.id)) {
            state.salon_ids.push(salon.id);
          }
        }
      }
    }
    
    // Update state objects with city IDs
    for (const city of cities) {
      if (city.state_id) {
        const state = states.find(s => s.id === city.state_id);
        if (state) {
          state.city_ids = state.city_ids || [];
          if (!state.city_ids.includes(city.id)) {
            state.city_ids.push(city.id);
          }
        }
      }
    }
    
    // Save processed JSON data
    await fs.writeJSON(path.join(publicDataDir, 'salons.json'), salons);
    await fs.writeJSON(path.join(publicDataDir, 'cities.json'), cities);
    await fs.writeJSON(path.join(publicDataDir, 'states.json'), states);
    await fs.writeJSON(path.join(publicDataDir, 'categories.json'), categories);
    
    console.log('JSON data files created.');
    
    // Generate HTML files and URLs for sitemap
    console.log('Generating HTML files and sitemap URLs...');
    
    const baseUrl = 'https://example.com'; // Replace with your actual domain
    const sitemapUrls: string[] = [];
    const htmlSitemapData: { url: string; title: string }[] = [];
    
    // Generate HTML files for salons
    for (const salon of salons) {
      const url = `/companies/${salon.slug}/`;
      const filePath = path.join(companiesDir, `${salon.slug}.html`);
      
      // Simple HTML template for salons
      const title = `${salon.title} - Electrolysis Hair Removal Salon`;
      const metaDescription = salon.description || `${salon.title} - Professional electrolysis services in ${salon.city_name || ''} ${salon.state_name || ''}`;
      
      const content = `
        <div class="salon-page">
          <h1>${salon.title}</h1>
          <p>${salon.description || ''}</p>
          <div class="salon-details">
            <div>Address: ${salon.address || 'N/A'}, ${salon.city_name || ''}, ${salon.state_name || ''} ${salon.postal_code || ''}</div>
            <div>Phone: ${salon.telephone || 'N/A'}</div>
            <div>Email: ${salon.email || 'N/A'}</div>
            <div>Website: ${salon.website || 'N/A'}</div>
          </div>
          ${salon.latitude && salon.longitude ? `
            <div class="map-container" 
                 data-lat="${salon.latitude}" 
                 data-lng="${salon.longitude}" 
                 data-title="${salon.title}">
              <div>Map loading...</div>
            </div>
          ` : ''}
        </div>
      `;
      
      await fs.writeFile(filePath, generateHtmlTemplate(title, metaDescription, content));
      
      sitemapUrls.push(url);
      htmlSitemapData.push({ url, title: salon.title });
    }
    
    // Generate HTML files for cities
    for (const city of cities) {
      const url = `/cities/${city.slug}/`;
      const filePath = path.join(citiesDir, `${city.slug}.html`);
      
      // Get salons in this city
      const citySalons = salons.filter(salon => salon.city_id === city.id);
      
      // Simple HTML template for cities
      const title = `Electrolysis Hair Removal in ${city.city}, ${city.state_name || ''}`;
      const metaDescription = `Find the best electrolysis hair removal salons in ${city.city}, ${city.state_name || ''}. Compare providers and services.`;
      
      const content = `
        <div class="city-page">
          <h1>Electrolysis Providers in ${city.city}, ${city.state_name || ''}</h1>
          <p>Find professional electrolysis services in ${city.city}.</p>
          ${city.latitude && city.longitude ? `
            <div class="map-container" 
                 data-lat="${city.latitude}" 
                 data-lng="${city.longitude}" 
                 data-title="${city.city}">
              <div>Map loading...</div>
            </div>
          ` : ''}
          <div class="salon-list">
            <h2>${citySalons.length} Electrolysis Provider${citySalons.length !== 1 ? 's' : ''} in ${city.city}</h2>
            <ul>
              ${citySalons.map(salon => `
                <li>
                  <a href="/companies/${salon.slug}/">${salon.title}</a>
                  <p>${salon.description ? salon.description.substring(0, 150) + '...' : ''}</p>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
      
      await fs.writeFile(filePath, generateHtmlTemplate(title, metaDescription, content));
      
      sitemapUrls.push(url);
      htmlSitemapData.push({ url, title: `Electrolysis in ${city.city}, ${city.state_name || ''}` });
    }
    
    // Generate HTML files for states
    for (const state of states) {
      const url = `/states/${state.slug}/`;
      const filePath = path.join(statesDir, `${state.slug}.html`);
      
      // Get cities in this state
      const stateCities = cities.filter(city => city.state_id === state.id);
      
      // Simple HTML template for states
      const title = `Electrolysis Hair Removal in ${state.state}`;
      const metaDescription = `Find electrolysis hair removal providers in ${state.state}. Browse by city and compare services.`;
      
      const content = `
        <div class="state-page">
          <h1>Electrolysis Providers in ${state.state}</h1>
          <p>Find professional electrolysis services across ${state.state}.</p>
          ${state.latitude && state.longitude ? `
            <div class="map-container" 
                 data-lat="${state.latitude}" 
                 data-lng="${state.longitude}" 
                 data-title="${state.state}">
              <div>Map loading...</div>
            </div>
          ` : ''}
          <div class="city-list">
            <h2>Cities in ${state.state}</h2>
            <ul>
              ${stateCities.map(city => `
                <li>
                  <a href="/cities/${city.slug}/">${city.city}</a>
                  <span>${city.salon_ids?.length || 0} provider${(city.salon_ids?.length || 0) !== 1 ? 's' : ''}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
      
      await fs.writeFile(filePath, generateHtmlTemplate(title, metaDescription, content));
      
      sitemapUrls.push(url);
      htmlSitemapData.push({ url, title: `Electrolysis in ${state.state}` });
    }
    
    // Generate sitemap.xml
    await fs.writeFile(path.join(publicDir, 'sitemap.xml'), generateSitemap(sitemapUrls, baseUrl));
    
    // Generate HTML sitemap
    await fs.writeFile(path.join(publicDir, 'sitemap.html'), generateHtmlTemplate('Sitemap', 'Complete sitemap of electrolysis providers', generateHtmlSitemap(htmlSitemapData)));
    
    // Split sitemap if there are more than 200 salon pages
    if (salons.length > 200) {
      const salonChunks = splitSitemap(
        salons.map(salon => ({ url: `/companies/${salon.slug}/`, title: salon.title })),
        200
      );
      
      // Create a sitemap index
      const sitemapIndexUrls = salonChunks.map((_, index) => `${baseUrl}/sitemap-companies-${index + 1}.xml`);
      const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemapIndexUrls.map(url => `
  <sitemap>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  `).join('')}
</sitemapindex>`;
      
      await fs.writeFile(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);
      
      // Create individual sitemap files
      for (let i = 0; i < salonChunks.length; i++) {
        const chunkUrls = salonChunks[i].map(item => item.url);
        await fs.writeFile(
          path.join(publicDir, `sitemap-companies-${i + 1}.xml`),
          generateSitemap(chunkUrls, baseUrl)
        );
      }
    }
    
    console.log('HTML generation complete!');
  } catch (error) {
    console.error('Error generating HTML:', error);
  }
};

// Run the main function
processData();