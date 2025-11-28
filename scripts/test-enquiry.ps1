$body = @{ 
    name    = 'Email Test'
    email   = 'alerts@raidenlabs.io'
    phone   = '+911234567890'
    message = 'Testing Brevo email delivery via API'
    source  = 'manual-test'
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri 'http://localhost:3000/api/enquiry' -Method POST -Body $body -ContentType 'application/json' | Select-Object -ExpandProperty Content
