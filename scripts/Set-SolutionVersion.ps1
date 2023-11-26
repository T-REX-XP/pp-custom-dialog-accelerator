param(
    [string]$solutionFilePath,
    [string]$newVersion
)

# Check if solution file path and new version are provided
if (-not $solutionFilePath -or -not $newVersion) {
    Write-Host "Usage: Set-SolutionVersion.ps1 -solutionFilePath <SolutionFilePath> -newVersion <NewVersion>"
    exit 1
}

# Load the solution.xml content
try {
    [xml]$solutionXml = Get-Content -Path $solutionFilePath
} catch {
    Write-Error "Error loading solution.xml: $_"
    exit 1
}

# Update the version
$solutionXml.solution.version = $newVersion

# Save the modified XML back to the solution.xml file
try {
    $solutionXml.Save($solutionFilePath)
    Write-Host "Solution version set to $newVersion in $solutionFilePath"
} catch {
    Write-Error "Error saving modified solution.xml: $_"
    exit 1
}
