@echo off
REM Quick Start Script for Phishing Awareness Demo
REM Run this to start both servers in separate terminals

echo =========================================
echo Phishing Awareness Demo - Quick Start
echo =========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install from https://nodejs.org/
    pause
    exit /b 1
)

echo Starting Backend Server...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
start cmd /k "npm start"

timeout /t 3 /nobreak

echo Starting Frontend Server...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
start cmd /k "npm start"

echo.
echo =========================================
echo Both servers should now be running!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo =========================================
echo.
pause
