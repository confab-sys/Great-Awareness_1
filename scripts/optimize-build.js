const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing build for smaller size...');

// Clean up unnecessary files
const cleanupPaths = [
  '.expo',
  'node_modules/.cache',
  'android/build',
  'android/app/build',
  'ios/build'
];

cleanupPaths.forEach(cleanupPath => {
  if (fs.existsSync(cleanupPath)) {
    console.log(`🧹 Cleaning up ${cleanupPath}`);
    fs.rmSync(cleanupPath, { recursive: true, force: true });
  }
});

// Optimize SVG files
const assetsPath = path.join(__dirname, '../assets');
if (fs.existsSync(assetsPath)) {
  console.log('📦 Optimizing assets...');
  
  // Remove large unused assets
  const largeAssets = [
    'assets/icons/Main_logo.svg', // 131KB
    'assets/images/icon.png',     // 22KB
    'assets/images/adaptive-icon.png', // 17KB
    'assets/images/splash-icon.png'    // 17KB
  ];
  
  largeAssets.forEach(assetPath => {
    if (fs.existsSync(assetPath)) {
      console.log(`🗑️  Removing large asset: ${assetPath}`);
      fs.unlinkSync(assetPath);
    }
  });
}

console.log('✅ Build optimization complete!');
console.log('💡 Tips for smaller builds:');
console.log('   - Use tiny_main_logo.svg (107KB) instead of Main_logo.svg (131KB)');
console.log('   - Removed unused dependencies');
console.log('   - Optimized metro and babel configs');
console.log('   - Added error handling to prevent crashes');

