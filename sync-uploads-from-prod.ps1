param(
  [string]$ProdUploadsBase = "https://visiteapihub.duckdns.org/uploads",
  [string]$UploadsDir = "visiteapihub.duckdns.org/uploads",
  [string]$MysqlContainer = "VisiteHub-db-new",
  [string]$MysqlUser = "root",
  [string]$MysqlPassword = "NewSecurePassword2025!",
  [string]$MysqlDatabase = "exped360_db",
  [int]$MaxDownloads = 0
)

$ErrorActionPreference = "Stop"

function Get-FilenamesFromValue([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return @() }
  $v = $value.Trim()

  # Common bad strings
  if ($v -eq "null" -or $v -eq "undefined") { return @() }

  # JSON arrays sometimes land in text columns
  if ($v.StartsWith("[")) {
    try {
      $arr = $v | ConvertFrom-Json
      $out = @()
      foreach ($item in $arr) {
        if ($item -is [string]) { $out += (Get-FilenamesFromValue $item) }
      }
      return $out
    } catch {
      # fall through
    }
  }

  # Absolute or relative uploads paths
  if ($v -match "/uploads/([^\?\#]+)") {
    return @($Matches[1])
  }

  # Bare filename
  if ($v -match "^[^/\\?#]+\.(png|jpe?g|webp|gif|svg)$") {
    return @($v)
  }

  return @()
}

if (-not (Test-Path $UploadsDir)) {
  New-Item -ItemType Directory -Path $UploadsDir -Force | Out-Null
}

$sql = @"
SELECT logo AS v FROM agences WHERE logo IS NOT NULL AND logo <> ''
UNION ALL SELECT coverImage FROM agences WHERE coverImage IS NOT NULL AND coverImage <> ''
UNION ALL SELECT logo FROM promoteurs WHERE logo IS NOT NULL AND logo <> ''
UNION ALL SELECT coverImage FROM promoteurs WHERE coverImage IS NOT NULL AND coverImage <> ''
UNION ALL SELECT coverImage FROM projects WHERE coverImage IS NOT NULL AND coverImage <> ''
UNION ALL SELECT imageUrl FROM property_images WHERE imageUrl IS NOT NULL AND imageUrl <> ''
"@

Write-Host "Querying DB for image references..."
$mysqlUserArg = ("-u{0}" -f $MysqlUser)
$mysqlPassArg = ("-p{0}" -f $MysqlPassword)
$values = docker exec $MysqlContainer mysql $mysqlUserArg $mysqlPassArg -D $MysqlDatabase -N -B -e $sql

$filenames = New-Object System.Collections.Generic.HashSet[string]
foreach ($line in $values) {
  foreach ($f in (Get-FilenamesFromValue $line)) {
    [void]$filenames.Add($f)
  }
}

$all = $filenames | Sort-Object
Write-Host ("Found {0} referenced upload files" -f $all.Count)

$missing = @()
foreach ($f in $all) {
  $dest = Join-Path $UploadsDir $f
  if (-not (Test-Path $dest)) {
    $missing += $f
  }
}

Write-Host ("Missing locally: {0}" -f $missing.Count)
if ($missing.Count -eq 0) {
  Write-Host "Nothing to download."
  exit 0
}

$downloaded = 0
foreach ($f in $missing) {
  if ($MaxDownloads -gt 0 -and $downloaded -ge $MaxDownloads) {
    Write-Host "Reached MaxDownloads limit."
    break
  }

  $url = ($ProdUploadsBase.TrimEnd('/')) + "/" + $f
  $dest = Join-Path $UploadsDir $f

  # Ensure parent dirs exist (in case DB stored subpaths)
  $parent = Split-Path -Parent $dest
  if (-not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }

  Write-Host "Downloading $url"
  $code = curl.exe -k -L -s -o "$dest" -w "%{http_code}" "$url"
  if ($code -ne "200") {
    Remove-Item -Force "$dest" -ErrorAction SilentlyContinue
    Write-Warning "Failed ($code): $url"
    continue
  }

  $downloaded++
}

Write-Host ("Downloaded {0} files" -f $downloaded)
Write-Host "If you run Docker, restart backend to pick up new files:"
Write-Host "  docker compose restart backend"
