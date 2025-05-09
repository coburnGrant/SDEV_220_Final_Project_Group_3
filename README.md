# Warehouse Management System

A full-stack warehouse management system built with Django and React.

## System Overview

For a detailed overview of the system's features and screenshots, please refer to the [System Overview Documentation](documentation/SystemOverview.md).

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

5. Populate the database with sample data (optional):
    - ```bash
        python manage.py populate_db
        ```
    This will create:
    - 20 inventory items across different categories
    - 10 shipments with various statuses
    - At least one item will be in low stock
    - All data will be cleared before new data is created

6. Start the Django development server:
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

## API Documentation/Endpoints

### Swagger
- Full API documentation and endpoints are automatically generated with each build 
    - Can be found at `/redocs` to get full documentation with examples
    - Can be found at `/swagger` to use swagger to explore and test API endpoints

## Development Notes

- Backend uses Django REST framework with JWT authentication
- Frontend uses React with Vite
- Make sure both backend and frontend servers are running for full functionality
- Admin interface available at `http://localhost:8000/admin/`

### Testing

This project uses GitHub Actions for running automated tests on our pull requests and pushes to the main branch. These actions will run tests for the backend sever and provide test coverage information. 

## Updating Dependencies

For instructions on how to keep the development dependencies up to date, refer to [Updating Dependencies](/UpdatingDependencies.md)
