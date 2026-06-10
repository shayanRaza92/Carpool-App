import sqlite3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = "../database.db"

def column_exists(cursor, table, column):
    cursor.execute(f"PRAGMA table_info({table})")
    columns = [row[1] for row in cursor.fetchall()]
    return column in columns

def run_migration():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        # Add ladies_only column if missing
        if not column_exists(cursor, "ride", "ladies_only"):
            cursor.execute("ALTER TABLE ride ADD COLUMN ladies_only BOOLEAN DEFAULT 0")
            logger.info("Added ladies_only column to ride table.")
        else:
            logger.info("ladies_only column already exists.")
        # Add status column if missing
        if not column_exists(cursor, "ride", "status"):
            cursor.execute("ALTER TABLE ride ADD COLUMN status VARCHAR DEFAULT 'scheduled'")
            logger.info("Added status column to ride table.")
        else:
            logger.info("status column already exists.")
        conn.commit()
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()
