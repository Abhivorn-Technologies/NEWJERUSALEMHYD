# NEWJERUSALEMHYD

A modern, dynamic web application and admin panel for New Jerusalem Church Hyderabad.

## Project Structure

This project is a monorepo consisting of:
- **`backend/`**: A Django-based REST API providing the single source of truth for the application content. It serves site settings, navigation items, hero banners, beliefs, Bible resources, stories, activities, and Telugu songs with category-based routing.
- **`frontend/`**: A premium, highly interactive Next.js application built with TypeScript, React, and custom Tailwind/CSS styling, optimized for visual excellence, responsiveness, and fluid animations.
- **`admin-panel/`**: A Next.js-based administration portal for church admins and content moderators.

## Tech Stack

### Backend
- **Framework**: Django & Django REST Framework
- **Database**: SQLite3 (Local development)
- **API Architecture**: Modular REST endpoints (`/api/`)

### Frontend & Admin Panel
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS, Modern Typography, Tailored palettes

## Setup & Running Locally

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Activate virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`
3. Install dependencies and run migrations:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```
4. Start the Django dev server:
   ```bash
   python manage.py runserver
   ```

### Frontend & Admin Panel
1. Navigate to `frontend` or `admin-panel`:
   ```bash
   cd frontend   # or cd admin-panel
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

## Key Features

- **Dynamic Navigation**: Navbar and Footer are fetched dynamically from the Django backend.
- **Telugu Song Book**: High-performance song library supporting Telugu alphabet indexes, custom sorting, categories, and fast responsive filtering.
- **Responsive Layout**: Fluid experience optimized across standard desktop, tablet, and mobile screens.
