const supabaseService = require('./services/supabaseService.js').default;

console.log('Testing image URLs...');
console.log('SUPABASE_CONFIG:', require('./config/supabase.js').SUPABASE_CONFIG);

const urls = supabaseService.getAllBookCoverUrls();
console.log('Generated URLs:');
Object.entries(urls).forEach(([name, url]) => {
  console.log(`${name}: ${url}`);
});

// Test a single URL
console.log('\nTesting single URL:');
const testUrl = supabaseService.getBookCoverUrl('Unlocking the Primal Brain.png');
console.log('Single test URL:', testUrl);