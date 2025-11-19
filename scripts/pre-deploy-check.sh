#!/bin/bash

# ByteBite Pre-Deployment Checklist Script
# This script runs all checks before deploying to production

# Don't exit on error - we want to run all checks
set +e

echo "🚀 ByteBite Pre-Deployment Checklist"
echo "===================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to print check result
check_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ $2${NC}"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}❌ $2${NC}"
    ((CHECKS_FAILED++))
  fi
}

# 1. Check Node version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 20 ]; then
  check_result 0 "Node.js version is $NODE_VERSION (>= 20)"
else
  check_result 1 "Node.js version is $NODE_VERSION (< 20)"
fi
echo ""

# 2. Run linter
echo "2️⃣  Running ESLint..."
if npm run lint > /dev/null 2>&1; then
  check_result 0 "Code passes linting"
else
  check_result 1 "Linting failed"
fi
echo ""

# 3. Check code formatting
echo "3️⃣  Checking code formatting..."
if npm run format:check > /dev/null 2>&1; then
  check_result 0 "Code formatting is correct"
else
  check_result 1 "Code formatting issues found"
fi
echo ""

# 4. Run tests
echo "4️⃣  Running tests..."
if npm run test:run > /dev/null 2>&1; then
  check_result 0 "All tests passed"
else
  check_result 1 "Tests failed"
fi
echo ""

# 5. Build project
echo "5️⃣  Building project..."
if npm run build > /dev/null 2>&1; then
  check_result 0 "Build successful"
else
  check_result 1 "Build failed"
fi
echo ""

# 6. Verify build output
echo "6️⃣  Verifying build output..."
if [ -f "dist/index.html" ] && [ -d "dist/assets" ]; then
  check_result 0 "Build output is valid"
else
  check_result 1 "Build output is invalid"
fi
echo ""

# 7. Check data files
echo "7️⃣  Checking data files..."
if [ -f "src/data/idioms.json" ] && [ -f "src/data/languages.json" ]; then
  check_result 0 "Data files exist"
else
  check_result 1 "Data files missing"
fi
echo ""

# 8. Check environment files
echo "8️⃣  Checking environment configuration..."
if [ -f ".env.example" ]; then
  check_result 0 "Environment example file exists"
else
  check_result 1 "Environment example file missing"
fi
echo ""

# Summary
echo "===================================="
echo "📊 Summary"
echo "===================================="
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
  exit 0
else
  echo -e "${RED}❌ Some checks failed. Please fix the issues before deploying.${NC}"
  exit 1
fi
