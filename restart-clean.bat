@echo off
echo === Cleaning and Restarting Cars.NA ===
echo.

echo [1/5] Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/5] Removing .next cache...
cd /d "%~dp0"
if exist .next (
    rd /s /q .next
    echo .next cache removed
) else (
    echo .next cache not found, skipping
)

echo [3/5] Seeding showcase vehicles...
node seed-vehicles-simple.js
if %ERRORLEVEL% NEQ 0 (
    echo Warning: Seeding failed, continuing anyway...
)
echo.

echo [4/5] Waiting for cleanup to complete...
timeout /t 3 /nobreak >nul

echo [5/5] Starting development server...
echo.
echo =====================================
echo Server starting on http://localhost:3000
echo Press Ctrl+C to stop the server
echo =====================================
echo.

npm run dev
