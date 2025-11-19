#!/bin/bash

# ByteBite Build Verification Script
# This script verifies that the production build is complete and valid

set -e

echo "🔍 Verifying ByteBite production build..."
echo ""

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "❌ Error: dist directory not found. Run 'npm run build' first."
  exit 1
fi

echo "✅ dist directory exists"

# Check for index.html
if [ ! -f "dist/index.html" ]; then
  echo "❌ Error: dist/index.html not found"
  exit 1
fi

echo "✅ index.html found"

# Check for assets directory
if [ ! -d "dist/assets" ]; then
  echo "❌ Error: dist/assets directory not found"
  exit 1
fi

echo "✅ assets directory found"

# Count JavaScript files
js_count=$(find dist/assets -name "*.js" | wc -l)
echo "✅ Found $js_count JavaScript files"

# Count CSS files
css_count=$(find dist/assets -name "*.css" | wc -l)
echo "✅ Found $css_count CSS files"

# Check for data files
if [ -f "dist/assets/idioms-*.json" ] || [ -f "src/data/idioms.json" ]; then
  echo "✅ Data files present"
else
  echo "⚠️  Warning: idioms.json not found in expected locations"
fi

# Calculate total build size
total_size=$(du -sh dist | cut -f1)
echo ""
echo "📦 Total build size: $total_size"

# List largest files
echo ""
echo "📊 Largest files:"
find dist -type f -exec du -h {} + | sort -rh | head -5

echo ""
echo "✅ Build verification complete!"
echo ""
echo "To preview the build locally, run:"
echo "  npm run preview"
