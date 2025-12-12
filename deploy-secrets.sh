#!/bin/bash

# Configuration
VPS_USER="root"
VPS_IP="213.199.58.144"
PROJECT_DIR="/root/VisiteHub_New"
LOCAL_ENV_FILE=".env"

# Check if .env exists
if [ ! -f "$LOCAL_ENV_FILE" ]; then
    echo "Error: $LOCAL_ENV_FILE not found!"
    echo "Please create a .env file with your production secrets first."
    echo "You can copy .env.example to .env and fill in the values."
    exit 1
fi

echo "Deploying secrets to VPS..."

# Create directory if it doesn't exist
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} "mkdir -p ${PROJECT_DIR}"

# Copy .env file
scp -o StrictHostKeyChecking=no ${LOCAL_ENV_FILE} ${VPS_USER}@${VPS_IP}:${PROJECT_DIR}/.env

echo "Secrets deployed successfully!"
