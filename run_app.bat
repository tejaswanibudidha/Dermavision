@echo off
echo Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is not found!
    echo You must install Node.js to run this application.
    echo.
    echo Please download it from: https://nodejs.org/
    echo.
    echo After installing, please RESTART your computer or VS Code.
    echo.
    pause
    exit /b
)

echo Node.js found. Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting development server...
call npm run dev
