$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$logDir = Join-Path $root "run-logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

function Start-HauslyProcess {
  param(
    [Parameter(Mandatory = $true)][string]$Name,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory,
    [Parameter(Mandatory = $true)][string]$Command,
    [Parameter(Mandatory = $true)][string]$Arguments
  )

  $stdout = Join-Path $logDir "$Name.out.log"
  $stderr = Join-Path $logDir "$Name.err.log"

  # Clean and robust argument construction using single-quoted template:
  $cleanArgs = $Arguments
  if ($Arguments -like "/c *") {
    $cleanArgs = $Arguments.Substring(3)
  }
  $fullArguments = '/c cd /d "{0}" && {1}' -f $WorkingDirectory, $cleanArgs

  $process = Start-Process `
    -FilePath "cmd.exe" `
    -ArgumentList $fullArguments `
    -NoNewWindow `
    -RedirectStandardOutput $stdout `
    -RedirectStandardError $stderr `
    -PassThru

  Set-Content -Path (Join-Path $logDir "$Name.pid") -Value $process.Id
  Write-Output "$Name PID $($process.Id) launched. Logs: $stdout"
}

# 1. Start Backend (Port 3000)
Start-HauslyProcess `
  -Name "backend" `
  -WorkingDirectory (Join-Path $root "backend") `
  -Command "cmd.exe" `
  -Arguments "/c npm run start:dev"

# 2. Start Admin Dashboard (Port 5173)
Start-HauslyProcess `
  -Name "admin" `
  -WorkingDirectory (Join-Path $root "admin") `
  -Command "cmd.exe" `
  -Arguments "/c npm run dev"

# 3. Start Next.js Web Portal (Port 3002)
Start-HauslyProcess `
  -Name "web" `
  -WorkingDirectory (Join-Path $root "web") `
  -Command "cmd.exe" `
  -Arguments "/c npm run dev"

# 4. Start Flutter Frontend Web Server (Port 3003)
# Try using Python to serve static web files
Start-HauslyProcess `
  -Name "frontend-web" `
  -WorkingDirectory (Join-Path $root "frontend\build\web") `
  -Command "cmd.exe" `
  -Arguments "/c python -m http.server 3003"

Write-Output "Hausly stack launched successfully!"
Write-Output "Access endpoints:"
Write-Output " - Backend API: http://localhost:3000/api"
Write-Output " - Admin Dashboard: http://localhost:5173"
Write-Output " - Next.js Tenant Web: http://localhost:3002"
Write-Output " - Flutter Tenant/Landlord App: http://localhost:3003"
Write-Output "Logs are stored in: $logDir"
