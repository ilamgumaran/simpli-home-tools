@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Launch-Clock.ps1" -AllyDisplay
if errorlevel 1 pause
