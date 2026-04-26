# Carpool

Carpool is a ride-sharing application developed for university students in Karachi to facilitate easy and affordable commuting.

## Features Implemented

1. **Custom Locations ("Other" Option)**
   - Added an "Other" option for Universities and Areas in Registration, functionality to Find a Ride, and Offer a Ride pages.
   - Users can type custom names if their specific location is not in the dropdown list.

2. **Smart Search & Pre-filled Data**
   - Implemented fuzzy search logic in the backend.
   - Driver destinations and WhatsApp numbers are seamlessly populated from their registered profile when offering a ride.

3. **Driver Rating & Review System**
   - Passengers can rate (1-5 stars) and review drivers after a ride is marked as completed.
   - A driver's average rating and total review count are dynamically displayed on their dashboard profile and in search results.

4. **Ride Booking Workflow**
   - Full lifecycle management for rides: Scheduled -> Accepted (Booking) -> Completed.
   - Drivers can manage incoming requests (Accept/Reject) and mark journeys as completed.

5. **WhatsApp Integration**
   - Secure and direct integration with WhatsApp for communication between drivers and confirmed riders.

## Technology Stack

**Frontend**
- Next.js 16 (React Framework)
- Tailwind CSS v4 (Styling)

**Backend**
- FastAPI (Python Web Framework)
- Uvicorn (ASGI Server)

**Database**
- SQLModel (ORM)
- SQLite / PostgreSQL

## Mobile Application

**Download the App:** [Download APK](/app-release.apk)

The Carpool application is now available on Android!
- **Built with:** React Native (Expo) & WebView
- **Features:** Full access to all web features in a native mobile experience.
- **Distribution:** Direct APK download for free access.

### How to Install
1. Click the download link above.
2. Open the downloaded file on your Android device.
3. If prompted, allow installation from "Unknown Sources" (since it's a direct download).
4. Install and enjoy!
