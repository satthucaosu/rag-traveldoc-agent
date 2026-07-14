# First-run environment setup. Run once after cloning.
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')

Write-Host '==> Installing dependencies'
Invoke-Expression '(none)'

Write-Host '==> Running smoke check'
& (Join-Path $PSScriptRoot 'check.ps1')

Write-Host '==> Bootstrap complete.'
