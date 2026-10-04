param([switch]$AllyDisplay, [switch]$Restart)
$ErrorActionPreference = 'Stop'
$clockRoot = Split-Path -Parent $PSScriptRoot
$clockUrl = 'http://127.0.0.1:4173'
if ($Restart) {
    $clockProfilePath = Join-Path $clockRoot '.edge-clock'
    $clockServerPath = Join-Path $clockRoot 'server.cjs'
    $clockProcesses = Get-CimInstance Win32_Process
    $clockBrowsers = $clockProcesses | Where-Object {
        $_.Name -eq 'msedge.exe' -and $_.CommandLine -match '--edge-kiosk-type=fullscreen' -and $_.CommandLine -match [regex]::Escape($clockProfilePath)
    }
    foreach ($clockBrowser in $clockBrowsers) {
        & taskkill.exe /PID $clockBrowser.ProcessId /T /F | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Start-Sleep -Milliseconds 300
            if (Get-Process -Id $clockBrowser.ProcessId -ErrorAction SilentlyContinue) { Stop-Process -Id $clockBrowser.ProcessId -Force }
        }
    }
    $clockServers = $clockProcesses | Where-Object {
        $_.Name -eq 'node.exe' -and $_.CommandLine -match [regex]::Escape($clockServerPath)
    }
    foreach ($clockServer in $clockServers) { Stop-Process -Id $clockServer.ProcessId -Force -ErrorAction SilentlyContinue }
    Write-Output 'Stopped the clock browser and its local server.'
}
$clockNode = Get-Command node -ErrorAction SilentlyContinue
if (-not $clockNode) { throw 'Node.js was not found on PATH. Open Little Orbit.html in the tool directory instead.' }
$clockNodePath = $clockNode.Source
$clockRunning = $false
try {
    $clockResponse = Invoke-WebRequest -Uri $clockUrl -TimeoutSec 2 -UseBasicParsing
    $clockRunning = $clockResponse.Content -match 'Little Orbit'
    if (-not $clockRunning) { throw 'Port 4173 is in use by another application.' }
} catch {
    if ($_.Exception.Message -eq 'Port 4173 is in use by another application.') { throw }
}
if (-not $clockRunning) {
    Start-Process -FilePath $clockNodePath -ArgumentList @(('"' + (Join-Path $clockRoot 'server.cjs') + '"')) -WorkingDirectory $clockRoot -WindowStyle Hidden
    for ($clockAttempt = 0; $clockAttempt -lt 20; $clockAttempt++) {
        Start-Sleep -Milliseconds 250
        try {
            $clockResponse = Invoke-WebRequest -Uri $clockUrl -TimeoutSec 1 -UseBasicParsing
            if ($clockResponse.Content -match 'Little Orbit') { $clockRunning = $true; break }
        } catch {}
    }
    if (-not $clockRunning) { throw 'Clock server could not start. Port 4173 may be occupied.' }
}
$clockEdge = @("${env:ProgramFiles(x86)}/Microsoft/Edge/Application/msedge.exe", "$env:ProgramFiles/Microsoft/Edge/Application/msedge.exe") | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($AllyDisplay -and $clockEdge) {
    $clockProfile = Join-Path $clockRoot '.edge-clock'
    $clockRevision = (Get-FileHash -LiteralPath (Join-Path $clockRoot 'style.css') -Algorithm SHA256).Hash.Substring(0,12)
    $clockDisplayUrl = $clockUrl + '/?revision=' + $clockRevision
    Start-Process -FilePath $clockEdge -ArgumentList @('--kiosk', $clockDisplayUrl, '--edge-kiosk-type=fullscreen', '--no-first-run', '--kiosk-idle-timeout-minutes=0', ('--user-data-dir="' + $clockProfile + '"'))
    Write-Output 'Little Orbit opened in full-screen Edge signage mode. Alt+F4 closes the display.'
} else {
    Start-Process $clockUrl
    Write-Output 'Little Orbit opened in your default browser. Use the Full screen button on the page.'
}
