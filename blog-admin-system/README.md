# BlogCMS – Full Stack Blog Management System

A production-ready, modern blog management system built with **Next.js 15+** (App Router), **Express.js**, **MongoDB**, and **JWT Authentication**.

---

## 🚀 Features

- **Secure Admin Authentication** — JWT login with bcrypt hashed passwords
- **Dashboard** — Stats cards: Total, Published, Drafts, Latest Blog
- **Blog Management** — Create, Read, Update, Delete blogs
- **Publish/Unpublish** — Toggle status inline from the blog list table
- **Rich Text Editor** — Custom toolbar with Bold, Italic, Code, Headings, Lists, Quotes
- **Image Uploads** — Drag-and-drop image upload with live preview
- **Auto Slug** — Slugs auto-generated from titles with uniqueness guarantee
- **Tags** — Multi-tag system with keyboard shortcuts
- **Category Filter** — Filter blogs by category in public and admin views
- **Search** — Search blogs by title, description, or tags
- **Pagination** — On all public and admin listing pages
- **Public Blog Site** — Hero homepage, blog detail pages with reading time
- **Related Posts** — Automatically shown based on category
- **SEO** — Dynamic OG metadata for each blog post
- **Skeleton Loading** — Premium perceived performance on all loading states
- **Responsive** — Mobile-first, works on all screen sizes

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15+ App Router, React, Tailwind CSS |
| UI Libraries | Lucide React, React Hook Form, React Hot Toast |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |
| File Upload | Multer |

---

## 📁 Project Structure

```
blog-admin-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── blogController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Admin.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── scripts/seed.js
│   ├── uploads/           ← Images stored here
│   ├── .env
│   ├── package.json
│   └── server.js
└── frontend/
    └── src/
        ├── app/
        │   ├── (public)/          ← Public blog site
        │   │   ├── page.tsx       ← Homepage
        │   │   └── blogs/[slug]/page.tsx  ← Blog detail
        │   ├── dashboard/
        │   │   ├── page.tsx       ← Dashboard home
        │   │   ├── blogs/
        │   │   │   ├── page.tsx   ← Blog list management
        │   │   │   ├── create/page.tsx
        │   │   │   └── edit/[id]/page.tsx
        │   │   └── settings/page.tsx
        │   ├── login/page.tsx
        │   ├── globals.css
        │   └── layout.tsx
        ├── components/
        │   ├── AdminLayout.tsx
        │   ├── Modal.tsx
        │   ├── PublicNavbar.tsx
        │   ├── PublicFooter.tsx
        │   ├── RichTextEditor.tsx
        │   └── Skeletons.tsx
        ├── context/AuthContext.tsx
        └── lib/api.ts
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)
- npm

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create or verify the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_system
JWT_SECRET=supersecretadminkeyjwt123!
JWT_EXPIRES_IN=7d
```

**Seed the database** (creates admin user and demo blogs):

```bash
npm run seed
```

**Start the backend server:**

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Verify `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Start the frontend:**

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## 🔐 Admin Login

Default credentials after seeding:

| Field | Value |
|---|---|
| Email | `admin@example.com` |
| Password | `admin123456` |

---

## 🌐 URL Reference

| URL | Description |
|---|---|
| `http://localhost:3000` | Public Blog Homepage |
| `http://localhost:3000/blogs/[slug]` | Public Blog Detail Page |
| `http://localhost:3000/login` | Admin Login |
| `http://localhost:3000/dashboard` | Admin Dashboard |
| `http://localhost:3000/dashboard/blogs` | Blog Management Table |
| `http://localhost:3000/dashboard/blogs/create` | Create New Blog |
| `http://localhost:3000/dashboard/settings` | Admin Settings |

---

## 🔌 REST API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Admin login |
| GET | `/api/auth/me` | Private | Get current admin |
| POST | `/api/auth/logout` | Public | Logout |

### Blogs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/blogs` | Public | List all published blogs |
| GET | `/api/blogs/slug/:slug` | Public | Get blog by slug |
| GET | `/api/blogs/:id` | Public | Get blog by ID |
| GET | `/api/blogs/admin/stats` | Private | Dashboard stats |
| POST | `/api/blogs` | Private | Create blog (multipart/form-data) |
| PUT | `/api/blogs/:id` | Private | Update blog |
| DELETE | `/api/blogs/:id` | Private | Delete blog |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- Routes protected with **JWT** bearer token verification
- Input validation via Mongoose schemas and frontend form validation
- Unique slug enforcement at the database level
- Image type and size validation (max 5MB, image/* only)
- CORS configured on the backend

---

## 📸 Screenshots

Visit `http://localhost:3000` (public site) and `http://localhost:3000/dashboard` (admin panel) after starting both servers.

---

## 📝 License

MIT — Built for educational and production use.
