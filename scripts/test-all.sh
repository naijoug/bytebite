#!/bin/bash

# ByteBite Complete Test Suite
# Runs all tests: unit tests, build verification, and E2E tests

set +e  # Don't exit on error - we want to run all tests

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 ByteBite Complete Test Suite${NC}"
echo "===================================="
echo ""

# Track results
SUITE_PASSED=0
SUITE_FAILED=0

# Function to run a test suite
run_suite() {
  local name=$1
  local command=$2
  
  echo -e "${BLUE}▶ Running: $name${NC}"
  echo "------------------------------------"
  
  if eval "$command"; then
    echo -e "${GREEN}✅ $name: PASSED${NC}"
    ((SUITE_PASSED++))
  else
    echo -e "${RED}❌ $name: FAILED${NC}"
    ((SUITE_FAILED++))
  fi
  echo ""
}

# 1. Unit Tests
run_suite "Unit Tests" "npm run test:run"

# 2. Linting
run_suite "ESLint" "npm run lint"

# 3. Format Check
run_suite "Prettier Format Check" "npm run format:check"

# 4. Build
run_suite "Production Build" "npm run build"

# 5. Build Verification
run_suite "Build Verification" "npm run verify-build"

# 6. E2E Tests (requires preview server)
echo -e "${BLUE}▶ Running: E2E Tests${NC}"
echo "------------------------------------"
echo "Starting preview server..."

# Start preview server in background
npm run preview > /dev/null 2>&1 &
PREVIEW_PID=$!

# Wait for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:4173 > /dev/null; then
  echo "Preview server started (PID: $PREVIEW_PID)"
  
  # Run E2E tests
  if npm run test:e2e; then
    echo -e "${GREEN}✅ E2E Tests: PASSED${NC}"
    ((SUITE_PASSED++))
  else
    echo -e "${RED}❌ E2E Tests: FAILED${NC}"
    ((SUITE_FAILED++))
  fi
  
  # Stop preview server
  kill $PREVIEW_PID 2>/dev/null
  echo "Preview server stopped"
else
  echo -e "${RED}❌ E2E Tests: FAILED (Could not start preview server)${NC}"
  ((SUITE_FAILED++))
  kill $PREVIEW_PID 2>/dev/null
fi
echo ""

# Summary
echo "===================================="
echo -e "${BLUE}📊 Test Suite Summary${NC}"
echo "===================================="
echo -e "${GREEN}Passed: $SUITE_PASSED${NC}"
echo -e "${RED}Failed: $SUITE_FAILED${NC}"
echo ""

if [ $SUITE_FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All test suites passed!${NC}"
  echo ""
  echo "🚀 Ready to deploy!"
  exit 0
else
  echo -e "${RED}❌ Some test suites failed.${NC}"
  echo ""
  echo "Please fix the failing tests before deploying."
  exit 1
fi
