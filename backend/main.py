from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .database import create_db_and_tables
from .routers import auth, rides, reviews

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://dancing-churros-a22bc1.netlify.app",
    "https://ShayanRaza.pythonanywhere.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(rides.router)
app.include_router(reviews.router)

@app.get("/")
def read_root():
    return {
        "message": "Carpooling App API is running",
        "version": "3.0 (Reviews & Ratings)",
        "allowed_origins": origins
    }
