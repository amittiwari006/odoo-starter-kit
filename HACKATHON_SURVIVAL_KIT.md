# 🏆 ODOO × FLUX LUCKNOW HACKATHON '26 — BATTLE CHEAT SHEET (OCT 31)

## 📌 QUICK LINKS & LOCATIONS
* **Your GitHub Repo:** [https://github.com/amittiwari006/odoo-starter-kit](https://github.com/amittiwari006/odoo-starter-kit)
* **Local Project Folder (VS Code):** `C:\Users\salon\.gemini\antigravity\scratch\odoo-starter-kit`
* **File Explorer Documents Copy:** `C:\Users\salon\Documents\odoo-starter-kit`
* **Supabase Cloud Database:** [https://supabase.com/dashboard/project/yxtjubfcpfotqponcajn](https://supabase.com/dashboard/project/yxtjubfcpfotqponcajn)
* **Local Dev Server:** `http://localhost:3000` (run `npm run dev`)

---

## 🎯 HOW ODOO EVALUATES & GIVES MARKS (THE SCORING RUBRIC)
Based on Odoo engineering jury standards and past Odoo Combat / hackathon reviews:

| Criteria | Weight | What Judges Look For | What Gets You Disqualified/Penalized |
|---|---|---|---|
| **Technical Implementation & Architecture** | **35%** | Real dynamic database queries (PostgreSQL/Supabase), relational integrity, foreign keys, clean code structure. | Hardcoded JSON files, mock data, broken APIs. |
| **Functional Completeness (Working MVP)** | **30%** | End-to-end user flow works live with zero console errors. Both User & Admin can perform actions. | Broken buttons, unhandled edge cases, features that crash during demo. |
| **UI/UX & Odoo Design Philosophy** | **20%** | Clean, uncluttered enterprise interface (Odoo `#714B67` purple branding), intuitive navigation, proper status pills, responsive layout. | Cluttered text, bad contrast, inconsistent padding/fonts. |
| **Git Discipline & Team History** | **15%** | Active distributed commits throughout the 8 hours with meaningful commit messages. | Single huge commit at 4:55 PM, no commit history. |

---

## ⏰ EXACT TIMELINE FOR TOMORROW (OCTOBER 31, 9:00 AM - 5:00 PM)

### 9:00 AM – 9:30 AM: Problem Drop & Selection
1. Open hackathon portal, read all surprise problem statements.
2. **Come straight to this chat** and paste the problem statements.
3. We will select the one that fits our existing architecture (Request / Booking / Listing / Approval workflow).

### 9:30 AM – 11:30 AM: Tailor Database & Schemas
* In Supabase, tweak the table columns to match the chosen problem statement (e.g. from `requests` to `incidents`, `bookings`, or `items`).
* Run the updated SQL in Supabase SQL editor.

### 11:30 AM – 2:30 PM: Tailor UI & Workflows
* Rename form inputs in `src/app/dashboard/page.tsx` and table headers in `src/app/admin/page.tsx`.
* Verify status state machine transitions:
  * `Pending` 🟡 → `In Progress` 🔵 → `Completed` 🟢

### 2:30 PM – 3:30 PM: Seed Realistic Data & Polish
* Insert 5-10 realistic demo records (real Indian names, realistic addresses, sensible descriptions — NO "test", "asdf").
* Test search bar and status filter dropdowns.

### 3:30 PM – 4:30 PM: Deploy & Record 2-Min Demo Video
1. Deploy to Vercel (connect GitHub repo `amittiwari006/odoo-starter-kit`).
2. Add the two Supabase environment variables in Vercel settings:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Record a 2-minute Loom screen walkthrough:
   * 0:00 - 0:30: Problem statement explanation
   * 0:30 - 1:30: Live demo: User submits -> Admin approves -> Real-time status update
   * 1:30 - 2:00: Architecture (Next.js + Supabase PostgreSQL + RBAC)

### 4:30 PM – 4:55 PM: Final Submission
* Submit GitHub URL and Live Vercel Link on the Odoo Hackathon portal.
* DO NOT WAIT UNTIL 4:59 PM.

---

## 🔑 EMERGENCY PROMPT IF YOU START A NEW CHAT TOMORROW:
If you ever open a new chat, just paste:
> *"I am Amit Tiwari in the Odoo x FLUX Lucknow Hackathon. Read my file at C:\Users\salon\.gemini\antigravity\scratch\odoo-starter-kit\HACKATHON_SURVIVAL_KIT.md and my repo https://github.com/amittiwari006/odoo-starter-kit.git. Here are my assigned problem statements today:"*
