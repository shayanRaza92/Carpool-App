
import sys
import os

print("--- Checking Auth Dependencies ---")

try:
    print("1. Testing Passlib (Hashing)...")
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    hash_val = pwd_context.hash("secret")
    print(f"   - Hash generated: {hash_val[:10]}...")
    assert pwd_context.verify("secret", hash_val)
    print("   - Verification successful")
except Exception as e:
    print(f"   !!! Passlib FAILED: {e}")

try:
    print("2. Testing Python-Jose (JWT)...")
    from jose import jwt
    SECRET_KEY = "test-secret"
    ALGORITHM = "HS256"
    data = {"sub": "test@example.com"}
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    print(f"   - Token generated: {token[:10]}...")
except Exception as e:
    print(f"   !!! JWT FAILED: {e}")

try:
    print("3. Testing Database User Model...")
    from backend.models import User
    print("   - User model imported")
except Exception as e:
    print(f"   !!! User Import FAILED: {e}")

print("--- Auth Check Complete ---")
