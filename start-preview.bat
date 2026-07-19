@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>&1
if not errorlevel 1 goto use_py

where python >nul 2>&1
if not errorlevel 1 goto use_python

echo Python was not found.
echo You can open index.html directly, or install Python and try again.
pause
goto end

:use_py
start "" "http://localhost:8000"
echo Local preview: http://localhost:8000
echo Press Ctrl+C to stop.
py -3 -m http.server 8000
goto stopped

:use_python
start "" "http://localhost:8000"
echo Local preview: http://localhost:8000
echo Press Ctrl+C to stop.
python -m http.server 8000

:stopped
echo.
echo Preview stopped. If this window closed immediately, port 8000 may already be in use.
pause

:end
endlocal
