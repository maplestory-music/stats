#!/bin/sh

setup_git() {
    git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
    git config --global user.name "github-actions[bot]"
}

git_commit() {
    git checkout --orphan prod
    timestamp=$(date "+%b %d %Y")
    git add top25.json
    git commit -m "GitHub Actions: $timestamp (Build $GITHUB_RUN_NUMBER)"
}

git_push() {
    git remote rm origin
    git remote add origin https://${GITHUB_TOKEN}@github.com/maplestory-music/stats.git > /dev/null 2>&1
    git push origin prod --force --quiet > /dev/null 2>&1
}

yarn report
setup_git
git_commit
git_push
