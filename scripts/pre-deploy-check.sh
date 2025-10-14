#!/bin/bash

# SubTrack Pre-Deployment Check Script
echo "🚀 SubTrack Pre-Deployment Checklist"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

ERRORS=0
WARNINGS=0

echo
echo "🔧 Environment Checks"
echo "--------------------"

# Check if .env file exists
if [ -f ".env" ]; then
    check_pass ".env file exists"
    
    # Check for required Firebase variables
    if grep -q "EXPO_PUBLIC_FIREBASE_API_KEY" .env; then
        check_pass "Firebase API key configured"
    else
        check_fail "Firebase API key missing in .env"
    fi
    
    if grep -q "EXPO_PUBLIC_FIREBASE_PROJECT_ID" .env; then
        check_pass "Firebase project ID configured"
    else
        check_fail "Firebase project ID missing in .env"
    fi
else
    check_fail ".env file missing"
fi

echo
echo "📱 App Configuration"
echo "-------------------"

# Check app.json configuration
if [ -f "app.json" ]; then
    check_pass "app.json exists"
    
    # Check version
    VERSION=$(node -pe "require('./app.json').expo.version")
    if [ "$VERSION" != "undefined" ]; then
        check_pass "App version set: $VERSION"
    else
        check_fail "App version not set in app.json"
    fi
    
    # Check bundle identifiers
    IOS_BUNDLE=$(node -pe "require('./app.json').expo.ios?.bundleIdentifier || 'undefined'")
    ANDROID_PACKAGE=$(node -pe "require('./app.json').expo.android?.package || 'undefined'")
    
    if [ "$IOS_BUNDLE" != "undefined" ]; then
        check_pass "iOS bundle identifier: $IOS_BUNDLE"
    else
        check_fail "iOS bundle identifier missing"
    fi
    
    if [ "$ANDROID_PACKAGE" != "undefined" ]; then
        check_pass "Android package name: $ANDROID_PACKAGE"
    else
        check_fail "Android package name missing"
    fi
else
    check_fail "app.json missing"
fi

echo
echo "🔨 Build Configuration"
echo "---------------------"

# Check EAS configuration
if [ -f "eas.json" ]; then
    check_pass "eas.json exists"
    
    # Check if production profile exists
    if node -pe "require('./eas.json').build.production" > /dev/null 2>&1; then
        check_pass "Production build profile configured"
    else
        check_fail "Production build profile missing in eas.json"
    fi
else
    check_fail "eas.json missing"
fi

echo
echo "📦 Dependencies"
echo "--------------"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    check_pass "Node modules installed"
else
    check_fail "Node modules not installed - run 'npm install'"
fi

# Check TypeScript compilation
echo "Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    check_pass "TypeScript compilation successful"
else
    check_warn "TypeScript compilation has warnings/errors"
fi

echo
echo "🗂️  Required Files"
echo "-------------------"

# Check Android gradlew permissions
if [ -f "android/gradlew" ]; then
    if [ -x "android/gradlew" ]; then
        check_pass "Android gradlew has execute permissions"
    else
        check_fail "Android gradlew missing execute permissions - run: chmod +x android/gradlew"
    fi
else
    check_warn "Android gradlew not found"
fi

# Check for required asset files
ASSETS_DIR="assets/images"
if [ -d "$ASSETS_DIR" ]; then
    check_pass "Assets directory exists"
    
    # Check for required images
    required_files=("icon.png" "adaptive-icon.png" "favicon.png" "splash-icon.png")
    for file in "${required_files[@]}"; do
        if [ -f "$ASSETS_DIR/$file" ]; then
            check_pass "$file exists"
        else
            check_warn "$file missing - may need to be created"
        fi
    done
else
    check_fail "Assets directory missing"
fi

echo
echo "🔐 Security"
echo "----------"

# Check if sensitive files are in .gitignore
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        check_pass ".env file is gitignored"
    else
        check_fail ".env file should be added to .gitignore"
    fi
    
    if grep -q "google-service-account.json" .gitignore; then
        check_pass "Service account key is gitignored"
    else
        check_warn "google-service-account.json should be in .gitignore"
    fi
else
    check_warn ".gitignore file missing"
fi

echo
echo "📊 Summary"
echo "==========="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found. Review before deployment.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found. Fix these before deployment.${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠️  $WARNINGS warning(s) also found.${NC}"
    fi
    exit 1
fi