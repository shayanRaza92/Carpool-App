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
from ..models import Ride, RideCreate, RideRead, User, Booking # Import Booking

# ... (imports remain similar)

@router.post("/", response_model=RideRead)
async def create_ride(ride: RideCreate, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # 1. Validate Date (Today or Tomorrow only)
    try:
        ride_date = datetime.strptime(ride.date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD")

    now = datetime.now()
    today = now.date()
    tomorrow = today + timedelta(days=1)

    if ride_date < today:
        raise HTTPException(status_code=400, detail="Cannot post rides in the past.")
    if ride_date > tomorrow:
        raise HTTPException(status_code=400, detail="You can only post rides for Today or Tomorrow.")
    
    # 2. Validate Time if date is Today
    if ride_date == today:
        try:
            ride_time = datetime.strptime(ride.departure_time, "%H:%M").time()
            if ride_time < now.time():
                 raise HTTPException(status_code=400, detail="Departure time must be in the future.")
        except ValueError:
             raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")

    # Create ride linked to user
    db_ride = Ride(
        driver_email=user.email,
        origin_area=ride.origin_area,
        destination_area=user.university, 
        departure_time=ride.departure_time,
        date=ride.date,
        seats_available=ride.seats_available,
        whatsapp_number=ride.whatsapp_number
    )
    session.add(db_ride)
    session.commit()
    session.refresh(db_ride)
    return db_ride

@router.get("/search", response_model=List[RideRead])
async def search_rides(area: str, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Search for rides with fuzzy matching logic
    # 1. Fetch all valid future rides to filter in Python (needed for fuzzy matching)
    today_str = date.today().isoformat()
    
    # We fetch potentially relevant rides first to minimize Python-side filtering if possible,
    # but for fuzzy search on areas, we might need a broader query or just fetch all active rides.
    # To be safe and since fuzzy match needs the text, let's fetch active rides.
    # Optimally: fetch rides where destination matches user's uni (fuzzy or exact? 
    # Let's assume Uni is also fuzzy matched per requirements "entry university name... also apply in find ride matching")
    
    statement = select(Ride).where(
        Ride.date >= today_str,
        Ride.seats_available > 0 
    ).order_by(Ride.date, Ride.departure_time)
    
    results = session.exec(statement).all()
    
    import difflib
    import re

    def normalize(text):
        if not text:
            return ""
        # Lowercase and remove all non-alphanumeric characters for comparison
        return re.sub(r'[^a-z0-9]', '', text.lower())

    def is_match(query, target):
        if not query or not target:
            return False
        
        n_query = normalize(query)
        n_target = normalize(target)
        
        # 1. Exact match after normalization
        if n_query == n_target:
            return True
            
        # 2. Substring match (e.g. "Gulshan" matches "Gulshan-e-Iqbal")
        if n_query in n_target or n_target in n_query:
            return True
            
        # 3. Fuzzy match using SequenceMatcher
        # Ratio > 0.8 means 80% similarity
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
        # Match Origin Area VS Search Area
        area_match = is_match(target_area, r.origin_area)
        
        # Match Destination VS User University
        # Note: We should probably match the destination to the user's registered university.
        # If the user selected "Other" and typed "Fast", and ride is to "FAST-NUCES", it should match.
        uni_match = is_match(user_uni, r.destination_area)
        
        if area_match and uni_match:
            valid_results.append(r)
                
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
        
    # 3. Check if driver is passenger (Optional, but good practice)
    if ride.driver_email == user.email:
        raise HTTPException(status_code=400, detail="You cannot book your own ride")

    # 4. Check if already booked
    statement = select(Booking).where(Booking.ride_id == ride_id, Booking.passenger_email == user.email)
    existing_booking = session.exec(statement).first()
    if existing_booking:
        raise HTTPException(status_code=400, detail="You have already booked this ride")

    # 5. Create Booking & Update Seats
    booking = Booking(ride_id=ride_id, passenger_email=user.email)
    ride.seats_available -= 1
    
    session.add(booking)
    session.add(ride)
    session.commit()
    
    return {"message": "Ride booked successfully", "seats_remaining": ride.seats_available}

@router.get("/booked", response_model=List[RideRead])
async def get_my_bookings(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Get rides booked by current user
    statement = select(Ride).join(Booking, Ride.id == Booking.ride_id).where(Booking.passenger_email == user.email)
    results = session.exec(statement).all()
    return results

@router.get("/", response_model=List[RideRead])
async def get_all_rides(session: Session = Depends(get_session)):
    statement = select(Ride)
    results = session.exec(statement).all()
    return results
