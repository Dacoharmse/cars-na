@echo off
echo ========================================
echo  Cars.na Production Server Startup
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Building Next.js application...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [2/3] Build completed successfully!
echo.
echo [3/3] Starting production server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm run start
