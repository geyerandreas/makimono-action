# makimono-action

A GitHub Action that automatically updates your release notes or changelog with the newest Pull Request information, powered by `@qbitone/makimono`.

## Usage

Create a workflow file in your repository (e.g., `.github/workflows/update-changelog.yml`):

```yaml
name: Update Changelog

on:
  pull_request:
    types: [closed] # Run when a PR is merged

jobs:
  update-notes:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    
    # REQUIRED: Allow the workflow to push commits back to your repository
    permissions:
      contents: write
      
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6
          
      - name: Update Release Notes
        uses: geyerandreas/makimono-action@v0.1.0
```

## Important: Push Permissions

Since this action automatically modifies, commits, and pushes changes to your changelog file, the workflow **must** be granted write access. 

```yml
permissions:
  contents: write
```