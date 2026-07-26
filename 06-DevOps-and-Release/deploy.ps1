$ErrorActionPreference = "Stop"

$ProjectRoot = "C:\Obsidian\New\Projects\08-iGraSpore_V2"
$DeployRepo = "$ProjectRoot\06-DevOps-and-Release\deploy-repo"
$SourceIndex = "$ProjectRoot\index.html"
$DestIndex = "$DeployRepo\index.html"

Write-Host "Checking if deploy-repo worktree exists..."
if (-not (Test-Path "$DeployRepo\.git")) {
    Write-Host "Deploy repo not found. Initializing worktree..."
    cd $ProjectRoot
    git fetch origin
    git worktree add $DeployRepo origin/main
}

Write-Host "Copying index.html..."
Copy-Item $SourceIndex -Destination $DestIndex -Force

Write-Host "Copying 04-Src..."
Copy-Item "$ProjectRoot\04-Src" -Destination "$DeployRepo\" -Recurse -Force

cd $DeployRepo

$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected. Committing and pushing..."
    git add index.html 04-Src
    git commit -m "Auto-deploy: Update game files"
    git push origin main
    Write-Host "Deploy successful!"
} else {
    Write-Host "No changes to deploy."
}
