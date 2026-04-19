#!/bin/bash
# Quick Start Script for Phishing Awareness Demo
# Run this to start both servers in separate terminals

echo "========================================="
echo "Phishing Awareness Demo - Quick Start"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install from https://nodejs.org/"
    exit 1
fi

echo "Starting Backend Server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Start backend in background
npm start &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend
npm start

# Cleanup: Kill backend when script exits
trap "kill $BACKEND_PID" EXIT

echo ""
echo "========================================="
echo "Both servers should now be running!"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "========================================="
