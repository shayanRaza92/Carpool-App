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

class RideCreate(SQLModel):
    origin_area: str
    destination_area: str
    departure_time: str
    date: str
    seats_available: int
    whatsapp_number: str

class RideRead(SQLModel):
    id: int
    driver_email: str
    origin_area: str
    destination_area: str
    departure_time: str
    date: str
    seats_available: int
    whatsapp_number: str

class Booking(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ride_id: int = Field(index=True)
    passenger_email: str = Field(index=True)
    booking_time: str = Field(default_factory=lambda: datetime.now().isoformat())

