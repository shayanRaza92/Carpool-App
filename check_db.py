from sqlalchemy import inspect
from database import engine

def check_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("--- Database Check ---")
    if tables:
        print(f"✅ Found tables: {tables}")
    else:
        print("❌ NO TABLES FOUND! You need to run init_db.py")

if __name__ == "__main__":
    check_tables()
