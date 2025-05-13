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


@REM :: Start Services in the Same Terminal
@REM echo Starting services...

@REM :: Start User Service (FastAPI) on port 8000
@REM cd /d "%~dp0\backend\user-service"
@REM start /B node server.js

@REM :: Start Event Service (Express.js) on port 5000
@REM cd /d "%~dp0\backend\task-service"
@REM start /B node server.js

@REM :: Start Booking Service (Express.js) on port 5001
@REM cd /d "%~dp0\backend\notification-service"
@REM start /B node server.js


@REM :: Wait a few seconds to let services start

@REM :: Start frontend server in the same terminal
@REM cd /d "%~dp0\frontend"
@REM start /B python -m http.server 5500

@REM :: Open frontend in Chrome
@REM timeout /t 2 /nobreak >nul
@REM start opera "http://localhost:5500/index.html"

@REM echo All services started successfully!
@REM pause