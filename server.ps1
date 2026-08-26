# Robust Lightweight PowerShell HTTP Server for Sister Sneak
$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Prefixes.Add("http://127.0.0.1:$port/")

try {
    $listener.Start()
    Write-Host "Sister Sneak server started successfully at http://localhost:$port/" -ForegroundColor Green
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # CORS headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "*")
            
            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }
            
            $rawPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrEmpty($rawPath) -or $rawPath -eq "") {
                $rawPath = "index.html"
            }
            
            # Normalize path separators
            $rawPath = $rawPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
            $filePath = Join-Path $PSScriptRoot $rawPath
            
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".svg"  { "image/svg+xml" }
                    ".ico"  { "image/x-icon" }
                    default { "application/octet-stream" }
                }
                
                $response.ContentType = $contentType
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $rawPath")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
            $response.Close()
        } catch {
            Write-Host "Request warning (resuming): $_" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "Server error: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
}
