from sqlmodel import SQLModel
from database import engine, create_db_and_tables
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init():
    logger.info("Starting manual database initialization...")
    try:
        create_db_and_tables()
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        raise

if __name__ == "__main__":
    init()
