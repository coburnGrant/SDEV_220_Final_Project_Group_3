# Warehouse Management System

A full-stack warehouse management system built with Django and React.

## Setup Instructions

### Backend (Django) Setup

1. Create and activate a Python virtual environment:
    - ```bash
        # Navigate to backend directory
        cd backend

        # Create virtual environment
        python -m venv env

        # Activate virtual environment
        # For Windows:
        env\Scripts\activate
        # For macOS/Linux:
        source env/bin/activate
        ```
2. Install Python dependencies:
    - ```bash
        pip install -r requirements.txt
        ```

3. Run database migrations:
    - ```bash
        python manage.py migrate
        ```

4. Create an admin superuser:
    - ```bash
        python manage.py createsuperuser
        ```

5. Start the Django development server:
    - ```bash
        python manage.py runserver
        ```
        - The backend will be running at `http://localhost:8000`

### Frontend (React) Setup

1. Ensure Node.js is installed
    - Check for installation by checking the version of node installed:
        - ```bash
            node -v
            ```
    - Check for installation of node package manager:
        - ```bash
            npm -v
            ```
    - To install node visit: https://nodejs.org/en/download

2. Navigate to frontend directory:
    - ```bash
        cd frontend
        ```

3. Install Node dependencies:
    - ```bash
        npm install
        ```

4. Start the front-end development server:
    - ```bash
        npm run dev
        ```

The frontend will be running at `http://localhost:5173`

## Updating Dependencies

### Backend Dependencies
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

### Frontend Dependencies
To update all frontend dependencies:
```bash
cd frontend
npm update
```

## API Endpoints

### Swagger
- Full API documentation and endpoints are automatically generated with each build 
    - Can be found at `/redocs` to get full documentation with examples
    - Can be found at `/swagger` to use swagger to explore and test API endpoints

## Development Notes

- Backend uses Django REST framework with JWT authentication
- Frontend uses React with Vite
- Make sure both backend and frontend servers are running for full functionality
- Admin interface available at `http://localhost:8000/admin/`