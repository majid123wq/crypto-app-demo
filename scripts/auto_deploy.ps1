<#
PowerShell deployment helper for Crypto App | Student Project
This script does the following (automated, run locally):
 - Creates a Render Web Service for the backend using your Render API key
 - Adds environment variables to the Render service
 - Creates/links a Netlify site for the frontend using the Netlify CLI
 - Sets `REACT_APP_API_URL` in Netlify build env to point to the Render backend

Security: do NOT hardcode tokens. The script prompts for tokens or reads from env vars.
Prereqs (run on your machine):
 - PowerShell 7+ recommended
 - curl (built-in on Windows 10+)
 - Node.js + npm
 - netlify-cli installed: `npm install -g netlify-cli`

Usage:
  1. Open PowerShell in repository root (this script path: ./scripts/auto_deploy.ps1)
  2. Run: .\scripts\auto_deploy.ps1
  3. Follow prompts for keys and values.

Note: The script performs remote actions using your tokens. Keep tokens private.
#>

function Read-SecretPrompt([string]$prompt) {
    if ($env:RENDER_KEY -and $env:NETLIFY_AUTH_TOKEN) {
        Write-Host "Using RENDER_KEY and NETLIFY_AUTH_TOKEN from environment variables."
        return
    }
}

Write-Host "=== Crypto App Auto Deploy Helper ===`n"

# Gather inputs
if (-not $env:RENDER_KEY) {
    $renderKey = Read-Host -Prompt "Enter Render API Key (will not be stored)"
} else {
    $renderKey = $env:RENDER_KEY
}

if (-not $env:NETLIFY_AUTH_TOKEN) {
    $netlifyToken = Read-Host -Prompt "Enter Netlify Personal Access Token (will not be stored)"
} else {
    $netlifyToken = $env:NETLIFY_AUTH_TOKEN
}

$githubRepo = Read-Host -Prompt "GitHub repo (owner/repo)" -Default "majid123wq/crypto-app-demo"
$renderServiceName = Read-Host -Prompt "Render service name" -Default "crypto-app-backend"
$renderRoot = Read-Host -Prompt "Render root directory" -Default "backend"
$renderBranch = Read-Host -Prompt "Render branch" -Default "main"

# Optional production values
$mongoUri = Read-Host -Prompt "MONGO_URI (Atlas URI) or leave blank to use in-memory DB" -Default ""
$jwtSecret = Read-Host -Prompt "JWT_SECRET (use a long random secret)" -Default "change_this_to_a_strong_secret_32+"
$jwtExpire = Read-Host -Prompt "JWT_EXPIRE" -Default "7d"

# Create Render service
$renderCreatePayload = @{
    service = @{
        name = $renderServiceName
        type = "web"
        repo = "https://github.com/$githubRepo"
        branch = $renderBranch
        rootDirectory = $renderRoot
        buildCommand = "npm install"
        startCommand = "node server.js"
        env = "node"
        autoDeploy = $true
    }
} | ConvertTo-Json -Depth 6

Write-Host "Creating Render service..."
$renderRes = curl -s -X POST "https://api.render.com/v1/services" -H "Authorization: Bearer $renderKey" -H "Content-Type: application/json" -d $renderCreatePayload | ConvertFrom-Json
if ($null -eq $renderRes.id) {
    Write-Error "Render service creation failed. Response:`n$renderRes"
    exit 1
}

$serviceId = $renderRes.id
$renderDomain = $renderRes.service.defaultDomain
Write-Host "Render service created: $renderDomain (id: $serviceId)"

# Prepare env vars array
$envVars = @()
if ($mongoUri -ne "") {
    $envVars += @{ key = "MONGO_URI"; value = $mongoUri; secure = $true }
}
$envVars += @{ key = "JWT_SECRET"; value = $jwtSecret; secure = $true }
$envVars += @{ key = "JWT_EXPIRE"; value = $jwtExpire; secure = $false }
$envVars += @{ key = "NODE_ENV"; value = "production"; secure = $false }
# CLIENT_URL will be updated after Netlify site created
$envVars += @{ key = "CLIENT_URL"; value = ""; secure = $false }

$envPayload = $envVars | ConvertTo-Json -Depth 6
Write-Host "Setting Render environment variables..."
$envRes = curl -s -X POST "https://api.render.com/v1/services/$serviceId/env-vars" -H "Authorization: Bearer $renderKey" -H "Content-Type: application/json" -d $envPayload | ConvertFrom-Json
if ($envRes -eq $null) { Write-Warning "Could not set env vars on Render via API; you can set them later in the Render dashboard." }
else { Write-Host "Render env vars set." }

# Create Netlify site using Netlify CLI
Write-Host "\nNow creating Netlify site using netlify-cli. Ensure netlify-cli is installed (npm i -g netlify-cli)."
$netlifyName = Read-Host -Prompt "Desired Netlify site name (kebab-case, unique)" -Default "yourname-crypto-app"
Write-Host "Authenticating netlify-cli using token..."
# Save token temporarily to env for netlify-cli
$env:NETLIFY_AUTH_TOKEN = $netlifyToken

# Create site linked to GitHub repo (this may open a browser for OAuth if needed)
Write-Host "Creating Netlify site and linking to GitHub repository (this may require Netlify GitHub access)..."
$createCmd = "netlify sites:create --name $netlifyName --repo https://github.com/$githubRepo --dir frontend --prod"
Write-Host "Running: $createCmd"
try {
    $createOut = iex $createCmd 2>&1
    Write-Host $createOut
} catch {
    Write-Warning "netlify CLI returned an error or requires interactive login. You can run 'netlify login' in your shell and re-run this script."
}

# After site creation, get site info via netlify api using token
Write-Host "Fetching created Netlify site info..."
$netlifySites = curl -s -H "Authorization: Bearer $netlifyToken" "https://api.netlify.com/api/v1/sites?per_page=100" | ConvertFrom-Json
$site = $netlifySites | Where-Object { $_.name -eq $netlifyName }
if ($null -eq $site) { Write-Warning "Could not find created Netlify site via API. Please create it via Netlify UI or run netlify login and try again." }
else {
    $siteId = $site.id
    $siteUrl = $site.ssl_url
    Write-Host "Netlify site created: $siteUrl (id: $siteId)"

    # Set REACT_APP_API_URL env var on Netlify to Render backend
    $apiUrl = "https://$renderDomain/api"
    Write-Host "Setting Netlify env var REACT_APP_API_URL=$apiUrl"
    $setEnvRes = curl -s -X PATCH "https://api.netlify.com/api/v1/sites/$siteId" -H "Authorization: Bearer $netlifyToken" -H "Content-Type: application/json" -d (ConvertTo-Json @{ build_settings = @{ env = @{ REACT_APP_API_URL = $apiUrl } } }) | ConvertFrom-Json
    Write-Host "Netlify env updated. Triggering new build..."
    $buildRes = curl -s -X POST "https://api.netlify.com/api/v1/sites/$siteId/builds" -H "Authorization: Bearer $netlifyToken" -H "Content-Type: application/json" -d '{"clear_cache": false}' | ConvertFrom-Json
    Write-Host "Netlify build triggered. Build id: $($buildRes.id)"

    # Update Render CLIENT_URL env var to point to Netlify site
    Write-Host "Updating Render CLIENT_URL to Netlify site URL..."
    $clientUrlRes = curl -s -X POST "https://api.render.com/v1/services/$serviceId/env-vars" -H "Authorization: Bearer $renderKey" -H "Content-Type: application/json" -d (ConvertTo-Json @(@{ key = 'CLIENT_URL'; value = $siteUrl; secure = $false })) | ConvertFrom-Json
    Write-Host "Render CLIENT_URL updated. You may want to trigger a manual deploy on Render dashboard."
}

Write-Host "\nAutomation finished. Please review Render and Netlify dashboards for final deployment status."
Write-Host "Render service: https://$renderDomain"
if ($siteUrl) { Write-Host "Netlify site: $siteUrl" }

# Cleanup temporary env
Remove-Item env:NETLIFY_AUTH_TOKEN -ErrorAction SilentlyContinue

Write-Host "Done."
