#!/bin/bash
cd /root/VisiteHub_New

echo "=== Step 1: Updating docker-compose.yml ==="
sed -i 's|http://localhost:4001|http://213.199.58.144:4001|g' docker-compose.yml

echo "=== Verification - docker-compose.yml should show 213.199.58.144:4001 ==="
grep "NEXT_PUBLIC_API_BASE_URL" docker-compose.yml

echo "=== Step 2: Fixing Backend CORS ==="
sed -i "s|'http://localhost:3002',|'http://localhost:3002',\n        'http://213.199.58.144:3002',|g" visiteapihub.duckdns.org/src/main.ts

echo "=== Step 3: Removing old frontend image ==="
docker rmi visitehub_new-frontend:latest 2>/dev/null || true

echo "=== Step 4: Rebuilding frontend (NO CACHE - this will take several minutes) ==="
docker compose build --no-cache frontend

echo "=== Step 5: Rebuilding backend ==="
docker compose build backend

echo "=== Step 6: Restarting containers ==="
docker compose up -d

echo "=== ✅ DONE! Wait 30 seconds, then visit http://213.199.58.144:3002 ==="
