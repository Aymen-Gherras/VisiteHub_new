Param(
  [string]$ProjectRoot = "C:\Users\gherr\OneDrive\Desktop\All dev folders\VisiteHub_"
)

$ErrorActionPreference = 'Stop'

Write-Host "Resetting local DB + stack (DELETES MySQL volume db_data_new)..." -ForegroundColor Yellow

Set-Location $ProjectRoot

# Stop containers and remove volumes to get a fresh MySQL data directory
# NOTE: This will delete all DB data in db_data_new.
docker compose down -v

# Build and start everything again
# With NODE_ENV=development in .env, backend will auto-create tables via TypeORM synchronize.
docker compose up -d --build

Write-Host "Done. Current containers:" -ForegroundColor Green
docker ps

Write-Host "If backend fails, check logs:" -ForegroundColor Cyan
Write-Host "  docker logs VisiteHub-backend-new" -ForegroundColor Cyan
