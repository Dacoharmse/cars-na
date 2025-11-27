@echo off
echo ========================================
echo  Cars.na Development Server Startup
echo ========================================
echo.

cd /d "%~dp0"

echo Starting development server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run dev
