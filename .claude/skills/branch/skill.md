---
name: branch
description: >-
  Creates a git branch for a Linear issue following the project convention:
  leramirezca/{issue-id-lowercase}-{slug}. Always starts from an updated develop.
---

## Branch naming convention

The format matches exactly what Linear generates in the `gitBranchName` field:

```
leramirezca/{issue-id-lowercase}-{slug-from-title}
```

Examples:
- `leramirezca/les-121-security-increase-minimum-password-length-to-8`
- `leramirezca/les-99-security-missing-zod-validation-in-api-interpret`

## Steps

### 1. Get the branch name from Linear

Use `mcp__linear-server__get_issue` with the issue ID (e.g. `LES-121`).
Read the `gitBranchName` field from the response — that is the exact name to use.
Do not generate the slug manually; trust Linear's field.

### 2. Update develop and create the branch

```bash
git checkout develop
git pull origin develop
git checkout -b {gitBranchName}
```

### 3. Confirm

Tell the user which branch they're on and which issue it will resolve.
