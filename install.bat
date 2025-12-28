@echo off
REM satucommit Installation Script for Windows
REM This script installs the satucommit CLI tool globally

echo.
echo ========================================
echo   satucommit Installation Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node -v
echo.
echo [OK] npm is installed
npm -v
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

REM Install globally
echo [INFO] Installing globally...
call npm link
if %errorlevel% neq 0 (
    echo [WARNING] Failed to install globally
    echo You can still use satucommit with: node cli.js [command]
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo [INFO] Initializing satucommit for AI agent slash command support...
call node cli.js init
echo.
echo ========================================
echo   Usage
echo ========================================
echo.
echo   satucommit generate     - Generate a semantic commit message
echo   satucommit quick        - Quick commit with auto-generated message
echo   satucommit interactive  - Interactive mode to build commit message
echo   satucommit types        - Show available commit types
echo   satucommit scopes       - Show common commit scopes
echo.
echo For more information, run: satucommit --help
echo.
pause
