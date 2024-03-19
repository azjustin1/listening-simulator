@echo off

call .\install.bat >nul
echo Install completed
call .\build.bat >nul
echo Build completed
call .\run-server.bat

echo The web is running at http://localhost:3000