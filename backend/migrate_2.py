import sqlite3

def run_migration():
    try:
        conn = sqlite3.connect('../database.db')
        cursor = conn.cursor()
        
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN gender VARCHAR DEFAULT 'Other'")
            print("Added gender column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping gender: {e}")
            
        try:
            cursor.execute("ALTER TABLE user ADD COLUMN is_verified BOOLEAN DEFAULT 0")
            print("Added is_verified column.")
        except sqlite3.OperationalError as e:
            print(f"Skipping is_verified: {e}")
            
        conn.commit()
        conn.close()
        print("Migration finished.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    run_migration()
