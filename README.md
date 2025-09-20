# Event Booking Management System

A full-stack web application for event management and ticket booking built with React and Django. This system allows users to browse events, book tickets, and manage their bookings, while providing administrators with tools to manage events and users.

##  Features

### User Features
- **User Authentication**: Secure login and registration system
- **Event Discovery**: Browse and search available events
- **Event Details**: View comprehensive event information including date, location, price, and available seats
- **Ticket Booking**: Book tickets for events with real-time seat availability
- **Booking Management**: View and manage personal bookings
- **Booking Confirmation**: Email confirmation system for successful bookings
- **Contact System**: Contact form with email integration

### Admin Features
- **Event Management**: Create, update, and manage events
- **User Management**: Admin panel for user administration
- **Booking Oversight**: Monitor and manage all bookings
- **Database Management**: Direct database access through Django admin

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Router** - Client-side routing for single-page applications
- **Bootstrap 5.3.8** - CSS framework for responsive design
- **Axios** - HTTP client for API communication
- **EmailJS** - Email sending capabilities
- **Font Awesome** - Icon library

### Backend
- **Django 5.2.5** - Python web framework
- **Django REST Framework** - API development toolkit
- **MySQL** - Relational database management system
- **Django CORS Headers** - Cross-origin resource sharing support

### Development Tools
- **React Scripts** - Build and development tools for React
- **SQLite** - Development database (can be switched to MySQL for production)

##  Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **MySQL** (for production database)

##  Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd event-booking-system
```

### 2. Backend Setup (Django)

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Database Setup
```bash
# If using MySQL (recommended for production)
# Create a MySQL database with name as you like

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

#### Run the Backend Server
```bash
python manage.py runserver
```

The Django development server will start at `http://localhost:8000`

### 3. Frontend Setup (React)

#### Install Node Dependencies
```bash
cd ../frontend
npm install
```

#### Start the Development Server
```bash
npm start
```

The React development server will start at `http://localhost:3000`

##  Project Structure

```
event-booking-system/
├── backend/                    # Django backend
│   ├── Eventapp/              # Main Django app
│   │   ├── models.py          # Database models
│   │   ├── views.py           # API views and logic
│   │   ├── urls.py            # URL routing
│   │   ├── forms.py           # Django forms
│   │   ├── admin.py           # Admin configuration
│   │   └── Email.py           # Email functionality
│   ├── backend/               # Django project settings
│   ├── manage.py              # Django management script
│   └── db.sqlite3             # Development database
├── frontend/                  # React frontend
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Home.jsx       # Home page
│   │   │   ├── Event.jsx      # Event listing
│   │   │   ├── EventList.jsx  # Individual event details
│   │   │   ├── BookingTickets.jsx # Ticket booking
│   │   │   ├── Login.jsx      # User login
│   │   │   ├── SignUp.jsx     # User registration
│   │   │   └── ...            # Other components
│   │   ├── App.js             # Main React app
│   │   └── index.js           # React entry point
│   └── package.json           # Node dependencies
└── README.md                  # This file
```

##  API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/signup/` - User registration
- `POST /api/logout/` - User logout

### Events
- `GET /api/events/` - Get all events
- `GET /api/events/{id}/` - Get specific event details
- `POST /api/events/` - Create new event (Admin only)
- `PUT /api/events/{id}/` - Update event (Admin only)
- `DELETE /api/events/{id}/` - Delete event (Admin only)

### Bookings
- `GET /api/bookings/` - Get user bookings
- `POST /api/bookings/` - Create new booking
- `DELETE /api/bookings/{id}/` - Cancel booking

## Usage

### For Users
1. **Register/Login**: Create an account or sign in to existing account
2. **Browse Events**: Navigate to the Events section to see available events
3. **View Details**: Click on any event to see full details
4. **Book Tickets**: Select the number of seats and complete booking
5. **Confirmation**: Receive email confirmation for successful bookings

### For Administrators
1. **Access Admin Panel**: Go to `/admin` and login with superuser credentials
2. **Manage Events**: Add, edit, or remove events
3. **Monitor Bookings**: View all bookings and manage them
4. **User Management**: Manage user accounts through admin interface

##  Email Configuration

The application uses Gmail SMTP for email notifications. To set up email functionality:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Update the email settings in `backend/backend/settings.py`:
   ```python
   EMAIL_HOST_USER = 'your-email@gmail.com'
   EMAIL_HOST_PASSWORD = 'your-app-password'
   ```

##  Configuration

### Environment Variables (Backend)
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_NAME=eventbookingdb
DATABASE_USER=root
DATABASE_PASSWORD=your-password
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

### CORS Configuration
The application is configured to accept requests from `http://localhost:3000` by default. Update `CORS_ALLOWED_ORIGINS` in settings.py for different environments.
---

**Note**: This application is designed for educational and demonstration purposes. For production use, ensure proper security measures, error handling, and database optimization.
