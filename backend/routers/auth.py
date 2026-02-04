from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
from passlib.context import CryptContext
from jose import JWTError, jwt
from ..database import get_session
from ..models import User, UserCreate, UserRead, Token

# Configuration
SECRET_KEY = "your-secret-key-keep-it-secret" # In prod, use env var
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

class LoginRequest(UserCreate):
    # Only need email and password but reusing model or creating new partial one
    # Let's clean this up with a specific one
    pass
    
from pydantic import BaseModel
class LoginSchema(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=Token)
async def login(login_data: LoginSchema, session: Session = Depends(get_session)):
    print(f"Login attempt for: {login_data.email}")
    statement = select(User).where(User.email == login_data.email)
    user = session.exec(statement).first()
    
    if not user:
        print("User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not verify_password(login_data.password, user.password_hash):
        print(f"Password verification failed for {login_data.email}")
        # print(f"Stored Hash: {user.password_hash}") # Be careful with logs in production
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("Login successful")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@router.post("/register", response_model=UserRead)
async def register(user: UserCreate, session: Session = Depends(get_session)):
    try:
        # Validate Phone Number
        if not user.phone.isdigit() or len(user.phone) != 11:
            raise HTTPException(
                 status_code=status.HTTP_400_BAD_REQUEST,
                 detail="Phone number must be exactly 11 digits"
            )

        # Check existing user
        statement = select(User).where(User.email == user.email)
        existing_user = session.exec(statement).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        # Note: excluding password from the db model update handled manually or via validate
        # creating instance manually to handle password hashing cleanly
        db_user = User(
            email=user.email,
            full_name=user.full_name,
            university=user.university,
            phone=user.phone,
            password_hash=get_password_hash(user.password)
        )
        
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
