@echo off
echo Freeing up ports and starting all services...

:: Function to kill process on a specific port
setlocal
set "ports=3002 3001 3000 5500"

for %%p in (%ports%) do (
    echo Killing process on port %%p...
    netstat -ano | findstr :%%p >nul
    if %errorlevel%==0 (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%%p') do (
            taskkill /PID %%a /F >nul 2>&1
            echo Process on port %%p killed.
        )
    ) else (
        echo No process found on port %%p.
    )
)

:: Start Services in the Same Terminal
echo Starting services...

:: Start User Service (FastAPI) on port 8000
cd /d "%~dp0\backend\user-service"
start /B node server.js

:: Start Event Service (Express.js) on port 5000
cd /d "%~dp0\backend\task-service"
start /B node server.js

:: Start Booking Service (Express.js) on port 5001
cd /d "%~dp0\backend\notification-service"
start /B node server.js


:: Wait a few seconds to let services start

:: Start frontend server in the same terminal
cd /d "%~dp0\frontend"
start /B python -m http.server 5500

:: Open frontend in Chrome
timeout /t 2 /nobreak >nul
start opera "http://localhost:5500/index.html"

echo All services started successfully!
pause