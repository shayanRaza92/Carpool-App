import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import create_engine, text

# Use the same database URL as the main app
DATABASE_URL = "postgresql://neondb_owner:npg_X6k1wWqJpziY@ep-spring-shape-a83234d4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL)

def run_migration():
    with engine.connect() as connection:
        # 1. Add columns to Ride table
        try:
            connection.execute(text("ALTER TABLE ride ADD COLUMN status VARCHAR DEFAULT 'scheduled'"))
            print("Added 'status' locally to Ride table")
        except Exception as e:
            print(f"Ride.status might already exist: {e}")

        try:
            connection.execute(text("ALTER TABLE ride ADD COLUMN ladies_only BOOLEAN DEFAULT FALSE"))
            print("Added 'ladies_only' locally to Ride table")
        except Exception as e:
            print(f"Ride.ladies_only might already exist: {e}")

        # 2. Add columns to Booking table
        try:
            connection.execute(text("ALTER TABLE booking ADD COLUMN status VARCHAR DEFAULT 'pending'"))
            print("Added 'status' locally to Booking table")
        except Exception as e:
            print(f"Booking.status might already exist: {e}")
            
        # 3. Add columns to User table (just in case they were reverted too)
        try:
            connection.execute(text("ALTER TABLE user ADD COLUMN gender VARCHAR DEFAULT 'Other'"))
            print("Added 'gender' locally to User table")
        except Exception as e:
            print(f"User.gender might already exist: {e}")
            
        try:
            connection.execute(text("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT FALSE"))
            print("Added 'is_verified' locally to User table")
        except Exception as e:
            print(f"User.is_verified might already exist: {e}")

        connection.commit()
        print("Migration completed.")

if __name__ == "__main__":
    run_migration()
