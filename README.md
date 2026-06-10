# KarPool 🚗

A ride-sharing platform made for university students in Karachi.

Students who drive to campus can offer their empty seats, and students who need a ride can find and book one — all through a simple web app. Communication happens through WhatsApp, so there's nothing new to learn.

---

## Why We Built This

Getting to university in Karachi is a daily headache. Fuel is expensive, traffic is awful, and ride-hailing apps burn through your wallet. Most students currently rely on random WhatsApp groups to find rides, which is messy and unreliable — there's no proper way to search, no seat tracking, and no accountability.

KarPool gives students a proper platform to organize all of this in one place.

---

## What It Does

**If you're a driver**, you post a ride with your pickup area, time, and how many seats you have. Your university and WhatsApp number get pulled from your profile automatically — you don't type them again.

**If you're a rider**, you search for rides by area, university, and date. You see the available options with driver info, seats left, cost, and ratings. You pick one, book a seat, and hit the WhatsApp button to coordinate with the driver.

**After the ride**, the driver marks it as completed, and the rider can leave a star rating and a review. These ratings show up on the driver's profile so other riders can make better choices next time.

---

## Features

- **University email registration** — only verified students can join
- **Driver and Rider roles** — pick your role at signup, switch anytime
- **Ride offers** — drivers post rides with area, time, date, seats, and optional cost per seat
- **Ride search** — riders search by area, destination, and date
- **Seat booking** — book a seat, and the count updates automatically (no overbooking)
- **WhatsApp integration** — one-tap button to message the driver directly
- **Ratings and reviews** — rate drivers after completed rides (1–5 stars + optional comment)
- **Ride history** — both drivers and riders can see all their past rides
- **Admin panel** — monitor users, rides, and bookings from a dashboard

---

## Tech Stack

| | Technology |
|---|---|
| **Frontend** | Next.js (React), Tailwind CSS |
| **Backend** | FastAPI (Python), Uvicorn |
| **Database** | SQLite / PostgreSQL, SQLModel ORM |
| **Mobile** | React Native (Expo) with WebView |
| **Auth** | JWT tokens, bcrypt password hashing |
| **Communication** | WhatsApp deep links |

---

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload --port 8000
```

API runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:3000`

### Database

Tables are created automatically when the backend starts. If you ever need to create them manually:

```bash
python backend/init_db.py
```

---

## Mobile App

There's also an Android app built with React Native and Expo. It wraps the web app in a WebView so you get the same experience on your phone.

To install: download the APK from the repo, open it on your Android device, and allow installation from unknown sources if prompted.

---

## Team

**Campus Carpool Crew**

- Shayan Raza
- Asad Siddiqui
- Sami Ul Hassan

Built as a Software Engineering course project.
