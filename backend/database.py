from sqlmodel import SQLModel, create_engine, Session
import os

# Use SQLite for local development, PostgreSQL for production
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    sqlite_file_name = "database.db"
    # check_same_thread=False is needed for SQLite with FastAPI
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
