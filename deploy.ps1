Write-Host "Smart Farm Deployment - Starting..."

# 1. Check if Git is installed
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Error "Git is missing."
    exit 1
}

# 2. Check if Node.js is installed
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js is missing."
    exit 1
}

# 3. Add files to Git
Write-Host "Adding files to Git..."
git add .
git commit -m "Auto-deploy update"

# 4. Deploy using Vercel CLI
Write-Host "Deploying with Vercel..."
$login = cmd /c "npx vercel whoami"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Vercel..."
    cmd /c "npx vercel login"
}

Write-Host "Pushing to production..."
cmd /c "npx vercel --prod --yes"

Write-Host "Deployment Complete."
Write-Host "REMINDER: Set Environment Variables in Vercel Dashboard (OPENAI_API_KEY, etc.)"
