@echo off
del /F /Q "c:\Users\User\Projects\cars-na\cars-na\src\lib\stripe.ts"
if exist "c:\Users\User\Projects\cars-na\cars-na\src\lib\stripe.ts" (
    echo ERROR: File still exists
) else (
    echo SUCCESS: stripe.ts deleted
)
pause
