from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str
    full_name: str
    university: str
    phone: Optional[str] = None
    role: str = "user"
    gender: str = "Other"
    is_verified: bool = False
    average_rating: float = 0.0
    total_reviews: int = 0

class UserCreate(SQLModel):
    email: str
    password: str
    full_name: str
    university: str
    phone: str

class UserRead(SQLModel):
    id: int
    email: str
    full_name: str
    university: str
    phone: Optional[str] = None
    average_rating: float = 0.0
    total_reviews: int = 0

class Token(SQLModel):
    access_token: str
    token_type: str

class TokenData(SQLModel):
    email: Optional[str] = None

class Ride(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    driver_email: str = Field(index=True) # Logical FK to user.email
    origin_area: str = Field(index=True)
    destination_area: str
    departure_time: str
    date: str # YYYY-MM-DD
    seats_available: int = 3
    whatsapp_number: str # Contact info
    ladies_only: bool = False
    status: str = "scheduled" # scheduled, in_progress, completed, cancelled

class RideCreate(SQLModel):
    origin_area: str
    destination_area: str
    departure_time: str
    date: str
    seats_available: int = 3
    whatsapp_number: str
    ladies_only: bool = False
    status: str = "scheduled" # scheduled, in_progress, completed, cancelled

class RideRead(Ride):
    pass

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ride_id: int = Field(foreign_key="ride.id")
    passenger_email: str = Field(foreign_key="user.email")
    status: str = "pending" # pending, accepted, rejected, cancelled
    booking_time: str = Field(default_factory=lambda: datetime.now().isoformat())

class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ride_id: int = Field(foreign_key="ride.id")
    reviewer_email: str = Field(foreign_key="user.email")   # passenger who left the review
    driver_email: str = Field(index=True)                    # driver being reviewed
    rating: int                                               # 1-5 stars
    comment: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class ReviewCreate(SQLModel):
    ride_id: int
    rating: int        # 1-5
    comment: Optional[str] = None

class ReviewRead(SQLModel):
    id: int
    ride_id: int
    reviewer_email: str
    reviewer_name: Optional[str] = None
    driver_email: str
    rating: int
    comment: Optional[str]
    created_at: str
