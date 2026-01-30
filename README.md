# Ciliade Tailoring Company - Full-Stack Luxury Tailoring Platform

A production-grade, luxury full-stack web application for a world-class tailoring and ready-to-wear fashion brand.

## Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication with httpOnly cookies
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Node-cron** - Scheduled email tasks

### Frontend
- **Next.js 14** (App Router) - React framework
- **TailwindCSS** + **shadcn/ui** - Styling
- **React Hook Form** + **Zod** - Form handling
- **Framer Motion** - Animations
- **Axios** - API requests

## Features

### Customer Features
- User registration and authentication
- Personal measurement profiles
- Browse ready-to-wear collections
- View lookbook galleries
- Book tailoring appointments
- Customer dashboard
- Contact form with auto-acknowledgment emails

### Admin Features
- Comprehensive admin dashboard
- Product management (Create, Read, Update, Delete)
- Customer management
- Booking management with status updates
- Message center
- View customer measurements
- Analytics and statistics

## Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service (Gmail, SendGrid, etc.)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Ciliade Tailoring Company <noreply@ciliade.com>

FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file from `.env.example`:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Default Admin Account

To create an admin account, register a user and manually update the database:
```javascript
// In MongoDB
db.users.updateOne(
  { email: "admin@ciliade.com" },
  { $set: { role: "admin" } }
)
```

## Project Structure