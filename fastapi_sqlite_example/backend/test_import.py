#!/usr/bin/env python
import sys
import traceback

print("Python version:", sys.version)
print("Current working directory:", sys.path[0])

try:
    print("Importing database...")
    from database import Base, SessionLocal, engine
    print("✓ database imported")
except Exception as e:
    print(f"✗ Failed to import database: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    print("Importing models...")
    import models
    print("✓ models imported")
except Exception as e:
    print(f"✗ Failed to import models: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    print("Importing schemas...")
    import schemas
    print("✓ schemas imported")
except Exception as e:
    print(f"✗ Failed to import schemas: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    print("Importing ml_model...")
    from ml_model import predict_skin_disease
    print("✓ ml_model imported")
except Exception as e:
    print(f"✗ Failed to import ml_model: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    print("Importing main...")
    import main
    print("✓ main imported")
except Exception as e:
    print(f"✗ Failed to import main: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n✓ All imports successful!")
