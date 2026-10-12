@echo off
cd /d "%~dp0"
py -3 baixar_imagens.py
if errorlevel 1 python baixar_imagens.py
pause
