# CryptoTrack Setup Script for Windows
# Run this script with: .\setup.ps1

Write-Host "🚀 CryptoTrack Setup Script" -ForegroundColor Cyan
Write-Host "============================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion found`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed`n" -ForegroundColor Green

# Check for .env file
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host "`nPlease create a .env file with your NeonDB connection string:" -ForegroundColor Cyan
    Write-Host "DATABASE_URL=`"postgresql://username:password@host/database?sslmode=require`"" -ForegroundColor White
    Write-Host "COINGECKO_API_URL=`"https://api.coingecko.com/api/v3/simple/price`"`n" -ForegroundColor White
    
    $createEnv = Read-Host "Would you like to create .env file now? (y/n)"
    if ($createEnv -eq "y") {
        $dbUrl = Read-Host "Enter your NeonDB connection string"
        @"
DATABASE_URL="$dbUrl"
COINGECKO_API_URL="https://api.coingecko.com/api/v3/simple/price"
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "✅ .env file created`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Setup cannot continue without .env file" -ForegroundColor Red
        exit 1
    }
}

# Push database schema
Write-Host "🗄️  Pushing database schema..." -ForegroundColor Yellow
npm run db:push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to push database schema" -ForegroundColor Red
    Write-Host "Please check your DATABASE_URL in .env file" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Database schema created`n" -ForegroundColor Green

# Seed database
Write-Host "🌱 Seeding database with initial data..." -ForegroundColor Yellow
npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Database seeding had issues (this might be okay if already seeded)" -ForegroundColor Yellow
} else {
    Write-Host "✅ Database seeded successfully`n" -ForegroundColor Green
}

# Success message
Write-Host "`n🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================`n" -ForegroundColor Green
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev`n" -ForegroundColor White
Write-Host "Then open http://localhost:3000 in your browser`n" -ForegroundColor Cyan
Write-Host "Happy coding! 🚀" -ForegroundColor Green
