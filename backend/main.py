from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import create_db_and_tables
from .routers import auth, rides

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
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

@app.get("/")
def read_root():
    return {
        "message": "Carpooling App API is running",
        "version": "1.1 (CORS Fix)",
        "allowed_origins": origins
    }
