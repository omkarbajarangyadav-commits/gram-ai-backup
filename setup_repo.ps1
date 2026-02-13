# Setup GitHub Repository
echo "Initializing Git Repository..."

# 1. Initialize Git if not already done
if (!(Test-Path .git)) {
    git init
}

# 2. Rename default branch to main
git branch -M main

# 3. Add all files
git add .

# 4. Commit
git commit -m "feat: Professional Engineering Setup with Supabase & CI/CD"

echo "---------------------------------------------------"
echo "To push to GitHub, create a new repo at https://github.net/new"
echo "Then run:"
echo "git remote add origin https://github.com/YOUR_USERNAME/smart-farm.git"
echo "git push -u origin main"
echo "---------------------------------------------------"
