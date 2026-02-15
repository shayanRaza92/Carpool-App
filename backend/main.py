from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import Session, select
from .database import create_db_and_tables, engine
from .models import User
import os
from .routers import auth, rides

@asynccontextmanager
async def lifespan(app: FastAPI):
    # create_db_and_tables() # Commenting out to check if this is causing the hang
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",    # Local development
    "https://dancing-churros-a22bc1.netlify.app", # Netlify production
    "https://ShayanRaza.pythonanywhere.com", # Backend itself (Correct URL)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Use defined origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rides.router)

@app.get("/test-db")
def test_db_connection():
    """
    Diagnostic endpoint to check DB connection on the server.
    """
    db_url = os.environ.get("DATABASE_URL")
    masked_url = "Not Set"
    if db_url:
        try:
            # Mask password
            part1 = db_url.split("@")[1]
            masked_url = f"Set (Host: {part1})"
        except:
             masked_url = "Set (Invalid Format)"

    engine_info = str(engine.url)
    
    try:
        with Session(engine) as session:
            # Try a simple query
            user = session.exec(select(User).limit(1)).first()
            return {
                "status": "success",
                "env_var": masked_url,
                "active_engine": engine_info,
                "user_found": bool(user),
                "message": "Database is connected and query works!"
            }
    except Exception as e:
        return {
            "status": "error",
            "env_var": masked_url,
            "active_engine": engine_info,
            "error_details": str(e),
            "message": "Database connection failed."
        }
        
@app.get("/")
def read_root():
    return {
        "message": "Carpooling App API is running",
        "version": "1.2 (DB Debug)",
        "allowed_origins": origins
    }
