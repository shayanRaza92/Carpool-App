
import sys
import os
import time

print("--- Starting Diagnostic ---")

# Setup path like WSGI file
path = '/home/ShayanRaza/Carpool-App'
if path not in sys.path:
    sys.path.append(path)

site_packages = '/home/ShayanRaza/.local/lib/python3.13/site-packages'
if site_packages not in sys.path:
    sys.path.append(site_packages)

print("1. Importing modules...")
try:
    from a2wsgi import ASGIMiddleware
    print("   - a2wsgi imported")
except ImportError as e:
    print(f"   !!! FAILED to import a2wsgi: {e}")

try:
    print("2. Importing backend.main...")
    start = time.time()
    from backend.main import app as fastapi_app
    end = time.time()
    print(f"   - backend.main imported in {end - start:.2f} seconds")
except Exception as e:
    print(f"   !!! FAILED to import backend.main: {e}")
    sys.exit(1)

print("3. Checking Database Connection...")
try:
    from backend.database import engine
    from sqlmodel import select
    from sqlalchemy import text
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("   - Database connection successful")
except Exception as e:
    print(f"   !!! Database check FAILED: {e}")

print("--- Diagnostic Complete ---")
