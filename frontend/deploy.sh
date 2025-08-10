#!/bin/bash

# Global Medical AI Library - Frontend Deployment Script

set -e

# Configuration
PROJECT_NAME="global-medical-ai-library-frontend"
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    log_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    npm install
    log_success "Dependencies installed successfully"
}

# Build project (if needed)
build_project() {
    log_info "Building project..."
    
    # For vanilla JS projects, we just need to ensure all files are present
    if [ ! -f "index.html" ]; then
        log_error "index.html not found. Please ensure you're in the correct directory."
        exit 1
    fi
    
    if [ ! -d "css" ]; then
        log_error "css directory not found."
        exit 1
    fi
    
    if [ ! -d "js" ]; then
        log_error "js directory not found."
        exit 1
    fi
    
    log_success "Project build completed"
}

# Create production build
create_production_build() {
    log_info "Creating production build..."
    
    # Create dist directory
    mkdir -p dist
    
    # Copy all files to dist
    cp -r *.html dist/
    cp -r css dist/
    cp -r js dist/
    cp README.md dist/ 2>/dev/null || true
    
    # Update config for production
    if [ -f "config.js" ]; then
        sed 's/ENVIRONMENT: .*/ENVIRONMENT: "production",/' config.js > dist/config.js
        sed -i 's/DEBUG_MODE: .*/DEBUG_MODE: false,/' dist/config.js
    fi
    
    # Create production package.json
    cat > dist/package.json << EOF
{
  "name": "${PROJECT_NAME}",
  "version": "${VERSION}",
  "description": "Production build of Global Medical AI Library Frontend",
  "main": "index.html",
  "scripts": {
    "start": "http-server -p 8000 -c-1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF
    
    log_success "Production build created in dist/ directory"
}

# Run tests (placeholder)
run_tests() {
    log_info "Running tests..."
    
    # Check if all HTML files are valid
    for file in *.html; do
        if [ -f "$file" ]; then
            log_info "Checking $file..."
            # Basic HTML validation (you can add more sophisticated validation here)
            if grep -q "<!DOCTYPE html>" "$file"; then
                log_success "$file is valid HTML"
            else
                log_warning "$file might not be valid HTML"
            fi
        fi
    done
    
    log_success "Tests completed"
}

# Deploy to local server
deploy_local() {
    log_info "Deploying to local server..."
    
    # Check if port 8000 is available
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "Port 8000 is already in use. Stopping existing server..."
        pkill -f "http-server.*8000" || true
    fi
    
    # Start local server
    log_info "Starting local server on http://localhost:8000"
    npm start &
    SERVER_PID=$!
    
    # Wait a moment for server to start
    sleep 2
    
    # Check if server is running
    if curl -s http://localhost:8000 > /dev/null; then
        log_success "Local server started successfully"
        log_info "Server PID: $SERVER_PID"
        log_info "Access your application at: http://localhost:8000"
        log_info "Press Ctrl+C to stop the server"
        
        # Wait for user to stop
        wait $SERVER_PID
    else
        log_error "Failed to start local server"
        kill $SERVER_PID 2>/dev/null || true
        exit 1
    fi
}

# Deploy to production (placeholder)
deploy_production() {
    log_info "Deploying to production..."
    
    # This is a placeholder for production deployment
    # You would typically upload to a web server, CDN, or cloud platform
    
    log_warning "Production deployment not configured"
    log_info "Please configure your production deployment method"
    log_info "Common options:"
    log_info "  - Upload to web server via FTP/SFTP"
    log_info "  - Deploy to AWS S3 + CloudFront"
    log_info "  - Deploy to Netlify/Vercel"
    log_info "  - Deploy to GitHub Pages"
}

# Show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  install     Install dependencies"
    echo "  build       Build the project"
    echo "  test        Run tests"
    echo "  local       Deploy to local server"
    echo "  prod        Create production build"
    echo "  deploy      Deploy to production"
    echo "  all         Run install, build, test, and local deployment"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Install dependencies"
    echo "  $0 local      # Start local development server"
    echo "  $0 prod       # Create production build"
}

# Main script
main() {
    case "${1:-help}" in
        "install")
            check_dependencies
            install_dependencies
            ;;
        "build")
            check_dependencies
            build_project
            ;;
        "test")
            run_tests
            ;;
        "local")
            check_dependencies
            build_project
            deploy_local
            ;;
        "prod")
            check_dependencies
            build_project
            create_production_build
            ;;
        "deploy")
            deploy_production
            ;;
        "all")
            check_dependencies
            install_dependencies
            build_project
            run_tests
            deploy_local
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
