# Unified verification — run before marking work done.
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host "==> Tests"
Invoke-Expression '(none)'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host '==> All checks passed.'
