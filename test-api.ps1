# ============================================================
# SMART API GUARD - AUTOMATED API TESTS
# Compatible with Windows PowerShell
# ============================================================

$BaseUrl = "https://smart-api-guard-1.onrender.com"

$ValidKey = "PSAG-PAVAN-8F42-XK91"
$InvalidKey = "WRONG-KEY"
$InactiveKey = "SAG-D2ayyL5TTQScHZ7dRJ5WuYiFV24Vr12X"

$Passed = 0
$Failed = 0

# ============================================================
# TEST FUNCTION
# ============================================================

function Test-Api {

    param (
        [string]$Name,
        [string]$Url,
        [string]$ApiKey,
        [int]$ExpectedStatus
    )

    Write-Host ""
    Write-Host "------------------------------------------------------------"
    Write-Host "TEST: $Name"
    Write-Host "------------------------------------------------------------"

    try {

        # ----------------------------------------------------
        # Build curl command
        # ----------------------------------------------------

        if ([string]::IsNullOrWhiteSpace($ApiKey)) {

            $output = & curl.exe `
                -s `
                -i `
                $Url 2>&1

        }
        else {

            $output = & curl.exe `
                -s `
                -i `
                -H "X-API-KEY: $ApiKey" `
                $Url 2>&1
        }

        # ----------------------------------------------------
        # Convert output to string
        # ----------------------------------------------------

        $responseText = $output -join "`n"

        # ----------------------------------------------------
        # Extract HTTP status
        # ----------------------------------------------------

        $statusMatch =
            [regex]::Match(
                $responseText,
                'HTTP/\d(?:\.\d)?\s+(\d{3})'
            )

        if (-not $statusMatch.Success) {

            Write-Host "RESULT   : FAIL" -ForegroundColor Red
            Write-Host "ERROR    : Could not determine HTTP status." -ForegroundColor Red
            Write-Host $responseText

            $script:Failed++
            return
        }

        $actualStatus =
            [int]$statusMatch.Groups[1].Value

        # ----------------------------------------------------
        # Print status
        # ----------------------------------------------------

        Write-Host "Expected : $ExpectedStatus"
        Write-Host "Actual   : $actualStatus"

        # ----------------------------------------------------
        # Check result
        # ----------------------------------------------------

        if ($actualStatus -eq $ExpectedStatus) {

            Write-Host "RESULT   : PASS" -ForegroundColor Green

            $script:Passed++

        }
        else {

            Write-Host "RESULT   : FAIL" -ForegroundColor Red

            $script:Failed++
        }

        # ----------------------------------------------------
        # Extract JSON body
        # ----------------------------------------------------

        $jsonStart =
            $responseText.IndexOf("{")

        if ($jsonStart -ge 0) {

            $body =
                $responseText.Substring(
                    $jsonStart
                )

            Write-Host "Response :"
            Write-Host $body
        }

    }
    catch {

        Write-Host "RESULT   : FAIL" -ForegroundColor Red
        Write-Host "ERROR    : $($_.Exception.Message)" -ForegroundColor Red

        $script:Failed++
    }
}

# ============================================================
# TEST 1
# VALID API KEY
# ============================================================

Test-Api `
    -Name "Valid API Key" `
    -Url "$BaseUrl/api/keys/validate" `
    -ApiKey $ValidKey `
    -ExpectedStatus 200


# ============================================================
# TEST 2
# INVALID API KEY
# ============================================================

Test-Api `
    -Name "Invalid API Key" `
    -Url "$BaseUrl/api/keys/validate" `
    -ApiKey $InvalidKey `
    -ExpectedStatus 401


# ============================================================
# TEST 3
# INACTIVE API KEY
# ============================================================

Test-Api `
    -Name "Inactive API Key" `
    -Url "$BaseUrl/api/keys/validate" `
    -ApiKey $InactiveKey `
    -ExpectedStatus 401


# ============================================================
# TEST 4
# MISSING API KEY
# ============================================================

Test-Api `
    -Name "Missing API Key" `
    -Url "$BaseUrl/api/usage/stats" `
    -ApiKey "" `
    -ExpectedStatus 401


# ============================================================
# TEST 5
# USAGE STATS
# ============================================================

Test-Api `
    -Name "Usage Stats" `
    -Url "$BaseUrl/api/usage/stats" `
    -ApiKey $ValidKey `
    -ExpectedStatus 200


# ============================================================
# TEST 6
# RECENT USAGE
# ============================================================

Test-Api `
    -Name "Recent Usage" `
    -Url "$BaseUrl/api/usage/recent" `
    -ApiKey $ValidKey `
    -ExpectedStatus 200


# ============================================================
# TEST 7
# ANALYTICS
# ============================================================

Test-Api `
    -Name "Analytics" `
    -Url "$BaseUrl/api/usage/analytics" `
    -ApiKey $ValidKey `
    -ExpectedStatus 200


# ============================================================
# TEST 8
# NON-EXISTENT ENDPOINT
# ============================================================

Test-Api `
    -Name "Non-existent Endpoint" `
    -Url "$BaseUrl/api/does-not-exist" `
    -ApiKey $ValidKey `
    -ExpectedStatus 404


# ============================================================
# FINAL SUMMARY
# ============================================================

Write-Host ""
Write-Host ""
Write-Host "============================================================"
Write-Host "SMART API GUARD TEST SUMMARY"
Write-Host "============================================================"

Write-Host "PASSED : $Passed" -ForegroundColor Green
Write-Host "FAILED : $Failed" -ForegroundColor Red

Write-Host "============================================================"

if ($Failed -eq 0) {

    Write-Host ""
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""

}
else {

    Write-Host ""
    Write-Host "SOME TESTS FAILED." -ForegroundColor Red
    Write-Host ""
}
# ============================================================
# RATE LIMIT TEST
# ============================================================

Write-Host ""
Write-Host "============================================================"
Write-Host "RATE LIMIT TEST"
Write-Host "============================================================"

$RateLimitPassed = $false
$RateLimitResponse = ""

Write-Host "Sending requests with PRO API key..."
Write-Host "Expected limit: 100 requests"
Write-Host ""

for ($i = 1; $i -le 105; $i++) {

    $response = & curl.exe `
        -s `
        -i `
        -H "X-API-KEY: $ValidKey" `
        "$BaseUrl/api/test" 2>&1

    $responseText = $response -join "`n"

    $statusMatch =
        [regex]::Match(
            $responseText,
            'HTTP/\d(?:\.\d)?\s+(\d{3})'
        )

    if ($statusMatch.Success) {

        $status =
            [int]$statusMatch.Groups[1].Value

        if ($status -eq 429) {

            Write-Host ""
            Write-Host "429 RATE LIMIT RECEIVED!" -ForegroundColor Green
            Write-Host "Request number: $i"

            $limitMatch =
                [regex]::Match(
                    $responseText,
                    'X-RateLimit-Limit:\s*(\d+)'
                )

            $remainingMatch =
                [regex]::Match(
                    $responseText,
                    'X-RateLimit-Remaining:\s*(\d+)'
                )

            $tierMatch =
                [regex]::Match(
                    $responseText,
                    'X-API-Tier:\s*(.+)'
                )

            if ($limitMatch.Success) {
                Write-Host "Rate Limit : $($limitMatch.Groups[1].Value)"
            }

            if ($remainingMatch.Success) {
                Write-Host "Remaining  : $($remainingMatch.Groups[1].Value)"
            }

            if ($tierMatch.Success) {
                Write-Host "Tier       : $($tierMatch.Groups[1].Value.Trim())"
            }

            $RateLimitPassed = $true
            $RateLimitResponse = $responseText

            break
        }

        Write-Host "Request $i -> HTTP $status"
    }
}

Write-Host ""

if ($RateLimitPassed) {

    Write-Host "RATE LIMIT TEST: PASS" -ForegroundColor Green
    $Passed++

}
else {

    Write-Host "RATE LIMIT TEST: FAIL" -ForegroundColor Red
    Write-Host "No HTTP 429 received after 105 requests."
    $Failed++
}

# ============================================================
# FINAL SUMMARY
# ============================================================

Write-Host ""
Write-Host ""
Write-Host "============================================================"
Write-Host "FINAL SMART API GUARD TEST SUMMARY"
Write-Host "============================================================"

Write-Host "PASSED : $Passed" -ForegroundColor Green
Write-Host "FAILED : $Failed" -ForegroundColor Red

Write-Host "============================================================"

if ($Failed -eq 0) {

    Write-Host ""
    Write-Host "ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""

}
else {

    Write-Host ""
    Write-Host "SOME TESTS FAILED." -ForegroundColor Red
    Write-Host ""
}