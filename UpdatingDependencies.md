# Updating Dependencies

## Backend Dependencies
To update all backend dependencies to their latest versions:
```bash
cd backend
python update_deps.py
```

This script will:
- Update pip to the latest version
- Update all installed packages
- Ensure test dependencies are installed
- Generate a new requirements.txt with latest versions

## Frontend Dependencies
To update all frontend dependencies:
```bash
cd frontend
npm update
```