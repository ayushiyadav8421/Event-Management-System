# 🎟️ Event Management Portal - v2.0

A full-stack MERN application for discovering and managing college/public events with advanced features.

**✨ New in v2.0:**
- 🔐 QR-based event check-in system
- 📊 Event analytics dashboard
- 🖼️ Image uploads for events
- 🔍 Advanced search with filters
- 👤 User profile page
- 🚫 404 error page

---

## 📁 Project Structure

```
event-portal/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic (auth, events, registrations, check-in, analytics, uploads)
│   ├── middleware/      → JWT auth middleware
│   ├── models/          → Mongoose schemas (User, Event, Registration)
│   ├── routes/          → Express routes (auth, events, registrations, check-in, analytics, uploads)
│   ├── uploads/         → Event images storage
│   ├── server.js        → Entry point
│   ├── package.json     → Dependencies (now includes multer, qrcode)
│   └── .env            → Environment variables
│
└── frontend/
    └── src/
        ├── components/  → Navbar, EventCard, EventFilters, EventForm
        ├── context/     → AuthContext (global auth state)
        ├── pages/       → 11 pages (Home, Login, Register, EventDetail, MyRegistrations, AdminDashboard, NotFound, Profile, Search, CheckIn, Analytics)
        ├── routes/      → PrivateRoute, AdminRoute guards
        ├── services/    → Axios API calls (api.js - now with check-in, analytics, upload endpoints)
        └── App.jsx      → Root with routing
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_portal
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🗺️ Frontend Routes

### Public Routes
- `GET /` → **Home** - Event listing with filters
- `GET /search` → **Search** - Advanced search page ✨ NEW
- `GET /login` → **Login** - User login
- `GET /register` → **Register** - User registration
- `GET /events/:id` → **EventDetail** - Single event details
- `GET /*` → **NotFound** - 404 error page ✨ NEW

### Private Routes (Authentication Required)
- `GET /profile` → **Profile** - User profile & logout ✨ NEW
- `GET /my-registrations` → **MyRegistrations** - Registered events
- `GET /check-in` → **CheckIn** - QR-based event check-in ✨ NEW

### Admin Routes (Admin Only)
- `GET /admin` → **AdminDashboard** - Create/Edit/Delete events
- `GET /admin/analytics` → **Analytics** - Event analytics & attendance ✨ NEW

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description       |
|--------|-----------------------|---------|-------------------|
| POST   | /api/auth/register    | Public  | Register user     |
| POST   | /api/auth/login       | Public  | Login user        |
| GET    | /api/auth/me          | Private | Get current user  |

### Events
| Method | Endpoint              | Access       | Description         |
|--------|-----------------------|--------------|---------------------|
| GET    | /api/events           | Public       | Get all events      |
| GET    | /api/events/:id       | Public       | Get single event    |
| POST   | /api/events           | Admin only   | Create event        |
| PUT    | /api/events/:id       | Admin only   | Update event        |
| DELETE | /api/events/:id       | Admin only   | Delete event        |

Query Params for GET /api/events: `category`, `date`, `location`, `search`

### Registrations (RSVP)
| Method | Endpoint                              | Access       | Description             |
|--------|---------------------------------------|--------------|-------------------------|
| GET    | /api/registrations/my                 | Private      | My registrations        |
| POST   | /api/registrations/:eventId           | Private      | RSVP for event          |
| PUT    | /api/registrations/:eventId/cancel    | Private      | Cancel registration     |
| GET    | /api/registrations/:eventId/attendees | Admin only   | Get event attendees     |

### Check-In (QR-Based) ✨ NEW
| Method | Endpoint                    | Access       | Description             |
|--------|----------------------------|--------------|-------------------------|
| POST   | /api/check-in/:eventId     | Private      | Check-in with QR code   |
| GET    | /api/check-in/:eventId     | Private      | Get check-in status     |

### Analytics ✨ NEW
| Method | Endpoint              | Access       | Description             |
|--------|----------------------|--------------|-------------------------|
| GET    | /api/analytics        | Admin only   | Get all analytics       |
| GET    | /api/analytics/:eventId | Admin only   | Get event analytics     |

### Uploads (Image) ✨ NEW
| Method | Endpoint                    | Access       | Description         |
|--------|----------------------------|--------------|---------------------|
| POST   | /api/uploads/event/:eventId | Admin only   | Upload event image  |
| GET    | /api/uploads/event/:eventId | Public       | Get event image     |

---

## 🗄️ Database Collections

### Users
```json
{ "name": "string", "email": "string", "password": "hashed", "role": "user|admin" }
```

### Events ✨ UPDATED
```json
{ 
  "title": "string",
  "description": "string",
  "category": "Tech|Cultural|Sports|Academic|Workshop|Other",
  "date": "Date",
  "location": "string",
  "image": "string (filename)",
  "imageUrl": "string (URL path)",
  "qrCode": "string (unique QR)",
  "createdBy": "ObjectId"
}
```

### Registrations ✨ UPDATED
```json
{ 
  "userId": "ObjectId",
  "eventId": "ObjectId",
  "status": "registered|cancelled",
  "checkedIn": "boolean",
  "checkInTime": "Date",
  "qrVerified": "boolean"
}
```

---

## 🚀 Features

### Core Features
- ✅ JWT Authentication (Register / Login)
- ✅ Role-based access (User / Admin)
- ✅ Event listing with Category, Date, Location, Search filters
- ✅ RSVP / Cancel registration
- ✅ Admin Dashboard — Create, Edit, Delete events
- ✅ View Attendees per event
- ✅ Protected routes (frontend + backend)
- ✅ Toast notifications
- ✅ Responsive UI with TailwindCSS

### New Features (v2.0) ✨
- ✨ **QR-Based Check-In** - Secure event attendance verification
- 📊 **Event Analytics** - Real-time attendance statistics
- 🖼️ **Image Uploads** - Add event promotional images
- 🔍 **Advanced Search** - Search, filter, and sort events
- 👤 **User Profile** - View profile and logout
- 🚫 **404 Page** - Professional error handling

---

## 🛠️ Tech Stack

| Layer    | Tech                                          |
|----------|-----------------------------------------------|
| Frontend | React, Vite, TailwindCSS, Axios, React Router |
| Backend  | Node.js, Express.js                           |
| Database | MongoDB, Mongoose                             |
| Auth     | JWT, bcryptjs                                 |
| Uploads  | Multer (file upload)                          |
| QR Code  | QRCode (QR generation)                        |
| UI/UX    | react-icons, react-toastify                   |

---

## 📦 Dependencies

### Backend (Updated)
```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.0",
  "mongoose": "^7.3.1",
  "multer": "^1.4.5+",      // ✨ NEW - File uploads
  "qrcode": "^1.5.3+"       // ✨ NEW - QR code generation
}
```

### Frontend (No changes needed)
```json
{
  "axios": "^1.4.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-icons": "^4.10.1",
  "react-router-dom": "^6.14.2",
  "react-toastify": "^9.1.3"
}
```

---

## 🧪 Testing APIs

Use Postman or Thunder Client to test endpoints.

**Example: Register User**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Example: Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Example: Check-In with QR**
```http
POST http://localhost:5000/api/check-in/event123
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "qrCode": "QR_CODE_VALUE_HERE"
}
```

**Example: Upload Event Image**
```http
POST http://localhost:5000/api/uploads/event/event123
Authorization: Bearer <your_token>
Content-Type: multipart/form-data

[Attach image file as 'image' field]
```

---

## 📚 Documentation Files

- `README.md` - This file (overview)
- `ROUTING_ANALYSIS.md` - Detailed routing documentation
- `FEATURE_UPDATE.md` - Complete feature implementation guide

---

## ✨ Key Features Highlights

| Feature | Type | Access | Status |
|---------|------|--------|--------|
| 404 Not Found Page | Frontend | Public | ✅ Complete |
| User Profile | Frontend | Private | ✅ Complete |
| Advanced Search | Frontend | Public | ✅ Complete |
| QR Check-In | Full Stack | Private | ✅ Complete |
| Analytics Dashboard | Full Stack | Admin | ✅ Complete |
| Image Uploads | Full Stack | Admin | ✅ Complete |

---

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy from `dist/` folder
3. Configure API base URL for production

---

## 💡 Future Enhancements

- [ ] Real-time notifications (WebSockets)
- [ ] Email notifications for events
- [ ] Event export (CSV/PDF)
- [ ] Mobile app for QR scanning
- [ ] Advanced reporting & graphs
- [ ] Event reviews & ratings
- [ ] Social media integration

---

## 📞 Support

For issues or feature requests, please create an issue in the repository.

---

**Version:** 2.0  
**Last Updated:** April 23, 2026  
**Status:** ✅ All features implemented and tested
