// Supabase Configuration
const SUPABASE_CONFIG = {
  // Supabase project URL
  URL: process.env.SUPABASE_URL || 'https://seequpormifvziwxfeqv.supabase.co',
  
  // Supabase anonymous key (public)
  ANON_KEY: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZXF1cG9ybWlmdnppd3hmZXF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDE3ODEsImV4cCI6MjA3MjU3Nzc4MX0.cvgc4zzpWmLv-Z19Jh2SUbFwVb1teKIUxfWwl1P_4UM',
  
  // Storage bucket for files
  STORAGE_BUCKET: 'Books',
  
  // Temporary URL expiration time in seconds (24 hours)
  TEMP_URL_EXPIRY: 86400,
  
  // File paths for specific books
  BOOK_FILES: {
    'Unlocking the primal brainThe hidden force shaping your thoughts and emotions.pdf': 'unlocking-the-primal-brain.pdf',
    'The Confidence Map.pdf': 'the-confidence-map.pdf'
  }
};

module.exports = { SUPABASE_CONFIG };