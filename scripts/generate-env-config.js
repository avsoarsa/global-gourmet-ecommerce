import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the env-config.js file with environment variables
const envConfigContent = `window.ENV = {
  SUPABASE_URL: '${process.env.SUPABASE_URL || 'https://lxljeehmdzrvxwaqlmhf.supabase.co'}',
  SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bGplZWhtZHpydnh3YXFsbWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NDQzOTksImV4cCI6MjA2MTAyMDM5OX0.gU4LoXQ0ETWS-vD3aQMubgeYKwqcFVzzb3r6LTaNNJQ'}'
};
`;

// Ensure the public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write the env-config.js file
fs.writeFileSync(
  path.resolve(publicDir, 'env-config.js'),
  envConfigContent
);

console.log('Generated env-config.js file');
