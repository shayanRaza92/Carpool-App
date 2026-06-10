from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from ..database import get_session
from ..models import Ride, RideCreate, RideRead, User
from .auth import oauth2_scheme
from jose import jwt, JWTError
from .auth import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/rides", tags=["rides"])

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_user_email(token: str = Depends(oauth2_scheme)):
    # Kept for backward compatibility if needed, or just redirect to get_current_user
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except:
        return None

from datetime import datetime, date, timedelta
from ..models import Ride, RideCreate, RideRead, User, Booking, Review # Import Booking and Review

# ... (imports remain similar)

@router.post("/", response_model=RideRead)
async def create_ride(ride: RideCreate, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # 0. Validate Ladies Only
    if ride.ladies_only and user.gender != "Female":
         raise HTTPException(status_code=400, detail="Only female drivers can post 'Ladies Only' rides.")

    # 1. Validate Date (Today or Tomorrow only)
    try:
        ride_date = datetime.strptime(ride.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    now = datetime.now()
    today = now.date()
    tomorrow = today + timedelta(days=1)
    
    # Allow posting for today and tomorrow
    if ride_date < today:
        raise HTTPException(status_code=400, detail="Cannot post rides in the past.")
    if ride_date > tomorrow:
        raise HTTPException(status_code=400, detail="You can only post rides for Today or Tomorrow.")
    
    # 2. Validate departure datetime is in the future
    try:
        ride_dt = datetime.strptime(f"{ride.date} {ride.departure_time}", "%Y-%m-%d %H:%M")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date or time format. Use YYYY-MM-DD for date and HH:MM for time")
    if ride_dt <= datetime.now():
        raise HTTPException(status_code=400, detail="Departure datetime must be in the future.")

    # Create ride linked to user
    db_ride = Ride(
        driver_email=user.email,
        origin_area=ride.origin_area,
        destination_area=user.university, 
        departure_time=ride.departure_time,
        date=ride.date,
        seats_available=ride.seats_available,
        whatsapp_number=ride.whatsapp_number,
        ladies_only=ride.ladies_only,
        status="scheduled"
    )
    session.add(db_ride)
    session.commit()
    session.refresh(db_ride)
    return db_ride

@router.get("/search", response_model=List[dict])
async def search_rides(area: str, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Search for rides with fuzzy matching logic
    today_str = date.today().isoformat()
    
    statement = select(Ride).where(
        Ride.date >= today_str,
        Ride.seats_available > 0,
        Ride.status == "scheduled"
    )
    
    # Gender Filtering
    if user.gender != "Female":
        statement = statement.where(Ride.ladies_only == False)
    
    results = session.exec(statement).all()
    
    import difflib
    import re

    def normalize(text):
        if not text:
            return ""
        return re.sub(r'[^a-z0-9]', '', text.lower())

    def is_match(query, target):
        if not query or not target:
            return False
        n_query = normalize(query)
        n_target = normalize(target)
        if n_query == n_target: return True
        if n_query in n_target or n_target in n_query: return True
        ratio = difflib.SequenceMatcher(None, n_query, n_target).ratio()
        return ratio > 0.80

    now = datetime.now()
    valid_results = []
    
    user_uni = user.university
    target_area = area

    for r in results:
        # Time check
        if r.date == today_str:
            try:
                r_time = datetime.strptime(r.departure_time, "%H:%M").time()
                if r_time <= now.time():
                    continue 
            except:
                continue

        # Fuzzy Match Logic
        area_match = is_match(target_area, r.origin_area)
        uni_match = is_match(user_uni, r.destination_area)
        
        if area_match and uni_match:
            # Get driver info for rating display
            driver = session.exec(select(User).where(User.email == r.driver_email)).first()
            valid_results.append({
                "id": r.id,
                "driver_email": r.driver_email,
                "driver_name": driver.full_name if driver else "Unknown",
                "driver_rating": driver.average_rating if driver else 0.0,
                "driver_total_reviews": driver.total_reviews if driver else 0,
                "origin_area": r.origin_area,
                "destination_area": r.destination_area,
                "departure_time": r.departure_time,
                "date": r.date,
                "seats_available": r.seats_available,
                "whatsapp_number": r.whatsapp_number,
                "ladies_only": r.ladies_only,
                "status": r.status
            })
                
    return valid_results

@router.post("/{ride_id}/book")
async def book_ride(ride_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # 1. Get Ride
    ride = session.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
        
    # 2. Check availability
    if ride.seats_available < 1:
        raise HTTPException(status_code=400, detail="No seats available")
    
    # 3. Check Ladies Only
    if ride.ladies_only and user.gender != "Female":
        raise HTTPException(status_code=403, detail="This is a Ladies Only ride.")

    # 4. Check if driver is passenger
    if ride.driver_email == user.email:
        raise HTTPException(status_code=400, detail="You cannot book your own ride")

    # 5. Check if already booked
    statement = select(Booking).where(Booking.ride_id == ride_id, Booking.passenger_email == user.email)
    existing_booking = session.exec(statement).first()
    if existing_booking:
        raise HTTPException(status_code=400, detail="You have already booked this ride")

    # 6. Create Booking (Pending status)
    booking = Booking(
        ride_id=ride_id, 
        passenger_email=user.email,
        status="pending"
    )
    
    # Note: We do NOT decrement seats here. Seats are decremented upon driver approval.
    
    session.add(booking)
    session.commit()
    
    return {"message": "Booking requested. Waiting for driver approval.", "status": "pending"}

@router.get("/booked") 
async def get_my_bookings(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Get rides booked by current user with booking status
    statement = select(Booking, Ride).where(Booking.ride_id == Ride.id, Booking.passenger_email == user.email)
    results = session.exec(statement).all()
    
    formatted_results = []
    for booking, ride in results:
        # Get driver info
        driver = session.exec(select(User).where(User.email == ride.driver_email)).first()
        
        # Check if user already reviewed this ride
        existing_review = session.exec(
            select(Review).where(
                Review.ride_id == ride.id,
                Review.reviewer_email == user.email
            )
        ).first()
        
        formatted_results.append({
            "id": ride.id,
            "driver_email": ride.driver_email,
            "driver_name": driver.full_name if driver else "Unknown",
            "driver_rating": driver.average_rating if driver else 0.0,
            "driver_total_reviews": driver.total_reviews if driver else 0,
            "origin_area": ride.origin_area,
            "destination_area": ride.destination_area,
            "departure_time": ride.departure_time,
            "date": ride.date,
            "seats_available": ride.seats_available,
            "whatsapp_number": ride.whatsapp_number,
            "booking_status": booking.status, # pending, accepted, rejected
            "booking_id": booking.id,
            "ride_status": ride.status, # scheduled, completed, cancelled
            "has_reviewed": existing_review is not None,
        })
    return formatted_results

from pydantic import BaseModel
class BookingStatusUpdate(BaseModel):
    status: str # accepted, rejected

@router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: int, update: BookingStatusUpdate, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    booking = session.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    ride = session.get(Ride, booking.ride_id)
    if not ride:
         raise HTTPException(status_code=404, detail="Ride not found")
         
    # Only driver can update status
    if ride.driver_email != user.email:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if update.status == "accepted":
        if ride.seats_available < 1:
             raise HTTPException(status_code=400, detail="No seats available to accept")
        booking.status = "accepted"
        ride.seats_available -= 1
        session.add(ride)
    elif update.status == "rejected":
        booking.status = "rejected"
        # If it was previously accepted, we should give back the seat? (Not handling re-rejection complex logic for now)
    else:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    session.add(booking)
    session.commit()
    return {"message": f"Booking {update.status}"}

@router.put("/{ride_id}/complete")
async def complete_ride(ride_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Mark a ride as completed. Only the driver can do this."""
    ride = session.get(Ride, ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Only driver can complete
    if ride.driver_email != user.email:
        raise HTTPException(status_code=403, detail="Only the driver can complete this ride")
    
    if ride.status == "completed":
        raise HTTPException(status_code=400, detail="Ride is already completed")
    
    if ride.status == "cancelled":
        raise HTTPException(status_code=400, detail="Cannot complete a cancelled ride")
    
    ride.status = "completed"
    session.add(ride)
    session.commit()
    
    return {"message": "Ride marked as completed. Passengers can now leave reviews."}

@router.get("/driver/requests")
async def get_driver_requests(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Get all bookings for rides driven by current user
    # Join Booking and Ride
    statement = select(Booking, Ride).join(Ride).where(Ride.driver_email == user.email, Booking.status == "pending")
    results = session.exec(statement).all()
    
    # Format output
    requests = []
    for booking, ride in results:
        # Get passenger details
        passenger = session.exec(select(User).where(User.email == booking.passenger_email)).first()
        requests.append({
            "booking_id": booking.id,
            "ride_id": ride.id,
            "passenger_name": passenger.full_name if passenger else "Unknown",
            "passenger_email": booking.passenger_email,
            "origin": ride.origin_area,
            "destination": ride.destination_area,
            "time": ride.departure_time
        })
    return requests

@router.get("/my-offered")
async def get_my_offered_rides(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    """Get rides offered by the current driver."""
    statement = select(Ride).where(Ride.driver_email == user.email).order_by(Ride.date.desc())
    rides = session.exec(statement).all()
    
    result = []
    for ride in rides:
        result.append({
            "id": ride.id,
            "origin_area": ride.origin_area,
            "destination_area": ride.destination_area,
            "departure_time": ride.departure_time,
            "date": ride.date,
            "seats_available": ride.seats_available,
            "whatsapp_number": ride.whatsapp_number,
            "ladies_only": ride.ladies_only,
            "status": ride.status
        })
    return result

@router.get("/", response_model=List[RideRead])
async def get_all_rides(session: Session = Depends(get_session)):
    statement = select(Ride)
    results = session.exec(statement).all()
    return results
