# FlowDesk — Odoo × FLUX Lucknow Hackathon 2026

> 🏆 A full-stack Request Management System built for the Odoo × FLUX Lucknow Hackathon 2026

## 🚀 Live Demo
**[Live App →](https://odoo-starter-kit.vercel.app)**  
**[Demo Video →](#)**

---

## 🎯 Problem Statement
Managing service/maintenance/facility requests across teams lacks transparency and traceability. Users don't know the status of their requests, and admins struggle to track and prioritize the pipeline.

## ✅ Solution — FlowDesk
A unified real-time request management platform with:
- **Users** can submit, track, and manage their own requests
- **Admins** can view all requests, update statuses, and visualize analytics
- Real-time PostgreSQL database (no static JSON)
- Role-based access control (RBAC) with separate dashboards

---

## 👥 User Roles
| Role | Capabilities |
|---|---|
| **User** | Submit requests, track status, filter/search own requests |
| **Admin** | View all requests, update status workflow, view analytics |

## 🔄 Status Workflow
```
Pending → In Progress → Completed
Pending → Rejected → Pending (Reopen)
```

---

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **Styling** | Tailwind CSS v4 + Custom Odoo-style design system |
| **Backend** | Next.js API Routes + Supabase PostgreSQL |
| **Auth** | Supabase Auth (JWT) with role metadata |
| **Database** | PostgreSQL via Supabase (Seoul region) |
| **Deployment** | Vercel (Frontend) + Supabase (DB) |
| **Icons** | Lucide React |

---

## 🗄️ Database Schema
```sql
-- Profiles Table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Requests Table
CREATE TABLE requests (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','in-progress','completed','rejected')),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📁 Project Structure
```
src/
├── app/
│   ├── page.tsx          # Landing page (Odoo-style)
│   ├── auth/page.tsx     # Login + Register (dual-role)
│   ├── dashboard/page.tsx # User dashboard
│   ├── admin/page.tsx    # Admin dashboard + analytics
│   └── globals.css       # Design system
├── lib/
│   ├── supabase.ts       # DB client
│   └── utils.ts          # Helpers, constants
└── components/           # Reusable UI components
```

---

## ⚡ Local Setup
```bash
git clone https://github.com/amittiwari006/odoo-starter-kit.git
cd odoo-starter-kit
npm install
# Add .env.local with Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📊 Features Checklist (Odoo Evaluation Criteria)
- ✅ Dynamic real-time database (PostgreSQL, no static JSON)
- ✅ Responsive and clean UI (consistent color scheme and layout)
- ✅ Robust user input validation (form errors, edge cases)
- ✅ Intuitive navigation with proper menu placement
- ✅ Version control (Git) with active commit history
- ✅ Role-based access control (User + Admin)
- ✅ Status workflow engine (Pending → In Progress → Completed)
- ✅ Admin analytics dashboard with category breakdown and resolution rate
- ✅ Search, filter, and sort functionality
- ✅ Loading states, empty states, and error handling

---

## 👨‍💻 Team
**Amit Tiwari** — [`@amittiwari006`](https://github.com/amittiwari006)
