from sqlmodel import Session, select, create_engine
from backend.models import User
from backend.routers.auth import get_password_hash, verify_password
from backend.database import engine

def test_login_flow():
    print("--- Starting Login Flow Debug ---")
    
    email = "debug_test@example.com"
    password = "debugpassword123"
    
    with Session(engine) as session:
        # 1. Cleaner: Remove existing if any
        existing = session.exec(select(User).where(User.email == email)).first()
        if existing:
            print(f"1. Removing old test user {email}...")
            session.delete(existing)
            session.commit()
            
        # 2. Create User
        print("2. Creating new test user...")
        user = User(
            email=email,
            password_hash=get_password_hash(password),
            full_name="Debug User",
            phone="03001234567",
            university="Test Uni"
        )
        session.add(user)
        try:
            session.commit()
            session.refresh(user)
            print("   ✅ User created successfully in DB")
        except Exception as e:
            print(f"   ❌ Failed to create user: {e}")
            return

        # 3. Simulate Login (Retrieve)
        print("3. Retrieving user for login...")
        db_user = session.exec(select(User).where(User.email == email)).first()
        
        if not db_user:
            print("   ❌ User not found after creation!")
            return
            
        print("   ✅ User found.")
        
        # 4. Check Password
        print("4. Verifying password...")
        is_valid = verify_password(password, db_user.password_hash)
        
        if is_valid:
            print("   ✅ Password verified successfully!")
            print("--- Login Flow PASSED ---")
        else:
            print("   ❌ Password verification FAILED.")

if __name__ == "__main__":
    test_login_flow()
