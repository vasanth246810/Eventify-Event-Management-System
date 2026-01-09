# Event Booking Management System

A comprehensive full-stack web application for event management and ticket booking, featuring user authentication, event discovery, booking management, and administrative controls.

## Features

### User Features
- **Secure Authentication**: User registration and login with email/password and Google OAuth integration
- **Event Discovery**: Browse available events with detailed information including date, location, pricing, and seat availability
- **Ticket Booking**: Real-time seat selection and booking with instant confirmation
- **Booking Management**: View personal booking history and manage reservations
- **Email Notifications**: Automated email confirmations for successful bookings
- **Profile Management**: User profile access and booking history tracking

### Admin Features
- **Event Management**: Create, update, and delete events with image uploads and location mapping
- **User Administration**: Manage user accounts and permissions
- **Booking Oversight**: Monitor all bookings and user activities
- **Analytics Dashboard**: View revenue analytics, user growth, and event category statistics
- **Database Management**: Direct access to Django admin interface

## Tech Stack

### Backend
- **Django 5.2.7** - High-level Python web framework
- **Django REST Framework 3.14.0** - Powerful API toolkit for building Web APIs
- **MySQL** - Relational database management system
- **Google OAuth2** - Social authentication integration
- **Email Integration** - SMTP email sending via Gmail
- **Geocoding** - Location services using Nominatim
- **CORS Support** - Cross-origin resource sharing configuration

### Frontend
- **React 19.1.1** - Modern JavaScript library for building user interfaces
- **React Router DOM 7.8.1** - Declarative routing for React applications
- **Bootstrap 5.3.8** - Responsive CSS framework
- **Axios 1.11.0** - HTTP client for API requests
- **EmailJS 4.4.1** - Client-side email sending service
- **Material-UI 7.3.6** - React components implementing Google's Material Design
- **Chart.js 4.5.1** - Simple yet flexible JavaScript charting library
- **ApexCharts 5.3.6** - Modern charting library
- **React DatePicker 9.1.0** - Date picker component
- **QRCode.react 4.2.0** - QR code generation
- **Swiper 12.0.3** - Modern mobile touch slider

## Prerequisites

- **Python 3.8+** with pip package manager
- **Node.js 14+** with npm package manager
- **MySQL Server** for database
- **Git** for version control

## Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd cleaned-repo
```

### 2. Backend Setup (Django)

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r ../requirements.txt
```

#### Environment Configuration
Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
MYSQLDATABASE=your_database_name
MYSQLUSER=your_mysql_username
MYSQLPASSWORD=your_mysql_password
MYSQLHOST=localhost
MYSQLPORT=3306
EMAIL_HOST_PASSWORD=your_gmail_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAILWAY_PUBLIC_DOMAIN=your_railway_domain (if deploying)
BASE_URL=http://localhost:8000
```

#### Database Setup
1. Create a MySQL database
2. Run migrations:
```bash
python manage.py migrate
```

#### Create Superuser (Optional)
```bash
python manage.py createsuperuser
```

#### Start Development Server
```bash
python manage.py runserver
```
Server runs at: `http://localhost:8000`

### 3. Frontend Setup (React)

#### Install Dependencies
```bash
cd ../frontend
npm install
```

#### Start Development Server
```bash
npm start
```
Server runs at: `http://localhost:3000`

## Project Structure

```
cleaned-repo/
├── backend/                          # Django backend application
│   ├── backend/                      # Django project settings
│   │   ├── settings.py              # Main configuration
│   │   ├── urls.py                  # URL routing
│   │   └── wsgi.py                  # WSGI configuration
│   ├── Eventapp/                     # Main Django app
│   │   ├── models.py                # Database models
│   │   ├── views.py                 # API views and business logic
│   │   ├── urls.py                  # App URL patterns
│   │   ├── forms.py                 # Django forms
│   │   ├── serializers.py           # DRF serializers
│   │   ├── admin.py                 # Admin interface
│   │   ├── Email.py                 # Email functionality
│   │   └── migrations/              # Database migrations
│   ├── media/                       # User uploaded files
│   ├── static/                      # Static files
│   └── manage.py                    # Django management script
├── frontend/                         # React frontend application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Event.jsx           # Event listing
│   │   │   ├── EventList.jsx       # Individual event details
│   │   │   ├── BookingTickets.jsx  # Ticket booking interface
│   │   │   ├── Login.jsx           # User login
│   │   │   ├── SignUp.jsx          # User registration
│   │   │   ├── Profile.jsx         # User profile
│   │   │   └── ...                 # Other components
│   │   ├── admin/                  # Admin panel components
│   │   │   ├── AdminLayout.jsx     # Admin layout
│   │   │   ├── pages/              # Admin pages
│   │   │   │   ├── Events.jsx      # Event management
│   │   │   │   ├── Users.jsx       # User management
│   │   │   │   ├── Booking.jsx     # Booking management
│   │   │   │   └── Commontable.js  # Reusable table component
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── routes/                 # Route definitions
│   │   ├── App.js                  # Main React app
│   │   └── index.js                # React entry point
│   └── package.json                # Node dependencies
├── requirements.txt                 # Python dependencies
└── README.md                        # This file
```

## API Endpoints

### Authentication
- `POST /api/login/` - User login
- `POST /api/signup/` - User registration
- `POST /api/logout/` - User logout
- `POST /api/auth/google/callback/` - Google OAuth callback
- `GET /api/whoami/` - Get current user info

### Events
- `GET /api/events/` - List all events
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/` - Create event (Admin)
- `PUT /api/events/{id}/` - Update event (Admin)
- `DELETE /api/events/{id}/` - Delete event (Admin)
- `GET /api/artists/` - List all artists
- `GET /api/artists/{name}/` - Get artist details with events

### Bookings
- `GET /api/profile/` - Get user bookings and profile
- `POST /api/BookingTickets/{id}/` - Book tickets for event
- `GET /api/BookedConfrimation/{id}/` - Get booking confirmation
- `GET /api/BookingDetails/` - Get all bookings (Admin)

### Admin
- `GET /api/UsersDetails/` - List all users (Admin)
- `POST /api/UsersDetails/` - Create user (Admin)
- `POST /api/UsersDetails/{id}/` - Update user (Admin)
- `GET /api/admin_analytics/` - Get analytics data (Admin)

### Utilities
- `GET /api/contact/` - Contact information
- `POST /api/filter_events/` - Filter events
- `GET /api/get_csrf_token/` - Get CSRF token

## Database Models

### UserProfile
- User authentication and profile information
- Supports both regular and Google OAuth users
- Admin role management

### Events
- Event details including title, description, date, location
- Seat management (total/available)
- Image uploads and geocoding
- Category classification

### Artists
- Artist information and images
- Associated with events through EventArtist model

### Bookingdetails
- Ticket booking records
- Links users to events with seat counts and pricing
- Unique booking IDs for tracking

### EventArtist
- Many-to-many relationship between events and artists

## Usage

### For Users
1. **Register/Login**: Create account or sign in with email/password or Google
2. **Browse Events**: Explore available events on the home page
3. **View Details**: Click events to see full information and artist details
4. **Book Tickets**: Select seats and complete booking process
5. **Manage Bookings**: View booking history in profile section
6. **Receive Confirmations**: Get email confirmations for successful bookings

### For Administrators
1. **Access Admin Panel**: Navigate to admin routes (protected)
2. **Manage Events**: Create/edit/delete events with image uploads
3. **User Management**: View and manage user accounts
4. **Monitor Bookings**: Track all booking activities
5. **View Analytics**: Access dashboard with revenue and user statistics

## Email Configuration

Configure Gmail SMTP in `backend/backend/settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

## Deployment

### Backend (Railway)
- Environment variables configured for Railway deployment
- Static files served via WhiteNoise
- CORS configured for frontend domain

### Frontend (Vercel/Netlify)
- Build command: `npm run build`
- Publish directory: `build`
- Configure API proxy to backend URL

## Security Features

- CSRF protection on forms
- Session-based authentication
- CORS configuration
- Secure password hashing (SHA256)
- Admin-only endpoints protection
- Input validation and sanitization

## Development Notes

- Uses SQLite for local development (configurable to MySQL)
- Hot reloading enabled for both frontend and backend
- Comprehensive error handling and logging
- Responsive design with Bootstrap
- Mobile-friendly interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request with detailed description

## License

This project is for educational and demonstration purposes. Ensure proper security measures for production deployment.
