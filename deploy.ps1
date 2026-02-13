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

# Master Deploy Script for Smart Farm
# 1. Pushes code to GitHub (Safety & History)
# 2. Deploys to Vercel (Live App)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Fully Automated Deployment..." -ForegroundColor Green

# --- Step 1: Git Push ---
Write-Host "`n📦 Step 1: Backing up code to GitHub..." -ForegroundColor Cyan
try {
    git add .
    $commitMessage = "Auto-update: $(Get-Date)"
    Write-Host "Commit Message: $commitMessage"
    git commit -m "$commitMessage"
    git push origin main
    Write-Host "✅ Code pushed to GitHub successfully." -ForegroundColor Green
} catch {
    Write-Host "⚠️  Git push skipped or failed (No changes?)" -ForegroundColor Yellow
}

# --- Step 2: Vercel Deploy ---
Write-Host "`n🌍 Step 2: Deploying to Vercel..." -ForegroundColor Cyan
try {
    # --prod triggers a production deployment
    # --yes skips the confirmation prompts
    npx vercel --prod --yes
    Write-Host "`n✅ Successfully Deployed to Production!" -ForegroundColor Green
} catch {
    Write-Host "`n❌ Vercel Deployment Failed." -ForegroundColor Red
    Write-Error $_
}

Write-Host "`n🎉 All Done! Your app is live." -ForegroundColor Green
"REMINDER: Set Environment Variables in Vercel Dashboard (OPENAI_API_KEY, etc.)"
