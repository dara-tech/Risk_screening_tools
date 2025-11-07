#!/bin/bash

# Deploy script for DHIS2 Import Tool
echo "Deploying Import Risk Screening Data to DHIS2 2.40..."

# Build the app first
echo "Building the app..."
d2-app-scripts build --no-verify

if [ $? -eq 0 ]; then
    echo "Build successful! Deploying to DHIS2..."
    
    # Deploy with credentials
    echo "http://localhost:8080" | d2-app-scripts deploy
else
    echo "Build failed!"
    exit 1
fi
