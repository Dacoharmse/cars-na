@echo off
echo ========================================
echo  Cars.na - Rebuild and Start Production
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing Stripe dependency...
call npm install stripe
if errorlevel 1 (
    echo ERROR: Failed to install Stripe
    pause
    exit /b 1
)

echo.
echo [2/4] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [3/4] Building Next.js application...
call npm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [4/4] Starting production server...
echo.
echo ========================================
echo  Server starting at: http://localhost:3000
echo  Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run start
