# Carpool

Carpool is a ride-sharing application developed for university students in Karachi to facilitate easy and affordable commuting.

## Features Implemented

1. **Custom Locations ("Other" Option)**
   - Added an "Other" option for Universities and Areas in Registration, functionality to Find a Ride, and Offer a Ride pages.
   - Users can type custom names if their specific location is not in the dropdown list.

2. **Smart Search**
   - Implemented fuzzy search logic in the backend.
   - It handles case-insensitivity and ignores special characters (e.g., "gulshan" matches "Gulshan-e-Iqbal").

3. **Responsive UI**
   - Replaced standard date/time pickers with custom dropdowns for Day, Month, Year, Hour, and Minute.
   - Ensures better usability on mobile devices.

4. **Integration**
   - Direct integration with WhatsApp for communication between drivers and riders.

## Technology Stack

**Frontend**
- Next.js 16 (React Framework)
- Tailwind CSS v4 (Styling)
- Lucide React (Icons)

**Backend**
- FastAPI (Python Web Framework)
- Uvicorn (ASGI Server)

**Database**
- SQLModel (ORM)
- PostgreSQL (Production Database)
- SQLite (Local Development)
