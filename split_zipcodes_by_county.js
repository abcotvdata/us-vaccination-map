// split_zipcodes_by_county.js
// Run with: node split_zipcodes_by_county.js

import fs from 'fs';
import path from 'path';

// Path to your main ZIP GeoJSON file
const INPUT_FILE = './zipcodes.geojson';

// Output folder
const OUTPUT_DIR = './zip_by_county';

// Create folder if missing
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

console.log('Reading master ZIP file...');
const raw = fs.readFileSync(INPUT_FILE, 'utf8');
const data = JSON.parse(raw);

if (!data || !data.features) {
  console.error('Invalid GeoJSON structure');
  process.exit(1);
}

console.log(`Found ${data.features.length} ZIP features`);
const counties = {};

for (const feature of data.features) {
  const county = feature.properties.county_state;
  if (!county) continue;

  const cleanName = county.toLowerCase().replace(/\s+/g, '_').replace(/,/g, '');
  if (!counties[cleanName]) counties[cleanName] = [];

  counties[cleanName].push(feature);
}

// Write out per-county GeoJSON
for (const [countyName, features] of Object.entries(counties)) {
  const outPath = path.join(OUTPUT_DIR, `${countyName}.geojson`);
  const fc = {
    type: 'FeatureCollection',
    features,
  };
  fs.writeFileSync(outPath, JSON.stringify(fc));
  console.log(`Wrote ${countyName}.geojson (${features.length} features)`);
}

console.log('🎉 Done! All counties written to', OUTPUT_DIR);
