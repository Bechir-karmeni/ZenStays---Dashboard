# Zenstays - STR Management System

## Complete Project Documentation

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Backend Setup](#4-backend-setup)
5. [Frontend Setup](#5-frontend-setup)
6. [Database Models](#6-database-models)
7. [API Endpoints](#7-api-endpoints)
8. [Authentication System](#8-authentication-system)
9. [User Roles & Permissions](#9-user-roles--permissions)
10. [Frontend Pages](#10-frontend-pages)
11. [Component Architecture](#11-component-architecture)
12. [Admin Guide](#12-admin-guide)
13. [Client Guide](#13-client-guide)
14. [Troubleshooting](#14-troubleshooting)
15. [Deployment](#15-deployment)

---

## 1. Project Overview

**Zenstays** is a Short-Term Rental (STR) management system designed to help property managers track performance metrics, manage clients, and monitor rental properties.

### Key Features

- **Admin Dashboard**: Comprehensive analytics with KPIs for revenue, occupancy, and booking metrics
- **Client Management**: Invite clients via email, manage client accounts
- **Role-Based Access**: Admin and Client roles with different permissions
- **Performance Tracking**: Revenue KPIs, occupancy rates, ADR, RevPAR, and more
- **Scheduling**: Calendar-based scheduling system

### System Architecture

```
┌─────────────────┐     HTTP/REST      ┌─────────────────┐
│                 │ ◄───────────────► │                 │
│  React Frontend │                    │  Django Backend │
│  (Port 5173)    │                    │  (Port 8000)    │
│                 │                    │                 │
└─────────────────┘                    └────────┬────────┘
                                                │
                                                ▼
                                       ┌─────────────────┐
                                       │    SQLite DB    │
                                       │  (db.sqlite3)   │
                                       └─────────────────┘
```

---

## 2. Technology Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.10+ | Programming language |
| Django | 4.2+ | Web framework |
| Django REST Framework | 3.14+ | REST API |
| Simple JWT | 5.0+ | JWT authentication |
| SQLite | 3 | Database |
| django-cors-headers | 4.0+ | CORS handling |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool |
| React Router | 6+ | Routing |
| Lucide React | - | Icons |
| Recharts | - | Charts |
| React Toastify | - | Notifications |

---

## 3. Project Structure

### Backend Structure
```
backend-master/
├── accounts/                 # User management app
│   ├── __init__.py
│   ├── admin.py             # Django admin config
│   ├── apps.py              # App config
│   ├── models.py            # User & Invite models
│   ├── serializers.py       # DRF serializers
│   ├── urls.py              # URL routes
│   ├── views.py             # API views
│   └── migrations/          # Database migrations
├── core/                     # Project settings
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Main URL config
│   └── wsgi.py
├── db.sqlite3               # SQLite database
├── manage.py                # Django CLI
└── requirements.txt         # Python dependencies
```

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   └── Sidebar.css
│   ├── pages/
│   │   ├── AcceptInvite.jsx # Client invitation page
│   │   ├── AuthPages.css    # Auth styles
│   │   ├── Dashboard.jsx    # Admin dashboard
│   │   ├── Dashboard.css
│   │   ├── Employees.jsx    # Client management
│   │   ├── LandingPage.jsx  # Public landing page
│   │   ├── LoginPage.jsx    # Login page
│   │   ├── MyAssessments.jsx # Client dashboard
│   │   ├── Profile.jsx      # User profile
│   │   └── Scheduling.jsx   # Calendar/scheduling
│   ├── App.jsx              # Main app component
│   ├── App.css
│   └── main.jsx             # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 4. Backend Setup

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)

### Installation Steps

```powershell
# 1. Navigate to backend directory
cd backend-master

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows PowerShell:
.\venv\Scripts\Activate
# Windows CMD:
venv\Scripts\activate.bat
# Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run migrations
python manage.py migrate

# 6. Create admin account
python manage.py shell
```

In the Python shell:
```python
from accounts.models import User

admin = User.objects.create_user(
    email="admin@zenstays.com",
    password="admin123456",
    first_name="Admin",
    last_name="Zenstays",
    role="ADMIN"
)
print(f"Admin created: {admin.email}")
exit()
```

```powershell
# 7. Run the server
python manage.py runserver
```

The backend will be available at: `http://127.0.0.1:8000`

### Backend Configuration

**settings.py** key configurations:
```python
# Custom User Model
AUTH_USER_MODEL = "accounts.User"

# JWT Settings
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# CORS - Allow all origins (development only)
CORS_ALLOW_ALL_ORIGINS = True
```

---

## 5. Frontend Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation Steps

```powershell
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The frontend will be available at: `http://localhost:5173`

### Environment Configuration

The API base URL is configured in each component:
```javascript
const API_BASE = "http://localhost:8000";
```

For production, update this to your production API URL.

---

## 6. Database Models

### User Model

| Field | Type | Description |
|-------|------|-------------|
| id | BigAutoField | Primary key |
| email | EmailField | Unique, used for login |
| password | CharField | Hashed password |
| first_name | CharField | User's first name |
| last_name | CharField | User's last name |
| role | CharField | "ADMIN" or "CLIENT" |
| phone | CharField | Phone number (optional) |
| location | CharField | Location (optional) |
| bio | TextField | Biography (optional) |
| join_date | DateField | Account creation date |
| is_active | BooleanField | Account status |

**Role Choices:**
```python
class Roles(models.TextChoices):
    ADMIN = "ADMIN", "Admin"
    CLIENT = "CLIENT", "Client"
```

### Invite Model

| Field | Type | Description |
|-------|------|-------------|
| id | UUIDField | Primary key (used as token) |
| email | EmailField | Invited email address |
| first_name | CharField | Pre-filled first name |
| last_name | CharField | Pre-filled last name |
| created_by | ForeignKey | Admin who created invite |
| is_accepted | BooleanField | Whether invite was used |
| created_at | DateTimeField | Creation timestamp |

---

## 7. API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login/` | Login, returns JWT tokens | No |
| POST | `/api/auth/refresh/` | Refresh access token | No |
| GET | `/api/auth/me/` | Get current user profile | Yes |
| PATCH | `/api/auth/me/` | Update current user profile | Yes |

### Invitations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/invites/` | Create new invitation | Yes (Admin) |
| POST | `/api/invites/accept/` | Accept invitation | No |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/` | List all users | Yes (Admin) |
| DELETE | `/api/users/{id}/` | Delete a user | Yes (Admin) |

### Request/Response Examples

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
    "email": "admin@zenstays.com",
    "password": "admin123456"
}
```

Response:
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1..."
}
```

#### Create Invite
```http
POST /api/invites/
Authorization: Bearer {access_token}
Content-Type: application/json

{
    "email": "client@example.com",
    "first_name": "John",
    "last_name": "Doe"
}
```

Response:
```json
{
    "id": "ea0d2c9b-0d18-4a7b-8e95-95028e47ef57",
    "email": "client@example.com",
    "first_name": "John",
    "last_name": "Doe"
}
```

#### Accept Invite
```http
POST /api/invites/accept/
Content-Type: application/json

{
    "token": "ea0d2c9b-0d18-4a7b-8e95-95028e47ef57",
    "password": "securepassword123",
    "first_name": "John",
    "last_name": "Doe"
}
```

Response:
```json
{
    "email": "client@example.com"
}
```

#### Get User Profile
```http
GET /api/auth/me/
Authorization: Bearer {access_token}
```

Response:
```json
{
    "id": 1,
    "email": "admin@zenstays.com",
    "first_name": "Admin",
    "last_name": "Zenstays",
    "role": "ADMIN",
    "phone": "",
    "location": "",
    "bio": "",
    "join_date": "2026-02-02"
}
```

---

## 8. Authentication System

### JWT Token Flow

```
┌────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                      │
└────────────────────────────────────────────────────────────────┘

1. LOGIN
   Client                              Server
     │                                   │
     │  POST /api/auth/login/            │
     │  {email, password}                │
     │ ─────────────────────────────────►│
     │                                   │
     │  {access_token, refresh_token}    │
     │ ◄─────────────────────────────────│
     │                                   │

2. AUTHENTICATED REQUEST
     │                                   │
     │  GET /api/users/                  │
     │  Authorization: Bearer {access}   │
     │ ─────────────────────────────────►│
     │                                   │
     │  [user data]                      │
     │ ◄─────────────────────────────────│
     │                                   │

3. TOKEN REFRESH (when access expires)
     │                                   │
     │  POST /api/auth/refresh/          │
     │  {refresh_token}                  │
     │ ─────────────────────────────────►│
     │                                   │
     │  {new_access_token}               │
     │ ◄─────────────────────────────────│
```

### Token Storage (Frontend)

Tokens are stored in localStorage:
```javascript
localStorage.setItem("access", tokens.access);
localStorage.setItem("refresh", tokens.refresh);
localStorage.setItem("me", JSON.stringify(userProfile));
```

### Making Authenticated Requests

```javascript
const access = localStorage.getItem("access");
const response = await fetch(`${API_BASE}/api/users/`, {
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access}`
    }
});
```

---

## 9. User Roles & Permissions

### Role Comparison

| Feature | Admin | Client |
|---------|-------|--------|
| Login | ✅ | ✅ |
| View own profile | ✅ | ✅ |
| Edit own profile | ✅ | ✅ |
| View Admin Dashboard | ✅ | ❌ |
| View Client Dashboard | ❌ | ✅ |
| Create invitations | ✅ | ❌ |
| View all users | ✅ | ❌ |
| Delete users | ✅ | ❌ |
| Access Client Management | ✅ | ❌ |
| Access Scheduling | ✅ | ❌ |

### Permission Implementation

Backend permission class:
```python
class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        role = getattr(request.user, "role", "")
        return role in ["ADMIN", "admin", "HR", "hr"]
```

Frontend role check:
```javascript
const storedUser = JSON.parse(localStorage.getItem("me") || "{}");
const role = storedUser.role || "CLIENT";
const isAdmin = role === "ADMIN" || role === "admin" || role === "HR";
```

---

## 10. Frontend Pages

### Public Pages (No Auth Required)

| Page | Route | Description |
|------|-------|-------------|
| Landing Page | `/` | Public homepage |
| Login | `/login` | User login |
| Accept Invite | `/accept-invite?token=xxx` | Client registration |

### Admin Pages (Admin Only)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | STR performance analytics |
| Client Management | `/employees` | Manage clients |
| Scheduling | `/scheduling` | Calendar and scheduling |
| Profile | `/profile` | Edit admin profile |

### Client Pages (Client Only)

| Page | Route | Description |
|------|-------|-------------|
| My Dashboard | `/my-assessments` | Client's personal dashboard |
| Profile | `/profile` | Edit client profile |

---

## 11. Component Architecture

### Sidebar Component

The sidebar dynamically shows menu items based on user role:

```jsx
// Admin menu
const adminMenu = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/employees", label: "Client Management", icon: Users },
    { path: "/scheduling", label: "Scheduling", icon: Calendar },
];

// Client menu
const clientMenu = [
    { path: "/my-assessments", label: "Dashboard", icon: Home }
];

// Select based on role
const menuItems = isAdmin ? adminMenu : clientMenu;
```

### Dashboard Component

The admin dashboard displays STR performance metrics:

**KPI Categories:**
1. **Revenue KPIs**: Total Revenue, YTD Revenue, MTD Revenue, Gross Profit, Margins
2. **Occupancy KPIs**: Avg Occupancy, ADR, RevPAN, RevPAR, Avg LOS, Cancel Rate

**Charts:**
- Revenue & Profit Trend (Bar Chart)
- Revenue by Area (Pie Chart)
- Occupancy Trend (Line Chart)
- Revenue by Property (Bar Chart)

### Client Management Component

Features:
- Search users by name/email
- Filter by role (Admin/Client)
- View user details
- Delete users
- Create new invitations

---

## 12. Admin Guide

### First Time Setup

1. **Start the backend server**
   ```powershell
   cd backend-master
   .\venv\Scripts\Activate
   python manage.py runserver
   ```

2. **Start the frontend server**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Login as Admin**
   - Go to `http://localhost:5173/login`
   - Email: `admin@zenstays.com`
   - Password: `admin123456`

### Inviting a New Client

1. Navigate to **Client Management** from the sidebar
2. Click **"+ Add Client"** button
3. Fill in the client's:
   - Email address (required)
   - First name (optional)
   - Last name (optional)
4. Click **"Create Invite"**
5. Copy the generated invite link
6. Send the link to the client via email

### Managing Clients

**View Client Details:**
- Click the **"View"** button next to any client

**Delete a Client:**
1. Click the **"Delete"** button next to the client
2. Confirm the deletion in the modal
3. The client account will be permanently removed

**Search & Filter:**
- Use the search bar to find clients by name or email
- Use the dropdown to filter by role (All/Admin/Client)

---

## 13. Client Guide

### Accepting an Invitation

1. You will receive an invitation link from the admin
2. Click the link or paste it in your browser
3. Fill in the registration form:
   - First name (optional, may be pre-filled)
   - Last name (optional, may be pre-filled)
   - Password (minimum 8 characters)
   - Confirm password
4. Click **"Activate Account"**
5. You will be redirected to the login page

### Logging In

1. Go to `http://localhost:5173/login`
2. Enter your email address (the one invited)
3. Enter your password
4. Click **"Sign In"**
5. You will be redirected to your dashboard

### Using the Client Dashboard

The client dashboard shows your personalized STR metrics:
- Total Revenue
- Owner Payout
- Occupancy Rate
- Properties count
- Recent bookings

---

## 14. Troubleshooting

### Common Issues

#### "Invalid or already used invite token"

**Causes:**
- The invite link has already been used
- The invite token in the URL is incorrect
- The database was reset after the invite was created

**Solutions:**
1. Ask the admin to create a new invitation
2. Verify the complete token is in the URL
3. Check if the invite exists:
   ```powershell
   python manage.py shell
   ```
   ```python
   from accounts.models import Invite
   for inv in Invite.objects.all():
       print(f"ID: {inv.id}, Email: {inv.email}, Used: {inv.is_accepted}")
   exit()
   ```

#### "Failed to delete user" (FOREIGN KEY constraint)

**Cause:** The user has created invitations that reference them.

**Solution:** Update `views.py` to delete related invites first:
```python
def destroy(self, request, *args, **kwargs):
    instance = self.get_object()
    # Delete invites created by this user first
    Invite.objects.filter(created_by=instance).delete()
    self.perform_destroy(instance)
    return Response(status=status.HTTP_204_NO_CONTENT)
```

#### Sidebar not showing all menu items

**Cause:** The user's role is not being recognized.

**Solution:**
1. Logout and login again
2. Check localStorage:
   ```javascript
   console.log(JSON.parse(localStorage.getItem("me")));
   ```
3. Verify the role is "ADMIN" or "HR" (case-sensitive check in sidebar)

#### CORS Errors

**Cause:** Backend not allowing frontend origin.

**Solution:** Ensure `settings.py` has:
```python
CORS_ALLOW_ALL_ORIGINS = True
```

#### Token Expired

**Symptoms:** API returns 401 Unauthorized after some time.

**Solution:** 
1. Implement token refresh in frontend
2. Or simply logout and login again

### Checking Database State

```powershell
python manage.py shell
```

```python
# List all users
from accounts.models import User
for u in User.objects.all():
    print(f"ID: {u.id}, Email: {u.email}, Role: {u.role}")

# List all invites
from accounts.models import Invite
for inv in Invite.objects.all():
    print(f"ID: {inv.id}, Email: {inv.email}, Used: {inv.is_accepted}")

exit()
```

### Reset Database

If you need to start fresh:

```powershell
# 1. Delete the database
del db.sqlite3

# 2. Run migrations
python manage.py migrate

# 3. Create admin account
python manage.py shell
```

```python
from accounts.models import User
User.objects.create_user(
    email="admin@zenstays.com",
    password="admin123456",
    first_name="Admin",
    last_name="Zenstays",
    role="ADMIN"
)
exit()
```

---

## 15. Deployment

### Production Checklist

#### Backend

1. **Update settings.py:**
   ```python
   DEBUG = False
   SECRET_KEY = "your-secure-secret-key"
   ALLOWED_HOSTS = ["your-domain.com"]
   CORS_ALLOWED_ORIGINS = ["https://your-frontend-domain.com"]
   ```

2. **Use PostgreSQL instead of SQLite:**
   ```python
   DATABASES = {
       "default": {
           "ENGINE": "django.db.backends.postgresql",
           "NAME": "zenstays_db",
           "USER": "your_user",
           "PASSWORD": "your_password",
           "HOST": "localhost",
           "PORT": "5432",
       }
   }
   ```

3. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

4. **Use a production server (Gunicorn):**
   ```bash
   pip install gunicorn
   gunicorn core.wsgi:application --bind 0.0.0.0:8000
   ```

#### Frontend

1. **Update API_BASE in all components:**
   ```javascript
   const API_BASE = "https://api.your-domain.com";
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder to:**
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Any static hosting

### Docker Deployment (Optional)

**Dockerfile for Backend:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**Dockerfile for Frontend:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Appendix

### Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@zenstays.com |
| Password | admin123456 |

⚠️ **Change these in production!**

### Useful Commands

```powershell
# Backend
python manage.py runserver          # Start server
python manage.py migrate            # Run migrations
python manage.py makemigrations     # Create migrations
python manage.py createsuperuser    # Create Django admin user
python manage.py shell              # Python shell with Django

# Frontend
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run preview                     # Preview production build
```

### API Quick Reference

| Action | Method | Endpoint |
|--------|--------|----------|
| Login | POST | `/api/auth/login/` |
| Refresh Token | POST | `/api/auth/refresh/` |
| Get Profile | GET | `/api/auth/me/` |
| Update Profile | PATCH | `/api/auth/me/` |
| Create Invite | POST | `/api/invites/` |
| Accept Invite | POST | `/api/invites/accept/` |
| List Users | GET | `/api/users/` |
| Delete User | DELETE | `/api/users/{id}/` |

---

**Documentation Version:** 1.0  
**Last Updated:** February 2026  
**Project:** Zenstays STR Management System
