from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, func
from typing import List
from ..database import get_session
from ..models import Review, ReviewCreate, ReviewRead, User, Ride, Booking
from .rides import get_current_user

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewRead)
async def submit_review(
    review_data: ReviewCreate,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Submit a review for a driver after a completed ride."""
    
    # 1. Validate rating range
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # 2. Get the ride
    ride = session.get(Ride, review_data.ride_id)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # 3. Ride must be completed
    if ride.status != "completed":
        raise HTTPException(status_code=400, detail="You can only review completed rides")
    
    # 4. Reviewer must not be the driver
    if ride.driver_email == user.email:
        raise HTTPException(status_code=400, detail="You cannot review your own ride")
    
    # 5. Reviewer must have an accepted booking on this ride
    statement = select(Booking).where(
        Booking.ride_id == review_data.ride_id,
        Booking.passenger_email == user.email,
        Booking.status == "accepted"
    )
    booking = session.exec(statement).first()
    if not booking:
        raise HTTPException(status_code=400, detail="You must have an accepted booking to review this ride")
    
    # 6. Check for duplicate review
    existing = session.exec(
        select(Review).where(
            Review.ride_id == review_data.ride_id,
            Review.reviewer_email == user.email
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this ride")
    
    # 7. Create the review
    db_review = Review(
        ride_id=review_data.ride_id,
        reviewer_email=user.email,
        driver_email=ride.driver_email,
        rating=review_data.rating,
        comment=review_data.comment
    )
    session.add(db_review)
    session.commit()
    session.refresh(db_review)
    
    # 8. Recalculate driver's average rating
    _recalculate_driver_rating(ride.driver_email, session)
    
    return ReviewRead(
        id=db_review.id,
        ride_id=db_review.ride_id,
        reviewer_email=db_review.reviewer_email,
        reviewer_name=user.full_name,
        driver_email=db_review.driver_email,
        rating=db_review.rating,
        comment=db_review.comment,
        created_at=db_review.created_at
    )


@router.get("/driver/{driver_email}", response_model=List[ReviewRead])
async def get_driver_reviews(
    driver_email: str,
    session: Session = Depends(get_session)
):
    """Get all reviews for a specific driver."""
    statement = select(Review).where(Review.driver_email == driver_email).order_by(Review.created_at.desc())
    reviews = session.exec(statement).all()
    
    result = []
    for review in reviews:
        # Get reviewer name
        reviewer = session.exec(select(User).where(User.email == review.reviewer_email)).first()
        result.append(ReviewRead(
            id=review.id,
            ride_id=review.ride_id,
            reviewer_email=review.reviewer_email,
            reviewer_name=reviewer.full_name if reviewer else "Unknown",
            driver_email=review.driver_email,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at
        ))
    
    return result


@router.get("/can-review/{ride_id}")
async def can_review_ride(
    ride_id: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Check if the current user can review a specific ride."""
    ride = session.get(Ride, ride_id)
    if not ride:
        return {"can_review": False, "reason": "Ride not found"}
    
    # Must be completed
    if ride.status != "completed":
        return {"can_review": False, "reason": "Ride not completed yet"}
    
    # Must not be driver
    if ride.driver_email == user.email:
        return {"can_review": False, "reason": "Cannot review own ride"}
    
    # Must have accepted booking
    booking = session.exec(
        select(Booking).where(
            Booking.ride_id == ride_id,
            Booking.passenger_email == user.email,
            Booking.status == "accepted"
        )
    ).first()
    if not booking:
        return {"can_review": False, "reason": "No accepted booking"}
    
    # Must not have already reviewed
    existing = session.exec(
        select(Review).where(
            Review.ride_id == ride_id,
            Review.reviewer_email == user.email
        )
    ).first()
    if existing:
        return {"can_review": False, "reason": "Already reviewed", "review_id": existing.id}
    
    return {"can_review": True}


@router.get("/driver-stats/{driver_email}")
async def get_driver_stats(
    driver_email: str,
    session: Session = Depends(get_session)
):
    """Get rating stats for a driver."""
    driver = session.exec(select(User).where(User.email == driver_email)).first()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    return {
        "average_rating": driver.average_rating,
        "total_reviews": driver.total_reviews,
        "driver_name": driver.full_name
    }


def _recalculate_driver_rating(driver_email: str, session: Session):
    """Recalculate and update a driver's average rating."""
    reviews = session.exec(
        select(Review).where(Review.driver_email == driver_email)
    ).all()
    
    if not reviews:
        return
    
    total = sum(r.rating for r in reviews)
    count = len(reviews)
    avg = round(total / count, 2)
    
    driver = session.exec(select(User).where(User.email == driver_email)).first()
    if driver:
        driver.average_rating = avg
        driver.total_reviews = count
        session.add(driver)
        session.commit()
