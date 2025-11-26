# Scan Sehat - Production-Ready Medical EHR Portability System

A secure, portable Electronic Health Record (EHR) system where patients upload medical records, AI extracts structured information, and doctors access records via temporary, revocable tokens (OTP/QR code).

## 🎯 Project Overview

**Scan Sehat** is a complete, production-ready medical EHR portability application built with:
- **Frontend**: React 18 + Vite + TypeScript + Zustand + TailwindCSS + React Query
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **AI**: OpenAI API for structured medical data extraction
- **Storage**: Cloudinary for secure file storage
- **Security**: JWT, bcrypt, rate limiting, helmet, CSRF protection, audit logs
- **Auth**: JWT-based authentication + Google OAuth2

## ✨ Features

### Authentication
- ✅ Signup/Login with JWT-based authentication
- ✅ Google OAuth2 integration
- ✅ Password hashing with bcrypt
- ✅ Device-aware sessions with refresh tokens
- ✅ Email verification
- ✅ Secure token storage and management

### Dashboard
- ✅ Profile overview with user information
- ✅ Medical records summary and statistics
- ✅ Recent records display
- ✅ Quick access to key features
- ✅ Real-time data with React Query

### Medical Record Upload
- ✅ Upload PDFs and images (JPG/PNG)
- ✅ Automatic Cloudinary storage
- ✅ AI-powered structured extraction
- ✅ OCR text extraction
- ✅ Metadata and raw file storage
- ✅ Encryption support

### AI-Powered Extraction
- ✅ Extracts structured fields:
  - Diagnosis
  - Medications
  - Lab values
  - Vitals
  - Doctor notes
  - Allergies
- ✅ Stores both structured and unstructured versions
- ✅ Semantic search with embeddings

### Temporary Access Sharing
- ✅ OTP access (configurable expiry, default 5 minutes)
- ✅ QR-code access (scan → token validation)
- ✅ One-time use OR session-based
- ✅ Read-only access for doctors
- ✅ Revocable anytime
- ✅ Comprehensive access logging

### Doctor View (Read-Only Mode)
- ✅ Patient name display
- ✅ List of medical records
- ✅ Structured AI metadata display
- ✅ Download disabled
- ✅ Screenshot-protection suggestion banner

### Audit Logs
- ✅ Tracks who accessed records
- ✅ When accessed
- ✅ What record was accessed
- ✅ Action types (OTP_ISSUED, QR_REDEEMED, RECORDS_VIEWED, etc.)
- ✅ IP address tracking (if available)

### Settings
- ✅ Profile management
- ✅ Password updates
- ✅ Avatar upload
- ✅ Security settings

## 🎨 UI/UX Design Specifications

### Medical Theme Colors
- **Medical Blue**: `#0C6CF2`
- **Teal**: `#00A1A9`
- **Text**: `#0F172A`
- **Background**: `#F5F8FA`
- **Card Background**: `#FFFFFF`
- **Border**: `#E2E8F0`

### Typography
- **Fonts**: Inter + Roboto (mix allowed)
- **Design**: Clean, hospital-grade, trustworthy interface

## 📁 Folder Structure

```
/scansehat
  /frontend
    /src
      /components        # Reusable UI components
        /layout          # DashboardLayout, Sidebar, TopNavbar
        /cards           # KPI cards, record cards
        /charts          # Data visualization
        /share           # OTP/QR sharing components
        /tables          # Data tables
        /ui              # Base UI components
      /pages
        /dashboard       # Dashboard pages (DashboardPage, RecordsPage, etc.)
        # Public pages: Home, Login, Register, ForgotPassword, AuthGoogleCallback
        # Protected pages: Upload
      /stores            # Zustand state management
      /utils             # API client, date formatting, constants
      /styles            # Global styles
    /public              # Static assets
    package.json
    vite.config.ts
    tailwind.config.cjs
  
  /backend
    /src
      /controllers       # Request handlers
      /routes            # API route definitions
      /models            # Mongoose schemas
      /middleware        # Auth, role-based access
      /services          # Business logic (OCR, OpenAI, Cloudinary, etc.)
      /utils             # Helpers (tokens, hashing, logging)
      /types             # TypeScript type definitions
      /scripts           # Migration and seed scripts
      app.ts             # Express app configuration
      server.ts          # Server entry point
      config.ts          # Configuration loader
    package.json
    tsconfig.json
    Dockerfile
```

## 🗄️ Database Collections

### Users
- Patient/doctor information
- Authentication credentials (hashed passwords)
- Profile data (name, email, avatar, etc.)
- Google OAuth integration
- Email verification status

### MedicalRecords
- Medical record files (Cloudinary URLs)
- Structured AI-extracted data
- OCR text
- Metadata (facility, doctor, date, etc.)
- Embeddings for semantic search
- Encryption information

### AccessSessions
- OTP/QR tokens (hashed)
- Expiration times
- Session tokens
- Doctor email
- Channel (OTP or QR)
- Status (pending, redeemed, expired)

### AccessLogs
- Audit trail for all access events
- Action types (OTP_ISSUED, QR_REDEEMED, RECORDS_VIEWED)
- Timestamps
- IP addresses
- Doctor information

### Tenants
- Multi-tenant support
- Organization information
- Subscription details

### UserSessions
- Refresh token storage
- Device information
- IP addresses
- Expiration tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- OpenAI API key
- Google OAuth credentials (for OAuth login)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd scansehat
```

2. **Backend Setup**
```bash
cd backend
npm install

# Copy config example
cp config.example.txt config.local.txt

# Edit config.local.txt with your values:
# - MONGO_URI
# - JWT_SECRET
# - CLOUDINARY credentials
# - OPENAI_API_KEY
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - FRONTEND_URL
# - etc.
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Copy config example
cp config.example.txt config.local.txt

# Edit config.local.txt with your values:
# - VITE_BACKEND_URL
# - VITE_FRONTEND_URL
# - VITE_GOOGLE_CLIENT_ID (optional)
```

4. **Seed Dummy Data (Optional)**
```bash
cd backend
npm run seed
```

This creates:
- Dummy user: `rakesh@example.com` / `password123`
- 2 medical records with structured data
- 1 access log entry

5. **Run Development Servers**

Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:5000 (or PORT from config)
```

Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

## 📝 Dummy Data

### User
- **Name**: Rakesh Kumar
- **Email**: rakesh@example.com
- **Phone**: +91 9876543210
- **Password**: password123

### Medical Records

**Record 1: Blood Test Report**
- Type: Blood Test Report
- Diagnosis: Mild Anemia
- Medications: ["Iron Supplement - Ferrous Sulfate 325mg"]
- Lab Values: { hb: "10.5 g/dL", wbc: "7000/mm3" }

**Record 2: Prescription**
- Type: Prescription
- Doctor: Dr. Amit Sharma
- Notes: "Take medication after lunch"
- Medications: ["Amlodipine 5mg", "Lisinopril 10mg"]

### Access Log
- Doctor: Dr. Meenakshi Rao
- Accessed: 2025-01-10T12:41:22Z
- Files: 2
- Mode: read-only

## 🔧 Configuration

### Backend Config (`backend/config.local.txt`)
```txt
APP_NAME=Scan Sehat
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/scan-sehat
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRY=15m
REFRESH_SECRET=your-refresh-secret-min-32-chars
REFRESH_EXPIRY=30d
SESSION_COOKIE_NAME=scan_sehat_session
REFRESH_COOKIE_NAME=scan_sehat_refresh
CSRF_SECRET=your-csrf-secret
CLOUDINARY_CLOUD=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret
OPENAI_API_KEY=sk-your-key
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:5173
OTP_EXPIRY_MIN=5
SESSION_TTL_MIN=30
MAX_FILE_MB=15
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend Config (`frontend/config.local.txt`)
```txt
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_URL=http://localhost:5173
VITE_GOOGLE_CLIENT_ID=your-google-client-id (optional)
```

**Note**: `VITE_BACKEND_URL` should be the base URL without `/api` suffix (e.g., `http://localhost:4000`, not `http://localhost:4000/api`). The `/api` prefix is automatically added by the axios client.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns token in response)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/session` - Get current session/user
- `PATCH /api/auth/profile` - Update user profile
- `POST /api/auth/update-password` - Change password
- `POST /api/auth/upload-avatar` - Upload profile picture
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/verify-email` - Verify email address
- `GET /api/auth/verify-email` - Verify email (GET variant)
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Records
- `GET /api/records` - List all records for authenticated user
- `GET /api/records/summary` - Get records summary statistics
- `GET /api/records/latest` - Get latest records (limit 10)
- `POST /api/records/upload` - Upload medical record
- `GET /api/records/:id` - Get specific record
- `DELETE /api/records/:id` - Delete record
- `GET /api/records/search?q=query` - Semantic search records

### Access/Sharing
- `POST /api/access/generate` - Generate OTP/QR token (requires auth)
- `POST /api/access/redeem` - Redeem OTP/QR token
- `GET /api/access/session/:token` - Get session records (doctor view)

### Logs
- `GET /api/logs` - Get access logs (requires auth, patient role)

### Tenants
- `GET /api/tenants/summary` - Get tenant summary
- `PATCH /api/tenants` - Update tenant information

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
```

### Frontend
```bash
cd frontend
npm run test
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Import repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables from `config.local.txt` (prefixed with `VITE_`)

### Backend (Render/Railway/Heroku)
1. Use `backend/Dockerfile` or build with `npm run build`
2. Set environment variables (convert `config.local.txt` format)
3. Configure MongoDB connection (Atlas recommended)
4. Set up Cloudinary and OpenAI credentials
5. Configure Google OAuth redirect URIs for production domain

### Docker
```bash
# Build and run with docker-compose
docker-compose up -d
```

## 🔒 Security Features

- ✅ JWT-based authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (configurable)
- ✅ Helmet security headers
- ✅ CORS protection (configurable origins)
- ✅ XSS protection
- ✅ MongoDB injection protection
- ✅ CSRF protection (double-submit cookie pattern)
- ✅ Audit logging
- ✅ Time-limited access tokens
- ✅ Read-only doctor access
- ✅ Secure cookie handling (httpOnly, secure in production)
- ✅ OAuth state validation
- ✅ Token expiration checks

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite (build tool)
- TypeScript
- Zustand (state management)
- React Query (data fetching)
- React Router (routing)
- TailwindCSS (styling)
- Axios (HTTP client)
- Framer Motion (animations)
- Lucide-react (icons)
- React-hook-form + Zod (form validation)

### Backend
- Node.js
- Express (TypeScript)
- TypeScript
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- Mongoose (MongoDB ODM)
- Cloudinary SDK (file storage)
- express-rate-limit (rate limiting)
- Helmet (security headers)
- Compression (response compression)
- csrf-csrf (CSRF protection)
- xss-clean (XSS protection)
- OpenAI API (AI extraction)
- Google OAuth2 (authentication)
- Pino (logging)

### Database
- MongoDB (with Mongoose)

### Storage
- Cloudinary (file storage)

## 📋 Recent Updates

### Project Audit & Cleanup (Latest)
- ✅ Removed 22 duplicate/unused files
- ✅ Fixed OAuth callback flow
- ✅ Fixed API endpoints (access/generate, logs)
- ✅ Added missing backend endpoints (summary, latest)
- ✅ Fixed token handling in login response
- ✅ Removed all unnecessary markdown files
- ✅ Cleaned up duplicate page components
- ✅ Verified all imports and dependencies
- ✅ Production-ready codebase

## 📄 License

Private - All rights reserved

## 👥 Contributors

Built as a production-ready medical EHR system following SDE-3 level best practices.

---

**Note**: This is a production-ready system. Ensure all security configurations are properly set before deploying to production. Always use strong secrets, enable HTTPS, and configure CORS appropriately for your domain.
